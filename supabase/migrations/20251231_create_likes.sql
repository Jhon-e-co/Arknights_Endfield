-- 1. Create Blueprint Likes Table
create table if not exists public.blueprint_likes (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    blueprint_id uuid references public.blueprints(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Prevent duplicate likes
    unique(user_id, blueprint_id)
);

-- 2. Create Squad Likes Table
create table if not exists public.squad_likes (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    squad_id uuid references public.squads(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, squad_id)
);

-- 3. Enable RLS
alter table public.blueprint_likes enable row level security;
alter table public.squad_likes enable row level security;

-- 4. RLS Policies
-- Everyone can see likes (to count them)
create policy "Public view blueprint likes"
on public.blueprint_likes for select
using (true);

create policy "Public view squad likes"
on public.squad_likes for select
using (true);

-- Authenticated users can insert their own likes
create policy "Users can like blueprints"
on public.blueprint_likes for insert
with check (auth.uid() = user_id);

create policy "Users can like squads"
on public.squad_likes for insert
with check (auth.uid() = user_id);

-- Authenticated users can delete their own likes
create policy "Users can unlike blueprints"
on public.blueprint_likes for delete
using (auth.uid() = user_id);

create policy "Users can unlike squads"
on public.squad_likes for delete
using (auth.uid() = user_id);
