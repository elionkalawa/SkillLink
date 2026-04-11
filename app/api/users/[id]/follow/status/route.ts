import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [isFollowingRes, followerRes, followingRes, isAllowedRes] = await Promise.all([
      supabase
        .from("follows")
        .select("*")
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId)
        .single(),
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", targetUserId),
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", targetUserId),
      supabase
        .from("follows")
        .select("is_allowed")
        .eq("follower_id", targetUserId)
        .eq("following_id", user.id)
        .single()
    ]);

    return NextResponse.json({
      isFollowing: !!isFollowingRes.data,
      followerCount: followerRes.count || 0,
      followingCount: followingRes.count || 0,
      isAllowed: isAllowedRes.data?.is_allowed || false
    });
  } catch (error) {
    console.error("Follow status fetch exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
