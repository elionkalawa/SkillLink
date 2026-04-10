"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { getChatMessagesKey, getChatsKey, getUnreadMessagesCountKey } from "./useChat";
import { getDashboardCountsKey } from "./useDashboardCounts";
import { Message } from "@/types";

/**
 * Subscribe to real-time INSERT events on the messages table for a specific chat.
 * On new message, optimistically update the TanStack Query cache so the UI updates instantly.
 */
export function useRealtimeMessages(chatId: string | null, currentUserId: string | null) {
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!chatId || !currentUserId) return;

    // Clean up any previous subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`messages-active:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          // Filter manually in JS to avoid UUID format issues in filters
          const record = (payload.new || payload.old) as Partial<Message>;
          if (record?.chat_id !== chatId) return;

          console.log("Active Chat Realtime event:", payload.eventType, payload);

          if (payload.eventType === "INSERT") {
            queryClient.invalidateQueries({ queryKey: getChatMessagesKey(chatId) });
          } else if (payload.eventType === "UPDATE") {
             // Handle read receipts
             const updated = payload.new as Message;
             queryClient.setQueryData<Message[]>(
                getChatMessagesKey(chatId),
                (old) => {
                  if (!old) return old;
                  return old.map((m) => (m.id === updated.id ? { ...m, ...updated } : m));
                }
             );
             queryClient.invalidateQueries({ queryKey: getChatMessagesKey(chatId) });
          }

          // Always refresh sidebar
          queryClient.invalidateQueries({ queryKey: getChatsKey });
          queryClient.invalidateQueries({ queryKey: getUnreadMessagesCountKey });
          queryClient.invalidateQueries({ queryKey: getDashboardCountsKey });
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for ACTIVE chat ${chatId}:`, status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [chatId, currentUserId, queryClient]);
}
