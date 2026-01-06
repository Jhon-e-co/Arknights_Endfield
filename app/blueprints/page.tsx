import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/motion-wrapper';
import { TERMINOLOGY } from '@/lib/constants';
import { AdUnit } from '@/components/ui/ad-unit';
import { createClient } from '@/lib/supabase/server';
import { Blueprint } from '@/lib/mock-data';
import { BlueprintsGrid } from '@/components/blueprints/blueprints-grid';
import { FilterBar } from '@/components/blueprints/filter-bar';
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Blueprints - Factory Automation & Efficiency | Endfield Lab",
  description: "Discover and share automation blueprints for Arknights: Endfield. Browse efficient factory layouts, production chains, and industrial designs from the community.",
  openGraph: {
    title: "Blueprints - Factory Automation & Efficiency | Endfield Lab",
    description: "Discover and share automation blueprints for Arknights: Endfield. Browse efficient factory layouts, production chains, and industrial designs from the community.",
  },
};

export default async function BlueprintsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; material?: string; function?: string }>;
}) {
  const params = await searchParams;
  const sort = params.sort || 'newest';
  const material = params.material || '';
  const functionParam = params.function || '';

  const supabase = await createClient();

  let query = supabase
    .from('blueprints')
    .select(`
      *,
      profiles (username, avatar_url)
    `);

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

  const [blueprintsResult, { data: { user } }] = await Promise.all([
    query,
    supabase.auth.getUser(),
  ]);

  const blueprints = blueprintsResult.data || [];

  let userLikes: Set<string> = new Set();
  let userFavorites: Set<string> = new Set();

  if (user) {
    const [likesResult, favoritesResult] = await Promise.all([
      supabase.from("blueprint_likes").select("blueprint_id").eq("user_id", user.id),
      supabase.from("saved_blueprints").select("blueprint_id").eq("user_id", user.id),
    ]);

    userLikes = new Set(likesResult.data?.map(l => l.blueprint_id) || []);
    userFavorites = new Set(favoritesResult.data?.map(f => f.blueprint_id) || []);
  }

  const mappedBlueprints: Blueprint[] = blueprints.map(bp => ({
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-black uppercase">
            {TERMINOLOGY.SYSTEM_AIC.split(' ')[0]} <span className="bg-[#FCEE21] px-1">BLUEPRINTS</span>
          </h1>
          <Link href="/blueprints/create">
            <Button
              className="bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 rounded-none font-bold px-6 py-3"
            >
              Upload Blueprint
            </Button>
          </Link>
        </div>
      </FadeIn>

      {/* Banner Ad */}
      <FadeIn delay={0.15}>
        <AdUnit type="banner" className="my-8" />
      </FadeIn>

      {/* Filter Section */}
      <FadeIn delay={0.2}>
        <FilterBar />
      </FadeIn>

      {/* Blueprints Grid with Stagger Animation */}
      <BlueprintsGrid blueprints={mappedBlueprints} />

      {/* Empty State */}
      {mappedBlueprints.length === 0 && (
        <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-zinc-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">No blueprints found.</h3>
          <p className="text-zinc-500 mb-6">Be the first to upload a blueprint!</p>
          <Link href="/blueprints/create">
            <Button className="bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 rounded-none font-bold flex items-center gap-2">
              Create Blueprint
            </Button>
          </Link>
        </div>
      )}

      {/* Empty Space for Better Layout */}
      <div className="h-16"></div>
    </div>
  );
}
