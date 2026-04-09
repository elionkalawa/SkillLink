import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: userId } = await params;
    const user = await getCurrentUser();

    if (!user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: applications, error } = await supabase
      .from("project_members")
      .select(`
        id,
        status,
        role,
        joined_at,
        project:projects (
          id,
          title,
          description,
          image_url,
          category,
          owner:next_auth.users!projects_owner_id_fkey (
            name,
            image
          )
        ),
        project_role:project_roles (
          title
        )
      `)
      .eq("user_id", userId)
      .neq("status", "approved") // Show pending/rejected applications here? Or just pending? 
      .order("joined_at", { ascending: false });

    if (error) {
      console.error("Fetch user applications error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(applications);
  } catch (error) {
    console.error("API GET User applications exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
