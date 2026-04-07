"use client";

import React, { useState } from "react";
import { 
  Mail, 
  ChevronRight, 
  ArrowLeft
} from "lucide-react";
import TopNav from "../components/TopNav";

type SettingPage = "main" | "profile" | "email" | "phone" | "password" | "2fa";

export default function SettingsPage() {
  const [activePage, setActivePage] = useState<SettingPage>("main");

  const renderMain = () => (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Manage your account preferences and security settings
          </p>
        </div>
        <TopNav />
      </div>

      <div className="space-y-10">
        <div>
          <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 ml-2">
            Account Settings
          </h2>
          <div className="bg-white dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/80 rounded-[28px] overflow-hidden shadow-sm">

            <button 
              onClick={() => setActivePage("email")}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Email Address</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage your primary email</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );


  const renderPlaceholder = (title: string, desc: string, BackLabel: string) => (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <button 
        onClick={() => setActivePage("main")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 font-semibold transition-colors"
      >
        <ArrowLeft size={20} />
        {BackLabel || "Back"}
      </button>

      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
        {title}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
        {desc}
      </p>

      <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-[32px] border border-slate-100 dark:border-zinc-800/80 shadow-sm text-center">
         <p className="text-slate-500 font-bold">This section is ready to be connected to the backend API.</p>
         <button 
           onClick={() => setActivePage("main")}
           className="mt-6 px-6 py-3 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-white transition-colors"
         >
           Return
         </button>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50/50 dark:bg-black min-h-full min-w-full pb-20">
      {activePage === "main" && renderMain()}
      {activePage === "email" && renderPlaceholder("Email Address", "Manage your primary and secondary email.", "Settings")}
      {activePage === "phone" && renderPlaceholder("Phone Number", "Add a phone for enhanced account security.", "Settings")}
      {activePage === "password" && renderPlaceholder("Password", "Ensure your account is using a strong password.", "Settings")}
      {activePage === "2fa" && renderPlaceholder("Two-Factor Authentication", "Add an additional security layer via SMS or Authenticator app.", "Settings")}
    </div>
  );
}