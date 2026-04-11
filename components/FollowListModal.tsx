"use client";

import React from "react";
import { X, UserPlus, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

interface UserListItem {
  id: string;
  name: string;
  username: string;
  image: string | null;
  profile_title: string | null;
  role: string | null;
}

interface FollowListModalProps {
  userId: string;
  type: "followers" | "following";
  isOpen: boolean;
  onClose: () => void;
}

export default function FollowListModal({ userId, type, isOpen, onClose }: FollowListModalProps) {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", userId, type],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/${type}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json() as Promise<UserListItem[]>;
    },
    enabled: isOpen && !!userId
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight capitalize">
              {type}
            </h2>
            <p className="text-xs font-bold text-slate-400 mt-0.5">
              {users.length} {users.length === 1 ? 'person' : 'people'} in this list
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-slate-400 hover:text-rose-500 transition-all active:scale-95 shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search placeholder (Optional future enhancement) */}
        
        {/* List Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 scrollbar-hide">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 size={32} className="animate-spin text-indigo-600 mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading List...</p>
            </div>
          ) : users.length > 0 ? (
            users.map((item) => (
              <Link
                key={item.id}
                href={`/dashboard/profile/${item.id}`}
                onClick={onClose}
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-zinc-800"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-lg font-black text-indigo-600 overflow-hidden">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      item.name?.charAt(0) || item.username?.charAt(0) || "?"
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-slate-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 truncate mt-0.5">
                    {item.profile_title || item.role || "Community Member"}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all">
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-300 mb-4">
                <UserPlus size={32} />
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">No {type} yet</h4>
              <p className="text-xs font-bold text-slate-400 max-w-[200px] mt-2 italic">Connections are the key to great projects!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
