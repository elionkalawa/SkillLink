import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-zinc-800">
        <div className="h-48 w-full bg-slate-100 dark:bg-zinc-800" />
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row md:items-end -mt-16 gap-6">
            <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-zinc-900 bg-slate-200 dark:bg-zinc-800 shadow-lg" />
            <div className="flex-1 space-y-3 pb-2">
              <div className="flex gap-3 items-center">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-5 w-12 rounded-md" />
              </div>
              <Skeleton className="h-6 w-64" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <div className="flex gap-3 pb-2">
              <Skeleton className="h-12 w-32 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-slate-200 dark:border-zinc-800 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex gap-3 items-center">
                   <Skeleton className="h-4 w-4 rounded-full" />
                   <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-3 items-center">
                   <Skeleton className="h-4 w-4 rounded-full" />
                   <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex gap-3 items-center">
                   <Skeleton className="h-4 w-4 rounded-full" />
                   <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl">
                   <div className="flex items-center gap-6">
                      <Skeleton className="h-14 w-14 rounded-2xl" />
                      <div className="space-y-2">
                         <Skeleton className="h-6 w-48" />
                         <div className="flex gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                         </div>
                      </div>
                   </div>
                   <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
