import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get following IDs
    const { data: follows, error: followsError } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", targetUserId);

    if (followsError) {
      return NextResponse.json({ error: followsError.message }, { status: 500 });
    }

    const followingIds = (follows || []).map((f: { following_id: string }) => f.following_id);
    if (followingIds.length === 0) return NextResponse.json([]);

    // Get user details
    const { data: following, error: usersError } = await supabase
      .schema("next_auth")
      .from("users")
      .select("id, name, username, image, profile_title, role")
      .in("id", followingIds);

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    return NextResponse.json(following || []);
  } catch (error) {
    console.error("GET following error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
