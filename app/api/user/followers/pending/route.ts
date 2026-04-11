import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get followers who are not allowed yet
    const { data: follows, error: followsError } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("following_id", user.id)
      .eq("is_allowed", false);

    if (followsError) {
      return NextResponse.json({ error: followsError.message }, { status: 500 });
    }

    const followerIds = (follows || []).map((f: { follower_id: string }) => f.follower_id);
    if (followerIds.length === 0) return NextResponse.json([]);

    const { data: users, error: usersError } = await supabase
      .schema("next_auth")
      .from("users")
      .select("id, name, username, image")
      .in("id", followerIds);

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    return NextResponse.json(users || []);
  } catch (error) {
    console.error("Pending followers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
