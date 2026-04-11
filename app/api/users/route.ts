import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    let supabaseQuery = supabase
      .schema("next_auth")
      .from("users")
      .select("id, name, username, image, bio, skills, profile_title, role, location")
      .neq("id", user.id);

    if (query) {
      supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,username.ilike.%${query}%,profile_title.ilike.%${query}%`);
    }

    const { data: users, error } = await supabaseQuery.limit(50);

    if (error) {
      console.error("Explore users error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(users || []);
  } catch (error) {
    console.error("Explore users exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
