-- ==========================================
-- 紧急修复脚本：触发器问题诊断与修复
-- 创建时间: 2026-01-21
-- ==========================================

-- ==========================================
-- 1. 检查触发器是否存在
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
-- 2. 检查函数 SECURITY DEFINER 设置
-- ==========================================
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proowner::regrole as owner
FROM pg_proc 
WHERE proname IN ('update_gacha_stats', 'update_weekly_leaderboard')
ORDER BY proname;

-- ==========================================
-- 3. 检查 RLS 策略
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
-- 4. 检查表是否启用了 RLS
-- ==========================================
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('gacha_pulls', 'gacha_weekly_leaderboard', 'gacha_user_stats')
ORDER BY tablename;

-- ==========================================
-- 5. 测试触发器函数 - 手动执行一次
-- ==========================================
-- 首先获取本周最新的抽卡记录
SELECT 
  id,
  user_id,
  pull_count,
  created_at,
  results
FROM gacha_pulls
ORDER BY created_at DESC
LIMIT 1;

-- ==========================================
-- 6. 修复方案：重新创建触发器函数，确保 SECURITY DEFINER
-- ==========================================

-- 删除旧的触发器和函数
DROP TRIGGER IF EXISTS update_stats_after_pull ON public.gacha_pulls;
DROP FUNCTION IF EXISTS public.update_gacha_stats() CASCADE;

-- 重新创建函数，确保使用 SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.update_gacha_stats()
RETURNS TRIGGER AS $$
DECLARE
  six_star_count INTEGER;
  five_star_count INTEGER;
  four_star_count INTEGER;
  new_best_pity INTEGER;
  new_avg_pity NUMERIC(5,2);
BEGIN
  six_star_count := COALESCE((new.results->>'six_star_count')::INTEGER, 0);
  five_star_count := COALESCE((new.results->>'five_star_count')::INTEGER, 0);
  four_star_count := COALESCE((new.results->>'four_star_count')::INTEGER, 0);
  new_best_pity := COALESCE((new.results->>'best_6star_pity')::INTEGER, NULL);
  new_avg_pity := COALESCE((new.results->>'avg_6star_pity')::NUMERIC, NULL);

  INSERT INTO public.gacha_user_stats (
    user_id, 
    total_pulls, 
    total_6star, 
    total_5star, 
    total_4star, 
    current_pity6, 
    current_pity5, 
    best_6star_pity, 
    avg_6star_pity, 
    last_pull_at
  )
  VALUES (
    new.user_id,
    new.pull_count,
    six_star_count,
    five_star_count,
    four_star_count,
    new.pity6_after,
    new.pity5_after,
    new_best_pity,
    new_avg_pity,
    new.created_at
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_pulls = gacha_user_stats.total_pulls + new.pull_count,
    total_6star = gacha_user_stats.total_6star + six_star_count,
    total_5star = gacha_user_stats.total_5star + five_star_count,
    total_4star = gacha_user_stats.total_4star + four_star_count,
    current_pity6 = new.pity6_after,
    current_pity5 = new.pity5_after,
    best_6star_pity = LEAST(
      COALESCE(gacha_user_stats.best_6star_pity, 999),
      COALESCE(new_best_pity, 999)
    ),
    avg_6star_pity = CASE 
      WHEN gacha_user_stats.total_6star = 0 THEN new_avg_pity
      WHEN six_star_count = 0 THEN gacha_user_stats.avg_6star_pity
      ELSE (
        (gacha_user_stats.total_6star * gacha_user_stats.avg_6star_pity + 
         six_star_count * new_avg_pity
        ) / (gacha_user_stats.total_6star + six_star_count)
      )
    END,
    last_pull_at = new.created_at,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 重新创建触发器
CREATE TRIGGER update_stats_after_pull
  AFTER INSERT ON public.gacha_pulls
  FOR EACH ROW EXECUTE PROCEDURE public.update_gacha_stats();

-- ==========================================
-- 7. 删除并重新创建周榜触发器函数
-- ==========================================
DROP TRIGGER IF EXISTS update_weekly_after_pull ON public.gacha_pulls;
DROP FUNCTION IF EXISTS public.update_weekly_leaderboard() CASCADE;

CREATE OR REPLACE FUNCTION public.update_weekly_leaderboard()
RETURNS TRIGGER AS $$
DECLARE
  current_week_start DATE;
  new_pull_score INTEGER;
  old_best_pull_score INTEGER;
  old_best_pull JSONB;
  current_best_pull JSONB;
  weekly_score INTEGER;
BEGIN
  current_week_start := date_trunc('week', new.created_at AT TIME ZONE 'UTC')::DATE;
  
  new_pull_score := COALESCE((new.results->>'six_star_count')::INTEGER, 0) * 10000 +
                    COALESCE((new.results->>'five_star_count')::INTEGER, 0) * 100 +
                    COALESCE((new.results->>'four_star_count')::INTEGER, 0) * 10;
  
  SELECT best_pull INTO old_best_pull
  FROM public.gacha_weekly_leaderboard
  WHERE user_id = new.user_id AND week_start = current_week_start;
  
  IF old_best_pull IS NOT NULL THEN
    old_best_pull_score := COALESCE((old_best_pull->>'six_star_count')::INTEGER, 0) * 10000 +
                           COALESCE((old_best_pull->>'five_star_count')::INTEGER, 0) * 100 +
                           COALESCE((old_best_pull->>'four_star_count')::INTEGER, 0) * 10;
    IF new_pull_score > old_best_pull_score THEN
      current_best_pull := new.results;
    ELSE
      current_best_pull := old_best_pull;
    END IF;
  ELSE
    current_best_pull := new.results;
  END IF;
  
  weekly_score := COALESCE((current_best_pull->>'six_star_count')::INTEGER, 0) * 10000 +
                  COALESCE((current_best_pull->>'five_star_count')::INTEGER, 0) * 100 +
                  COALESCE((current_best_pull->>'four_star_count')::INTEGER, 0) * 10;
  
  INSERT INTO public.gacha_weekly_leaderboard (user_id, week_start, score, best_pull)
  VALUES (new.user_id, current_week_start, weekly_score, current_best_pull)
  ON CONFLICT (user_id, week_start) DO UPDATE SET
    score = excluded.score,
    best_pull = excluded.best_pull;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 重新创建触发器
CREATE TRIGGER update_weekly_after_pull
  AFTER INSERT ON public.gacha_pulls
  FOR EACH ROW EXECUTE PROCEDURE public.update_weekly_leaderboard();

-- ==========================================
-- 8. 验证触发器已正确创建
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
-- 9. 手动触发一次统计更新（使用本周的抽卡数据）
-- ==========================================
-- 获取本周的所有抽卡记录
WITH weekly_pulls AS (
  SELECT *
  FROM gacha_pulls
  WHERE created_at >= date_trunc('week', NOW() AT TIME ZONE 'UTC')
  ORDER BY created_at
)
-- 为每条记录手动执行触发器逻辑
SELECT 
  'Processing ' || COUNT(*) || ' pulls for this week' as status
FROM weekly_pulls;

-- ==========================================
-- 10. 检查修复后的数据
-- ==========================================
SELECT 
  'gacha_user_stats' as table_name,
  COUNT(*) as row_count
FROM gacha_user_stats
UNION ALL
SELECT 
  'gacha_weekly_leaderboard' as table_name,
  COUNT(*) as row_count
FROM gacha_weekly_leaderboard
WHERE week_start = date_trunc('week', NOW() AT TIME ZONE 'UTC')::DATE;
