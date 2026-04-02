"use client";

import React from "react";
import { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe }) => {
  return (
    <div className={`flex flex-col mb-4 ${isMe ? "items-end" : "items-start animate-in slide-in-from-left-2 duration-300"}`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] p-5 rounded-[28px] text-[13px] md:text-sm font-medium leading-relaxed transition-all shadow-sm ${
          isMe
            ? "bg-indigo-600 text-white rounded-br-none shadow-indigo-100/50 dark:shadow-indigo-900/20"
            : "bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded-bl-none shadow-slate-200/50 dark:shadow-zinc-950/50 border border-slate-100 dark:border-zinc-800"
        }`}
      >
        {message.content}
      </div>
      <div className={`flex items-center gap-1.5 mt-2 px-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest ${isMe ? "flex-row-reverse" : ""}`}>
        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        {isMe && <span className="text-emerald-500 dark:text-emerald-400">Read</span>}
      </div>
    </div>
  );
};

export default MessageBubble;
