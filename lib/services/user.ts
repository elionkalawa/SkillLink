import { User } from "@/types";

export const userService = {
  async updateProfile(input: Partial<User>) {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update profile");
    }
    return res.json() as Promise<User>;
  },

  async getUserApplications(userId: string) {
    const res = await fetch(`/api/users/${userId}/applications`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch applications");
    }
    return res.json();
  }
};
