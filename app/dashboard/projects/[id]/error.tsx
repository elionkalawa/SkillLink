"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-3xl flex items-center justify-center text-rose-500 mb-8 animate-in zoom-in duration-500">
        <AlertCircle size={48} />
      </div>
      
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
        Project not found
      </h1>
      
      <p className="text-slate-500 dark:text-slate-400 font-bold max-w-sm mb-10 leading-relaxed">
        We couldn&apos;t load the project details. It may have been removed or you may have an unstable connection.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <button
          onClick={() => reset()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95"
        >
          <RotateCcw size={20} />
          Try again
        </button>
        
        <Link 
          href="/dashboard/explore"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-extrabold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft size={20} />
          Go back
        </Link>
      </div>
    </div>
  );
}
