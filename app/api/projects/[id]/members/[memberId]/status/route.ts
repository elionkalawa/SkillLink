import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string, memberId: string }> }
) {
  try {
    const { id: projectId, memberId } = await params;
    const user = await getCurrentUser();
    const { status } = await request.json(); // 'approved' or 'rejected'

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // 1. Verify user is owner of the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("owner_id, title, chat_id")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: Only owners can approve members" }, { status: 403 });
    }

    // 2. Update member status
    const { data: member, error: memberError } = await supabase
      .from("project_members")
      .update({ status })
      .eq("id", memberId)
      .select("user_id")
      .single();

    if (memberError || !member) {
      return NextResponse.json({ error: "Membership record not found" }, { status: 404 });
    }

    // 3. Create notification for applicant
    const { error: notifyError } = await supabase
      .from("notifications")
      .insert({
        user_id: member.user_id,
        type: status === 'approved' ? 'approval' : 'project-update',
        message: status === 'approved' 
          ? `Congratulations! You've been approved to join "${project.title}".` 
          : `Your application to join "${project.title}" was not successful at this time.`,
        link: status === 'approved' ? `/dashboard/workspaces/${projectId}` : '/dashboard/explore',
        sender_id: user.id
      });

    if (notifyError) {
      console.error("Applicant notification error:", notifyError);
    }

    // 4. (If approved) Add to workspace chat automatically
    if (status === 'approved') {
       // Fetch workspace chat ID (might be stored in workspaces table or projects)
       const { data: workspace } = await supabase
         .from("workspaces")
         .select("chat_id")
         .eq("project_id", projectId)
         .single();

       if (workspace?.chat_id) {
         await supabase
           .from("chat_participants")
           .insert({
             chat_id: workspace.chat_id,
             user_id: member.user_id
           });
       }
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Member status update exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
