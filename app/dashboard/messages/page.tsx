"use client";

import React, { useMemo, useState } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";
import TopNav from "../components/TopNav";
import {
  useChats,
  useChatMessages,
  useSendMessage,
  useChatRecipients,
  useCreateDirectChat,
} from "@/hooks";
import { useUser } from "@/hooks/useUser";
import MessagesLoading from "./loading";

const MessagesPage = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null); // Start with null for mobile list view
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const { user, isLoading: userLoading } = useUser();
  const { data: chats = [], isLoading: chatsLoading, isError: chatsIsError } = useChats();
  const { data: currentMessages = [], isLoading: messagesLoading } = useChatMessages(activeChatId);
  const { data: recipients = [], isLoading: recipientsLoading } = useChatRecipients();
  const createDirectChat = useCreateDirectChat();
  const sendMessage = useSendMessage();

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) || null,
    [activeChatId, chats],
  );

  if (userLoading) return <MessagesLoading />;

  const handleSendMessage = (content: string) => {
    if (!activeChatId) return;
    sendMessage.mutate({ chatId: activeChatId, content });
  };

  const handleStartChat = async (recipientId: string) => {
    const chat = await createDirectChat.mutateAsync(recipientId);
    setActiveChatId(chat.id);
    setShowNewChatModal(false);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-84px)] md:h-[calc(100vh-100px)] w-full max-w-[1400px] mx-auto p-2 sm:p-3 md:p-8 pt-2 md:pt-6 gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="justify-between items-center w-full hidden md:flex">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Messages
          </h1>
        </div>
        <TopNav />
      </div>
      <div className="flex flex-1 gap-3 md:gap-6 overflow-hidden min-h-0">
        {/* Sidebar - Hidden on mobile if a chat is active */}
        <div className={`w-full md:w-auto h-full ${activeChatId ? 'hidden md:block' : 'block'}`}>
          <ChatSidebar 
            chats={chatsLoading ? [] : chats} 
            activeChatId={activeChatId} 
            onSelectChat={setActiveChatId} 
            onStartChat={() => setShowNewChatModal(true)}
          />
          {chatsIsError && (
            <div className="mt-3 text-xs font-bold text-rose-500 px-2">
              Failed to load chats.
            </div>
          )}
        </div>

        {/* Chat Window - Hidden on mobile if no chat is active */}
        <div className={`flex-1 h-full ${activeChatId ? 'block' : 'hidden md:block'}`}>
          <ChatWindow 
            chat={activeChat} 
            messages={messagesLoading ? [] : currentMessages} 
            currentUser={user || null} 
            onSendMessage={handleSendMessage}
            onBack={() => setActiveChatId(null)}
          />
        </div>
      </div>

      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Start new chat
              </h2>
              <button
                className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                onClick={() => setShowNewChatModal(false)}
              >
                Close
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto space-y-2">
              {recipientsLoading && (
                <div className="text-sm font-medium text-slate-500">Loading recipients...</div>
              )}
              {!recipientsLoading && recipients.length === 0 && (
                <div className="text-sm font-medium text-slate-500">
                  No eligible recipients yet. Join a project/workspace first.
                </div>
              )}
              {recipients.map((recipient) => (
                <button
                  key={recipient.id}
                  className="w-full text-left px-3 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                  onClick={() => handleStartChat(recipient.id)}
                  disabled={createDirectChat.isPending}
                >
                  <div className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                    {recipient.name || recipient.username || "User"}
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                    {(recipient.skills || []).slice(0, 3).join(", ") || "No skills listed"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;