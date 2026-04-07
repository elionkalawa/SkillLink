import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    const { data: user, error } = await supabase
      .schema('next_auth')
      .from("users")
      .select(`
        id,
        name,
        image,
        username,
        bio,
        skills,
        github_url,
        linkedin_url,
        portfolio_url,
        location,
        years_of_experience,
        role,
        created_at
      `)
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Fetch user error:", error);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Fetch user exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
