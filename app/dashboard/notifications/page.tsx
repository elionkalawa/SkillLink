"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Bell, 
  CheckCircle, 
  Info, 
  MessageCircle, 
  Briefcase, 
  Trash2, 
  Loader2, 
  Check, 
  X, 
  UserCircle 
} from "lucide-react";
import Link from "next/link";
import TopNav from "../components/TopNav";
import { useUpdateMemberStatus } from "@/hooks/useProjects";
import { toast } from "sonner";

export interface Notification {
  id: string;
  user_id: string;
  type: 'invite' | 'approval' | 'message' | 'project-update';
  message: string;
  read: boolean;
  link?: string;
  created_at: string;
  metadata?: {
    projectId: string;
    applicantId: string;
    memberId: string;
    type: string;
  };
}

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const { mutateAsync: updateStatus } = useUpdateMemberStatus();
  const [processingId, setProcessingId] = useState<string | null>(null);

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
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  };

  const handleAction = async (notification: Notification, status: 'approved' | 'rejected') => {
    if (!notification.metadata) return;
    
    setProcessingId(notification.id);
    try {
      await updateStatus({
        projectId: notification.metadata.projectId,
        memberId: notification.metadata.memberId,
        status
      });
      toast.success(`Application ${status === 'approved' ? 'approved' : 'rejected'}`);
      // Mark notification as read and hide actions
      await markAsRead(notification.id, false);
      // Remove metadata to hide buttons after action
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, metadata: undefined } : n));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Action failed";
      toast.error(message);
    } finally {
      setProcessingId(null);
    }
  };

  const deleteNotification = async (id: string) => {
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
            Manage your project requests and team updates.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-end gap-4">
          <TopNav />
          {notifications.length > 0 && (
            <button 
              onClick={clearAllAppNotifications}
              className="px-4 py-2 text-sm font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-xl transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900/50 rounded-[32px] p-12 text-center border border-slate-100 dark:border-zinc-800">
            <Bell className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-bold">All caught up!</h3>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`group relative flex flex-col p-6 rounded-[32px] border transition-all ${
                notification.read
                  ? 'bg-white dark:bg-zinc-900/50 border-slate-100 dark:border-zinc-800 opacity-80'
                  : 'bg-white dark:bg-zinc-900 border-indigo-100 dark:border-indigo-500/30 shadow-xl shadow-indigo-100/20 dark:shadow-none'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${notification.read ? 'bg-slate-50 dark:bg-zinc-800' : 'bg-indigo-50 dark:bg-indigo-500/10 shadow-inner'}`}>
                  {getIconForType(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-base leading-relaxed ${notification.read ? 'text-slate-500' : 'text-slate-900 dark:text-white font-bold'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs font-bold text-slate-400 mt-2">
                    {formatDate(notification.created_at)}
                  </p>

                  {/* Action Buttons for Join Requests */}
                  {notification.metadata?.type === 'join-request' && (
                    <div className="flex flex-wrap items-center gap-3 mt-5">
                       <Link 
                         href={`/dashboard/profile/${notification.metadata.applicantId}`}
                         className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 text-sm font-black border border-slate-100 dark:border-zinc-700 hover:bg-slate-100 transition-all"
                       >
                         <UserCircle size={16} />
                         View Profile
                       </Link>
                       <button 
                         onClick={() => handleAction(notification, 'approved')}
                         disabled={!!processingId}
                         className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none disable:opacity-50"
                       >
                         {processingId === notification.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                         Approve
                       </button>
                       <button 
                         onClick={() => handleAction(notification, 'rejected')}
                         disabled={!!processingId}
                         className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 text-sm font-black hover:bg-rose-100 transition-all"
                       >
                         <X size={16} />
                         Reject
                       </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}