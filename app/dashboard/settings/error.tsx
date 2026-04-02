"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
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
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-[32px] flex items-center justify-center text-rose-500 mb-8 shadow-sm">
        <AlertCircle size={40} />
      </div>
      
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
        Something went wrong!
      </h1>
      
      <p className="text-slate-500 dark:text-slate-400 font-bold text-md max-w-sm mb-10 leading-relaxed">
        {error.message || "An unexpected error occurred while loading your settings."}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-95"
        >
          <RefreshCcw size={20} />
          <span>Try again</span>
        </button>
        
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white font-extrabold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
        >
          <Home size={20} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
