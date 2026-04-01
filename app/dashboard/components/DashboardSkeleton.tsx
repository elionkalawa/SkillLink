import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="w-full py-4">
      {/* Header Skeleton */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex flex-col justify-center items-start gap-2 w-full md:w-1/2">
          <Skeleton className="h-10 w-64 md:w-80" />
          <Skeleton className="h-6 w-48 md:w-60" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </section>

      {/* Stats Cards Skeleton */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 justify-start items-center gap-4 py-10 flex-wrap">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-2 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm">
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        ))}
      </section>

      {/* Matches for you Skeleton */}
      <section className="w-full mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col gap-2 w-full md:w-1/3">
             <Skeleton className="h-8 w-48" />
             <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
           ))}
        </div>
      </section>

      {/* Active Workspaces Skeleton */}
      <section className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col gap-2 w-full md:w-1/3">
             <Skeleton className="h-8 w-48" />
             <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardSkeleton;
