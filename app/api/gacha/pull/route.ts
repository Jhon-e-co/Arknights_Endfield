import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { GachaSystem, GachaResult } from '@/lib/gacha/engine';

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [profileResult, statsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single(),
    supabase
      .from('gacha_user_stats')
      .select('current_pity6, current_pity5, last_pull_at')
      .eq('user_id', user.id)
      .single()
  ]);

  const { data: profile, error: profileError } = profileResult;
  const { data: stats, error: statsError } = statsResult;

  if (profileError || !profile) {
    console.error('Profile missing:', profileError);
    return NextResponse.json({
      error: 'User profile missing. Please log out and log in again to trigger creation.',
      code: profileError?.code,
      details: profileError?.details,
      hint: profileError?.hint
    }, { status: 400 });
  }

  try {
    const body = await request.json();
    const count = Number(body.count);

    if (isNaN(count) || ![1, 10].includes(count)) {
      return NextResponse.json(
        { error: 'Invalid pull count. Must be exactly 1 or 10.' },
        { status: 400 }
      );
    }

    if (!statsError && stats?.last_pull_at) {
      const lastPullTime = new Date(stats.last_pull_at).getTime();
      const now = Date.now();
      if (now - lastPullTime < 2000) {
        return NextResponse.json(
          { error: 'Whoa! Slow down, Doctor. (Rate limit: 1 pull per 2s)' },
          { status: 429 }
        );
      }
    }

    let currentPity6 = 0;
    let currentPity5 = 0;

    if (statsError) {
      if (statsError.code === 'PGRST116') {
        console.log(`User ${user.id} has no gacha stats, initializing with pity 0`);
      } else {
        console.error('Gacha Stats Error:', JSON.stringify({
          code: statsError.code,
          message: statsError.message,
          details: statsError.details,
          hint: statsError.hint,
          userId: user.id
        }, null, 2));
        console.warn('Proceeding with 0 pity due to DB error');
      }
    } else {
      currentPity6 = stats?.current_pity6 ?? 0;
      currentPity5 = stats?.current_pity5 ?? 0;
    }

    const system = new GachaSystem({ pity6: currentPity6, pity5: currentPity5 });

    let results: GachaResult[];
    if (count === 10) {
      results = system.rollTen();
    } else {
      results = [system.rollSingle()];
    }

    const finalState = system.getState();

    const sixStarCount = results.filter((r) => r.character.rarity === 6).length;
    const fiveStarCount = results.filter((r) => r.character.rarity === 5).length;
    const fourStarCount = results.filter((r) => r.character.rarity === 4).length;

    let best6StarPity: number | null = null;
    let avg6StarPity: number | null = null;

    if (sixStarCount > 0) {
      const sixStarIndices = results
        .map((r, idx) => (r.character.rarity === 6 ? idx + 1 : null))
        .filter((idx): idx is number => idx !== null);

      best6StarPity = Math.min(...sixStarIndices);
      avg6StarPity = sixStarIndices.reduce((sum, idx) => sum + idx, 0) / sixStarCount;
    }

    const resultsJson = results.map((r) => ({
      character: {
        id: r.character.id,
        name: r.character.name,
        rarity: r.character.rarity,
        image: r.character.image,
      },
      newPity6: r.newPity6,
      newPity5: r.newPity5,
    }));

    const pullData = {
      user_id: user.id,
      pull_count: count,
      results: {
        characters: resultsJson,
        six_star_count: sixStarCount,
        five_star_count: fiveStarCount,
        four_star_count: fourStarCount,
        best_6star_pity: best6StarPity,
        avg_6star_pity: avg6StarPity,
      },
      pity6_before: currentPity6,
      pity5_before: currentPity5,
      pity6_after: finalState.pity6,
      pity5_after: finalState.pity5,
    };

    const { error: insertError } = await supabase
      .from('gacha_pulls')
      .insert(pullData);

    if (insertError) {
      console.error('Failed to insert gacha pull:', JSON.stringify({
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        userId: user.id
      }, null, 2));
      return NextResponse.json(
        {
          error: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        results: resultsJson,
        pity6: finalState.pity6,
        pity5: finalState.pity5,
      },
    });
  } catch (error) {
    console.error('Gacha pull error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorCode = error instanceof Error && 'code' in error ? (error as any).code : undefined;
    const errorDetails = error instanceof Error && 'details' in error ? (error as any).details : undefined;
    const errorHint = error instanceof Error && 'hint' in error ? (error as any).hint : undefined;
    
    return NextResponse.json(
      {
        error: errorMessage,
        code: errorCode,
        details: errorDetails,
        hint: errorHint
      },
      { status: 500 }
    );
  }
}
