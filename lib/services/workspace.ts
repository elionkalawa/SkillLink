import { Workspace } from "@/types";

export const workspaceService = {
  async getWorkspace(id: string) {
    const res = await fetch(`/api/workspaces/${id}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch workspace");
    }
    return res.json() as Promise<Workspace>;
  },

  async updateWorkspace(id: string, input: Partial<Workspace>) {
    const res = await fetch(`/api/workspaces/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update workspace");
    }
    return res.json() as Promise<Workspace>;
  }
};
