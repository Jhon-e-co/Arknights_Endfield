-- ==========================================
-- 抽卡系统计分公式与时区统一修复
-- 创建时间: 2026-01-21
-- 功能: 
--   1. 统一使用 UTC 时区
--   2. 重写计分公式，提高 6 星权重
--   3. 修复 Best Pull 选择逻辑
-- ==========================================

-- ==========================================
-- 1. 重写周榜触发器函数 - 统一 UTC 时区 + 新计分公式
-- ==========================================
drop function if exists public.update_weekly_leaderboard() cascade;

create or replace function public.update_weekly_leaderboard()
returns trigger as $$
declare
  current_week_start date;
  new_pull_score integer;
  old_best_pull_score integer;
  old_best_pull jsonb;
  current_best_pull jsonb;
  weekly_score integer;
begin
  current_week_start := date_trunc('week', new.created_at at time zone 'UTC')::date;
  
  new_pull_score := COALESCE((new.results->>'six_star_count')::int, 0) * 10000 +
                    COALESCE((new.results->>'five_star_count')::int, 0) * 100 +
                    COALESCE((new.results->>'four_star_count')::int, 0) * 10;
  
  select best_pull into old_best_pull
  from public.gacha_weekly_leaderboard
  where user_id = new.user_id and week_start = current_week_start;
  
  if old_best_pull is not null then
    old_best_pull_score := COALESCE((old_best_pull->>'six_star_count')::int, 0) * 10000 +
                           COALESCE((old_best_pull->>'five_star_count')::int, 0) * 100 +
                           COALESCE((old_best_pull->>'four_star_count')::int, 0) * 10;
    if new_pull_score > old_best_pull_score then
      current_best_pull := new.results;
    else
      current_best_pull := old_best_pull;
    end if;
  else
    current_best_pull := new.results;
  end if;
  
  weekly_score := COALESCE((current_best_pull->>'six_star_count')::int, 0) * 10000 +
                  COALESCE((current_best_pull->>'five_star_count')::int, 0) * 100 +
                  COALESCE((current_best_pull->>'four_star_count')::int, 0) * 10;
  
  insert into public.gacha_weekly_leaderboard (user_id, week_start, score, best_pull)
  values (new.user_id, current_week_start, weekly_score, current_best_pull)
  on conflict (user_id, week_start) do update set
    score = excluded.score,
    best_pull = excluded.best_pull;
  
  return new;
end;
$$ language plpgsql security definer;

-- ==========================================
-- 2. 重新创建触发器
-- ==========================================
drop trigger if exists update_weekly_after_pull on public.gacha_pulls;
create trigger update_weekly_after_pull
  after insert on public.gacha_pulls
  for each row execute procedure public.update_weekly_leaderboard();

-- ==========================================
-- 3. 更新总榜视图 - 使用新的计分公式
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
  (COALESCE(gus.total_6star, 0) * 10000 + 
   case when gus.best_6star_pity is not null and gus.best_6star_pity <= 80 
        then (80 - gus.best_6star_pity) 
        else 0 
   end
  ) as score
from public.gacha_user_stats gus
join public.profiles p on gus.user_id = p.id
where gus.total_pulls >= 10
order by score desc;

-- ==========================================
-- 4. 更新清理旧周榜数据的函数 - 使用 UTC 时区
-- ==========================================
drop function if exists public.cleanup_old_weekly_leaderboard() cascade;

create or replace function public.cleanup_old_weekly_leaderboard()
returns void as $$
declare
  current_week_start date;
begin
  current_week_start := date_trunc('week', now() at time zone 'UTC')::date;
  
  delete from public.gacha_weekly_leaderboard
  where week_start < current_week_start;
end;
$$ language plpgsql security definer;

-- ==========================================
-- 5. 清空周榜数据（重新生成以应用新计分公式）
-- ==========================================
TRUNCATE TABLE public.gacha_weekly_leaderboard;

-- ==========================================
-- 6. 分析表以更新统计信息
-- ==========================================
analyze public.gacha_weekly_leaderboard;
analyze public.gacha_pulls;
analyze public.gacha_user_stats;
