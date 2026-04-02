"use client";

import React from "react";
import { Search } from "lucide-react";
import { Chat } from "@/types";

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string | null) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ chats, activeChatId, onSelectChat }) => {
  return (
    <div className="w-full md:w-[380px] h-full flex flex-col bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-zinc-950/50 border border-slate-100 dark:border-zinc-800 overflow-hidden">
      <div className="p-6 pb-2">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Messages</h1>
          <button className="w-10 h-10 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-2xl flex items-center justify-center transition-colors">
             <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search chat..."
            className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-medium text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 scrollbar-hide">
        {chats.map((chat) => {
          const isActive = chat.id === activeChatId;
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
              <div className="relative flex-shrink-0">
                <div className={`w-14 h-14 rounded-2xl overflow-hidden shadow-sm transition-transform group-hover:scale-105 duration-300 ${isActive ? "ring-2 ring-white/20" : ""}`}>
                   <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center">
                      <span className={`text-lg font-bold ${isActive ? "text-white" : "text-indigo-400 dark:text-indigo-300"}`}>
                        {chat.name?.charAt(0)}
                      </span>
                   </div>
                </div>
                {chat.id === "1" && !isActive && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white text-[11px] flex items-center justify-center rounded-full border-[3px] border-white dark:border-zinc-900 font-black shadow-sm">
                     1
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-bold truncate text-sm tracking-tight ${isActive ? "text-white" : "text-slate-900 dark:text-zinc-100"}`}>
                    {chat.name}
                  </h3>
                  <span className={`text-[10px] font-medium whitespace-nowrap ${isActive ? "text-indigo-100" : "text-slate-400 dark:text-zinc-500"}`}>
                    9:41 AM
                  </span>
                </div>
                <p className={`text-xs truncate font-medium ${isActive ? "text-indigo-50" : "text-slate-500 dark:text-zinc-500"}`}>
                  {chat.last_message}
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
