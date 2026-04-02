"use client";

import { Bell, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Profile from "@/components/Profile";

export default function TopNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-4">
      {pathname !== "/dashboard/notifications" && (
        <Link
          href="/dashboard/notifications"
          className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <Bell className="text-slate-500 hover:text-blue-primary transition-colors" />
          <span className="absolute top-0 right-0 text-xs text-white bg-notification rounded-full px-2 py-1 ">
            2
          </span>
        </Link>
      )}
      
      {pathname !== "/dashboard/messages" && (
        <Link
          href="/dashboard/messages"
          className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <MessageCircle className="text-slate-500 hover:text-blue-primary transition-colors" />
          <span className="absolute top-0 right-0 text-xs text-white bg-notification rounded-full px-2 py-1 ">
            2
          </span>
        </Link>
      )}

      {pathname !== "/dashboard/profile" && (
        <Profile />
      )}
    </div>
  );
}
