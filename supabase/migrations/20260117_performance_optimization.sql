-- ==========================================
-- 性能优化索引补丁
-- 创建时间: 2026-01-17
-- 功能: 优化排行榜查询性能，解决卡顿问题
-- ==========================================

-- 1. 为 gacha_pulls 添加复合索引（优化 best_pull 子查询）
-- 这个索引将大幅提升总榜视图的查询性能
create index if not exists idx_gacha_pulls_user_created 
  on public.gacha_pulls(user_id, created_at desc);

-- 2. 为 gacha_user_stats 添加覆盖索引（优化总榜排序）
-- 这个索引包含所有查询字段，避免回表查询
create index if not exists idx_gacha_user_stats_leaderboard 
  on public.gacha_user_stats(total_pulls, total_6star, best_6star_pity)
  where total_pulls >= 10;

-- 3. 为 gacha_weekly_leaderboard 添加 rank 索引（优化排名查询）
-- 虽然已有 (week_start desc, score desc)，但添加 rank 索引可以加速特定排名查询
create index if not exists idx_gacha_weekly_leaderboard_rank 
  on public.gacha_weekly_leaderboard(week_start, rank);

-- 4. 为 profiles 表添加索引（优化用户信息关联查询）
create index if not exists idx_profiles_username 
  on public.profiles(username);

-- 5. 分析表以更新统计信息（优化查询计划）
analyze public.gacha_pulls;
analyze public.gacha_user_stats;
analyze public.gacha_weekly_leaderboard;
analyze public.profiles;
