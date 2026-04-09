export type DashboardStats = {
  applications: number;
  shipped: number;
};

export const dashboardService = {
  async getStats() {
    const res = await fetch("/api/dashboard/stats");
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch dashboard stats");
    }
    return res.json() as Promise<DashboardStats>;
  },
};

