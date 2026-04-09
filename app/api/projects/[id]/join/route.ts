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
    
    // Parse roleId from body if it exists
    let roleId = null;
    try {
      const body = await request.json();
      roleId = body.roleId;
    } catch {
      // Body might be empty, that's okay
    }

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

    // Verify role exists and is open if roleId is provided
    if (roleId) {
      const { data: role, error: roleError } = await supabase
        .from("project_roles")
        .select("is_open")
        .eq("id", roleId)
        .eq("project_id", projectId)
        .single();
        
      if (roleError || !role) {
        return NextResponse.json({ error: "Role not found for this project" }, { status: 404 });
      }
      if (!role.is_open) {
        return NextResponse.json({ error: "This role is no longer accepting applications" }, { status: 400 });
      }
    }

    // 3. Create pending membership
    const { data: member, error: memberError } = await supabase
      .from("project_members")
      .insert({
        project_id: projectId,
        user_id: user.id,
        project_role_id: roleId,
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
