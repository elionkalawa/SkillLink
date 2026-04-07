"use client";

import { Bell, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Profile from "@/components/Profile";
import { useUnreadNotificationsCount } from "@/hooks/useNotifications";

export default function TopNav() {
  const pathname = usePathname();
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();

  return (
    <div className="flex items-center gap-4">
      {pathname !== "/dashboard/notifications" && (
        <Link
          href="/dashboard/notifications"
          className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <Bell className="text-slate-500 hover:text-blue-primary transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-black text-white bg-rose-500 rounded-lg shadow-lg shadow-rose-200 dark:shadow-none border-2 border-white dark:border-zinc-900 animate-in zoom-in-50 duration-300">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      )}
      
      {pathname !== "/dashboard/messages" && (
        <Link
          href="/dashboard/messages"
          className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <MessageCircle className="text-slate-500 hover:text-blue-primary transition-colors" />
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-black text-white bg-indigo-500 rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none border-2 border-white dark:border-zinc-900">
            2
          </span>
        </Link>
      )}

      {!pathname.includes("/dashboard/settings") && (
        <Profile />
      )}
    </div>
  );
}
