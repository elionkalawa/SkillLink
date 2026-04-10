"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";
import TopNav from "../components/TopNav";
import {
  useChats,
  useChatMessages,
  useSendMessage,
  useChatRecipients,
  useCreateDirectChat,
  useMarkChatRead,
} from "@/hooks";
import { useUser } from "@/hooks/useUser";
import { usePresence } from "@/hooks/usePresence";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import MessagesLoading from "./loading";

const MessagesPage = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const { user, isLoading: userLoading } = useUser();
  const {
    data: chats = [],
    isLoading: chatsLoading,
    isError: chatsIsError,
  } = useChats();
  const { data: currentMessages = [], isLoading: messagesLoading } =
    useChatMessages(activeChatId);
  const { data: recipients = [], isLoading: recipientsLoading } =
    useChatRecipients();
  const createDirectChat = useCreateDirectChat();
  const sendMessage = useSendMessage();
  const { mutate: markAsRead, isPending: isMarkingRead } = useMarkChatRead();

  // Presence tracking
  const { isOnline, getLastSeen, fetchPresence, onlineUserIds } = usePresence();

  // Realtime message subscription for active chat
  useRealtimeMessages(activeChatId, user?.id || null);

  // Build a map: chatId -> other participant's userId
  const chatParticipantMap = useMemo(() => {
    const map = new Map<string, string>();
    chats.forEach((chat) => {
      if (!chat.is_group && chat.other_participant_id) {
        map.set(chat.id, chat.other_participant_id);
      }
    });
    return map;
  }, [chats]);

  // All user IDs to track presence for
  const allRelevantUserIds = useMemo(() => {
    const ids = new Set<string>();
    recipients.forEach((r) => ids.add(r.id));
    chats.forEach((c) => {
      if (c.other_participant_id) ids.add(c.other_participant_id);
    });
    return Array.from(ids);
  }, [recipients, chats]);

  // Fetch presence for all recipients and chat participants
  useEffect(() => {
    if (allRelevantUserIds.length > 0) {
      fetchPresence(allRelevantUserIds);
    }
  }, [allRelevantUserIds, fetchPresence]);

  // Periodically refresh presence
  useEffect(() => {
    if (allRelevantUserIds.length === 0) return;

    const interval = setInterval(() => {
      fetchPresence(allRelevantUserIds);
    }, 30_000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [allRelevantUserIds, fetchPresence]);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) || null,
    [activeChatId, chats],
  );

  // Get the other user's ID in the active chat to check their online status
  const otherUserIdInActiveChat = useMemo(() => {
    if (!activeChat) return null;
    return chatParticipantMap.get(activeChat.id) || null;
  }, [activeChat, chatParticipantMap]);

  // Mark chat as read when selecting it
  const handleSelectChat = useCallback(
    (chatId: string | null) => {
      setActiveChatId(chatId);
      if (chatId) {
        markAsRead(chatId);
      }
    },
    [markAsRead],
  );

  // Also mark as read when new messages arrive in the active chat
  useEffect(() => {
    if (activeChatId && currentMessages.length > 0 && !isMarkingRead) {
      const hasUnread = currentMessages.some(
        (m) => !m.is_read && m.sender_id !== user?.id,
      );
      if (hasUnread) {
        markAsRead(activeChatId);
      }
    }
  }, [
    activeChatId,
    currentMessages,
    user?.id,
    isMarkingRead,
    markAsRead,
  ]);

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
        <div
          className={`w-full md:w-auto h-full ${activeChatId ? "hidden md:block" : "block"}`}
        >
          <ChatSidebar
            chats={chatsLoading ? [] : chats}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
            onStartChat={() => setShowNewChatModal(true)}
            onlineUserIds={onlineUserIds}
            chatParticipantMap={chatParticipantMap}
          />
          {chatsIsError && (
            <div className="mt-3 text-xs font-bold text-rose-500 px-2">
              Failed to load chats.
            </div>
          )}
        </div>

        {/* Chat Window - Hidden on mobile if no chat is active */}
        <div
          className={`flex-1 h-full ${activeChatId ? "block" : "hidden md:block"}`}
        >
          <ChatWindow
            chat={activeChat}
            messages={messagesLoading ? [] : currentMessages}
            currentUser={user || null}
            onSendMessage={handleSendMessage}
            onBack={() => setActiveChatId(null)}
            isOnline={
              otherUserIdInActiveChat ? isOnline(otherUserIdInActiveChat) : false
            }
            lastSeen={
              otherUserIdInActiveChat
                ? getLastSeen(otherUserIdInActiveChat)
                : null
            }
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
                <div className="text-sm font-medium text-slate-500">
                  Loading recipients...
                </div>
              )}
              {!recipientsLoading && recipients.length === 0 && (
                <div className="text-sm font-medium text-slate-500">
                  No eligible recipients yet. Join a project/workspace first.
                </div>
              )}
              {recipients.map((recipient) => {
                const recipientOnline = isOnline(recipient.id);
                return (
                  <button
                    key={recipient.id}
                    className="w-full text-left px-3 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                    onClick={() => handleStartChat(recipient.id)}
                    disabled={createDirectChat.isPending}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-sm font-bold text-indigo-500">
                          {(recipient.name || recipient.username || "U").charAt(
                            0,
                          )}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-50 dark:border-zinc-800 ${
                            recipientOnline
                              ? "bg-emerald-500"
                              : "bg-slate-300 dark:bg-zinc-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                          {recipient.name || recipient.username || "User"}
                        </div>
                        <div className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                          {recipientOnline ? (
                            <span className="text-emerald-500">Online</span>
                          ) : (
                            (recipient.skills || []).slice(0, 3).join(", ") ||
                            "No skills listed"
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
