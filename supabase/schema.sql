-- ==========================================
-- 1. 初始化与扩展
-- ==========================================
-- 启用 UUID 扩展
create extension if not exists "uuid-ossp";

-- ==========================================
-- 2. 公共存储桶 (Storage)
-- ==========================================
-- 注意：需要在 Supabase Dashboard -> Storage 手动创建 'blueprints' 和 'avatars' 桶
-- 这里仅设置 RLS 策略 (假设桶已创建)

-- ==========================================
-- 3. 用户与档案 (Profiles)
-- ==========================================
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  username text,
  avatar_url text default '/images/avatars/Endministrator.webp',
  bio text default 'Endfield Engineer',
  blueprints_created integer default 0,
  total_likes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: 所有人可读，仅自己可改
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- ==========================================
-- 4. 角色与攻略 (Characters & Guides)
-- ==========================================
create table public.characters (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  rarity integer not null,
  element text not null,
  role text[],
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.character_guides (
  id uuid default uuid_generate_v4() primary key,
  character_id uuid references public.characters(id) not null,
  overview_text text,
  skill_priority jsonb,
  equipment_recommendations jsonb,
  team_comps jsonb,
  author_id uuid references public.profiles(id),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: 所有人可读，登录用户可创建/更新
alter table public.characters enable row level security;
create policy "Characters are viewable by everyone." on public.characters for select using (true);

alter table public.character_guides enable row level security;
create policy "Character guides are viewable by everyone." on public.character_guides for select using (true);
create policy "Authenticated users can create guides." on public.character_guides for insert with check (auth.role() = 'authenticated');
create policy "Users can update own guides." on public.character_guides for update using (auth.uid() = author_id);

-- ==========================================
-- 5. 蓝图系统 (Blueprints)
-- ==========================================
create table public.blueprints (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  image_url text not null,
  code text not null,
  tags text[],
  author_id uuid references public.profiles(id) not null,
  likes integer default 0,
  downloads integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: 所有人可读，登录用户可传
alter table public.blueprints enable row level security;
create policy "Blueprints are viewable by everyone." on public.blueprints for select using (true);
create policy "Authenticated users can create blueprints." on public.blueprints for insert with check (auth.role() = 'authenticated');
create policy "Users can update own blueprints." on public.blueprints for update using (auth.uid() = author_id);
create policy "Users can delete own blueprints." on public.blueprints for delete using (auth.uid() = author_id);

-- ==========================================
-- 6. 配队系统 (Squads)
-- ==========================================
create table public.squads (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  author_id uuid references public.profiles(id) not null,
  members uuid[],
  likes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: 所有人可读，登录用户可创建/更新/删除
alter table public.squads enable row level security;
create policy "Squads are viewable by everyone." on public.squads for select using (true);
create policy "Authenticated users can create squads." on public.squads for insert with check (auth.role() = 'authenticated');
create policy "Users can update own squads." on public.squads for update using (auth.uid() = author_id);
create policy "Users can delete own squads." on public.squads for delete using (auth.uid() = author_id);

-- ==========================================
-- 7. 自动化触发器 (Triggers)
-- ==========================================
-- 当新用户注册时，自动创建 Profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', '/images/avatars/Endministrator.webp')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 自动更新 updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_character_guides_updated_at
  before update on public.character_guides
  for each row execute procedure public.update_updated_at();
