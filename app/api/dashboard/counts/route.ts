import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all counts in parallel
    const [
      { data: userProjects },
      { data: pendingApplications },
      { data: participantRows },
      { data: notifications },
    ] = await Promise.all([
      // Count of projects the user owns
      supabase
        .from("projects")
        .select("id")
        .eq("owner_id", user.id),

      // Count of pending applications the user has submitted
      supabase
        .from("project_members")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "pending"),

      // Get chat IDs user participates in (for unread message count)
      supabase
        .from("chat_participants")
        .select("chat_id")
        .eq("user_id", user.id),

      // Count of unread notifications
      supabase
        .from("notifications")
        .select("id")
        .eq("user_id", user.id)
        .eq("read", false),
    ]);

    // Compute unread messages count
    let unreadMessages = 0;
    const chatIds = (participantRows || []).map((r: { chat_id: string }) => r.chat_id);
    if (chatIds.length > 0) {
      const { data: unreadRows } = await supabase
        .from("messages")
        .select("id")
        .in("chat_id", chatIds)
        .eq("is_read", false)
        .neq("sender_id", user.id);
      unreadMessages = (unreadRows || []).length;
    }

    return NextResponse.json({
      projects: (userProjects || []).length,
      applications: (pendingApplications || []).length,
      messages: unreadMessages,
      notifications: (notifications || []).length,
    });
  } catch (error) {
    console.error("API GET Dashboard counts exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
