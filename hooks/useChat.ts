"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/lib/services/chat";

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

