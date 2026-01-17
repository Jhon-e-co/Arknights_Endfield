-- ==========================================
-- 排行榜终极修复
-- 创建时间: 2026-01-17
-- 功能: 修复总榜无图、周榜头像重复、score为NULL问题
-- ==========================================

-- ==========================================
-- 1. 修复总榜视图 - 添加 best_pull 字段（按运气分排序）
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
       COALESCE((results->>'four_star_count')::int, 0) * 1) desc,
      created_at desc,
      id desc
    limit 1
  ) as best_pull,
  (COALESCE(gus.total_6star, 0) * 1000 + 
   case when gus.best_6star_pity is not null then (80 - gus.best_6star_pity) * 10 else 0 end
  ) as score
from public.gacha_user_stats gus
join public.profiles p on gus.user_id = p.id
where gus.total_pulls >= 10
order by score desc;

-- ==========================================
-- 2. 修复周榜触发器 - 确保 best_pull 正确更新，并修复 score 为 NULL 问题
-- ==========================================
drop function if exists public.update_weekly_leaderboard() cascade;

create or replace function public.update_weekly_leaderboard()
returns trigger as $$
declare
  current_week_start date;
  current_score integer;
  new_pull_luck integer;
  old_pull_luck integer;
  old_best_pull jsonb;
  user_stats_6star integer;
  user_stats_best_pity integer;
begin
  current_week_start := date_trunc('week', new.created_at)::date;
  
  select 
    COALESCE(total_6star, 0),
    COALESCE(best_6star_pity, 0)
  into user_stats_6star, user_stats_best_pity
  from public.gacha_user_stats
  where user_id = new.user_id;
  
  current_score := user_stats_6star * 1000 + 
    case when user_stats_best_pity > 0 then (80 - user_stats_best_pity) * 10 else 0 end;
  
  new_pull_luck := COALESCE((new.results->>'six_star_count')::int, 0) * 10000 +
                   COALESCE((new.results->>'five_star_count')::int, 0) * 100 +
                   COALESCE((new.results->>'four_star_count')::int, 0) * 1;
  
  select best_pull into old_best_pull
  from public.gacha_weekly_leaderboard
  where user_id = new.user_id and week_start = current_week_start;
  
  if old_best_pull is not null then
    old_pull_luck := COALESCE((old_best_pull->>'six_star_count')::int, 0) * 10000 +
                     COALESCE((old_best_pull->>'five_star_count')::int, 0) * 100 +
                     COALESCE((old_best_pull->>'four_star_count')::int, 0) * 1;
  else
    old_pull_luck := -1;
  end if;
  
  insert into public.gacha_weekly_leaderboard (user_id, week_start, score, best_pull)
  values (new.user_id, current_week_start, current_score, new.results)
  on conflict (user_id, week_start) do update set
    score = excluded.score,
    best_pull = case 
      when new_pull_luck > old_pull_luck then excluded.best_pull
      else gacha_weekly_leaderboard.best_pull
    end;
  
  return new;
end;
$$ language plpgsql security definer;

-- ==========================================
-- 3. 重新创建触发器
-- ==========================================
drop trigger if exists update_weekly_after_pull on public.gacha_pulls;
create trigger update_weekly_after_pull
  after insert on public.gacha_pulls
  for each row execute procedure public.update_weekly_leaderboard();

-- ==========================================
-- 4. 验证视图是否正确创建
-- ==========================================
-- 检查视图是否包含 best_pull 字段
select column_name, data_type 
from information_schema.columns 
where table_name = 'gacha_alltime_leaderboard' 
and column_name = 'best_pull';

-- ==========================================
-- 5. 可选：清空周榜数据（如果需要重新生成）
-- ==========================================
-- TRUNCATE TABLE public.gacha_weekly_leaderboard;
