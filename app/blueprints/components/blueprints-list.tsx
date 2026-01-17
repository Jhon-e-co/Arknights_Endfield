import { BlueprintsGrid } from '@/components/blueprints/blueprints-grid';
import { createClient } from '@/lib/supabase/server';
import { Blueprint } from '@/lib/mock-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface BlueprintsListProps {
  sort: string;
  material: string;
  functionParam: string;
  userId?: string;
}

export async function BlueprintsList({ 
  sort, 
  material, 
  functionParam,
  userId 
}: BlueprintsListProps) {
  const supabase = await createClient();
  
  let query = supabase
    .from('blueprints')
    .select('*, profiles (username, avatar_url)');

  if (material) {
    query = query.contains('tags', [material]);
  }

  if (functionParam) {
    query = query.contains('tags', [functionParam]);
  }

  switch (sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'popular':
      query = query.order('likes', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const { data: blueprints } = await query;

  let userLikes: Set<string> = new Set();
  let userFavorites: Set<string> = new Set();

  if (userId) {
    const [likesResult, favoritesResult] = await Promise.all([
      supabase.from("blueprint_likes").select("blueprint_id").eq("user_id", userId),
      supabase.from("saved_blueprints").select("blueprint_id").eq("user_id", userId),
    ]);

    userLikes = new Set(likesResult.data?.map(l => l.blueprint_id) || []);
    userFavorites = new Set(favoritesResult.data?.map(f => f.blueprint_id) || []);
  }

  const mappedBlueprints: Blueprint[] = (blueprints || []).map(bp => ({
    id: bp.id,
    title: bp.title,
    author: bp.profiles?.username || 'Unknown',
    author_id: bp.author_id,
    image: bp.image_url,
    tags: bp.tags || [],
    likes: bp.likes || 0,
    code: bp.code,
    description: bp.description || '',
    createdAt: bp.created_at,
    initialIsLiked: userLikes.has(bp.id),
    initialIsCollected: userFavorites.has(bp.id),
  }));

  if (mappedBlueprints.length === 0) {
    return (
      <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-zinc-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h3 className="text-lg font-bold mb-2">No blueprints found.</h3>
        <p className="text-zinc-500 mb-6">Be first to upload a blueprint!</p>
        <Link href="/blueprints/create">
          <Button className="bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 rounded-none font-bold flex items-center gap-2">
            Create Blueprint
          </Button>
        </Link>
      </div>
    );
  }

  return <BlueprintsGrid blueprints={mappedBlueprints} />;
}

export function BlueprintsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border border-zinc-200 bg-white rounded-none shadow-sm">
          <div className="aspect-video bg-zinc-200 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-zinc-200 animate-pulse rounded" />
            <div className="h-3 bg-zinc-200 animate-pulse rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
