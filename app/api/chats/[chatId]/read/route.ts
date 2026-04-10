import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await params;

    // Verify the user is a participant
    const { data: participant } = await supabase
      .from("chat_participants")
      .select("chat_id")
      .eq("chat_id", chatId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!participant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Mark all messages in this chat as read (ones not sent by current user)
    const now = new Date().toISOString();
    const { data: updated, error } = await supabase
      .from("messages")
      .update({ is_read: true, read_at: now })
      .eq("chat_id", chatId)
      .eq("is_read", false)
      .neq("sender_id", user.id)
      .select("id");

    if (error) {
      console.error("Mark chat read error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ marked: (updated || []).length });
  } catch (error) {
    console.error("Mark chat read exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
