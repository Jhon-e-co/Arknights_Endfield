import { TeamCard } from '@/components/teams/team-card';
import { createClient } from '@/lib/supabase/server';

interface TeamsListProps {
  userId?: string;
}

export async function TeamsList({ userId }: TeamsListProps) {
  const supabase = await createClient();

  const [squadsResult, charactersResult] = await Promise.all([
    supabase.from("squads").select("*, profiles(username, avatar_url)").order("created_at", { ascending: false }),
    supabase.from("characters").select("*"),
  ]);

  const squads = squadsResult.data || [];
  const characters = charactersResult.data || [];
  const characterMap = new Map(characters.map((c) => [c.id, c]));

  let userLikes: Set<string> = new Set();
  let userFavorites: Set<string> = new Set();

  if (userId) {
    const [likesResult, favoritesResult] = await Promise.all([
      supabase.from("squad_likes").select("squad_id").eq("user_id", userId),
      supabase.from("saved_squads").select("squad_id").eq("user_id", userId),
    ]);

    userLikes = new Set(likesResult.data?.map(l => l.squad_id) || []);
    userFavorites = new Set(favoritesResult.data?.map(f => f.squad_id) || []);
  }

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
      initialIsLiked: userLikes.has(squad.id),
      initialIsCollected: userFavorites.has(squad.id),
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {formattedSquads.length > 0 ? (
        formattedSquads.map((squad) => (
          <TeamCard 
            key={squad.id} 
            squad={squad} 
          />
        ))
      ) : (
        <div className="col-span-full text-center py-20 bg-zinc-50 border border-dashed border-zinc-200">
          <p className="text-zinc-500">No squads found. Be first to create one!</p>
        </div>
      )}
    </div>
  );
}

export function TeamsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border border-zinc-200 bg-white rounded-none shadow-sm p-6">
          <div className="h-6 bg-zinc-200 animate-pulse rounded mb-4" />
          <div className="h-4 bg-zinc-200 animate-pulse rounded w-3/4 mb-6" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="w-12 h-12 bg-zinc-200 animate-pulse rounded-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
