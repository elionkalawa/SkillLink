"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, MoreHorizontal, ArrowLeft } from "lucide-react";
import MessageBubble, { formatDateSeparator } from "./MessageBubble";
import { Chat, Message, User } from "@/types";

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  currentUser: User | null;
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  isOnline?: boolean;
  lastSeen?: string | null;
}

// ── Last seen formatter ─────────────────────────────────────────
function formatLastSeen(iso: string | null | undefined): string {
  if (!iso) return "Offline";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "Offline";
  
  const now = Date.now();
  const diff = now - date.getTime();
  
  if (diff < 60_000) return "Last seen just now";
  if (diff < 3600_000) return `Last seen ${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86400_000) return `Last seen ${Math.floor(diff / 3600_000)}h ago`;
  
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const seenDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (seenDate.getTime() === yesterday.getTime()) {
    return `Last seen yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
  
  return `Last seen ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

// ── Build date separators ───────────────────────────────────────
function getDateSeparators(messages: Message[]): Map<number, string> {
  const separators = new Map<number, string>();
  let lastDate = "";
  
  messages.forEach((msg, index) => {
    const msgDate = new Date(msg.created_at);
    const dateKey = `${msgDate.getFullYear()}-${msgDate.getMonth()}-${msgDate.getDate()}`;
    
    if (dateKey !== lastDate) {
      separators.set(index, formatDateSeparator(msg.created_at));
      lastDate = dateKey;
    }
  });
  
  return separators;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  chat, 
  messages, 
  currentUser, 
  onSendMessage, 
  onBack,
  isOnline = false,
  lastSeen,
}) => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: messages.length - prevMessageCountRef.current === 1 ? "smooth" : "auto" });
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length]);

  // Also scroll when chat changes
  useEffect(() => {
    prevMessageCountRef.current = 0;
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, 100);
  }, [chat?.id]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 h-full hidden md:flex flex-col items-center justify-center bg-slate-50/50 dark:bg-zinc-900/50 rounded-3xl border border-slate-100 dark:border-zinc-800">
        <div className="w-20 h-20 bg-white dark:bg-zinc-900 shadow-xl shadow-slate-100 dark:shadow-zinc-950 rounded-[32px] flex items-center justify-center mb-6 border border-slate-50 dark:border-zinc-800">
           <Send className="w-8 h-8 text-indigo-200 dark:text-zinc-700" />
        </div>
        <h3 className="text-slate-900 dark:text-slate-100 font-extrabold mb-2 text-xl tracking-tight">Your Messages</h3>
        <p className="text-slate-400 dark:text-zinc-500 text-sm font-medium">Select a conversation to start chatting.</p>
      </div>
    );
  }

  const dateSeparators = getDateSeparators(messages);

  return (
    <div className="flex-1 h-full flex flex-col bg-white dark:bg-zinc-900 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-zinc-950/50 border border-slate-100 dark:border-zinc-800 overflow-hidden relative">
      {/* Header */}
      <header className="px-3 sm:px-4 md:px-6 py-3 md:py-4 border-b border-slate-50 dark:border-zinc-800/50 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl z-20">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
          {onBack && (
            <button 
              onClick={onBack}
              className="md:hidden p-2 -ml-2 text-slate-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center font-bold text-indigo-500 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20">
               {chat.name?.charAt(0)}
            </div>
            {/* Online indicator on avatar */}
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900 ${
              isOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300 dark:bg-zinc-600"
            }`} />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-slate-900 dark:text-zinc-100 text-sm sm:text-base leading-tight tracking-tight truncate">{chat.name}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isOnline ? (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-500 font-bold">Online</span>
              ) : (
                <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
                  {formatLastSeen(lastSeen)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
           <div className="w-px h-4 bg-slate-100 dark:bg-zinc-800 mx-1" />
           <button className="p-2.5 text-slate-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded-xl transition-all">
              <MoreHorizontal className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* Messages */}
      <main ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 scrollbar-hide bg-slate-50/30 dark:bg-zinc-950/30">
        <div className="flex flex-col min-h-full justify-end">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-indigo-300 dark:text-indigo-600" />
              </div>
              <p className="text-sm font-bold text-slate-400 dark:text-zinc-500">No messages yet</p>
              <p className="text-xs text-slate-300 dark:text-zinc-600 mt-1">Send a message to start the conversation</p>
            </div>
          )}
          {messages.map((message, index) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isMe={message.sender_id === currentUser?.id}
              recipientOnline={isOnline}
              showDateSeparator={dateSeparators.get(index) || null}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="p-3 sm:p-4 md:p-5 bg-white dark:bg-zinc-900 border-t border-slate-50 dark:border-zinc-800/50">
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-800/50 p-2 rounded-2xl border border-slate-100 dark:border-zinc-800 focus-within:border-indigo-200 dark:focus-within:border-indigo-500/50 focus-within:bg-white dark:focus-within:bg-zinc-800 focus-within:shadow-lg focus-within:shadow-indigo-100/50 dark:focus-within:shadow-indigo-900/10 transition-all duration-300">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none py-3 px-4 outline-none text-sm font-semibold text-slate-700 dark:text-zinc-300 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
              inputValue.trim() 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:scale-105 active:scale-95" 
              : "bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatWindow;
