import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { CHARACTERS } from '@/lib/mock-data';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const results = [];

  for (const char of CHARACTERS) {
    try {
      const { data: charData, error: charError } = await supabase
        .from('characters')
        .upsert(
          {
            slug: char.id,
            name: char.name,
            rarity: char.rarity,
            element: char.element.charAt(0).toUpperCase() + char.element.slice(1),
            role: char.guide?.overview.role || [],
            image_url: char.portrait ? `/characters/${char.portrait}` : '',
          },
          { onConflict: 'slug' }
        )
        .select()
        .single();

      if (charError) {
        results.push({ name: char.name, status: 'Error Char', error: charError.message });
        continue;
      }

      if (char.guide) {
        const { error: guideError } = await supabase
          .from('character_guides')
          .upsert(
            {
              character_id: charData.id,
              overview_text: char.guide.overview.tips,
              skill_priority: char.guide.skillPriority,
              equipment_recommendations: char.guide.loadout,
              team_comps: char.guide.teams,
            },
            { onConflict: 'character_id' }
          );

        if (guideError) {
          results.push({ name: char.name, status: 'Error Guide', error: guideError.message });
        } else {
          results.push({ name: char.name, status: 'Success' });
        }
      } else {
        results.push({ name: char.name, status: 'Success (No Guide)' });
      }
    } catch (error) {
      results.push({ name: char.name, status: 'Error', error: (error as Error).message });
    }
  }

  return NextResponse.json({
    message: 'Seeding completed',
    total: CHARACTERS.length,
    results
  });
}
