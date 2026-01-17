import { Suspense } from 'react';
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { TeamsList, TeamsSkeleton } from './components/teams-list';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Squads - Best Team Builds & Compositions | Endfield Lab",
  description: "Discover and share the most efficient team compositions for Arknights: Endfield. Browse tactical squad builds, operator synergies, and optimal team setups.",
  openGraph: {
    title: "Squads - Best Team Builds & Compositions | Endfield Lab",
    description: "Discover and share the most efficient team compositions for Arknights: Endfield. Browse tactical squad builds, operator synergies, and optimal team setups.",
  },
};

export default async function TeamsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
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

      {/* Teams List with Suspense */}
      <Suspense fallback={<TeamsSkeleton />}>
        <TeamsList userId={user?.id} />
      </Suspense>
    </div>
  );
}
