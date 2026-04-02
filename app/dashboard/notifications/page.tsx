"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";
import { Bell, CheckCircle, Info, MessageCircle, Briefcase, Trash2, Loader2 } from "lucide-react";
import TopNav from "../components/TopNav";

export interface Notification {
  id: string;
  user_id: string;
  type: 'invite' | 'approval' | 'message' | 'project-update';
  message: string;
  read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const isLoading = status === 'loading' || (status === 'authenticated' && isFetching);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setNotifications(data as Notification[]);
      }
      setIsFetching(false);
    };

    if (status === 'authenticated') {
      fetchNotifications();
    }
  }, [session, status]);

  // Set up real-time subscription
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return;

    const channel = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications((prev) => [payload.new as Notification, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications((prev) =>
              prev.map((n) => (n.id === payload.new.id ? (payload.new as Notification) : n))
            );
          } else if (payload.eventType === 'DELETE') {
            setNotifications((prev) => prev.filter((n) => n.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, status]);

  const markAsRead = async (id: string, currentRead: boolean) => {
    if (currentRead) return;
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  };

  const deleteNotification = async (id: string) => {
    // Optimistic update
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await supabase.from('notifications').delete().eq('id', id);
  };

  const clearAllAppNotifications = async () => {
    if (!session?.user?.id) return;
    setNotifications([]);
    await supabase.from('notifications').delete().eq('user_id', session.user.id);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'invite': return <Info size={20} className="text-blue-500" />;
      case 'approval': return <CheckCircle size={20} className="text-green-500" />;
      case 'message': return <MessageCircle size={20} className="text-indigo-500" />;
      case 'project-update': return <Briefcase size={20} className="text-purple-500" />;
      default: return <Bell size={20} className="text-slate-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-indigo-500 w-12 h-12 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
            <Bell className="text-indigo-500" size={32} />
            Notifications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Stay updated with your latest alerts and messages.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-end gap-4 h-full">
          <TopNav />
          {notifications.length > 0 && (
            <button 
              onClick={clearAllAppNotifications}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-xl transition-colors w-fit"
            >
              <Trash2 size={16} />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900/50 rounded-[32px] p-12 text-center border border-slate-100 dark:border-zinc-800 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <Bell size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No notifications yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
            When you receive invites, approvals, or messages, they will appear here. They update in real-time!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id, notification.read)}
              className={`group flex items-start gap-4 p-6 rounded-[24px] border transition-all cursor-pointer ${
                notification.read
                  ? 'bg-white dark:bg-zinc-900/50 border-slate-100 dark:border-zinc-800 shadow-sm hover:border-slate-200 dark:hover:border-zinc-700'
                  : 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20 shadow-md ring-1 ring-indigo-500/10'
              }`}
            >
              <div className={`p-3 rounded-2xl ${notification.read ? 'bg-slate-50 dark:bg-zinc-800/80 shadow-inner' : 'bg-white dark:bg-zinc-800 shadow-sm'}`}>
                {getIconForType(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-base leading-relaxed ${notification.read ? 'text-slate-600 dark:text-slate-300 font-medium' : 'text-slate-900 dark:text-white font-bold'}`}>
                  {notification.message}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <span>
                    {formatDate(notification.created_at)}
                  </span>
                  {!notification.read && (
                    <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>
                      New
                    </span>
                  )}
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors focus:ring-2 focus:ring-rose-500/20 outline-none"
                  aria-label="Delete notification"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}