import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ThumbsUp, FileText, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { BlueprintCard } from '@/components/blueprints/blueprint-card';
import { TeamCard } from '@/components/teams/team-card';
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).single();

  if (!profile) return { title: "User Not Found" };

  return {
    title: profile.username || "Unknown Agent",
    description: profile.bio || "",
  };
}

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  const { data: blueprints } = await supabase
    .from("blueprints")
    .select("*, profiles(*)")
    .eq("author_id", id)
    .order("created_at", { ascending: false });

  const { data: rawSquads } = await supabase
    .from("squads")
    .select("*, profiles(*)")
    .eq("author_id", id)
    .order("created_at", { ascending: false });

  const { data: allChars } = await supabase.from("characters").select("*");
  const charMap = new Map((allChars || []).map((c) => [c.id, c]));

  const squads = (rawSquads || []).map(squad => ({
    ...squad,
    members: (squad.members || [])
      .map((mid: string) => charMap.get(mid))
      .filter((c: any) => c !== undefined)
  }));

  const totalBlueprints = blueprints?.length || 0;
  const totalSquads = squads?.length || 0;
  const blueprintLikes = blueprints?.reduce((sum, item) => sum + (item.likes || 0), 0) || 0;
  const squadLikes = squads.reduce((sum, item) => sum + (item.likes || 0), 0) || 0;
  const totalLikes = blueprintLikes + squadLikes;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white border border-zinc-200 p-6 shadow-sm mb-8 flex flex-col">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-100">
                <Image
                  src={profile.avatar_url || "/images/avatars/default.png"}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900">
                  {profile.username || "Unknown Agent"}
                </h2>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <span className="uppercase">ID: {profile.id.slice(0, 8)}</span>
                </div>
              </div>
            </div>
          </div>

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

        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Published Blueprints
            </h2>
            {blueprints && blueprints.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blueprints.map((blueprint) => (
                  <div key={blueprint.id}>
                    <BlueprintCard blueprint={blueprint} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center rounded-none">
                <FileText className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
                <p className="text-zinc-500">No blueprints yet.</p>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Published Squads
            </h2>
            {squads && squads.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {squads.map((squad) => (
                  <div key={squad.id}>
                    <TeamCard squad={squad} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center rounded-none">
                <Users className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
                <p className="text-zinc-500">No squads yet.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}