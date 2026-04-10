"use client";

import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Chat } from "@/types";

// ── Relative time formatter ─────────────────────────────────────
function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";

  const now = Date.now();
  const diff = now - date.getTime();

  if (diff < 60_000) return "now";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h`;

  const today = new Date();
  const yesterday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (msgDate.getTime() === yesterday.getTime()) return "Yesterday";

  if (diff < 604800_000) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string | null) => void;
  onStartChat: () => void;
  onlineUserIds?: Set<string>;
  chatParticipantMap?: Map<string, string>; // chatId -> other participant userId
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onStartChat,
  onlineUserIds = new Set(),
  chatParticipantMap = new Map(),
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = searchQuery.trim()
    ? chats.filter((c) =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : chats;

  return (
    <div className="w-full md:w-[360px] lg:w-[380px] h-full flex flex-col bg-white dark:bg-zinc-900 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-zinc-950/50 border border-slate-100 dark:border-zinc-800 overflow-hidden">
      <div className="p-4 md:p-6 pb-2">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Messages
          </h1>
          <button
            onClick={onStartChat}
            className="w-10 h-10 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-2xl flex items-center justify-center transition-colors"
            title="Start new chat"
            aria-label="Start new chat"
          >
            <Plus className="w-4 h-4 text-indigo-500" />
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-medium text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 md:px-4 pb-4 md:pb-6 space-y-2 scrollbar-hide">
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-bold text-slate-400 dark:text-zinc-500">
              {searchQuery ? "No chats found" : "No conversations yet"}
            </p>
            {!searchQuery && (
              <p className="text-xs text-slate-300 dark:text-zinc-600 mt-1">
                Start a chat with a project member
              </p>
            )}
          </div>
        )}
        {filteredChats.map((chat) => {
          const isActive = chat.id === activeChatId;
          const otherUserId = chatParticipantMap.get(chat.id);
          const isOtherOnline = otherUserId
            ? onlineUserIds.has(otherUserId)
            : false;

          return (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full text-left p-4 rounded-[24px] flex items-center gap-4 transition-all duration-300 group ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
                  : "hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400"
              }`}
            >
              <div className="relative shrink-0">
                <div
                  className={`w-14 h-14 rounded-2xl overflow-hidden shadow-sm transition-transform group-hover:scale-105 duration-300 ${isActive ? "ring-2 ring-white/20" : ""}`}
                >
                  <div className="w-full h-full bg-linear-to-br from-indigo-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center">
                    <span
                      className={`text-lg font-bold ${isActive ? "text-white" : "text-indigo-400 dark:text-indigo-300"}`}
                    >
                      {chat.name?.charAt(0)}
                    </span>
                  </div>
                </div>
                {/* Online/Offline dot */}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                    isActive
                      ? "border-indigo-600"
                      : "border-white dark:border-zinc-900"
                  } ${
                    isOtherOnline
                      ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                      : "bg-slate-300 dark:bg-zinc-600"
                  }`}
                />

                {/* Unread badge */}
                {!!chat.unread_count && chat.unread_count > 0 && !isActive && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white text-[11px] flex items-center justify-center rounded-full border-[3px] border-white dark:border-zinc-900 font-black shadow-sm">
                    {chat.unread_count > 9 ? "9+" : chat.unread_count}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3
                    className={`font-bold truncate text-sm tracking-tight ${isActive ? "text-white" : "text-slate-900 dark:text-zinc-100"}`}
                  >
                    {chat.name}
                  </h3>
                  <span
                    className={`text-[10px] font-semibold whitespace-nowrap ml-2 ${isActive ? "text-indigo-100" : "text-slate-400 dark:text-zinc-500"}`}
                  >
                    {formatRelativeTime(chat.updated_at)}
                  </span>
                </div>
                <p
                  className={`text-xs truncate font-medium ${isActive ? "text-indigo-50" : "text-slate-500 dark:text-zinc-500"}`}
                >
                  {chat.last_message || "No messages yet"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;
