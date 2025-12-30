import { createClient } from "@/lib/supabase/server";
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

    const { data: squad, error: fetchError } = await supabase
      .from("squads")
      .select("id, author_id")
      .eq("id", id)
      .single();

    if (fetchError || !squad) {
      return NextResponse.json({ error: "Squad not found" }, { status: 404 });
    }

    const isOwner = user.id === squad.author_id;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from("squads")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete squad error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
