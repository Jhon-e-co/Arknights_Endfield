import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: pulls, error } = await supabase
      .from('gacha_pulls')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch gacha history:', error);
      return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }

    if (!pulls || pulls.length === 0) {
      return NextResponse.json({ data: { history: [], inventory: {} } });
    }

    const history = pulls.flatMap(pull => {
      const characters = pull.results?.characters || [];
      return characters.map((char: any) => ({
        character: {
          id: char.character.id,
          name: char.character.name,
          rarity: char.character.rarity,
          element: char.character.element,
          type: char.character.type,
          image: char.character.image,
        },
        newPity6: pull.pity6_after,
        newPity5: pull.pity5_after,
      }));
    });

    const inventory = history.reduce((acc, result) => {
      const charId = result.character.id;
      acc[charId] = (acc[charId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({ 
      data: {
        history,
        inventory,
      }
    });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
