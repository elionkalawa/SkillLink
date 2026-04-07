import { supabase } from "../supabaseClient";
import { Chat, Message } from "@/types";

export const chatService = {
  /**
   * Fetches all conversations for the current user including participant info
   */
  async getChats(userId: string) {
    const { data, error } = await supabase
      .from("chat_participants")
      .select(`
        chat_id,
        chats (
          id,
          created_at,
          updated_at,
          last_message,
          is_group,
          name
        )
      `)
      .eq("user_id", userId);

    if (error) throw error;

    return data.map(
      (d: { chat_id: string; chats: Omit<Chat, "participants" | "messages"> | Omit<Chat, "participants" | "messages">[] }) => {
        // Supabase may return the joined relation as an array or single object
        const chat = Array.isArray(d.chats) ? d.chats[0] : d.chats;
        return chat as Chat;
      }
    );
  },

  
  /**
   * Fetches messages for a specific chat
   */
  async getMessages(chatId: string) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as Message[];
  },

  /**
   * Sends a message to a chat
   */
  async sendMessage(chatId: string, senderId: string, content: string) {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        content: content,
      })
      .select()
      .single();

    if (error) throw error;

    // Optional: Update chat's last_message
    await supabase
      .from("chats")
      .update({ last_message: content, updated_at: new Date().toISOString() })
      .eq("id", chatId);

    return data as Message;
  }
};
