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

    // Get follower IDs
    const { data: follows, error: followsError } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("following_id", targetUserId);

    if (followsError) {
      return NextResponse.json({ error: followsError.message }, { status: 500 });
    }

    const followerIds = (follows || []).map((f: { follower_id: string }) => f.follower_id);
    if (followerIds.length === 0) return NextResponse.json([]);

    // Get user details
    const { data: followers, error: usersError } = await supabase
      .schema("next_auth")
      .from("users")
      .select("id, name, username, image, profile_title, role")
      .in("id", followerIds);

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    return NextResponse.json(followers || []);
  } catch (error) {
    console.error("GET followers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
