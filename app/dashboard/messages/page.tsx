"use client";

import React, { useState } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";
import { Chat, Message, User } from "@/types";
import TopNav from "../components/TopNav";

// MOCK DATA
const MOCK_USER: User = {
  id: "me",
  name: "Elion",
  email: "elion@example.com",
  emailVerified: null,
  image: null,
  username: "elion",
  bio: "Fullstack Developer",
  skills: ["React", "Next.js", "Supabase"],
  created_at: new Date().toISOString(),
};

const MOCK_CHATS: Chat[] = [
  {
    id: "1",
    name: "Sarah Chen",
    last_message: "When are you available for a quick sync?",
    is_group: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    participants: [],
  },
  {
    id: "2",
    name: "Marcus Wright",
    last_message: "Thanks for the invite. I'm interested.",
    is_group: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    participants: [],
  },
];

const createMockMessageSender = (id: string, name: string): User => ({
  id,
  name,
  email: `${id}@example.com`,
  emailVerified: null,
  image: null,
  username: id,
  bio: null,
  skills: [],
  created_at: new Date().toISOString(),
});

const MOCK_MESSAGES: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      chat_id: "1",
      sender_id: "sarah",
      content: "Hey, saw your application for SolarOS! Your profile looks great.",
      created_at: "2026-04-02T09:00:00Z",
      is_read: true,
      sender: createMockMessageSender("sarah", "Sarah Chen"),
    },
    {
      id: "m2",
      chat_id: "1",
      sender_id: "me",
      content: "Hi Sarah! Thanks for reaching out. I'm really excited about the project.",
      created_at: "2026-04-02T09:15:00Z",
      is_read: true,
      sender: MOCK_USER,
    },
    {
      id: "m3",
      chat_id: "1",
      sender_id: "sarah",
      content: "When are you available for a quick sync?",
      created_at: "2026-04-02T09:20:00Z",
      is_read: false,
      sender: createMockMessageSender("sarah", "Sarah Chen"),
    },
  ],
  "2": [
    {
      id: "m4",
      chat_id: "2",
      sender_id: "marcus",
      content: "Thanks for the invite. I'm interested.",
      created_at: "2026-04-02T09:41:00Z",
      is_read: true,
      sender: createMockMessageSender("marcus", "Marcus Wright"),
    },
  ],
};

const MessagesPage = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null); // Start with null for mobile list view
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const activeChat = MOCK_CHATS.find((c) => c.id === activeChatId) || null;
  const currentMessages = activeChatId ? messages[activeChatId] || [] : [];

  const handleSendMessage = (content: string) => {
    if (!activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      chat_id: activeChatId,
      sender_id: "me",
      content,
      created_at: new Date().toISOString(),
      is_read: false,
      sender: MOCK_USER,
    };

    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage],
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full max-w-[1400px] mx-auto p-4 md:p-8 pt-4 md:pt-6 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="justify-between items-center w-full hidden md:flex">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Messages
          </h1>
        </div>
        <TopNav />
      </div>
      <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
        {/* Sidebar - Hidden on mobile if a chat is active */}
        <div className={`w-full md:w-auto h-full ${activeChatId ? 'hidden md:block' : 'block'}`}>
          <ChatSidebar 
            chats={MOCK_CHATS} 
            activeChatId={activeChatId} 
            onSelectChat={setActiveChatId} 
          />
        </div>

        {/* Chat Window - Hidden on mobile if no chat is active */}
        <div className={`flex-1 h-full ${activeChatId ? 'block' : 'hidden md:block'}`}>
          <ChatWindow 
            chat={activeChat} 
            messages={currentMessages} 
            currentUser={MOCK_USER} 
            onSendMessage={handleSendMessage}
            onBack={() => setActiveChatId(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;