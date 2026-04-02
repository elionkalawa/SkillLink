"use client";

import React, { useEffect, useState } from "react";
import SidebarItem from "./components/SidebarItem";
import { Logo } from "@/components/ui/Logo";
import {
  Bell,
  Briefcase,
  CircleUser,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  PanelLeftClose,
  PanelRightClose,
  Settings,
} from "lucide-react";
import { LogoIcon } from "@/components/ui/LogoIcon";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeRoute = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      const timer = setTimeout(() => {
        setCollapsed(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <>
      <main className="flex h-screen bg-slate-50 dark:bg-zinc-950 overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Overlay (Mobile) */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
          fixed md:static z-30 h-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md 
          border-r border-slate-200 dark:border-zinc-800
          transition-all duration-300 flex flex-col
          ${collapsed ? "w-20" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              {collapsed ? <LogoIcon /> : <Logo />}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {collapsed ? (
                  <PanelRightClose size={20} />
                ) : (
                  <PanelLeftClose size={20} />
                )}
              </button>

              <button
                onClick={() => setMobileOpen(false)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {!collapsed && (
              <h1 className="px-4 mb-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Navigation
              </h1>
            )}
            <SidebarItem
              icon={<LayoutDashboard size={22} />}
              label="Home"
              collapsed={collapsed}
              route="/dashboard"
              counter={0}
              activeRoute={activeRoute}
              onClick={() => setMobileOpen(false)}
            />
            <SidebarItem
              icon={<Compass size={22} />}
              label="Marketplace"
              collapsed={collapsed}
              route="/dashboard/explore"
              counter={0}
              activeRoute={activeRoute}
              onClick={() => setMobileOpen(false)}
            />
            <SidebarItem
              icon={<Briefcase size={22} />}
              label="My Projects"
              collapsed={collapsed}
              route="/dashboard/my-projects"
              counter={1}
              activeRoute={activeRoute}
              onClick={() => setMobileOpen(false)}
            />
            <SidebarItem
              icon={<CircleUser size={22} />}
              label="Profile"
              collapsed={collapsed}
              route="/dashboard/profile"
              counter={0}
              activeRoute={activeRoute}
              onClick={() => setMobileOpen(false)}
            />
            <SidebarItem
              icon={<MessageCircle size={22} />}
              label="Messages"
              collapsed={collapsed}
              route="/dashboard/messages"
              counter={2}
              activeRoute={activeRoute}
              onClick={() => setMobileOpen(false)}
            />

            {!collapsed && (
              <h1 className="px-4 mt-8 mb-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Account
              </h1>
            )}

            <SidebarItem
              icon={<Bell size={22} />}
              label="Notifications"
              collapsed={collapsed}
              route="/dashboard/notifications"
              counter={0}
              activeRoute={activeRoute}
              onClick={() => setMobileOpen(false)}
            />
            <SidebarItem
              icon={<Settings size={22} />}
              label="Settings"
              collapsed={collapsed}
              route="/dashboard/settings"
              counter={0}
              activeRoute={activeRoute}
              onClick={() => setMobileOpen(false)}
            />
             <ThemeToggle variant="sidebar" collapsed={collapsed} />
          </nav>
          {/**
           SignOut*/}
          <div className="w-ful p-4 flex flex-col gap-4">
           
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 p-4 font-bold rounded-2xl transition-all text-sm bg-rose-500/10 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400"
            >
              <LogOut size={22} className="text-xl shrink-0" />
              {!collapsed && (
                <span className="whitespace-nowrap">
                  Sign Out
                </span>
              )}
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-black">
          {/* Mobile Header */}
          <header className="md:hidden flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10">
            <div className="ml-4">
              <Logo size="md" />
            </div>
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Menu size={24} />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto bg-transparent p-6 md:p-10">
            <div className="">{children}</div>
          </main>
        </div>
      </main>
    </>
  );
};

export default Layout;
