"use client";

import React, { useEffect } from "react";
import { 
  AlertCircle, 
  RefreshCcw, 
  Home, 
  ChevronRight,
  ShieldAlert,
  Ghost
} from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard Error Boundary:", error);
  }, [error]);

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden p-6">
      {/* Immersive Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-500/10 dark:bg-rose-500/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      
      <div className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in-95 duration-1000 ease-out">
        {/* Main Glass Card */}
        <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl border border-white/20 dark:border-zinc-800/50 rounded-[48px] p-8 md:p-14 shadow-2xl shadow-indigo-500/10">
          
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Visual Header */}
            <div className="relative">
              <div className="w-24 h-24 rounded-[32px] bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-inner relative z-10">
                <ShieldAlert size={48} strokeWidth={1.5} className="animate-in slide-in-from-top-4 duration-1000" />
              </div>
              <div className="absolute inset-x-0 bottom-[-10px] h-4 bg-rose-500/20 blur-xl rounded-full scale-x-75" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                System Encountered <br />
                <span className="text-rose-500">an Intersection.</span>
              </h1>
              <p className="text-slate-500 dark:text-zinc-400 font-bold text-lg max-w-md mx-auto leading-relaxed">
                We encountered a technical hurdle while synchronizing your workspace.
              </p>
            </div>

            {/* Error Detail (Glassmorphism inset) */}
            <div className="w-full bg-slate-50/50 dark:bg-black/20 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800/50 text-left group">
               <div className="flex items-center gap-3 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <AlertCircle size={14} />
                  <span>Technical Log</span>
               </div>
               <p className="text-sm font-bold text-slate-600 dark:text-zinc-300 font-mono break-all line-clamp-2">
                 {error.message || "An unexpected system transition occurred."}
               </p>
            </div>

            {/* Action Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <button
                onClick={() => reset()}
                className="group flex items-center justify-center gap-3 px-8 py-5 rounded-3xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-[0.98] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-all duration-300" />
                <RefreshCcw size={22} className="group-hover:rotate-180 transition-transform duration-700 font-black" />
                <span>Synchronize</span>
              </button>
              
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-3 px-8 py-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-black text-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98]"
              >
                <Home size={22} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                <span>Retrace Steps</span>
              </Link>
            </div>

            <div className="pt-4">
              <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-500 transition-all uppercase tracking-widest">
                <span>View System Report</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Graphic Decor */}
      <div className="absolute bottom-10 right-10 opacity-10 dark:opacity-5 select-none pointer-events-none">
        <Ghost size={200} strokeWidth={1} />
      </div>
    </div>
  );
}
