import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Check if already applied or member
    const { data: existingMember } = await supabase
      .from("project_members")
      .select("id, status")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .single();

    if (existingMember) {
      return NextResponse.json({ 
        error: `You have already ${existingMember.status === 'pending' ? 'applied to' : 'joined'} this project.` 
      }, { status: 400 });
    }

    // 2. Fetch project owner info
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("title, owner_id")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.owner_id === user.id) {
      return NextResponse.json({ error: "Owners are already members of their own project." }, { status: 400 });
    }

    // 3. Create pending membership
    const { data: member, error: memberError } = await supabase
      .from("project_members")
      .insert({
        project_id: projectId,
        user_id: user.id,
        status: 'pending',
        role: 'member'
      })
      .select()
      .single();

    if (memberError) {
      console.error("Join application error:", memberError);
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    // 4. Create notification for owner
    const { error: notifyError } = await supabase
      .from("notifications")
      .insert({
        user_id: project.owner_id,
        type: 'invite', // Reusing invite type for join requests
        message: `${user.name} has applied to join "${project.title}".`,
        link: `/dashboard/profile/${user.id}`, // Link to applicant profile
        sender_id: user.id,
        metadata: {
          projectId,
          applicantId: user.id,
          memberId: member.id,
          type: 'join-request'
        }
      });

    if (notifyError) {
      console.error("Notification error:", notifyError);
    }

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error("Join request exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
