import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

interface ProjectResponse {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  category: string;
  owner_id: string;
  owner?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

interface ApplicationResponse {
  id: string;
  status: string;
  role: string;
  joined_at: string;
  project: ProjectResponse | ProjectResponse[];
  project_role: { title: string } | null;
}

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
      .select(
        `
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
          owner_id
        ),
        project_role:project_roles (
          title
        )
      `,
      )
      .eq("user_id", userId)
      .neq("status", "approved")
      .order("joined_at", { ascending: false });

    if (error) {
      console.error("Fetch user applications error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const typedApplications = applications as unknown as ApplicationResponse[];

    // Since we can't easily join cross-schema for the owner in one go,
    // fetch owners for these projects if there are any
    if (typedApplications && typedApplications.length > 0) {
      const ownerIds = Array.from(
        new Set(
          typedApplications
            .map((app) => {
              const project = Array.isArray(app.project)
                ? app.project[0]
                : app.project;
              return project?.owner_id;
            })
            .filter(Boolean) as string[],
        ),
      );

      if (ownerIds.length > 0) {
        const { data: owners } = await supabase
          .schema("next_auth")
          .from("users")
          .select("id, name, image")
          .in("id", ownerIds);

        const ownerMap = new Map(owners?.map((o) => [o.id, o]) || []);

        typedApplications.forEach((app) => {
          const project = Array.isArray(app.project)
            ? app.project[0]
            : app.project;
          if (project && project.owner_id) {
            project.owner = ownerMap.get(project.owner_id) || null;
          }
        });
      }
    }

    return NextResponse.json(typedApplications);
  } catch (error) {
    console.error("API GET User applications exception:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
