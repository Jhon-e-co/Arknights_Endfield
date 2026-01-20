import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.role === 'admin';

    const { data: blueprint, error: fetchError } = await supabase
      .from("blueprints")
      .select("id, image_url, author_id")
      .eq("id", id)
      .single();

    if (fetchError || !blueprint) {
      return NextResponse.json({ error: "Blueprint not found" }, { status: 404 });
    }

    const isOwner = user.id === blueprint.author_id;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    if (blueprint.image_url) {
      const match = blueprint.image_url.match(/\/blueprints\/(.+)$/);
      if (match && match[1]) {
        const filePath = match[1];
        console.log("Deleting file:", filePath);

        const { error: rmError } = await supabaseAdmin
          .storage
          .from('blueprints')
          .remove([filePath]);

        if (rmError) {
          console.error("Storage delete error:", rmError);
        }
      } else {
        console.warn("Could not parse file path from:", blueprint.image_url);
      }
    }

    const { error: deleteError } = await supabase
      .from("blueprints")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Delete blueprint error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
