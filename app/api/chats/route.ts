import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

type ChatRow = {
  id: string;
  created_at: string;
  updated_at: string;
  last_message: string | null;
  name: string | null;
  is_group: boolean;
};

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: participantRows, error: participantsError } = await supabase
      .from("chat_participants")
      .select(
        `
        chat_id,
        chats (
          id,
          created_at,
          updated_at,
          last_message,
          name,
          is_group
        )
      `,
      )
      .eq("user_id", user.id);

    if (participantsError) {
      console.error("Supabase GET Chats participants error:", participantsError);
      return NextResponse.json({ error: participantsError.message }, { status: 500 });
    }

    const chats: ChatRow[] = (participantRows || [])
      .map((row: { chat_id: string; chats: ChatRow | ChatRow[] | null }) => {
        const chat = Array.isArray(row.chats) ? row.chats[0] : row.chats;
        return chat || null;
      })
      .filter(Boolean) as ChatRow[];

    if (chats.length === 0) return NextResponse.json([]);

    // Compute unread count per chat (messages not read, not sent by current user)
    const chatIds = chats.map((c) => c.id);
    const { data: unreadRows, error: unreadError } = await supabase
      .from("messages")
      .select("chat_id")
      .in("chat_id", chatIds)
      .eq("is_read", false)
      .neq("sender_id", user.id);

    if (unreadError) {
      console.error("Supabase GET Chats unread error:", unreadError);
      // Don't fail whole endpoint; just return unread_count = 0
    }

    const unreadByChat = new Map<string, number>();
    for (const row of unreadRows || []) {
      const chatId = (row as { chat_id: string }).chat_id;
      unreadByChat.set(chatId, (unreadByChat.get(chatId) || 0) + 1);
    }

    // For 1:1 chats without an explicit name, derive the other participant's name.
    const unnamedOneToOne = chats.filter((c) => !c.is_group && !c.name).map((c) => c.id);
    const derivedNames = new Map<string, string>();
    if (unnamedOneToOne.length > 0) {
      const { data: cpRows, error: cpError } = await supabase
        .from("chat_participants")
        .select("chat_id, user_id")
        .in("chat_id", unnamedOneToOne);

      if (!cpError && cpRows) {
        const otherUserIds = Array.from(
          new Set(
            cpRows
              .filter((r: { chat_id: string; user_id: string }) => r.user_id !== user.id)
              .map((r: { chat_id: string; user_id: string }) => r.user_id),
          ),
        );

        if (otherUserIds.length > 0) {
          const { data: users } = await supabase
            .schema("next_auth")
            .from("users")
            .select("id,name,username")
            .in("id", otherUserIds);

          if (users) {
            const userById = new Map(users.map((u) => [u.id, u]));
            for (const r of cpRows as { chat_id: string; user_id: string }[]) {
              if (r.user_id === user.id) continue;
              const other = userById.get(r.user_id);
              if (!other) continue;
              derivedNames.set(r.chat_id, other.name || other.username || "Chat");
            }
          }
        }
      }
    }

    const response = chats
      .map((chat) => ({
        ...chat,
        name: chat.name || derivedNames.get(chat.id) || chat.name || "Chat",
        participants: [],
        unread_count: unreadByChat.get(chat.id) || 0,
      }))
      .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));

    return NextResponse.json(response);
  } catch (error) {
    console.error("API GET Chats exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

