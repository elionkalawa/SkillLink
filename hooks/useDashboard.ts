"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/services/dashboard";

export const getDashboardStatsKey = ["dashboard", "stats"];

export function useDashboardStats() {
  return useQuery({
    queryKey: getDashboardStatsKey,
    queryFn: () => dashboardService.getStats(),
  });
}

