"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";
import TopNav from "../components/TopNav";
import { useChats, useChatMessages, useSendMessage, useChatRecipients, useCreateDirectChat, useMarkChatRead } from "@/hooks";
import { useUser } from "@/hooks/useUser";
import { usePresence } from "@/hooks/usePresence";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { X, Search, UserPlus, ArrowRight } from "lucide-react";
import Image from "next/image";
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
  const sendMessage = useSendMessage(user);
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

  interface Recipient {
    id: string;
    name: string;
    username: string;
    image: string | null;
    bio: string | null;
    skills: string[];
    relationship: "peer" | "following" | "allowed_follower";
  }

  const categorizedRecipients = useMemo(() => {
    const categories = {
      peer: [] as Recipient[],
      following: [] as Recipient[],
      allowed_follower: [] as Recipient[]
    };
    (recipients as Recipient[]).forEach((r) => {
      if (r.relationship === "peer") categories.peer.push(r);
      else if (r.relationship === "following") categories.following.push(r);
      else categories.allowed_follower.push(r);
    });
    return categories;
  }, [recipients]);

  const [recipientSearch, setRecipientSearch] = useState("");
  const filteredRecipients = useMemo(() => {
    if (!recipientSearch) return categorizedRecipients;
    const lower = recipientSearch.toLowerCase();
    const filter = (list: Recipient[]) => list.filter(r => 
      (r.name || "").toLowerCase().includes(lower) || 
      (r.username || "").toLowerCase().includes(lower)
    );
    return {
      peer: filter(categorizedRecipients.peer),
      following: filter(categorizedRecipients.following),
      allowed_follower: filter(categorizedRecipients.allowed_follower)
    };
  }, [categorizedRecipients, recipientSearch]);

  const { data: pendingFollowers = [], refetch: refetchPending } = useQuery({
    queryKey: ["users", "pending-followers"],
    queryFn: async () => {
      const res = await fetch("/api/user/followers/pending"); 
      if (!res.ok) return [];
      return res.json();
    },
    enabled: showNewChatModal
  });

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

  const handleAllowFollower = async (followerId: string) => {
    try {
      const res = await fetch(`/api/users/${followerId}/follow/allow`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to allow follower");
      toast.success("Follower allowed to message");
      refetchPending();
      // Recipients list will automatically update via React Query in useChatRecipients
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "An error occurred");
    }
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-50 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/50">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Start New Chat
                </h2>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Choose a collaborator or connection</p>
              </div>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-slate-400 hover:text-rose-500 transition-all active:scale-95 shadow-sm"
                onClick={() => setShowNewChatModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="px-8 py-4 bg-white dark:bg-zinc-900">
              <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search connections..." 
                  value={recipientSearch}
                  onChange={(e) => setRecipientSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* Recipients List */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6 scrollbar-hide">
              {recipientsLoading && (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin mb-4" />
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Searching...</p>
                </div>
              )}

              {/* Pending Approvals */}
              {!recipientSearch && pendingFollowers.length > 0 && (
                <div className="space-y-3">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Pending Approvals
                  </h3>
                  <div className="space-y-2">
                    {pendingFollowers.map((follower: { id: string; name: string }) => (
                      <div key={follower.id} className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center font-black text-amber-600">
                            {follower.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{follower.name}</p>
                            <p className="text-[10px] font-bold text-amber-600/70">Wants to message you</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleAllowFollower(follower.id)}
                          className="px-4 py-2 bg-slate-900 dark:bg-amber-500 text-white text-[10px] font-black rounded-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
                        >
                          Allow
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Object.entries(filteredRecipients).map(([category, list]) => {
                if (list.length === 0) return null;
                return (
                  <div key={category} className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {category.replace("_", " ")}s
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {list.map((recipient) => {
                        const online = isOnline(recipient.id);
                        return (
                          <button
                            key={recipient.id}
                            onClick={() => handleStartChat(recipient.id)}
                            className="group flex items-center gap-4 p-4 rounded-[20px] bg-slate-50 dark:bg-zinc-800/40 border border-slate-50 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-indigo-600/20 hover:shadow-xl hover:shadow-indigo-500/5 transition-all text-left"
                          >
                            <div className="relative">
                              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-lg font-black text-indigo-600">
                                {recipient.image ? (
                                  <Image src={recipient.image} alt={recipient.name} fill className="object-cover rounded-2xl" />
                                ) : (
                                  (recipient.name || recipient.username || "U").charAt(0)
                                )}
                              </div>
                              <span
                                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-4 border-slate-50 dark:border-zinc-900 group-hover:scale-110 transition-transform ${
                                  online ? "bg-emerald-500" : "bg-slate-300 dark:bg-zinc-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-black text-slate-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 transition-colors">
                                {recipient.name || recipient.username || "User"}
                              </h4>
                              <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 truncate mt-0.5">
                                {online ? (
                                  <span className="text-emerald-500">Active now</span>
                                ) : (
                                  (recipient.skills || []).slice(0, 3).join(" • ") || "Community Member"
                                )}
                              </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 opacity-0 group-hover:opacity-100 flex items-center justify-center text-indigo-600 shadow-sm transition-all -translate-x-2 group-hover:translate-x-0">
                              <ArrowRight size={16} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {!recipientsLoading && recipients.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-300 mb-4">
                    <UserPlus size={32} />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">No connections found</h4>
                  <p className="text-xs font-bold text-slate-400 max-w-[200px] mt-2">Try following more people or joining active projects.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
