"use client";

import React from "react";
import { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  recipientOnline?: boolean;
  showDateSeparator?: string | null;
}

// ── Tick SVG icons ──────────────────────────────────────────────
function SingleTick({ className }: { className?: string }) {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className={className}>
      <path d="M11.071 0.929L5.414 6.586 2.929 4.101 1.515 5.515 5.414 9.414 12.485 2.343 11.071 0.929Z" fill="currentColor" />
    </svg>
  );
}

function DoubleTick({ className }: { className?: string }) {
  return (
    <svg width="20" height="11" viewBox="0 0 20 11" fill="none" className={className}>
      <path d="M15.071 0.929L9.414 6.586 8.707 5.879 7.293 7.293 9.414 9.414 16.485 2.343 15.071 0.929Z" fill="currentColor" />
      <path d="M11.071 0.929L5.414 6.586 2.929 4.101 1.515 5.515 5.414 9.414 12.485 2.343 11.071 0.929Z" fill="currentColor" />
    </svg>
  );
}

// ── Timestamp formatting ────────────────────────────────────────
function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDateSeparator(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (messageDate.getTime() === today.getTime()) return "Today";
  if (messageDate.getTime() === yesterday.getTime()) return "Yesterday";
  
  return date.toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// ── Read status logic ───────────────────────────────────────────
type ReadStatus = "sending" | "sent" | "delivered" | "read";

function getReadStatus(message: Message, isMe: boolean, recipientOnline?: boolean): ReadStatus {
  if (!isMe) return "read"; 
  if (message.is_read || message.read_at) return "read";
  if (recipientOnline) return "delivered";
  return "sent";
}

// ── Component ───────────────────────────────────────────────────
const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, recipientOnline, showDateSeparator }) => {
  const readStatus = getReadStatus(message, isMe, recipientOnline);
  const time = formatMessageTime(message.created_at);

  return (
    <>
      {/* Date separator */}
      {showDateSeparator && (
        <div className="flex items-center justify-center my-6">
          <div className="px-4 py-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full">
            <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
              {showDateSeparator}
            </span>
          </div>
        </div>
      )}
      
      <div className={`flex flex-col mb-3 ${isMe ? "items-end" : "items-start animate-in slide-in-from-left-2 duration-300"}`}>
        <div
          className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-[20px] text-[13px] md:text-sm font-medium leading-relaxed transition-all shadow-sm ${
            isMe
              ? "bg-indigo-600 text-white rounded-br-md shadow-indigo-100/50 dark:shadow-indigo-900/20"
              : "bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded-bl-md shadow-slate-200/50 dark:shadow-zinc-950/50 border border-slate-100 dark:border-zinc-800"
          }`}
        >
          <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
          
          {/* Inline time & ticks */}
          <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : ""}`}>
            <span className={`text-[10px] font-medium ${
              isMe ? "text-indigo-200" : "text-slate-400 dark:text-zinc-500"
            }`}>
              {time}
            </span>
            
            {/* Read receipt ticks — only for sent messages */}
            {isMe && (
              <span className="ml-0.5 flex items-center">
                {readStatus === "read" ? (
                  <DoubleTick className="w-4 h-3 text-sky-300 drop-shadow-[0_0_2px_rgba(125,211,252,0.4)]" />
                ) : readStatus === "delivered" ? (
                  <DoubleTick className="w-4 h-3 text-indigo-300/40" />
                ) : (
                  <SingleTick className="w-3.5 h-2.5 text-indigo-300/30" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageBubble;
