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
    return NextResponse.json(data);
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

    return NextResponse.json(project);
  } catch (error) {
    console.error("API POST Project exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
