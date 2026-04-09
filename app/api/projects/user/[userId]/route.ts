import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    console.log("Fetching projects for userId:", userId);

    // 1. Fetch projects where user is the owner
    const { data: ownedProjects, error: ownedError } = await supabase
      .from("projects")
      .select("*")
      .eq("owner_id", userId);

    if (ownedError) {
      console.error("Owned projects retrieval error:", ownedError);
      return NextResponse.json({ error: ownedError.message }, { status: 500 });
    }

    // 2. Fetch projects where user is an approved member
    const { data: memberships, error: memberError } = await supabase
      .from("project_members")
      .select("project_id")
      .eq("user_id", userId)
      .eq("status", "approved");

    if (memberError) {
      console.error("Project memberships retrieval error:", memberError);
    }

    const joinedProjectIds = (memberships || []).map(m => m.project_id);
    
    let joinedProjects = [];
    if (joinedProjectIds.length > 0) {
      const { data: joined, error: joinedError } = await supabase
        .from("projects")
        .select("*")
        .in("id", joinedProjectIds);
      
      if (joinedError) {
        console.error("Joined projects retrieval error:", joinedError);
      } else {
        joinedProjects = joined || [];
      }
    }

    // Combine and remove duplicates (though theoretically there shouldn't be any if one is owner and other is member, but just in case)
    const projects = [...ownedProjects, ...joinedProjects.filter(p => !ownedProjects.some(op => op.id === p.id))];
    
    // Sort by created_at
    projects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


    if (!projects || projects.length === 0) {
      return NextResponse.json([]);
    }

    const projectIds = projects.map((project) => project.id);
    const { data: workspaces, error: workspacesError } = await supabase
      .from("workspaces")
      .select("id,project_id")
      .in("project_id", projectIds);

    if (workspacesError) {
      console.error(
        `Supabase Workspaces retrieval error for userId ${userId}:`,
        JSON.stringify(workspacesError, null, 2),
      );
      // Keep projects list functional even if workspace lookup fails.
      const withoutWorkspaces = projects.map((project) => ({
        ...project,
        workspaces: [],
      }));
      return NextResponse.json(withoutWorkspaces);
    }

    const workspaceByProject = new Map(
      (workspaces || []).map((workspace) => [workspace.project_id, workspace]),
    );

    const projectsWithWorkspaces = projects.map((project) => {
      const workspace = workspaceByProject.get(project.id);
      return {
        ...project,
        workspaces: workspace ? [{ id: workspace.id }] : [],
      };
    });

    return NextResponse.json(projectsWithWorkspaces);
  } catch (error) {
    console.error("API GET User Projects exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
