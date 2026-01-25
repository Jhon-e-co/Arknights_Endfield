import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  try {
    const results: any = {};

    // 1. 检查触发器是否存在及状态
    const { data: triggers } = await supabase
      .rpc('get_triggers_info', { table_name: 'gacha_pulls' });

    // 由于 Supabase 客户端可能无法直接访问 information_schema，
    // 我们需要使用 SQL 查询
    const { data: triggersData, error: triggersError } = await supabase
      .rpc('execute_sql', {
        sql: `
          SELECT 
            trigger_name, 
            action_statement, 
            action_orientation, 
            action_timing,
            event_manipulation
          FROM information_schema.triggers 
          WHERE event_object_table = 'gacha_pulls'
          ORDER BY trigger_name
        `
      });

    results.triggers = triggersData;
    results.triggersError = triggersError;

    // 2. 检查本周是否有抽卡数据 (UTC)
    const { data: recentPulls, error: recentPullsError } = await supabase
      .from('gacha_pulls')
      .select('id, user_id, pull_count, created_at, results')
      .gte('created_at', new Date(new Date().setUTCHours(0, 0, 0, 0) - (new Date().getUTCDay() * 24 * 60 * 60 * 1000)).toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    results.recentPulls = recentPulls;
    results.recentPullsError = recentPullsError;

    const { count: recentPullsCount, error: countError } = await supabase
      .from('gacha_pulls')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().setUTCHours(0, 0, 0, 0) - (new Date().getUTCDay() * 24 * 60 * 60 * 1000)).toISOString());

    results.recentPullsCount = recentPullsCount;
    results.countError = countError;

    // 3. 检查周榜目前有多少条数据
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('gacha_weekly_leaderboard')
      .select('*')
      .order('week_start', { ascending: false });

    results.leaderboard = leaderboard;
    results.leaderboardError = leaderboardError;

    const { count: leaderboardCount } = await supabase
      .from('gacha_weekly_leaderboard')
      .select('*', { count: 'exact', head: true });

    results.leaderboardCount = leaderboardCount;

    // 4. 检查本周周榜数据
    const currentWeekStart = new Date(new Date().setUTCHours(0, 0, 0, 0) - (new Date().getUTCDay() * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

    const { data: currentWeekLeaderboard, error: currentWeekError } = await supabase
      .from('gacha_weekly_leaderboard')
      .select('*')
      .eq('week_start', currentWeekStart)
      .order('score', { ascending: false });

    results.currentWeekLeaderboard = currentWeekLeaderboard;
    results.currentWeekError = currentWeekError;

    // 5. 检查用户统计表数据
    const { data: userStats, error: userStatsError } = await supabase
      .from('gacha_user_stats')
      .select('*')
      .order('total_6star', { ascending: false })
      .limit(10);

    results.userStats = userStats;
    results.userStatsError = userStatsError;

    const { count: totalUsers } = await supabase
      .from('gacha_user_stats')
      .select('*', { count: 'exact', head: true });

    results.totalUsers = totalUsers;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      currentWeekStart,
      results
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
