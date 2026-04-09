import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

async function getAllowedRecipientIds(userId: string) {
  const [{ data: ownedProjects }, { data: myMemberships }] = await Promise.all([
    supabase.from("projects").select("id").eq("owner_id", userId),
    supabase.from("project_members").select("project_id").eq("user_id", userId),
  ]);

  const projectIds = Array.from(
    new Set([
      ...(ownedProjects || []).map((p: { id: string }) => p.id),
      ...(myMemberships || []).map((m: { project_id: string }) => m.project_id),
    ]),
  );

  if (projectIds.length === 0) return [];

  const { data: peers } = await supabase
    .from("project_members")
    .select("user_id")
    .in("project_id", projectIds)
    .neq("user_id", userId);

  return Array.from(new Set((peers || []).map((p: { user_id: string }) => p.user_id)));
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { recipientId?: string };
    const recipientId = body.recipientId;
    if (!recipientId) {
      return NextResponse.json({ error: "recipientId is required" }, { status: 400 });
    }
    if (recipientId === user.id) {
      return NextResponse.json({ error: "Cannot create chat with yourself" }, { status: 400 });
    }

    const allowedRecipientIds = await getAllowedRecipientIds(user.id);
    if (!allowedRecipientIds.includes(recipientId)) {
      return NextResponse.json({ error: "You can only message project/workspace peers." }, { status: 403 });
    }

    // Find existing 1:1 chat between current user and recipient.
    const { data: myParticipantRows } = await supabase
      .from("chat_participants")
      .select("chat_id")
      .eq("user_id", user.id);
    const myChatIds = (myParticipantRows || []).map((r: { chat_id: string }) => r.chat_id);

    if (myChatIds.length > 0) {
      const { data: recipientRows } = await supabase
        .from("chat_participants")
        .select("chat_id")
        .eq("user_id", recipientId)
        .in("chat_id", myChatIds);
      const sharedChatIds = (recipientRows || []).map((r: { chat_id: string }) => r.chat_id);

      if (sharedChatIds.length > 0) {
        const { data: existingChat } = await supabase
          .from("chats")
          .select("id,created_at,updated_at,last_message,name,is_group")
          .in("id", sharedChatIds)
          .eq("is_group", false)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existingChat) {
          return NextResponse.json({
            ...existingChat,
            participants: [],
            unread_count: 0,
          });
        }
      }
    }

    const { data: newChat, error: chatError } = await supabase
      .from("chats")
      .insert({ is_group: false })
      .select("id,created_at,updated_at,last_message,name,is_group")
      .single();

    if (chatError || !newChat) {
      console.error("Supabase create direct chat error:", chatError);
      return NextResponse.json({ error: chatError?.message || "Failed to create chat" }, { status: 500 });
    }

    const { error: participantsError } = await supabase.from("chat_participants").insert([
      { chat_id: newChat.id, user_id: user.id },
      { chat_id: newChat.id, user_id: recipientId },
    ]);

    if (participantsError) {
      console.error("Supabase create direct participants error:", participantsError);
      return NextResponse.json({ error: participantsError.message }, { status: 500 });
    }

    return NextResponse.json({
      ...newChat,
      participants: [],
      unread_count: 0,
    });
  } catch (error) {
    console.error("API POST direct chat exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

