import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: followerId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: follow, error: fetchError } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", followerId)
      .eq("following_id", user.id)
      .single();

    if (fetchError || !follow) {
      return NextResponse.json({ error: "Follow record not found" }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from("follows")
      .update({ is_allowed: !follow.is_allowed })
      .eq("follower_id", followerId)
      .eq("following_id", user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ isAllowed: !follow.is_allowed });
  } catch (error) {
    console.error("Allow messaging exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
