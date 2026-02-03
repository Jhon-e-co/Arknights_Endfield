import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import SquadForm from "@/components/squad/squad-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSquadPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. 获取当前用户
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/teams');
  }

  // 2. 获取队伍详情
  const { data: squad, error } = await supabase
    .from("squads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !squad) {
    console.error("Squad not found error:", error);
    return notFound();
  }

  // 3. 权限检查
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === 'admin';
  const isOwner = user.id === squad.author_id;

  if (!isOwner && !isAdmin) {
    redirect('/teams');
  }

  // 4. 准备初始数据
  const initialData = {
    title: squad.title || '',
    description: squad.description || '',
    members: squad.members || [],
    tags: squad.tags || [],
  };

  return (
    <SquadForm
      mode="edit"
      squadId={id}
      initialData={initialData}
    />
  );
}
