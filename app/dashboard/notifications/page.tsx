"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Bell, 
  Trash2, 
  Loader2, 
  Check, 
  X, 
  ArrowLeft,
  ChevronRight,
  Clock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useUpdateMemberStatus } from "@/hooks/useProjects";
import { 
  useNotifications, 
  useMarkNotificationRead, 
  useDeleteNotification, 
  useClearNotifications 
} from "@/hooks";
import { toast } from "sonner";

export interface Notification {
  id: string;
  user_id: string;
  type: 'invite' | 'approval' | 'message' | 'project-update' | 'join-request';
  message: string;
  read: boolean;
  link?: string;
  created_at: string;
  status?: 'pending' | 'approved' | 'rejected'; // Added status
  metadata?: {
    projectId: string;
    applicantId: string;
    memberId: string;
    type: string;
    status?: 'pending' | 'approved' | 'rejected'; // Added status in metadata
  };
}

export default function NotificationsPage() {
  const { status } = useSession();
  const { data: notifications = [], isLoading: notificationsLoading } = useNotifications();
  const markAsReadMutation = useMarkNotificationRead();
  const deleteMutation = useDeleteNotification();
  const clearAllMutation = useClearNotifications();
  const { mutateAsync: updateStatus } = useUpdateMemberStatus();
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  // Local state to track actions taken in the current session
  const [handledActions, setHandledActions] = useState<Record<string, 'approved' | 'rejected'>>({});

  const isLoading = status === 'loading' || (status === 'authenticated' && notificationsLoading);

  const selectedNotification = notifications.find((n: Notification) => n.id === selectedId);

  // Auto-select first notification on large screens
  useEffect(() => {
    if (notifications.length > 0 && !selectedId && window.innerWidth >= 1024) {
      setSelectedId(notifications[0].id);
    }
  }, [notifications, selectedId]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const notification = notifications.find((n: Notification) => n.id === id);
    if (notification && !notification.read) {
      markAsReadMutation.mutate(id);
    }
  };

  const handleAction = async (notification: Notification, actionStatus: 'approved' | 'rejected') => {
    if (!notification.metadata) return;
    setProcessingId(notification.id);
    try {
      await updateStatus({
        projectId: notification.metadata.projectId,
        memberId: notification.metadata.memberId,
        status: actionStatus,
        notificationId: notification.id
      });
      
      // Update local state to reflect the action immediately
      setHandledActions(prev => ({ ...prev, [notification.id]: actionStatus }));
      
      toast.success(`Application ${actionStatus === 'approved' ? 'approved' : 'rejected'}`);
      if (!notification.read) markAsReadMutation.mutate(notification.id);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-medium">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col -m-4 sm:-m-5 md:-m-8 lg:-m-10 bg-white dark:bg-black overflow-hidden border border-slate-200 dark:border-zinc-800 rounded-none md:rounded-3xl shadow-2xl shadow-indigo-500/5">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: List */}
        <div className={`w-full lg:w-[400px] flex flex-col border-r border-slate-200 dark:border-zinc-900 bg-slate-50/30 dark:bg-zinc-950/20 ${selectedId && 'hidden lg:flex'}`}>
          <div className="px-6 py-5 border-b border-slate-200 dark:border-zinc-900 flex items-center justify-between shrink-0">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell size={18} className="text-indigo-500" />
              Notifications
            </h1>
            {notifications.length > 0 && (
              <button 
                onClick={() => clearAllMutation.mutate()}
                className="text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 tracking-widest transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-10 text-center text-slate-400">
                <Bell size={40} className="mb-4 opacity-20" />
                <p className="font-bold">No notifications</p>
                <p className="text-xs">You&apos;re all caught up!</p>
              </div>
            ) : (
              notifications.map((notification: Notification) => {
                const currentStatus = handledActions[notification.id] || notification.metadata?.status || notification.status;
                
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleSelect(notification.id)}
                    className={`w-full p-6 text-left border-b border-slate-100 dark:border-zinc-900/50 transition-all ${
                      selectedId === notification.id 
                        ? 'bg-white dark:bg-zinc-900/50 shadow-sm' 
                        : 'hover:bg-white/50 dark:hover:bg-zinc-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${notification.read ? 'text-slate-400' : 'text-indigo-50'}`}>
                        {notification.type}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm leading-snug line-clamp-2 ${notification.read ? 'text-slate-500' : 'text-slate-900 dark:text-white font-bold'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      {!notification.read && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                      {currentStatus && (currentStatus as string) !== 'pending' && (
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          currentStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {currentStatus}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Detail */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-black transition-all ${!selectedId && 'hidden lg:flex'}`}>
          {selectedId && selectedNotification ? (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-900 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedId(null)}
                    className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={14} />
                    <span className="text-xs font-bold">{formatDate(selectedNotification.created_at)}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(selectedNotification.id);
                    setSelectedId(null);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-20">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      {selectedNotification.type}
                    </span>
                    {(handledActions[selectedNotification.id] || selectedNotification.metadata?.status || selectedNotification.status) && (
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                        (handledActions[selectedNotification.id] || selectedNotification.metadata?.status || selectedNotification.status) === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {handledActions[selectedNotification.id] || selectedNotification.metadata?.status || selectedNotification.status}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-8">
                    {selectedNotification.message}
                  </h2>

                  {/* Context-specific actions */}
                  <div className="space-y-6">
                    {selectedNotification.metadata?.type === 'join-request' ? (
                      <div className="space-y-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                          { (handledActions[selectedNotification.id] || (selectedNotification.metadata?.status as string) || (selectedNotification.status as string)) === 'pending' || !(handledActions[selectedNotification.id] || selectedNotification.metadata?.status || selectedNotification.status)
                            ? "Action required: Review this application and either approve or reject the user's request to join your project."
                            : `This application has been ${handledActions[selectedNotification.id] || selectedNotification.metadata?.status || selectedNotification.status}.`
                          }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <Link 
                            href={`/dashboard/profile/${selectedNotification.metadata.applicantId}`}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white text-sm font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all"
                          >
                            <ExternalLink size={16} />
                            View Profile
                          </Link>
                          
                          {/* Status-aware buttons */}
                          {(!handledActions[selectedNotification.id] && (!selectedNotification.metadata?.status || selectedNotification.metadata.status === 'pending') && (!selectedNotification.status || selectedNotification.status === 'pending')) ? (
                            <>
                              <button 
                                onClick={() => handleAction(selectedNotification, 'approved')}
                                disabled={!!processingId}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                              >
                                {processingId === selectedNotification.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                Approve
                              </button>
                              <button 
                                onClick={() => handleAction(selectedNotification, 'rejected')}
                                disabled={!!processingId}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
                              >
                                <X size={16} />
                                Reject
                              </button>
                            </>
                          ) : (
                            <div className={`flex-1 flex items-center justify-center py-3 px-6 rounded-xl border text-sm font-black uppercase tracking-widest ${
                              (handledActions[selectedNotification.id] || selectedNotification.metadata?.status || selectedNotification.status) === 'approved'
                                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500'
                                : 'border-rose-500/20 bg-rose-500/5 text-rose-500'
                            }`}>
                              {(handledActions[selectedNotification.id] || selectedNotification.metadata?.status || selectedNotification.status) === 'approved' ? 'Approved' : 'Rejected'}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : selectedNotification.link && (
                      <div className="pt-4">
                        <Link 
                          href={selectedNotification.link}
                          className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all"
                        >
                          View Details
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-10 text-center animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-full border border-slate-200 dark:border-zinc-800 flex items-center justify-center mb-6">
                <Bell size={24} className="opacity-20" />
              </div>
              <p className="text-sm font-bold text-slate-400">Select a notification to view</p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; }
      `}</style>
    </div>
  );
}