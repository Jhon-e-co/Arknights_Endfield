import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'alltime';

    if (type === 'weekly') {
      const now = new Date();
      const day = now.getUTCDay();
      const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now);
      monday.setUTCDate(diff);
      monday.setUTCHours(0, 0, 0, 0);
      const currentWeekStartStr = monday.toISOString().split('T')[0];

      const { data: weeklyData, error: weeklyError } = await supabase
        .from('gacha_weekly_leaderboard')
        .select(`
          id,
          user_id,
          week_start,
          score,
          best_pull,
          rank,
          created_at,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('week_start', currentWeekStartStr)
        .order('score', { ascending: false })
        .limit(100);

      if (weeklyError) {
        console.error('Failed to fetch weekly leaderboard:', weeklyError);
        return NextResponse.json(
          { error: 'Failed to fetch weekly leaderboard' },
          { status: 500 }
        );
      }

      const formattedData = weeklyData?.map((entry, index) => ({
        id: entry.id,
        userId: entry.user_id,
        username: (entry.profiles as any)?.username || 'Unknown', // eslint-disable-line @typescript-eslint/no-explicit-any
        avatarUrl: (entry.profiles as any)?.avatar_url || '/images/avatars/Endministrator.webp', // eslint-disable-line @typescript-eslint/no-explicit-any
        weekStart: entry.week_start,
        score: entry.score,
        bestPull: entry.best_pull,
        rank: index + 1,
        createdAt: entry.created_at,
      })) || [];

      return NextResponse.json({ data: formattedData, type: 'weekly' }, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      });
    } else {
      const { data: alltimeData, error: alltimeError } = await supabase
        .from('gacha_alltime_leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(100);

      if (alltimeError) {
        console.error('Failed to fetch alltime leaderboard:', alltimeError);
        return NextResponse.json(
          { error: 'Failed to fetch alltime leaderboard' },
          { status: 500 }
        );
      }

      const formattedData = alltimeData?.map((entry, index) => ({
        id: entry.user_id,
        userId: entry.user_id,
        username: entry.username || 'Unknown',
        avatarUrl: entry.avatar_url || '/images/avatars/Endministrator.webp',
        score: entry.score,
        bestPull: entry.best_pull,
        totalPulls: entry.total_pulls,
        total6Star: entry.total_6star,
        total5Star: entry.total_5star,
        total4Star: entry.total_4star,
        best6StarPity: entry.best_6star_pity,
        avg6StarPity: entry.avg_6star_pity,
        lastPullAt: entry.last_pull_at,
        rank: index + 1,
      })) || [];

      return NextResponse.json({ data: formattedData, type: 'alltime' }, {
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
        }
      });
    }
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
