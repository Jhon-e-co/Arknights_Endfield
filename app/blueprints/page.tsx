import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/motion-wrapper';
import { TERMINOLOGY } from '@/lib/constants';
import { AdUnit } from '@/components/ui/ad-unit';
import { createClient } from '@/lib/supabase/server';
import { Blueprint } from '@/lib/mock-data';
import { BlueprintsGrid } from '@/components/blueprints/blueprints-grid';

export const dynamic = 'force-dynamic';

export default async function BlueprintsPage() {
  const supabase = await createClient();

  const { data: blueprints } = await supabase
    .from('blueprints')
    .select(`
      *,
      profiles (username, avatar_url)
    `)
    .order('created_at', { ascending: false });

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
    createdAt: bp.created_at
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
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Sort By */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Sort by
            </label>
            <select
              className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
            >
              <option>Most Popular</option>
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Most Liked</option>
            </select>
          </div>

          {/* Material Type */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Material Type
            </label>
            <select
              className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
            >
              <option>All Materials</option>
              <option>Iron</option>
              <option>Copper</option>
              <option>Silicon</option>
              <option>Water</option>
            </select>
          </div>

          {/* Additional Filter Placeholder */}
          <div className="flex-1 hidden md:block">
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Stage
            </label>
            <select
              className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
            >
              <option>All Stages</option>
              <option>Early Game</option>
              <option>Mid Game</option>
              <option>End Game</option>
            </select>
          </div>
        </div>
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
