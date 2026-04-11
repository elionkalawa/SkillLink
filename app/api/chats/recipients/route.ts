import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get project peers
    const [{ data: ownedProjects }, { data: myMemberships }] = await Promise.all([
      supabase.from("projects").select("id").eq("owner_id", user.id),
      supabase.from("project_members").select("project_id").eq("user_id", user.id),
    ]);

    const projectIds = Array.from(
      new Set([
        ...(ownedProjects || []).map((p: { id: string }) => p.id),
        ...(myMemberships || []).map((m: { project_id: string }) => m.project_id),
      ]),
    );

    let peerIds: string[] = [];
    if (projectIds.length > 0) {
      const { data: peers } = await supabase
        .from("project_members")
        .select("user_id")
        .in("project_id", projectIds)
        .neq("user_id", user.id);
      peerIds = (peers || []).map((p: { user_id: string }) => p.user_id);
    }

    // 2. Get people I follow or who are allowed to message me
    const [{ data: following }, { data: allowedFollowers }] = await Promise.all([
      supabase.from("follows").select("following_id").eq("follower_id", user.id),
      supabase.from("follows").select("follower_id").eq("following_id", user.id).eq("is_allowed", true),
    ]);

    const connectionIds = [
      ...(following || []).map((f: { following_id: string }) => f.following_id),
      ...(allowedFollowers || []).map((f: { follower_id: string }) => f.follower_id),
    ];

    // Combine and deduplicate
    const allRecipientIds = Array.from(new Set([...peerIds, ...connectionIds]));

    if (allRecipientIds.length === 0) return NextResponse.json([]);

    const { data: users, error: usersError } = await supabase
      .schema("next_auth")
      .from("users")
      .select("id,name,username,image,bio,skills")
      .in("id", allRecipientIds);

    if (usersError) {
      console.error("Supabase GET chat recipients users error:", usersError);
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    // Map relationships for categorization
    const categorizedUsers = (users || []).map((u: { id: string; name: string; username: string; image: string; bio: string; skills: string[] }) => {
      const isPeer = peerIds.includes(u.id);
      const isFollowing = (following || []).some((f: { following_id: string }) => f.following_id === u.id);
      
      return {
        ...u,
        relationship: isPeer ? "peer" : isFollowing ? "following" : "allowed_follower"
      };
    });

    return NextResponse.json(categorizedUsers);
  } catch (error) {
    console.error("API GET chat recipients exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

