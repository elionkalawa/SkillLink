import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (projectError) {
      console.error("Supabase GET Project error:", projectError);
      return NextResponse.json({ error: projectError.message }, { status: 500 });
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { data: owner, error: ownerError } = await supabase
      .schema("next_auth")
      .from("users")
      .select("id,name,image,username,role,location")
      .eq("id", project.owner_id)
      .single();

    if (ownerError) {
      console.error("Supabase GET Project owner error:", ownerError);
      // Keep the project readable even if owner fetch fails
      return NextResponse.json({ ...project, owner: null });
    }

    const { data: roles } = await supabase
      .from("project_roles")
      .select("*")
      .eq("project_id", id);

    const { data: workspace } = await supabase
      .from("workspaces")
      .select("id")
      .eq("project_id", id)
      .single();

    const currentUser = await getCurrentUser();

    let membership = null;

    if (currentUser) {
      const { data: memberData } = await supabase
        .from("project_members")
        .select("status, role")
        .eq("project_id", id)
        .eq("user_id", currentUser.id)
        .maybeSingle();

      membership = memberData;
    }

    // Count approved members so the UI can show real team capacity
    const { count: currentMembersCount } = await supabase
      .from("project_members")
      .select("id", { count: "exact", head: true })
      .eq("project_id", id)
      .eq("status", "approved");

    return NextResponse.json({
      ...project,
      owner,
      roles: roles || [],
      membership,
      workspace: workspace || null,
      current_members_count: currentMembersCount ?? 0,
    });
  } catch (error) {
    console.error("API GET Project exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Verify ownership
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "location",
      "skills_required",
      "tags",
      "max_team_size",
      "status",
      "organization",
      "deadline",
      "image_url",
      "full_description",
    ];

    const updateData: Record<string, unknown> = {};
    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PATCH Project error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Role syncing
    if (body.roles && Array.isArray(body.roles)) {
      const { data: existingRoles } = await supabase
        .from("project_roles")
        .select("id")
        .eq("project_id", id);
        
      const existingRoleIds = (existingRoles || []).map((r: { id: string }) => r.id);
      const incomingRoles = body.roles;
      const incomingRoleIds = incomingRoles.filter((r: { id?: string }) => r.id).map((r: { id: string }) => r.id);
      
      const rolesToDelete = existingRoleIds.filter(rid => !incomingRoleIds.includes(rid));
      
      if (rolesToDelete.length > 0) {
        await supabase.from("project_roles").delete().in("id", rolesToDelete);
      }
      
      for (const role of incomingRoles) {
        if (role.id) {
          await supabase.from("project_roles").update({
            title: role.title,
            description: role.description || null,
            vacancies: role.vacancies,
            skills_required: role.skills_required || [],
          }).eq("id", role.id);
        } else {
          await supabase.from("project_roles").insert({
            project_id: id,
            title: role.title,
            description: role.description || null,
            vacancies: role.vacancies,
            skills_required: role.skills_required || [],
            is_open: true
          });
        }
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API PATCH Project exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("Supabase DELETE Project error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API DELETE Project exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
