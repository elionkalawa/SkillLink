import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

const MyProjectsLoading = () => {
  return (
    <div className="w-full space-y-10 animate-pulse p-2">
      {/* Header Skeleton */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Skeleton className="h-10 w-48 md:w-64 rounded-xl mb-4" />
          <Skeleton className="h-5 w-full max-w-lg rounded-lg" />
        </div>
        <Skeleton className="h-14 w-48 rounded-2xl" />
      </section>

      {/* Tabs Skeleton */}
      <div className="flex border-b border-slate-100 dark:border-zinc-800 gap-8 mb-10 overflow-x-auto pb-4">
        {[1, 2, 3].map((i) => (
           <Skeleton key={i} className="h-8 w-32 rounded-lg shrink-0" />
        ))}
      </div>

      {/* Active Project Card Skeleton */}
      <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 md:p-10 border border-slate-50 dark:border-zinc-800 shadow-xl shadow-slate-200/50 dark:shadow-zinc-950/50 flex flex-col md:flex-row items-center gap-10">
        <Skeleton className="w-24 h-24 rounded-[32px] shrink-0" />
        <div className="flex-1 w-full space-y-8">
           <div className="space-y-3">
              <Skeleton className="h-8 w-64 rounded-xl" />
              <Skeleton className="h-4 w-48 rounded-lg" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                 <Skeleton key={i} className="h-28 w-full rounded-3xl" />
              ))}
           </div>
           <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-48 rounded-2xl" />
              <Skeleton className="h-12 w-48 rounded-2xl" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default MyProjectsLoading;
