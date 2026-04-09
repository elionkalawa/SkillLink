import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get projects where user is owner
    const { data: ownedProjects } = await supabase
      .from("projects")
      .select("id")
      .eq("owner_id", user.id);

    // 2. Get projects where user is approved member
    const { data: memberProjects } = await supabase
      .from("project_members")
      .select("project_id")
      .eq("user_id", user.id)
      .eq("status", "approved");

    const projectIds = [
      ...(ownedProjects || []).map(p => p.id),
      ...(memberProjects || []).map(m => m.project_id)
    ];

    if (projectIds.length === 0) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("workspaces")
      .select(`
        *,
        project:projects (
          id,
          title,
          owner_id
        )
      `)
      .in("project_id", projectIds)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET Workspaces error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);

  } catch (error) {
    console.error("API GET Workspaces exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

