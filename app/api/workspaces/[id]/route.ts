import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase GET Workspace error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const { data: memberships, error: membersError } = await supabase
      .from("project_members")
      .select("user_id, role, status")
      .eq("project_id", data.project_id)
      .eq("status", "approved");

    if (membersError) {
      console.error("Supabase GET Workspace members error:", membersError);
      return NextResponse.json({ ...data, members: [] });
    }

    const memberUserIds = (memberships || []).map((membership) => membership.user_id);
    if (memberUserIds.length === 0) {
      return NextResponse.json({ ...data, members: [] });
    }

    const { data: users, error: usersError } = await supabase
      .schema("next_auth")
      .from("users")
      .select("id,name,image,username,role")
      .in("id", memberUserIds);

    if (usersError) {
      console.error("Supabase GET Workspace member users error:", usersError);
      return NextResponse.json({ ...data, members: [] });
    }

    const userById = new Map((users || []).map((memberUser) => [memberUser.id, memberUser]));
    const members = (memberships || []).map((membership) => {
      const memberUser = userById.get(membership.user_id);
      return {
        user_id: membership.user_id,
        membership_role: membership.role,
        membership_status: membership.status,
        name: memberUser?.name || "Unknown User",
        image: memberUser?.image || null,
        username: memberUser?.username || null,
        role: memberUser?.role || null,
      };
    });

    return NextResponse.json({ ...data, members });
  } catch (error) {
    console.error("API GET Workspace exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Verify ownership via the linked project
    const { data: workspace, error: fetchError } = await supabase
      .from("workspaces")
      .select("project_id, projects(owner_id)")
      .eq("id", id)
      .single();

    if (fetchError || !workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // @ts-expect-error - Supabase join types can be tricky
    if (workspace.projects?.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allowedFields = [
      "name",
      "description",
      "avatar_url",
      "cover_url",
      "settings",
      "pinned_links",
      "status"
    ];

    const updateData: Record<string, unknown> = {};
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    const { data, error } = await supabase
      .from("workspaces")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PATCH Workspace error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API PATCH Workspace exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
