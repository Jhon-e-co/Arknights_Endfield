import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { squad_id } = await request.json();
    if (!squad_id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const { error } = await supabase
      .from("saved_squads")
      .insert({ user_id: user.id, squad_id });

    if (error) throw error;

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
    const { squad_id } = await request.json();
    if (!squad_id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const { error } = await supabase
      .from("saved_squads")
      .delete()
      .match({ user_id: user.id, squad_id });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
