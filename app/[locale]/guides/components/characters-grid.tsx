import { Suspense } from 'react';
import { Link } from '@/src/i18n/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export async function CharactersGrid() {
  const supabase = await createClient();
  
  const { data: characters } = await supabase
    .from('characters')
    .select('*, character_guides(*)')
    .order('rarity', { ascending: false });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {characters?.map((char: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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
                <Image
                  src={char.image_url || ''}
                  alt={char.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
              <Image
                src={char.image_url || ''}
                alt={char.name}
                fill
                className="object-cover grayscale"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
  );
}

export function CharactersSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="aspect-square bg-zinc-200 animate-pulse" />
      ))}
    </div>
  );
}
