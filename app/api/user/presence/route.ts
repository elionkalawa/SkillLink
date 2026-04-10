import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { userIds?: string[] };
    const userIds = body.userIds || [];

    if (userIds.length === 0) {
      return NextResponse.json({ users: [] });
    }

    // Limit to 50 users max
    const limited = userIds.slice(0, 50);

    const { data: users, error } = await supabase
      .schema("next_auth")
      .from("users")
      .select("id, last_seen")
      .in("id", limited);

    if (error) {
      console.error("Presence fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      users: (users || []).map((u) => ({
        id: u.id,
        last_seen: u.last_seen || null,
      })),
    });
  } catch (error) {
    console.error("Presence exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
