import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Book, LayoutGrid, Users, Star, Plus, Heart } from "lucide-react";
import { BlueprintItem } from "@/components/dashboard/blueprint-item";
import { SquadItem } from "@/components/dashboard/squad-item";
import { ProfileEditor } from "@/components/dashboard/profile-editor";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams;
  const activeTab = params.tab || 'blueprints';
  const supabase = await createClient();

  // 1. 获取用户信息
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  // 2. 获取用户详情 (Profile)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const currentUserRole = profile?.role || 'user';

  // 获取所有用户的 blueprints 和 squads 用于统计
  const { data: allBlueprints } = await supabase
    .from("blueprints")
    .select("likes")
    .eq("author_id", user.id);

  const { data: allSquadsRaw } = await supabase
    .from("squads")
    .select("likes")
    .eq("author_id", user.id);

  const totalBlueprints = allBlueprints?.length || 0;
  const totalSquads = allSquadsRaw?.length || 0;
  const blueprintLikes = allBlueprints?.reduce((sum, item) => sum + (item.likes || 0), 0) || 0;
  const squadLikes = allSquadsRaw?.reduce((sum, item) => sum + (item.likes || 0), 0) || 0;
  const totalLikes = blueprintLikes + squadLikes;

  // 3. 按需获取数据
  let myBlueprints: any[] = [];
  let mySquads: any[] = [];
  let mySavedBlueprints: any[] = [];
  let mySavedSquads: any[] = [];
  let dbError: any = null;

  if (activeTab === 'blueprints') {
    const { data, error } = await supabase
      .from("blueprints")
      .select("*, profiles (username, avatar_url)")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });
    myBlueprints = data || [];
    dbError = error;
  } else if (activeTab === 'squads') {
    const { data: rawSquads } = await supabase
      .from("squads")
      .select("*, profiles(*)")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });

    const { data: allChars } = await supabase.from("characters").select("*");
    const charMap = new Map((allChars || []).map((c) => [c.id, c]));

    mySquads = (rawSquads || []).map(squad => ({
      ...squad,
      members: (squad.members || [])
        .map((id: string) => charMap.get(id))
        .filter((c: any) => c !== undefined)
    }));
  } else if (activeTab === 'favorites') {
    const { data: savedBlueprintsRaw } = await supabase
      .from("saved_blueprints")
      .select("*, blueprints!inner(*, profiles(username, avatar_url))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    mySavedBlueprints = savedBlueprintsRaw?.map(item => item.blueprints) || [];

    const { data: savedSquadsRaw } = await supabase
      .from("saved_squads")
      .select("*, squads!inner(*, profiles(username, avatar_url))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const rawSavedSquads = savedSquadsRaw?.map(item => item.squads) || [];
    const { data: allChars } = await supabase.from("characters").select("*");
    const charMap = new Map((allChars || []).map((c) => [c.id, c]));

    mySavedSquads = rawSavedSquads.map(squad => ({
      ...squad,
      members: (squad.members || [])
        .map((id: string) => charMap.get(id))
        .filter((item: any) => item !== undefined)
    }));
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* 1. 顶部标题区域 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-wider flex items-center gap-2">
          <span className="bg-[#FCEE21] px-2 py-1 text-black">
            Endministrator
          </span>
          <span>Dashboard</span>
        </h1>
      </div>

      {/* 2. 个人信息卡片 (Profile Card) */}
      <div className="bg-white border border-zinc-200 p-6 shadow-sm mb-8 flex flex-col">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* 左侧：头像与信息 */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-100">
               {/* 优先显示 profile avatar, 否则显示默认 */}
              <Image
                src={profile?.avatar_url || "/images/avatars/default.png"}
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">
                {profile?.username || "Endministrator"}
              </h2>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Endministrator</span>
                <span className="uppercase">ID: {user.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>

          {/* 右侧：操作按钮 */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <ProfileEditor user={user} profile={profile} />
            <Link href="/blueprints/create">
              <Button className="bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 rounded-none font-bold border-0">
                <Plus className="w-4 h-4 mr-2" />
                Upload Blueprint
              </Button>
            </Link>
          </div>
        </div>

        {/* 统计栏 */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-100">
          <div>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Blueprints</p>
            <p className="text-2xl font-black text-zinc-900">{totalBlueprints}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Squads</p>
            <p className="text-2xl font-black text-zinc-900">{totalSquads}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Total Likes</p>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <p className="text-2xl font-black text-zinc-900">{totalLikes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 标签栏 (Tabs) - 使用 URL 参数控制 */}
      <div className="flex items-center gap-8 border-b border-zinc-200 mb-8 pb-1">
        <Link
          href="/dashboard?tab=blueprints"
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'blueprints'
              ? 'border-black font-bold text-black'
              : 'border-transparent text-zinc-500 hover:text-black'
          }`}
        >
          <Book className="w-4 h-4" />
          My Blueprints
        </Link>
        <Link
          href="/dashboard?tab=squads"
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'squads'
              ? 'border-black font-bold text-black'
              : 'border-transparent text-zinc-500 hover:text-black'
          }`}
        >
          <Users className="w-4 h-4" />
          My Squads
        </Link>
        <Link
          href="/dashboard?tab=favorites"
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'favorites'
              ? 'border-black font-bold text-black'
              : 'border-transparent text-zinc-500 hover:text-black'
          }`}
        >
          <Star className="w-4 h-4" />
          Favorites
        </Link>
      </div>

      {/* 4. 内容展示区 - 根据 Tab 条件渲染 */}
      <div>
        {activeTab === 'blueprints' && (
          <>
            {dbError && (
              <div className="text-red-500 mb-4">Error loading blueprints: {dbError.message}</div>
            )}

            {!dbError && myBlueprints && myBlueprints.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBlueprints.map((blueprint) => (
                  <BlueprintItem key={blueprint.id} blueprint={blueprint} currentUserRole={currentUserRole} currentUserId={user.id} />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center rounded-none">
                <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
                <p className="text-zinc-500">No blueprints found yet.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'squads' && (
          <>
            {mySquads && mySquads.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mySquads.map((squad) => (
                  <SquadItem key={squad.id} squad={squad} currentUserRole={currentUserRole} currentUserId={user.id} />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center rounded-none">
                <Users className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
                <p className="text-zinc-500">No squads found yet.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Saved Squads
              </h2>
              {mySavedSquads.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mySavedSquads.map((squad: any) => (
                    <div key={squad.id}>
                      <TeamCard squad={squad} currentUserRole={currentUserRole} currentUserId={user.id} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 italic">No saved squads yet.</p>
              )}
            </section>

            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Book className="w-5 h-5" />
                Saved Blueprints
              </h2>
              {mySavedBlueprints.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mySavedBlueprints.map((bp: any) => (
                    <div key={bp.id}>
                      <BlueprintCard blueprint={bp} currentUserRole={currentUserRole} currentUserId={user.id} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 italic">No saved blueprints yet.</p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
