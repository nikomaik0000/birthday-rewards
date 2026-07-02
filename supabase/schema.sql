-- ============================================================
-- 生日優惠網站 — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`)
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- rewards: the core table
-- ------------------------------------------------------------
create table if not exists public.rewards (
  id                uuid primary key default gen_random_uuid(),

  -- core fields
  store_name        text not null,
  category          text not null check (category in ('飲料','食物','美妝','其他')),
  content           text not null default '',
  date_category     text not null default '其他' check (date_category in ('月底','次月底','其他')),
  score             smallint not null default 5 check (score between 1 and 5),
  official_url      text,
  logo_url          text,

  -- state
  is_favorite       boolean not null default false,
  is_used           boolean not null default false,
  click_count       integer not null default 0,

  -- expiry reminder
  expiry_date       date,

  -- usage notes ("使用心得")
  notes             text not null default '',

  -- timestamps
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- ---- reserved / future-proof columns (PRD section 13) ----
  is_active         boolean not null default true,
  is_featured       boolean not null default false,
  reward_type       text,
  region            text,
  city              text,
  country           text,
  brand             text,
  source            text,
  last_verified_at  timestamptz,
  verified_by       text,
  ai_summary        text,
  ai_tags           text[] default '{}',
  ai_score          numeric,
  metadata          jsonb not null default '{}'::jsonb
);

create index if not exists rewards_store_name_idx on public.rewards using gin (to_tsvector('simple', store_name));
create index if not exists rewards_content_idx on public.rewards using gin (to_tsvector('simple', content));
create index if not exists rewards_notes_idx on public.rewards using gin (to_tsvector('simple', notes));
create index if not exists rewards_category_idx on public.rewards (category);
create index if not exists rewards_date_category_idx on public.rewards (date_category);
create index if not exists rewards_score_idx on public.rewards (score);
create index if not exists rewards_is_favorite_idx on public.rewards (is_favorite);
create index if not exists rewards_is_used_idx on public.rewards (is_used);
create index if not exists rewards_click_count_idx on public.rewards (click_count desc);
create index if not exists rewards_expiry_date_idx on public.rewards (expiry_date);
create index if not exists rewards_created_at_idx on public.rewards (created_at desc);
create index if not exists rewards_updated_at_idx on public.rewards (updated_at desc);

-- ------------------------------------------------------------
-- tags: free-form multi tags, low-saturation colors auto-assigned
-- ------------------------------------------------------------
create table if not exists public.tags (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  color_hex   text not null default '#E7E4DE',
  created_at  timestamptz not null default now()
);

create table if not exists public.reward_tags (
  reward_id   uuid not null references public.rewards(id) on delete cascade,
  tag_id      uuid not null references public.tags(id) on delete cascade,
  primary key (reward_id, tag_id)
);

create index if not exists reward_tags_tag_id_idx on public.reward_tags (tag_id);

-- ------------------------------------------------------------
-- favorite collections ("收藏資料夾") — many-to-many with rewards
-- ------------------------------------------------------------
create table if not exists public.collections (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references auth.users(id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.collection_rewards (
  collection_id  uuid not null references public.collections(id) on delete cascade,
  reward_id      uuid not null references public.rewards(id) on delete cascade,
  added_at       timestamptz not null default now(),
  primary key (collection_id, reward_id)
);

-- ------------------------------------------------------------
-- reward_history: "歷史更新紀錄" shown on the store detail page
-- ------------------------------------------------------------
create table if not exists public.reward_history (
  id             uuid primary key default gen_random_uuid(),
  reward_id      uuid not null references public.rewards(id) on delete cascade,
  changed_at     timestamptz not null default now(),
  changed_by     text,
  field_changed  text not null,
  old_value      text,
  new_value      text
);

create index if not exists reward_history_reward_id_idx on public.reward_history (reward_id, changed_at desc);

-- ------------------------------------------------------------
-- updated_at auto-touch trigger
-- ------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists rewards_touch_updated_at on public.rewards;
create trigger rewards_touch_updated_at
  before update on public.rewards
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- click increment helper (atomic, avoids read-then-write races)
-- ------------------------------------------------------------
create or replace function public.increment_click(reward_id uuid)
returns void as $$
begin
  update public.rewards set click_count = click_count + 1 where id = reward_id;
end;
$$ language plpgsql security definer;

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.rewards enable row level security;
alter table public.tags enable row level security;
alter table public.reward_tags enable row level security;
alter table public.collections enable row level security;
alter table public.collection_rewards enable row level security;
alter table public.reward_history enable row level security;

-- Public (anon) can read everything — this is a public deals site.
create policy "rewards are publicly readable" on public.rewards for select using (true);
create policy "tags are publicly readable" on public.tags for select using (true);
create policy "reward_tags are publicly readable" on public.reward_tags for select using (true);
create policy "reward_history is publicly readable" on public.reward_history for select using (true);

-- Public can add a new reward from the front-end ("前台新增"),
-- and toggle favorite/used + increment clicks on existing rows,
-- but cannot delete or touch other people's admin-only fields via RLS alone —
-- fine-grained field protection is additionally enforced in the server actions.
create policy "anyone can insert a reward" on public.rewards for insert with check (true);
create policy "anyone can update reward state" on public.rewards for update using (true) with check (true);

-- Tags: anyone can create a new tag when adding a reward from the front-end.
create policy "anyone can insert tags" on public.tags for insert with check (true);
create policy "anyone can link tags" on public.reward_tags for insert with check (true);
create policy "anyone can unlink tags" on public.reward_tags for delete using (true);

-- Admin-only destructive actions (delete rewards, batch operations) require auth.
create policy "authenticated users can delete rewards" on public.rewards for delete
  using (auth.role() = 'authenticated');

-- Collections are private to their owner.
create policy "owner reads own collections" on public.collections for select
  using (auth.uid() = owner_id);
create policy "owner manages own collections" on public.collections for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner manages own collection_rewards" on public.collection_rewards for all
  using (exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid()))
  with check (exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid()));

create policy "authenticated users can write history" on public.reward_history for insert
  with check (true);
