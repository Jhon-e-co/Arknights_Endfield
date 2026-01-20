import { createClient } from '@/lib/supabase/server';
import { Link } from '@/src/i18n/navigation';
import { notFound } from 'next/navigation';

export default async function GuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: character } = await supabase
    .from('characters')
    .select('*, character_guides(*)')
    .eq('slug', id)
    .single();

  if (!character || !character.character_guides) {
    notFound();
  }

  const rawGuide = character.character_guides;
  const guide = Array.isArray(rawGuide) ? rawGuide[0] : rawGuide;

  if (!guide) {
    return <div className="container py-20 text-center">Guide data is missing.</div>;
  }

  const teamMembers = guide.team_comps?.flatMap((t: any) => t.members) || []; // eslint-disable-line @typescript-eslint/no-explicit-any
  const { data: allCharacters } = await supabase
    .from('characters')
    .select('id, name, slug, image_url, rarity')
    .in('slug', teamMembers);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Low':
        return 'bg-zinc-100 text-zinc-600 border-zinc-300';
      default:
        return 'bg-zinc-100 text-zinc-600 border-zinc-300';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'T0':
        return 'bg-[#FCEE21] text-black';
      case 'T1':
        return 'bg-zinc-300 text-black';
      case 'T2':
        return 'bg-zinc-400 text-white';
      case 'T3':
        return 'bg-zinc-500 text-white';
      default:
        return 'bg-zinc-400 text-white';
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-white"></div>
      
      {/* Large ENDFIELD Text Decoration */}
      <div className="absolute right-[-10%] bottom-[-10%] text-[20rem] font-black text-zinc-100 pointer-events-none select-none">
        ENDFIELD
      </div>
      
      {/* Corner HUD Elements */}
      <div className="absolute top-8 left-8 text-zinc-400 font-mono text-sm hidden md:block">
        [ ANALYSIS: {character.name.toUpperCase()} ]
      </div>
      <div className="absolute top-8 right-8 text-zinc-400 font-mono text-sm hidden md:block">
        [ GUIDE ]
      </div>
      <div className="absolute bottom-8 left-8 text-zinc-400 font-mono text-sm hidden md:block">
        [ STATUS: ONLINE ]
      </div>
      <div className="absolute bottom-8 right-8 text-zinc-400 font-mono text-sm hidden md:block">
        [ TIER: {guide.tier} ]
      </div>
      
      {/* Warning Stripes */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#FCEE21] to-transparent opacity-50"></div>
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#FCEE21] to-transparent opacity-50"></div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Link
          href="/guides"
          className="relative z-20 inline-flex items-center gap-2 bg-[#FCEE21] text-black px-4 py-2 font-bold font-display tracking-wide text-sm hover:bg-[#FCEE21]/80 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          BACK TO GUIDES
        </Link>

        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-2 border-zinc-200 rounded-lg overflow-hidden mb-8">
            <div className="relative h-64 md:h-80">
              <img
                src={character.image_url || ''}
                alt={character.name}
                className="w-full h-full object-cover object-[center_40%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-zinc-600 text-sm uppercase">{character.element}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: character.rarity }).map((_, i) => (
                          <span key={i} className="text-[#FCEE21] text-lg">★</span>
                        ))}
                      </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-2 text-zinc-900">
                      {character.name}
                    </h1>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {character.role?.map((role: string) => (
                        <span
                          key={role}
                          className="px-3 py-1 bg-zinc-200 text-zinc-700 text-sm rounded-full"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-6">
              <h2 className="text-2xl font-black uppercase tracking-widest mb-4 text-zinc-900">
                Overview
              </h2>
              <p className="text-zinc-700 text-lg leading-relaxed">{guide.overview_text}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-6">
              <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-zinc-900">
                Skills Priority
              </h2>
              <div className="space-y-4">
                {guide.skill_priority?.map((skill: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                  <div
                    key={skill.name}
                    className="bg-white border-2 border-zinc-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-zinc-900">{skill.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs font-bold uppercase bg-zinc-200 text-zinc-700 rounded">
                          {skill.type}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-bold uppercase border rounded ${getPriorityColor(
                            skill.priority
                          )}`}
                        >
                          {skill.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-zinc-600 text-sm">{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-6">
              <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-zinc-900">
                Loadout
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3 text-zinc-900">Best Weapons</h3>
                  <ul className="space-y-2">
                    {guide.equipment_recommendations?.bestWeapons?.map((weapon: string) => (
                      <li
                        key={weapon}
                        className="flex items-center gap-2 text-zinc-700"
                      >
                        <span className="w-2 h-2 bg-[#FCEE21] rounded-full" />
                        {weapon}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3 text-zinc-900">Best Equipment</h3>
                  <ul className="space-y-2">
                    {guide.equipment_recommendations?.bestEquipment?.map((equipment: string) => (
                      <li
                        key={equipment}
                        className="flex items-center gap-2 text-zinc-700"
                      >
                        <span className="w-2 h-2 bg-[#FCEE21] rounded-full" />
                        {equipment}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3 text-zinc-900">Stats Priority</h3>
                  <div className="flex flex-wrap gap-2">
                    {guide.equipment_recommendations?.statsPriority?.map((stat: string) => (
                      <span
                        key={stat}
                        className="px-3 py-1 bg-zinc-200 text-zinc-700 text-sm rounded-full"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-zinc-900">
              Team Compositions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guide.team_comps?.map((team: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                <div
                  key={team.name}
                  className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-6"
                >
                  <h3 className="font-bold text-xl mb-4 text-zinc-900">{team.name}</h3>
                  <div className="flex gap-3 mb-4">
                    {team.members.map((memberSlug: string) => {
                      const member = allCharacters?.find((c: any) => c.slug === memberSlug); // eslint-disable-line @typescript-eslint/no-explicit-any
                      if (!member) return null;
                      return (
                        <div
                          key={memberSlug}
                          className="relative w-16 h-16 flex-shrink-0"
                        >
                          <img
                            src={member.image_url || ''}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-lg border-2 border-zinc-300"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-white text-zinc-900 text-[10px] px-1 rounded border border-zinc-300">
                            {member.rarity}★
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-zinc-600 text-sm">{team.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
