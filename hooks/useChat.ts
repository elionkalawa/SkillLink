"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/lib/services/chat";
import { getDashboardCountsKey } from "./useDashboardCounts";
import { Message } from "@/types";

export const getChatsKey = ["chats"];
export const getChatMessagesKey = (chatId: string) => ["chats", chatId, "messages"];
export const getUnreadMessagesCountKey = ["chats", "unread-count"];
export const getChatRecipientsKey = ["chats", "recipients"];

export function useChats() {
  return useQuery({
    queryKey: getChatsKey,
    queryFn: () => chatService.getChats(),
  });
}

export function useChatMessages(chatId: string | null) {
  return useQuery({
    queryKey: getChatMessagesKey(chatId || ""),
    queryFn: () => chatService.getMessages(chatId!),
    enabled: !!chatId,
    // Realtime handles updates — no polling needed
    refetchInterval: false,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, content }: { chatId: string; content: string }) =>
      chatService.sendMessage(chatId, content),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: getChatMessagesKey(variables.chatId) });
      await queryClient.invalidateQueries({ queryKey: getChatsKey });
      await queryClient.invalidateQueries({ queryKey: getUnreadMessagesCountKey });
      await queryClient.invalidateQueries({ queryKey: getDashboardCountsKey });
    },
  });
}

export function useUnreadMessagesCount() {
  return useQuery({
    queryKey: getUnreadMessagesCountKey,
    queryFn: () => chatService.getUnreadCount(),
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

export function useChatRecipients() {
  return useQuery({
    queryKey: getChatRecipientsKey,
    queryFn: () => chatService.getRecipients(),
  });
}

export function useCreateDirectChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipientId: string) => chatService.createOrGetDirectChat(recipientId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getChatsKey });
      await queryClient.invalidateQueries({ queryKey: getUnreadMessagesCountKey });
    },
  });
}

export function useMarkChatRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chatId: string) => {
      const res = await fetch(`/api/chats/${chatId}/read`, { method: "POST" });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to mark chat as read");
      }
      return res.json() as Promise<{ marked: number }>;
    },
    onMutate: async (chatId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: getChatMessagesKey(chatId) });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<Message[]>(getChatMessagesKey(chatId));

      // Optimistically update to the new value
      if (previousMessages) {
        queryClient.setQueryData<Message[]>(getChatMessagesKey(chatId), 
          previousMessages.map(m => ({ ...m, is_read: true }))
        );
      }

      return { previousMessages };
    },
    onError: (err, chatId, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(getChatMessagesKey(chatId), context.previousMessages);
      }
    },
    onSuccess: async () => {
      // Only invalidate chats and counts, messages are already updated optimistically
      // and will be updated by the realtime anyway
      await queryClient.invalidateQueries({ queryKey: getChatsKey });
      await queryClient.invalidateQueries({ queryKey: getUnreadMessagesCountKey });
      await queryClient.invalidateQueries({ queryKey: getDashboardCountsKey });
    },
  });
}
