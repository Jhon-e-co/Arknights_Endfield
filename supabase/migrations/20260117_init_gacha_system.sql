-- ==========================================
-- 抽卡系统数据库迁移
-- 创建时间: 2026-01-17
-- 功能: 数据持久化、用户统计、排行榜
-- ==========================================

-- ==========================================
-- 1. 抽卡历史记录表
-- ==========================================
create table if not exists public.gacha_pulls (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  pull_count integer not null,
  results jsonb not null,
  pity6_before integer not null,
  pity5_before integer not null,
  pity6_after integer not null,
  pity5_after integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 索引优化
create index if not exists idx_gacha_pulls_user_id on public.gacha_pulls(user_id);
create index if not exists idx_gacha_pulls_created_at on public.gacha_pulls(created_at desc);

-- RLS 策略
alter table public.gacha_pulls enable row level security;

create policy "Users can view own pulls" 
on public.gacha_pulls for select 
using (auth.uid() = user_id);

create policy "Users can insert own pulls" 
on public.gacha_pulls for insert 
with check (auth.uid() = user_id);

-- ==========================================
-- 2. 用户抽卡统计表
-- ==========================================
create table if not exists public.gacha_user_stats (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  total_pulls integer default 0,
  total_6star integer default 0,
  total_5star integer default 0,
  total_4star integer default 0,
  current_pity6 integer default 0,
  current_pity5 integer default 0,
  best_6star_pity integer,
  avg_6star_pity numeric(5,2),
  last_pull_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 索引优化
create index if not exists idx_gacha_user_stats_score on public.gacha_user_stats(
  (total_6star * 1000 + 
   case when best_6star_pity is not null then (80 - best_6star_pity) * 10 else 0 end
  ) desc
);

-- RLS 策略
alter table public.gacha_user_stats enable row level security;

create policy "Users can view own stats" 
on public.gacha_user_stats for select 
using (auth.uid() = user_id);

create policy "Users can insert own stats" 
on public.gacha_user_stats for insert 
with check (auth.uid() = user_id);

create policy "Users can update own stats" 
on public.gacha_user_stats for update 
using (auth.uid() = user_id);

-- ==========================================
-- 3. 欧皇周榜表
-- ==========================================
create table if not exists public.gacha_weekly_leaderboard (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  week_start date not null,
  score integer not null,
  best_pull jsonb,
  rank integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, week_start)
);

-- 索引优化
create index if not exists idx_gacha_weekly_leaderboard_week on public.gacha_weekly_leaderboard(week_start desc, score desc);

-- RLS 策略
alter table public.gacha_weekly_leaderboard enable row level security;

create policy "Weekly leaderboard is public" 
on public.gacha_weekly_leaderboard for select 
using (true);

-- ==========================================
-- 4. 欧皇总榜视图
-- ==========================================
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
  (gus.total_6star * 1000 + 
   case when gus.best_6star_pity is not null then (80 - gus.best_6star_pity) * 10 else 0 end
  ) as score
from public.gacha_user_stats gus
join public.profiles p on gus.user_id = p.id
where gus.total_pulls >= 10
order by score desc;

-- ==========================================
-- 5. 自动更新统计表触发器函数
-- ==========================================
create or replace function public.update_gacha_stats()
returns trigger as $$
declare
  six_star_count integer;
  five_star_count integer;
  four_star_count integer;
  new_best_pity integer;
  new_avg_pity numeric(5,2);
  total_6star_after integer;
begin
  six_star_count := (new.results->>'6star_count')::integer;
  five_star_count := (new.results->>'5star_count')::integer;
  four_star_count := (new.results->>'4star_count')::integer;
  new_best_pity := (new.results->>'best_6star_pity')::integer;
  new_avg_pity := (new.results->>'avg_6star_pity')::numeric;

  insert into public.gacha_user_stats (user_id, total_pulls, total_6star, total_5star, total_4star, current_pity6, current_pity5, best_6star_pity, avg_6star_pity, last_pull_at)
  values (
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
  on conflict (user_id) do update set
    total_pulls = gacha_user_stats.total_pulls + new.pull_count,
    total_6star = gacha_user_stats.total_6star + six_star_count,
    total_5star = gacha_user_stats.total_5star + five_star_count,
    total_4star = gacha_user_stats.total_4star + four_star_count,
    current_pity6 = new.pity6_after,
    current_pity5 = new.pity5_after,
    best_6star_pity = least(
      coalesce(gacha_user_stats.best_6star_pity, 999),
      coalesce(new_best_pity, 999)
    ),
    avg_6star_pity = case 
      when gacha_user_stats.total_6star = 0 then new_avg_pity
      when six_star_count = 0 then gacha_user_stats.avg_6star_pity
      else (
        (gacha_user_stats.total_6star * gacha_user_stats.avg_6star_pity + 
         six_star_count * new_avg_pity
        ) / (gacha_user_stats.total_6star + six_star_count)
      )
    end,
    last_pull_at = new.created_at,
    updated_at = now();
  
  return new;
end;
$$ language plpgsql security definer;

-- 创建触发器
drop trigger if exists update_stats_after_pull on public.gacha_pulls;
create trigger update_stats_after_pull
  after insert on public.gacha_pulls
  for each row execute procedure public.update_gacha_stats();

-- ==========================================
-- 6. 自动更新周榜触发器函数
-- ==========================================
create or replace function public.update_weekly_leaderboard()
returns trigger as $$
declare
  current_week_start date;
  current_score integer;
  best_pull_jsonb jsonb;
  current_rank integer;
begin
  current_week_start := date_trunc('week', new.created_at)::date;
  
  select 
    total_6star * 1000 + 
    case when best_6star_pity is not null then (80 - best_6star_pity) * 10 else 0 end,
    new.results
  into current_score, best_pull_jsonb
  from public.gacha_user_stats
  where user_id = new.user_id;
  
  insert into public.gacha_weekly_leaderboard (user_id, week_start, score, best_pull)
  values (new.user_id, current_week_start, current_score, best_pull_jsonb)
  on conflict (user_id, week_start) do update set
    score = excluded.score,
    best_pull = case 
      when excluded.score > gacha_weekly_leaderboard.score then excluded.best_pull
      else gacha_weekly_leaderboard.best_pull
    end;
  
  return new;
end;
$$ language plpgsql security definer;

-- 创建触发器
drop trigger if exists update_weekly_after_pull on public.gacha_pulls;
create trigger update_weekly_after_pull
  after insert on public.gacha_pulls
  for each row execute procedure public.update_weekly_leaderboard();

-- ==========================================
-- 7. 自动更新周榜排名的函数
-- ==========================================
create or replace function public.update_weekly_ranks()
returns void as $$
begin
  with ranked_entries as (
    select 
      id,
      rank() over (partition by week_start order by score desc) as new_rank
    from public.gacha_weekly_leaderboard
  )
  update public.gacha_weekly_leaderboard w
  set rank = r.new_rank
  from ranked_entries r
  where w.id = r.id;
end;
$$ language plpgsql;

-- ==========================================
-- 8. 创建定期更新周榜排名的函数（可选）
-- ==========================================
-- 注意：需要在 Supabase Dashboard 中创建 pg_cron 扩展并设置定时任务
-- create extension if not exists pg_cron;
-- 
-- select cron.schedule(
--   'update-weekly-ranks',
--   '0 * * * *',
--   $$select public.update_weekly_ranks();$$
-- );
