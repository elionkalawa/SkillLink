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
    const { status, notificationId } = await request.json(); // 'approved', 'rejected' and optional notificationId

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // 1. Verify user is owner of the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("owner_id, title")
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
      .select("user_id, project_role_id")
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

       // Handle Role Vacancies if applicable
       if (member.project_role_id) {
         // Count approved members for this role
         const { count: approvedCount } = await supabase
           .from("project_members")
           .select("id", { count: 'exact', head: true })
           .eq("project_role_id", member.project_role_id)
           .eq("status", "approved");
           
         // Get role vacancy size
         const { data: role } = await supabase
           .from("project_roles")
           .select("vacancies")
           .eq("id", member.project_role_id)
           .single();
           
         if (role && (approvedCount || 0) >= role.vacancies) {
           // Close the role
           await supabase
             .from("project_roles")
             .update({ is_open: false })
             .eq("id", member.project_role_id);
         }
       }
    }

    // 5. Update the original notification if notificationId is provided
    if (notificationId) {
      // First, get the current metadata to merge
      const { data: nData, error: nFetchError } = await supabase
        .from("notifications")
        .select("metadata")
        .eq("id", notificationId)
        .single();

      if (nFetchError || !nData) {
        console.error("Could not fetch notification for metadata update:", nFetchError);
      } else {
        const updatedMetadata = {
          ...((nData?.metadata as object) || {}),
          status: status,
        };

        const { error: nUpdateError } = await supabase
          .from("notifications")
          .update({
            metadata: updatedMetadata,
            read: true,
          })
          .eq("id", notificationId);

        if (nUpdateError) {
          console.error("Failed to update notification metadata with status:", nUpdateError);
        }
      }
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Member status update exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
