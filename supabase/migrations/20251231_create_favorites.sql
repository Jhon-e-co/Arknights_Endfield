-- 1. Enable UUID extension if not exists
create extension if not exists "uuid-ossp";

-- 2. Create Saved Blueprints Table
create table if not exists public.saved_blueprints (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    blueprint_id uuid references public.blueprints(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Prevent duplicate favorites
    unique(user_id, blueprint_id)
);

-- 3. Create Saved Squads Table
create table if not exists public.saved_squads (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    squad_id uuid references public.squads(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, squad_id)
);

-- 4. Enable RLS
alter table public.saved_blueprints enable row level security;
alter table public.saved_squads enable row level security;

-- 5. RLS Policies (Private Favorites)
-- Users can only see their own favorites
create policy "Users can view own saved blueprints"
on public.saved_blueprints for select
using (auth.uid() = user_id);

create policy "Users can view own saved squads"
on public.saved_squads for select
using (auth.uid() = user_id);

-- Users can insert their own favorites
create policy "Users can save blueprints"
on public.saved_blueprints for insert
with check (auth.uid() = user_id);

create policy "Users can save squads"
on public.saved_squads for insert
with check (auth.uid() = user_id);

-- Users can delete their own favorites
create policy "Users can unsave blueprints"
on public.saved_blueprints for delete
using (auth.uid() = user_id);

create policy "Users can unsave squads"
on public.saved_squads for delete
using (auth.uid() = user_id);
