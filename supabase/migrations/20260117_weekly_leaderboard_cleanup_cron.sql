-- ==========================================
-- 周榜定时清理任务
-- 创建时间: 2026-01-17
-- 功能: 每周一自动清理旧周榜数据
-- ==========================================

-- 注意：需要在 Supabase Dashboard 中启用 pg_cron 扩展
-- 执行以下命令启用扩展：
-- create extension if not exists pg_cron;

-- 创建定时任务：每周一 UTC 00:00（美国东部时间周日 19:00）清理旧周榜
-- select cron.schedule(
--   'cleanup-weekly-leaderboard',
--   '0 0 * * 1',
--   $$select public.cleanup_old_weekly_leaderboard();$$
-- );

-- 查看定时任务状态
-- select * from cron.job;
