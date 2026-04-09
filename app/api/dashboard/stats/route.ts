import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [{ data: applications }, { data: shipped }] = await Promise.all([
      supabase
        .from("project_members")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "pending"),
      supabase
        .from("projects")
        .select("id")
        .eq("owner_id", user.id)
        .eq("status", "completed"),
    ]);

    return NextResponse.json({
      applications: (applications || []).length,
      shipped: (shipped || []).length,
    });
  } catch (error) {
    console.error("API GET Dashboard stats exception:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

