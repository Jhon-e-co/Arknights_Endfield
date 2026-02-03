-- [Fix & Backfill] Rebuild Leaderboard and User Stats
-- Created: 2026-01-21
-- Purpose: Fix broken triggers and backfill missing data from gacha_pulls

BEGIN;

-- 1. CLEANUP: Remove broken triggers and functions
DROP TRIGGER IF EXISTS update_stats_after_pull ON public.gacha_pulls;
DROP FUNCTION IF EXISTS public.update_gacha_stats() CASCADE;
DROP TRIGGER IF EXISTS update_weekly_after_pull ON public.gacha_pulls;
DROP FUNCTION IF EXISTS public.update_weekly_leaderboard() CASCADE;

-- 2. FIX: Recreate user stats function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.update_gacha_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  six_star_count INTEGER;
  five_star_count INTEGER;
  four_star_count INTEGER;
  new_best_pity INTEGER;
  new_avg_pity NUMERIC(5,2);
BEGIN
  six_star_count := COALESCE((NEW.results->>'six_star_count')::INTEGER, 0);
  five_star_count := COALESCE((NEW.results->>'five_star_count')::INTEGER, 0);
  four_star_count := COALESCE((NEW.results->>'four_star_count')::INTEGER, 0);
  new_best_pity := COALESCE((NEW.results->>'best_6star_pity')::INTEGER, NULL);
  new_avg_pity := COALESCE((NEW.results->>'avg_6star_pity')::NUMERIC, NULL);

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
    NEW.user_id,
    NEW.pull_count,
    six_star_count,
    five_star_count,
    four_star_count,
    NEW.pity6_after,
    NEW.pity5_after,
    new_best_pity,
    new_avg_pity,
    NEW.created_at
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_pulls = gacha_user_stats.total_pulls + NEW.pull_count,
    total_6star = gacha_user_stats.total_6star + six_star_count,
    total_5star = gacha_user_stats.total_5star + five_star_count,
    total_4star = gacha_user_stats.total_4star + four_star_count,
    current_pity6 = NEW.pity6_after,
    current_pity5 = NEW.pity5_after,
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
    last_pull_at = NEW.created_at,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- 3. RESTORE: Re-attach user stats trigger
CREATE TRIGGER update_stats_after_pull
  AFTER INSERT ON public.gacha_pulls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_gacha_stats();

-- 4. FIX: Recreate weekly leaderboard function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.update_weekly_leaderboard()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_week_start DATE;
  new_pull_score INTEGER;
  old_best_pull_score INTEGER;
  old_best_pull JSONB;
  current_best_pull JSONB;
  weekly_score INTEGER;
BEGIN
  current_week_start := date_trunc('week', NEW.created_at AT TIME ZONE 'UTC')::DATE;

  new_pull_score := COALESCE((NEW.results->>'six_star_count')::INTEGER, 0) * 10000 +
                    COALESCE((NEW.results->>'five_star_count')::INTEGER, 0) * 100 +
                    COALESCE((NEW.results->>'four_star_count')::INTEGER, 0) * 10;

  SELECT best_pull INTO old_best_pull
  FROM public.gacha_weekly_leaderboard
  WHERE user_id = NEW.user_id AND week_start = current_week_start;

  IF old_best_pull IS NOT NULL THEN
    old_best_pull_score := COALESCE((old_best_pull->>'six_star_count')::INTEGER, 0) * 10000 +
                           COALESCE((old_best_pull->>'five_star_count')::INTEGER, 0) * 100 +
                           COALESCE((old_best_pull->>'four_star_count')::INTEGER, 0) * 10;
    IF new_pull_score > old_best_pull_score THEN
      current_best_pull := NEW.results;
    ELSE
      current_best_pull := old_best_pull;
    END IF;
  ELSE
    current_best_pull := NEW.results;
  END IF;

  weekly_score := COALESCE((current_best_pull->>'six_star_count')::INTEGER, 0) * 10000 +
                  COALESCE((current_best_pull->>'five_star_count')::INTEGER, 0) * 100 +
                  COALESCE((current_best_pull->>'four_star_count')::INTEGER, 0) * 10;

  INSERT INTO public.gacha_weekly_leaderboard (user_id, week_start, score, best_pull)
  VALUES (NEW.user_id, current_week_start, weekly_score, current_best_pull)
  ON CONFLICT (user_id, week_start) DO UPDATE SET
    score = EXCLUDED.score,
    best_pull = EXCLUDED.best_pull;

  RETURN NEW;
END;
$$;

-- 5. RESTORE: Re-attach weekly leaderboard trigger
CREATE TRIGGER update_weekly_after_pull
  AFTER INSERT ON public.gacha_pulls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_weekly_leaderboard();

-- 6. BACKFILL: Rebuild User Stats from history
TRUNCATE TABLE public.gacha_user_stats;

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
SELECT
  user_id,
  SUM(pull_count) as total_pulls,
  SUM(COALESCE((results->>'six_star_count')::INTEGER, 0)) as total_6star,
  SUM(COALESCE((results->>'five_star_count')::INTEGER, 0)) as total_5star,
  SUM(COALESCE((results->>'four_star_count')::INTEGER, 0)) as total_4star,
  (SELECT pity6_after FROM public.gacha_pulls WHERE user_id = gp.user_id ORDER BY created_at DESC LIMIT 1) as current_pity6,
  (SELECT pity5_after FROM public.gacha_pulls WHERE user_id = gp.user_id ORDER BY created_at DESC LIMIT 1) as current_pity5,
  MIN(COALESCE((results->>'best_6star_pity')::INTEGER, 999)) as best_6star_pity,
  AVG(COALESCE((results->>'avg_6star_pity')::NUMERIC, 0)) as avg_6star_pity,
  MAX(created_at) as last_pull_at
FROM public.gacha_pulls gp
GROUP BY user_id;

-- 7. BACKFILL: Rebuild Weekly Leaderboard from history
TRUNCATE TABLE public.gacha_weekly_leaderboard;

INSERT INTO public.gacha_weekly_leaderboard (user_id, week_start, score, best_pull)
WITH weekly_pulls AS (
  SELECT
    user_id,
    date_trunc('week', created_at AT TIME ZONE 'UTC')::DATE as week_start,
    results,
    COALESCE((results->>'six_star_count')::INTEGER, 0) * 10000 +
    COALESCE((results->>'five_star_count')::INTEGER, 0) * 100 +
    COALESCE((results->>'four_star_count')::INTEGER, 0) * 10 as pull_score
  FROM public.gacha_pulls
),
ranked_pulls AS (
  SELECT
    user_id,
    week_start,
    results,
    pull_score,
    ROW_NUMBER() OVER (PARTITION BY user_id, week_start ORDER BY pull_score DESC) as rn
  FROM weekly_pulls
)
SELECT
  user_id,
  week_start,
  pull_score as score,
  results as best_pull
FROM ranked_pulls
WHERE rn = 1
ON CONFLICT (user_id, week_start) DO NOTHING;

-- 8. VERIFICATION: Check the results
SELECT
  'gacha_user_stats' as table_name,
  COUNT(*) as row_count
FROM public.gacha_user_stats
UNION ALL
SELECT
  'gacha_weekly_leaderboard' as table_name,
  COUNT(*) as row_count
FROM public.gacha_weekly_leaderboard
WHERE week_start = date_trunc('week', NOW() AT TIME ZONE 'UTC')::DATE;

COMMIT;
