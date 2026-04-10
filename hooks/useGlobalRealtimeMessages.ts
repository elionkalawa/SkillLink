"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { getChatsKey, getUnreadMessagesCountKey, getChatMessagesKey } from "./useChat";
import { getDashboardCountsKey } from "./useDashboardCounts";
import { useUser } from "./useUser";
import { Message, Chat } from "@/types";

/**
 * Global listener for real-time message updates across all chats the user is part of.
 * This handles unread badge updates and real-time read receipts globally.
 */
export function useGlobalRealtimeMessages() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    // We first need to know which chats to listen to
    const setupSubscription = async () => {
      // Get current chats from cache or fetch if needed
      const chats = queryClient.getQueryData<Chat[]>(getChatsKey);
      
      if (!chats) {
        // If not in cache, we'll wait for the next run or let the Chats component handle it.
        // For now, let's just listen to ALL messages but filter client-side 
        // OR better yet, let's just fetch once.
        const { data: participantRows } = await supabase
          .from("chat_participants")
          .select("chat_id")
          .eq("user_id", user.id);
        
        const chatIds = participantRows?.map(r => r.chat_id) || [];
        if (chatIds.length === 0) return;
        
        subscribeToUpdates(chatIds);
      } else {
        const chatIds = chats.map(c => c.id);
        if (chatIds.length === 0) return;
        subscribeToUpdates(chatIds);
      }
    };

    const subscribeToUpdates = (chatIds: string[]) => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      const channel = supabase
        .channel(`global-updates:${user.id}`)
        // 1. Listen for ALL message changes (manual filter)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const record = (payload.new || payload.old) as Partial<Message>;
            if (!record?.chat_id || !chatIds.includes(record.chat_id)) return;

            console.log("Global Message Event:", record.chat_id, payload.eventType);
            
            // Refetch EVERYTHING relevant
            queryClient.invalidateQueries({ queryKey: getChatsKey });
            queryClient.invalidateQueries({ queryKey: getUnreadMessagesCountKey });
            queryClient.invalidateQueries({ queryKey: getDashboardCountsKey });
            queryClient.refetchQueries({ queryKey: getChatMessagesKey(record.chat_id) });
          }
        )
        // 2. Listen for CHAT table updates (last_message, updated_at)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "chats",
          },
          (payload) => {
            const updatedChat = payload.new as Chat;
            if (!chatIds.includes(updatedChat.id)) return;

            console.log("Global Chat Update:", updatedChat.id);
            queryClient.invalidateQueries({ queryKey: getChatsKey });
          }
        )
        .subscribe((status) => {
          console.log(`Global Realtime subscription status for user ${user.id}:`, status);
        });

      channelRef.current = channel;
    };

    setupSubscription();

    // Also listen for NEW chat participations to resubscribe and include new chats in the filter
    const partChannel = supabase
      .channel(`user-parts:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_participants",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          setupSubscription();
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      supabase.removeChannel(partChannel);
    };
  }, [user?.id, queryClient]);
}
