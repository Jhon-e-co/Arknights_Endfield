-- ==========================================
-- 数据库清洗 - 清空排行榜数据
-- 创建时间: 2026-01-17
-- 功能: 清空周榜和抽卡记录，重新开始
-- ==========================================

-- ==========================================
-- 1. 清空周榜数据
-- ==========================================
TRUNCATE TABLE public.gacha_weekly_leaderboard CASCADE;

-- ==========================================
-- 2. 清空抽卡记录（会触发 CASCADE 清空相关依赖）
-- ==========================================
TRUNCATE TABLE public.gacha_pulls CASCADE;

-- ==========================================
-- 3. 清空用户统计数据
-- ==========================================
TRUNCATE TABLE public.gacha_user_stats CASCADE;

-- ==========================================
-- 4. 验证清空结果
-- ==========================================
SELECT 
  'gacha_weekly_leaderboard' as table_name,
  COUNT(*) as row_count
FROM public.gacha_weekly_leaderboard

UNION ALL

SELECT 
  'gacha_pulls' as table_name,
  COUNT(*) as row_count
FROM public.gacha_pulls

UNION ALL

SELECT 
  'gacha_user_stats' as table_name,
  COUNT(*) as row_count
FROM public.gacha_user_stats;

-- ==========================================
-- 5. 检查视图是否正常
-- ==========================================
SELECT * FROM public.gacha_alltime_leaderboard LIMIT 5;

-- ==========================================
-- 执行完成提示
-- ==========================================
-- 所有数据已清空，请重新抽卡以生成新的排行榜数据
