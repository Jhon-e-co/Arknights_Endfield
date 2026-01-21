-- ==========================================
-- 修复总榜计分逻辑 - 基于 Best Pull 单次抽卡结果
-- 创建时间: 2026-01-21
-- 功能: 
--   1. 修改总榜视图的计分公式，使其基于 best_pull 的单次抽卡结果
--   2. 与周榜计分逻辑保持一致
-- ==========================================

-- ==========================================
-- 1. 重新创建总榜视图 - 基于 Best Pull 的单次抽卡结果计分
-- ==========================================
drop view if exists public.gacha_alltime_leaderboard;

create or replace view public.gacha_alltime_leaderboard as
select 
  gus.user_id,
  p.username,
  p.avatar_url,
  gus.total_pulls,
  gus.total_6star,
  gus.total_5star,
  gus.total_4star,
  gus.best_6star_pity,
  gus.avg_6star_pity,
  gus.last_pull_at,
  (
    select results
    from public.gacha_pulls
    where user_id = gus.user_id
    order by 
      (COALESCE((results->>'six_star_count')::int, 0) * 10000 +
       COALESCE((results->>'five_star_count')::int, 0) * 100 +
       COALESCE((results->>'four_star_count')::int, 0) * 10) desc,
      created_at desc,
      id desc
    limit 1
  ) as best_pull,
  (
    select 
      COALESCE((results->>'six_star_count')::int, 0) * 10000 +
      COALESCE((results->>'five_star_count')::int, 0) * 100 +
      COALESCE((results->>'four_star_count')::int, 0) * 10
    from public.gacha_pulls
    where user_id = gus.user_id
    order by 
      (COALESCE((results->>'six_star_count')::int, 0) * 10000 +
       COALESCE((results->>'five_star_count')::int, 0) * 100 +
       COALESCE((results->>'four_star_count')::int, 0) * 10) desc,
      created_at desc,
      id desc
    limit 1
  ) as score
from public.gacha_user_stats gus
join public.profiles p on gus.user_id = p.id
where gus.total_pulls >= 10
order by score desc;

-- ==========================================
-- 2. 分析表以更新统计信息
-- ==========================================
analyze public.gacha_alltime_leaderboard;
analyze public.gacha_pulls;
analyze public.gacha_user_stats;
