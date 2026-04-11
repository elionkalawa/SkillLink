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

          if (payload.eventType === "INSERT") {
            const newMsg = payload.new as Message; // raw DB row — no .sender
            let injected = false;

            queryClient.setQueryData<Message[]>(getChatMessagesKey(chatId), (old) => {
              if (!old) return old;
              // Dedup: message already in cache (e.g. own message via onSuccess)
              if (old.some((m) => m.id === newMsg.id)) {
                injected = true;
                return old;
              }
              // Remove any stale optimistic placeholders (race: realtime before onSuccess)
              const withoutOptimistic = old.filter((m) => !m.id.startsWith("optimistic-"));
              // Look up sender from messages already in cache to avoid a network roundtrip
              const senderFromCache = withoutOptimistic.find(
                (m) => m.sender_id === newMsg.sender_id,
              )?.sender;
              if (!senderFromCache) return old; // fallback to invalidate below
              injected = true;
              return [...withoutOptimistic, { ...newMsg, sender: senderFromCache }];
            });

            // Only fall back to a network fetch when sender wasn't in the cache
            if (!injected) {
              queryClient.invalidateQueries({ queryKey: getChatMessagesKey(chatId) });
            }
          } else if (payload.eventType === "UPDATE") {
            // Read receipts — update in place, no extra roundtrip
            const updated = payload.new as Message;
            queryClient.setQueryData<Message[]>(getChatMessagesKey(chatId), (old) => {
              if (!old) return old;
              return old.map((m) => (m.id === updated.id ? { ...m, ...updated } : m));
            });
          }

          // Always refresh sidebar counts / preview
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
