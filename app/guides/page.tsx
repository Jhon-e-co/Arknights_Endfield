import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function GuidesPage() {
  const supabase = await createClient();
  
  const { data: characters } = await supabase
    .from('characters')
    .select('*, character_guides(*)')
    .order('rarity', { ascending: false });

  const endAdmin = characters?.find(c => c.slug === 'endministrator' || c.name === 'Endministrator');
  console.log('--- DEBUG START ---');
  console.log('EndAdmin ID:', endAdmin?.id);
  console.log('EndAdmin Guides Raw:', JSON.stringify(endAdmin?.character_guides, null, 2));
  console.log('--- DEBUG END ---');

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
          <div className="mb-8">
            <h1 className="text-3xl font-black uppercase text-zinc-900 mb-2">
              Operator <span className="bg-[#FCEE21] px-1">Guides</span>
            </h1>
            <p className="text-zinc-600">
              Tactical analysis, loadout recommendations, and team compositions.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {characters?.map((char) => {
              const rawGuide = char.character_guides;
              const guideData = Array.isArray(rawGuide) ? rawGuide[0] : rawGuide;

              const hasGuide = !!(guideData && guideData.id);
              
              if (hasGuide) {
                return (
                  <Link
                    key={char.id}
                    href={`/guides/${char.slug}`}
                    className="group relative bg-white border-2 border-zinc-200 hover:border-[#FCEE21] transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={char.image_url || ''}
                        alt={char.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-[#FCEE21] text-black text-xs font-bold px-2 py-1">
                        GUIDE READY
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent p-4">
                        <h3 className="font-bold text-lg text-zinc-900">{char.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-zinc-600 uppercase">{char.element}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: char.rarity }).map((_, i) => (
                              <span key={i} className="text-[#FCEE21] text-xs">★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }
              
              return (
                <div
                  key={char.id}
                  className="relative bg-zinc-100 border-2 border-zinc-200 opacity-60 overflow-hidden"
                >
                  <div className="aspect-square relative">
                    <img
                      src={char.image_url || ''}
                      alt={char.name}
                      className="w-full h-full object-cover grayscale"
                    />
                    <div className="absolute top-2 right-2 bg-zinc-400 text-white text-xs font-bold px-2 py-1">
                      COMING SOON
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-100 via-zinc-100/90 to-transparent p-4">
                      <h3 className="font-bold text-lg text-zinc-600">{char.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500 uppercase">{char.element}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: char.rarity }).map((_, i) => (
                            <span key={i} className="text-zinc-400 text-xs">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
