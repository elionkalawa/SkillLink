import { Chat, ChatRecipient, Message } from "@/types";

export const chatService = {
  async getChats() {
    const res = await fetch("/api/chats");
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch chats");
    }
    return res.json() as Promise<Chat[]>;
  },

  async getMessages(chatId: string) {
    const res = await fetch(`/api/chats/${chatId}/messages`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch messages");
    }
    return res.json() as Promise<Message[]>;
  },

  async sendMessage(chatId: string, content: string) {
    const res = await fetch(`/api/chats/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to send message");
    }
    return res.json() as Promise<Message>;
  },

  async getUnreadCount() {
    const res = await fetch("/api/chats/unread-count");
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch unread count");
    }
    const data = (await res.json()) as { count: number };
    return data.count;
  },

  async getRecipients() {
    const res = await fetch("/api/chats/recipients");
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch chat recipients");
    }
    return res.json() as Promise<ChatRecipient[]>;
  },

  async createOrGetDirectChat(recipientId: string) {
    const res = await fetch("/api/chats/direct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create direct chat");
    }
    return res.json() as Promise<Chat>;
  },
};
