import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

async function userIsParticipant(chatId: string, userId: string) {
  const { data, error } = await supabase
    .from("chat_participants")
    .select("chat_id")
    .eq("chat_id", chatId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await params;
    const allowed = await userIsParticipant(chatId, user.id);
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: messages, error } = await supabase
      .from("messages")
      .select("id,chat_id,sender_id,content,created_at,is_read")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase GET Messages error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const senderIds = Array.from(
      new Set((messages || []).map((m: { sender_id: string }) => m.sender_id)),
    );

    let senderById = new Map<string, unknown>();
    if (senderIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .schema("next_auth")
        .from("users")
        .select("id,name,email,image,username,bio,skills,created_at")
        .in("id", senderIds);

      if (usersError) {
        console.error("Supabase GET Messages users error:", usersError);
      } else {
        senderById = new Map((users || []).map((u) => [u.id, u]));
      }
    }

    const response = (messages || []).map((message: { sender_id: string }) => ({
      ...message,
      sender: senderById.get(message.sender_id) || null,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error("API GET Messages exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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
    const allowed = await userIsParticipant(chatId, user.id);
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as { content?: string };
    const content = (body.content || "").trim();
    if (!content) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const { data: inserted, error: insertError } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        sender_id: user.id,
        content,
        is_read: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase POST Messages insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const { error: updateChatError } = await supabase
      .from("chats")
      .update({ last_message: content, updated_at: new Date().toISOString() })
      .eq("id", chatId);

    if (updateChatError) {
      console.error("Supabase POST Messages update chat error:", updateChatError);
    }

    return NextResponse.json(inserted);
  } catch (error) {
    console.error("API POST Messages exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

