export const notificationService = {
  async markAsRead(id: string) {
    const res = await fetch("/api/notifications/read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to mark notification as read");
    }
    return res.json();
  },

  async markAllAsRead() {
    const res = await fetch("/api/notifications/read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to mark all notifications as read");
    }
    return res.json();
  },

  async getAll() {
    const res = await fetch("/api/notifications");
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch notifications");
    }
    return res.json();
  },

  async delete(id: string) {
    const res = await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete notification");
    }
    return res.json();
  },

  async clearAll() {
    const res = await fetch("/api/notifications", { method: "DELETE" });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to clear notifications");
    }
    return res.json();
  }
};
