-- ==========================================
-- 数据库深度诊断脚本
-- 创建时间: 2026-01-21
-- 功能: 检查触发器、数据、RLS 权限
-- ==========================================

-- ==========================================
-- 1. 检查触发器是否存在及状态
-- ==========================================
SELECT 
  trigger_name, 
  action_statement, 
  action_orientation, 
  action_timing,
  event_manipulation
FROM information_schema.triggers 
WHERE event_object_table = 'gacha_pulls'
ORDER BY trigger_name;

-- ==========================================
-- 2. 检查本周是否有抽卡数据 (UTC)
-- ==========================================
SELECT 
  count(*) as recent_pulls_count,
  min(created_at) as earliest_pull,
  max(created_at) as latest_pull,
  count(distinct user_id) as unique_users
FROM gacha_pulls 
WHERE created_at >= date_trunc('week', now() at time zone 'UTC');

-- ==========================================
-- 3. 检查周榜目前有多少条数据
-- ==========================================
SELECT 
  count(*) as leaderboard_count,
  count(distinct week_start) as weeks_count,
  min(week_start) as earliest_week,
  max(week_start) as latest_week,
  min(score) as min_score,
  max(score) as max_score
FROM gacha_weekly_leaderboard;

-- ==========================================
-- 4. 检查本周周榜数据
-- ==========================================
SELECT 
  week_start,
  count(*) as entries_count,
  min(score) as min_score,
  max(score) as max_score
FROM gacha_weekly_leaderboard
WHERE week_start = date_trunc('week', now() at time zone 'UTC')::date
GROUP BY week_start;

-- ==========================================
-- 5. 检查 RLS 策略配置
-- ==========================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('gacha_pulls', 'gacha_weekly_leaderboard', 'gacha_user_stats')
ORDER BY tablename, policyname;

-- ==========================================
-- 6. 检查函数 SECURITY DEFINER 设置
-- ==========================================
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proowner::regrole as owner
FROM pg_proc 
WHERE proname IN ('update_gacha_stats', 'update_weekly_leaderboard', 'update_weekly_ranks', 'cleanup_old_weekly_leaderboard')
ORDER BY proname;

-- ==========================================
-- 7. 检查本周抽卡记录详情（最新10条）
-- ==========================================
SELECT 
  gp.id,
  gp.user_id,
  gp.pull_count,
  gp.created_at,
  gp.results->>'six_star_count' as six_star_count,
  gp.results->>'five_star_count' as five_star_count,
  gp.results->>'four_star_count' as four_star_count
FROM gacha_pulls gp
WHERE gp.created_at >= date_trunc('week', now() at time zone 'UTC')
ORDER BY gp.created_at DESC
LIMIT 10;

-- ==========================================
-- 8. 检查用户统计表数据
-- ==========================================
SELECT 
  count(*) as total_users,
  sum(total_pulls) as total_pulls_all,
  sum(total_6star) as total_6star_all,
  sum(total_5star) as total_5star_all,
  sum(total_4star) as total_4star_all,
  count(*) filter (where last_pull_at >= date_trunc('week', now() at time zone 'UTC')) as active_users_this_week
FROM gacha_user_stats;

-- ==========================================
-- 9. 检查触发器函数定义
-- ==========================================
SELECT 
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN ('update_gacha_stats', 'update_weekly_leaderboard')
ORDER BY p.proname;
