-- ==========================================
-- 数据库性能补丁 - 优化 Upsert 操作
-- 创建时间: 2026-01-17
-- 功能: 为 gacha_weekly_leaderboard 添加唯一索引，加速 ON CONFLICT 操作
-- ==========================================

-- 为 gacha_weekly_leaderboard 添加唯一索引
-- 这个索引是 ON CONFLICT (user_id, week_start) 的关键，必须存在
create unique index if not exists idx_gacha_weekly_upsert 
  on public.gacha_weekly_leaderboard(user_id, week_start);

-- 注意：如果表定义中已有 unique(user_id, week_start) 约束，
-- 这个索引会自动创建，但显式创建可以确保索引名称一致

-- 分析表以更新统计信息
analyze public.gacha_weekly_leaderboard;
