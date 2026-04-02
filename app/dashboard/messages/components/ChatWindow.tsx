"use client";

import React, { useState } from "react";
import { Send, MoreHorizontal, ArrowLeft } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { Chat, Message, User } from "@/types";

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  currentUser: User | null;
  onSendMessage: (content: string) => void;
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, messages, currentUser, onSendMessage, onBack }) => {
  const [inputValue, setInputValue] = useState("");

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

  return (
    <div className="flex-1 h-full flex flex-col bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-zinc-950/50 border border-slate-100 dark:border-zinc-800 overflow-hidden relative">
      {/* Header */}
      <header className="px-6 py-5 border-b border-slate-50 dark:border-zinc-800/50 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="md:hidden p-2 -ml-2 text-slate-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center font-bold text-indigo-500 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20">
             {chat.name?.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-zinc-100 text-base leading-tight tracking-tight">{chat.name}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[11px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-wider">Online</span>
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
      <main className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-slate-50/30 dark:bg-zinc-950/30">
        <div className="flex flex-col min-h-full justify-end">
           {messages.map((message) => (
             <MessageBubble 
               key={message.id} 
               message={message} 
               isMe={message.sender_id === currentUser?.id} 
             />
           ))}
        </div>
      </main>

      {/* Input */}
      <footer className="p-6 bg-white dark:bg-zinc-900 border-t border-slate-50 dark:border-zinc-800/50">
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-800/50 p-2 rounded-2xl border border-slate-100 dark:border-zinc-800 focus-within:border-indigo-200 dark:focus-within:border-indigo-500/50 focus-within:bg-white dark:focus-within:bg-zinc-800 focus-within:shadow-lg focus-within:shadow-indigo-100/50 dark:focus-within:shadow-indigo-900/10 transition-all duration-300">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none py-3 px-4 outline-none text-sm font-semibold text-slate-700 dark:text-zinc-300 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
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
