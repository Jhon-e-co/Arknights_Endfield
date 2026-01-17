import React, { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TERMINOLOGY } from '@/lib/constants';
import { AdUnit } from '@/components/ui/ad-unit';
import { createClient } from '@/lib/supabase/server';
import { FilterBar } from '@/components/blueprints/filter-bar';
import { Metadata } from "next";
import { BlueprintsList, BlueprintsSkeleton } from './components/blueprints-list';

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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
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

      {/* Banner Ad */}
      <AdUnit type="banner" className="my-8" />

      {/* Filter Section */}
      <FilterBar />

      {/* Blueprints Grid with Suspense */}
      <Suspense fallback={<BlueprintsSkeleton />}>
        <BlueprintsList
          sort={params.sort || 'newest'}
          material={params.material || ''}
          functionParam={params.function || ''}
          userId={user?.id}
        />
      </Suspense>

      {/* Empty Space for Better Layout */}
      <div className="h-16"></div>
    </div>
  );
}
