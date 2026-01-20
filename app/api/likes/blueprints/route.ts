import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { blueprint_id } = await request.json();
    if (!blueprint_id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const { error } = await supabase
      .from("blueprint_likes")
      .insert({ user_id: user.id, blueprint_id });

    if (error) {
      if (error.code === '23505') return NextResponse.json({ success: true });
      throw error;
    }

    await supabase.rpc('increment_blueprint_likes', { row_id: blueprint_id });

    return NextResponse.json({ success: true });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { blueprint_id } = await request.json();
    if (!blueprint_id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const { error } = await supabase
      .from("blueprint_likes")
      .delete()
      .match({ user_id: user.id, blueprint_id });

    if (error) throw error;

    await supabase.rpc('decrement_blueprint_likes', { row_id: blueprint_id });

    return NextResponse.json({ success: true });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
