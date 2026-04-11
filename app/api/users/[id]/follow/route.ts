import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.id === targetUserId) {
      return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
    }

    // 1. Check if already following
    const { data: existingFollow } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId)
      .single();

    if (existingFollow) {
      // Unfollow
      const { error: deleteError } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId);

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      return NextResponse.json({ following: false });
    } else {
      // Follow
      const { error: insertError } = await supabase
        .from("follows")
        .insert({
          follower_id: user.id,
          following_id: targetUserId,
        });

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      interface SessionUser {
        id: string;
        name?: string | null;
        username?: string | null;
        email?: string | null;
        image?: string | null;
      }
      const sender = user as SessionUser;

      // 2. Create notification for the target user
      await supabase.from("notifications").insert({
        user_id: targetUserId,
        type: "follow",
        message: `${sender.name || sender.username || "Someone"} followed you.`,
        link: `/dashboard/profile/${sender.id}`,
        sender_id: sender.id,
        metadata: {
          type: "follow",
          followerId: sender.id,
        },
      });

      return NextResponse.json({ following: true });
    }
  } catch (error) {
    console.error("Follow toggling exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
