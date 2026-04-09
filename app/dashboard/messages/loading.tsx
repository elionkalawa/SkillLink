import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

const MessagesLoading = () => {
  return (
    <div className="flex h-[calc(100dvh-84px)] md:h-[calc(100vh-100px)] w-full max-w-[1400px] mx-auto p-2 sm:p-3 md:p-8 gap-3 md:gap-6 animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="hidden md:flex w-[360px] lg:w-[380px] h-full flex-col bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-zinc-950/50 border border-slate-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 pb-2">
          <div className="flex justify-between items-center mb-10 mt-2">
            <Skeleton className="h-8 w-32 rounded-xl" />
            <Skeleton className="w-10 h-10 rounded-2xl" />
          </div>
          <Skeleton className="h-14 w-full rounded-2xl mb-8" />
        </div>

        <div className="flex-1 px-4 pb-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4">
               <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
               <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                     <Skeleton className="h-4 w-24 rounded-lg" />
                     <Skeleton className="h-3 w-10 rounded-lg" />
                  </div>
                  <Skeleton className="h-3 w-full rounded-lg" />
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window Skeleton */}
      <div className="flex-1 h-full flex flex-col bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-zinc-950/50 border border-slate-100 dark:border-zinc-800 overflow-hidden relative">
        <header className="px-6 py-6 border-b border-slate-50 dark:border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Skeleton className="w-12 h-12 rounded-2xl" />
             <div className="space-y-2">
                <Skeleton className="h-5 w-32 rounded-lg" />
                <Skeleton className="h-3 w-16 rounded-lg" />
             </div>
          </div>
          <div className="flex gap-2">
             <Skeleton className="w-10 h-10 rounded-xl" />
             <Skeleton className="w-10 h-10 rounded-xl" />
          </div>
        </header>

        <main className="flex-1 p-8 space-y-8 bg-slate-50/30 dark:bg-zinc-950/30">
          <div className="flex flex-col items-start gap-3">
             <Skeleton className="h-16 w-[60%] rounded-3xl rounded-bl-none" />
             <Skeleton className="h-3 w-20 rounded-lg ml-2" />
          </div>
          <div className="flex flex-col items-end gap-3">
             <Skeleton className="h-12 w-[40%] rounded-3xl rounded-br-none" />
             <Skeleton className="h-3 w-16 rounded-lg mr-2" />
          </div>
          <div className="flex flex-col items-start gap-3 mt-10">
             <Skeleton className="h-24 w-[50%] rounded-3xl rounded-bl-none" />
             <Skeleton className="h-3 w-24 rounded-lg ml-2" />
          </div>
        </main>

        <footer className="p-6 bg-white dark:bg-zinc-900 border-t border-slate-50 dark:border-zinc-800/50">
           <Skeleton className="h-16 w-full rounded-2xl" />
        </footer>
      </div>
    </div>
  );
};

export default MessagesLoading;
