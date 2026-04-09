import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // For join-request notifications, enrich metadata with the live member status
    // This ensures the UI always reflects the true DB state, even if the metadata
    // update in the status route failed silently.
    const enriched = await Promise.all(
      (data ?? []).map(async (notification) => {
        const meta = notification.metadata as Record<string, string> | null;
        if (meta?.type === 'join-request' && meta?.memberId) {
          // Metadata already has a resolved status, no need to re-fetch
          if (meta.status === 'approved' || meta.status === 'rejected') {
            return notification;
          }

          // Fetch the actual member status from the source of truth
          const { data: member } = await supabase
            .from('project_members')
            .select('status')
            .eq('id', meta.memberId)
            .single();

          if (member && (member.status === 'approved' || member.status === 'rejected')) {
            return {
              ...notification,
              metadata: { ...meta, status: member.status },
            };
          }
        }
        return notification;
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Notifications GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      await supabase.from('notifications').delete().eq('id', id).eq('user_id', user.id);
    } else {
      await supabase.from('notifications').delete().eq('user_id', user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications DELETE Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
