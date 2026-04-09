import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    if (projectIds.length === 0) return NextResponse.json([]);

    const { data: peers, error: peersError } = await supabase
      .from("project_members")
      .select("user_id")
      .in("project_id", projectIds)
      .neq("user_id", user.id);

    if (peersError) {
      console.error("Supabase GET chat recipients peers error:", peersError);
      return NextResponse.json({ error: peersError.message }, { status: 500 });
    }

    const peerIds = Array.from(new Set((peers || []).map((p: { user_id: string }) => p.user_id)));
    if (peerIds.length === 0) return NextResponse.json([]);

    const { data: users, error: usersError } = await supabase
      .schema("next_auth")
      .from("users")
      .select("id,name,username,image,bio,skills")
      .in("id", peerIds);

    if (usersError) {
      console.error("Supabase GET chat recipients users error:", usersError);
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    return NextResponse.json(users || []);
  } catch (error) {
    console.error("API GET chat recipients exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

