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
  }
};
