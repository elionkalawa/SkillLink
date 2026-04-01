"use client";

import { useEffect } from "react";
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-8">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
        Something went wrong!
      </h1>
      
      <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mb-10 leading-relaxed font-medium">
        We encountered an unexpected error while loading your dashboard. Don&apos;t worry, your data is safe.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-blue-primary text-white rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-primary/20"
        >
          <RefreshCcw size={18} />
          Try again
        </button>
        
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold transition-all hover:bg-slate-200 dark:hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>

      {error.digest && (
        <p className="mt-12 text-xs text-slate-400 font-mono">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
