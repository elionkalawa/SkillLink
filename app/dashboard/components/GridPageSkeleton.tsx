import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * High-fidelity skeleton for categories and grid-based marketplace pages.
 * Used by 'Explore' and 'All Projects'
 */
const GridPageSkeleton = () => {
  return (
    <div className="w-full space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <section>
        <Skeleton className="h-10 w-64 md:w-80 rounded-xl mb-4" />
        <Skeleton className="h-5 w-full max-w-lg rounded-lg" />
      </section>

      {/* Search and filtering section skeleton */}
      <section className="py-4 -mx-2 px-2">
        <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
          <Skeleton className="h-14 w-full xl:max-w-2xl rounded-2xl" />
          <div className="flex items-center gap-3 w-full xl:w-auto">
             <Skeleton className="h-14 w-32 flex-1 xl:flex-none rounded-2xl" />
             <Skeleton className="h-14 w-32 flex-1 xl:flex-none rounded-2xl" />
          </div>
        </div>

        {/* Categories Strip Skeleton */}
        <div className="mt-8 flex items-center gap-3 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
             <Skeleton key={i} className="h-11 w-32 rounded-xl flex-shrink-0" />
          ))}
        </div>
      </section>

      {/* Projects Grid Skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 pb-20">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 h-[320px] flex flex-col gap-4 shadow-sm">
             <Skeleton className="h-8 w-1/2 rounded-xl" />
             <Skeleton className="h-4 w-full rounded-lg" />
             <Skeleton className="h-4 w-2/3 rounded-lg" />
             <div className="mt-auto flex justify-between items-center">
                <div className="flex -space-x-2">
                   {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-8 w-8 rounded-full border-2 border-white dark:border-zinc-900" />
                   ))}
                </div>
                <Skeleton className="h-10 w-24 rounded-xl" />
             </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default GridPageSkeleton;
