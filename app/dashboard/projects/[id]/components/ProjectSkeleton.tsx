import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

const ProjectSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-pulse">
      {/* Navigation Header Skeleton */}
      <Skeleton className="h-6 w-40 rounded-lg" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
        {/* Main Content Column Skeleton */}
        <div className="lg:col-span-8 space-y-16">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Skeleton className="h-6 w-20 rounded-lg" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-16 w-3/4 rounded-2xl" />
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <div className="space-y-8">
            <Skeleton className="h-8 w-56" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-3xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column Skeleton */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-slate-200 dark:border-zinc-800 space-y-12 shadow-sm">
             <div className="space-y-6">
                <div className="flex justify-between">
                   <Skeleton className="h-4 w-20" />
                   <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
             </div>
             <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
             </div>
             <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full rounded-2xl" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSkeleton;
