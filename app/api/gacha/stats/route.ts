import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: stats, error: statsError } = await supabase
      .from('gacha_user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (statsError) {
      if (statsError.code === 'PGRST116') {
        return NextResponse.json({
          data: {
            userId: user.id,
            totalPulls: 0,
            total6Star: 0,
            total5Star: 0,
            total4Star: 0,
            currentPity6: 0,
            currentPity5: 0,
            best6StarPity: null,
            avg6StarPity: null,
            lastPullAt: null,
          },
        });
      }
      console.error('Failed to fetch user stats:', statsError);
      return NextResponse.json(
        { error: 'Failed to fetch user stats' },
        { status: 500 }
      );
    }

    const formattedData = {
      userId: stats.user_id,
      totalPulls: stats.total_pulls,
      total6Star: stats.total_6star,
      total5Star: stats.total_5star,
      total4Star: stats.total_4star,
      currentPity6: stats.current_pity6,
      currentPity5: stats.current_pity5,
      best6StarPity: stats.best_6star_pity,
      avg6StarPity: stats.avg_6star_pity,
      lastPullAt: stats.last_pull_at,
      createdAt: stats.created_at,
      updatedAt: stats.updated_at,
    };

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
