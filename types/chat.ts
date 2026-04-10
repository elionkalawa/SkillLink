import { User } from "./user";

export interface Chat {
  id: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  name?: string;
  is_group: boolean;
  unread_count?: number;
  other_participant_id?: string | null;
  participants: ChatParticipant[];
  messages?: Message[];
}

export interface ChatParticipant {
  chat_id: string;
  user_id: string;
  joined_at: string;
  user: User;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  read_at?: string | null;
  sender: User;
}

export interface ChatRecipient {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  bio: string | null;
  skills: string[];
}

// For use in the Messaging Dashboard views
export interface ActiveChat extends Chat {
  current_user_id: string;
}
