"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { 
  User, 
  Mail, 
  Smartphone, 
  Lock, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft,
  Camera,
} from "lucide-react";
import NextImage from "next/image";
import TopNav from "../components/TopNav";

type SettingPage = "main" | "profile" | "email" | "phone" | "password" | "2fa";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activePage, setActivePage] = useState<SettingPage>("main");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setActivePage("main");
    }, 800);
  };

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
        {/* ACCOUNT SETTINGS */}
        <div>
          <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 ml-2">
            Account Settings
          </h2>
          <div className="bg-white dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/80 rounded-[28px] overflow-hidden shadow-sm">
            
            {/* Profile */}
            <button 
              onClick={() => setActivePage("profile")}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Profile Information</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Update your name, bio, and profile picture</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>
            <div className="h-px w-full bg-slate-100 dark:bg-zinc-800/80 ml-20" />

            {/* Email */}
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
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage your primary and secondary email addresses</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>
            <div className="h-px w-full bg-slate-100 dark:bg-zinc-800/80 ml-20" />

            {/* Phone */}
             <button 
              onClick={() => setActivePage("phone")}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Phone Number</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Add a phone number for two-factor authentication</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>

          </div>
        </div>

        {/* SECURITY & PRIVACY */}
        <div>
          <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 ml-2">
            Security & Privacy
          </h2>
          <div className="bg-white dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/80 rounded-[28px] overflow-hidden shadow-sm">
            
            {/* Password */}
            <button 
              onClick={() => setActivePage("password")}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Lock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Password</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Change your password and security questions</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>
            <div className="h-px w-full bg-slate-100 dark:bg-zinc-800/80 ml-20" />

            {/* 2FA */}
            <button 
              onClick={() => setActivePage("2fa")}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Two-Factor Authentication</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Add an extra layer of security to your account</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <button 
        onClick={() => setActivePage("main")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 font-semibold transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Settings
      </button>

      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
        Profile Information
      </h1>

      <div className="space-y-8 bg-white dark:bg-zinc-900/50 p-8 rounded-[32px] border border-slate-100 dark:border-zinc-800/80 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-[28px] bg-slate-100 dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden">
               {session?.user?.image ? (
                 <NextImage src={session.user.image} alt="Profile" width={256} height={256} className="w-full h-full object-cover" />
               ) : (
                 <User className="text-slate-400" size={40} />
               )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-[28px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
               <Camera className="text-white" size={24} />
            </div>
          </div>
          <div className="flex-1 space-y-2 w-full text-center sm:text-left">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Profile Picture</p>
            <p className="text-xs font-medium text-slate-400">PNG, JPG or GIF up to 5MB. Recommended size is 256x256px.</p>
            <button className="px-4 py-2 mt-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-white font-bold rounded-xl transition-colors text-sm">
              Upload New
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
           <div className="space-y-2">
             <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
             <input 
               type="text" 
               defaultValue={session?.user?.name || ""}
               className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white font-medium transition-all"
             />
           </div>
           
           <div className="space-y-2">
             <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Bio</label>
             <textarea 
               rows={4}
               placeholder="Tell us a little bit about yourself..."
               className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white font-medium resize-none transition-all"
             ></textarea>
           </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center min-w-[120px] gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 disabled:opacity-70 transition-all active:scale-95"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
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
    <div className="bg-slate-50/50 dark:bg-black min-h-full">
      {activePage === "main" && renderMain()}
      {activePage === "profile" && renderProfile()}
      {activePage === "email" && renderPlaceholder("Email Address", "Manage your primary and secondary email.", "Settings")}
      {activePage === "phone" && renderPlaceholder("Phone Number", "Add a phone for enhanced account security.", "Settings")}
      {activePage === "password" && renderPlaceholder("Password", "Ensure your account is using a strong password.", "Settings")}
      {activePage === "2fa" && renderPlaceholder("Two-Factor Authentication", "Add an additional security layer via SMS or Authenticator app.", "Settings")}
    </div>
  );
}