import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";
import { CreateProjectInput } from "@/lib/services/project";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET Projects error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) return NextResponse.json([]);

    // Batch-fetch approved member counts for all projects (single query, no N+1)
    const projectIds = data.map((p) => p.id);
    const { data: memberRows } = await supabase
      .from("project_members")
      .select("project_id")
      .in("project_id", projectIds)
      .eq("status", "approved");

    const countMap = new Map<string, number>();
    for (const row of memberRows || []) {
      countMap.set(row.project_id, (countMap.get(row.project_id) ?? 0) + 1);
    }

    const result = data.map((p) => ({
      ...p,
      current_members_count: countMap.get(p.id) ?? 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("API GET Projects exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateProjectInput = await req.json();

    // 1. Create the Chat for the Workspace
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .insert({
        name: body.title,
        is_group: true
      })
      .select()
      .single();

    if (chatError) {
      console.error("Chat creation error:", chatError);
      return NextResponse.json({ error: chatError.message }, { status: 500 });
    }

    // Add owner as the first chat participant
    await supabase.from("chat_participants").insert({
      chat_id: chat.id,
      user_id: user.id
    });

    // 2. Create the Project
    const insertData = {
      title: body.title,
      description: body.description,
      category: body.category,
      skills_required: body.skills_required,
      tags: body.tags || [],
      max_team_size: body.max_team_size,
      owner_id: user.id,
      status: "open",
      location: body.location || "Remote",
      organization: body.organization,
      deadline: body.deadline,
    };

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert(insertData)
      .select()
      .single();

    if (projectError) {
      console.error("Project creation error:", projectError);
      return NextResponse.json({ error: projectError.message }, { status: 500 });
    }

    // Add creator as an approved project member so workspace member lists can load immediately.
    const { error: memberError } = await supabase.from("project_members").insert({
      project_id: project.id,
      user_id: user.id,
      role: "owner",
      status: "approved",
    });

    if (memberError) {
      console.error("Project owner membership creation error:", memberError);
    }

    // 3. Create the Workspace linked to both
    const { error: workspaceError } = await supabase
      .from("workspaces")
      .insert({
        project_id: project.id,
        chat_id: chat.id,
        name: body.title,
        description: body.description
      });

    if (workspaceError) {
      console.error("Workspace creation error:", workspaceError);
      // We don't fail the whole request but log it
    }

    // 4. Create Project Roles if provided
    if (body.roles && body.roles.length > 0) {
      const rolesData = body.roles.map(role => ({
        project_id: project.id,
        title: role.title,
        description: role.description || null,
        vacancies: role.vacancies,
        skills_required: role.skills_required || [],
        is_open: true
      }));

      const { error: rolesError } = await supabase
        .from("project_roles")
        .insert(rolesData);

      if (rolesError) {
        console.error("Project roles creation error:", rolesError);
      }
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("API POST Project exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
