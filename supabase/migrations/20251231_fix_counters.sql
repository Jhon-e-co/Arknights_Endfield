-- Increment Blueprint Likes
create or replace function increment_blueprint_likes(row_id uuid)
returns void as $$
begin
  update public.blueprints
  set likes = likes + 1
  where id = row_id;
end;
$$ language plpgsql;

-- Decrement Blueprint Likes
create or replace function decrement_blueprint_likes(row_id uuid)
returns void as $$
begin
  update public.blueprints
  set likes = greatest(0, likes - 1)
  where id = row_id;
end;
$$ language plpgsql;

-- Increment Squad Likes
create or replace function increment_squad_likes(row_id uuid)
returns void as $$
begin
  update public.squads
  set likes = likes + 1
  where id = row_id;
end;
$$ language plpgsql;

-- Decrement Squad Likes
create or replace function decrement_squad_likes(row_id uuid)
returns void as $$
begin
  update public.squads
  set likes = greatest(0, likes - 1)
  where id = row_id;
end;
$$ language plpgsql;