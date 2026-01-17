import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { Metadata } from "next";
import { CharactersGrid, CharactersSkeleton } from './components/characters-grid';

export const metadata: Metadata = {
  title: "Guides - Operator Strategies & Tactics | Endfield Lab",
  description: "Tactical analysis, loadout recommendations, and team compositions for Arknights: Endfield operators. Master your favorite characters with detailed guides.",
  openGraph: {
    title: "Guides - Operator Strategies & Tactics | Endfield Lab",
    description: "Tactical analysis, loadout recommendations, and team compositions for Arknights: Endfield operators. Master your favorite characters with detailed guides.",
  },
};

export default async function GuidesPage() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-zinc-50"></div>
      
      {/* Large OPERATORS Text Decoration */}
      <div className="absolute right-[-10%] bottom-[-10%] text-[20rem] font-black text-zinc-100 pointer-events-none select-none">
        OPERATORS
      </div>
      
      {/* Corner HUD Elements */}
      <div className="absolute top-8 left-8 text-zinc-400 font-mono text-sm hidden md:block">
        [ DATABASE: ACCESS ]
      </div>
      <div className="absolute top-8 right-8 text-zinc-400 font-mono text-sm hidden md:block">
        [ GUIDES ]
      </div>
      <div className="absolute bottom-8 left-8 text-zinc-400 font-mono text-sm hidden md:block">
        [ STATUS: ONLINE ]
      </div>
      <div className="absolute bottom-8 right-8 text-zinc-400 font-mono text-sm hidden md:block">
        [ VER: 2.0 ]
      </div>
      
      {/* Warning Stripes */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#FCEE21] to-transparent opacity-50"></div>
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#FCEE21] to-transparent opacity-50"></div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black uppercase text-zinc-900 mb-2">
              Operator <span className="bg-[#FCEE21] px-1">Guides</span>
            </h1>
            <p className="text-zinc-600">
              Tactical analysis, loadout recommendations, and team compositions.
            </p>
          </div>
          
          {/* Characters Grid with Suspense */}
          <Suspense fallback={<CharactersSkeleton />}>
            <CharactersGrid />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
