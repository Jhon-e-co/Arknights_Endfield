import { createClient } from "@/lib/supabase/server";
import { TeamCard } from "@/components/teams/team-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const supabase = await createClient();

  const [squadsResult, charactersResult] = await Promise.all([
    supabase
      .from("squads")
      .select("*, profiles(username, avatar_url)")
      .order("created_at", { ascending: false }),
    supabase.from("characters").select("*"),
  ]);

  const squads = squadsResult.data || [];
  const characters = charactersResult.data || [];

  const characterMap = new Map(characters.map((c) => [c.id, c]));

  const formattedSquads = squads.map((squad) => {
    const squadMembers = (squad.members || [])
      .map((id: string) => characterMap.get(id))
      .filter(Boolean);

    return {
      id: squad.id,
      title: squad.title,
      description: squad.description || "",
      members: squadMembers,
      likes: squad.likes || 0,
      profiles: squad.profiles,
      author_id: squad.author_id,
      tags: [],
    };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider mb-2">
            TACTICAL <span className="bg-[#FCEE21] px-1">SQUADS</span>
          </h1>
          <p className="text-zinc-500">
            Discover and share the most efficient team compositions.
          </p>
        </div>
        <Link href="/teams/create">
          <Button className="bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 rounded-none font-bold px-6 py-3 w-full md:w-auto">
            Create Squad
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {formattedSquads.length > 0 ? (
          formattedSquads.map((squad) => (
            <TeamCard key={squad.id} squad={squad} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-zinc-50 border border-dashed border-zinc-200">
            <p className="text-zinc-500">No squads found. Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
