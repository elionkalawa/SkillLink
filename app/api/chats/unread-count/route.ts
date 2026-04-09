import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all chats the user participates in
    const { data: participantRows, error: participantsError } = await supabase
      .from("chat_participants")
      .select("chat_id")
      .eq("user_id", user.id);

    if (participantsError) {
      console.error("Supabase GET UnreadCount participants error:", participantsError);
      return NextResponse.json({ error: participantsError.message }, { status: 500 });
    }

    const chatIds = (participantRows || []).map((r: { chat_id: string }) => r.chat_id);
    if (chatIds.length === 0) return NextResponse.json({ count: 0 });

    const { data: unreadRows, error: unreadError } = await supabase
      .from("messages")
      .select("id")
      .in("chat_id", chatIds)
      .eq("is_read", false)
      .neq("sender_id", user.id);

    if (unreadError) {
      console.error("Supabase GET UnreadCount unread error:", unreadError);
      return NextResponse.json({ error: unreadError.message }, { status: 500 });
    }

    return NextResponse.json({ count: (unreadRows || []).length });
  } catch (error) {
    console.error("API GET UnreadCount exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

