"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";

export interface DashboardCounts {
  projects: number;
  applications: number;
  messages: number;
  notifications: number;
}

export const getDashboardCountsKey = ["dashboard", "counts"];

export function useDashboardCounts() {
  const { user } = useUser();

  return useQuery<DashboardCounts>({
    queryKey: getDashboardCountsKey,
    queryFn: async () => {
      const res = await fetch("/api/dashboard/counts");
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch dashboard counts");
      }
      return res.json();
    },
    enabled: !!user?.id,
    staleTime: 15_000, // 15 seconds
    refetchInterval: 30_000, // Poll every 30 seconds
    refetchOnWindowFocus: true,
  });
}
