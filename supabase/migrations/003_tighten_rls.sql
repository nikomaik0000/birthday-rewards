-- ============================================================
-- Migration: tighten RLS for v2 security requirements
-- Does NOT drop or alter any table/column — only replaces the
-- overly-permissive write policies from schema.sql.
--
-- Why this is needed even though app-level checks were added:
-- the NEXT_PUBLIC_SUPABASE_ANON_KEY is public, so anyone could
-- previously call supabase-js directly from the browser console
-- and write to `rewards` regardless of what the Next.js server
-- actions allow. RLS is the only real enforcement boundary.
--
-- Run this once in the Supabase SQL editor after schema.sql
-- (and after 002_reward_reports.sql).
-- ============================================================

-- ---- rewards: remove anonymous insert/update, keep anon read ----
drop policy if exists "anyone can insert a reward" on public.rewards;
drop policy if exists "anyone can update reward state" on public.rewards;

create policy "authenticated users can insert rewards" on public.rewards
  for insert with check (auth.role() = 'authenticated');

create policy "authenticated users can update rewards" on public.rewards
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---- tags / reward_tags: only admins create or (un)link tags now ----
drop policy if exists "anyone can insert tags" on public.tags;
drop policy if exists "anyone can link tags" on public.reward_tags;
drop policy if exists "anyone can unlink tags" on public.reward_tags;

create policy "authenticated users can insert tags" on public.tags
  for insert with check (auth.role() = 'authenticated');

create policy "authenticated users can link tags" on public.reward_tags
  for insert with check (auth.role() = 'authenticated');

create policy "authenticated users can unlink tags" on public.reward_tags
  for delete using (auth.role() = 'authenticated');

-- ---- favorites: the ONE write general visitors keep ----
-- A narrow SECURITY DEFINER function that can only ever touch the
-- is_favorite column, so we don't need to reopen a broad anon
-- UPDATE policy on `rewards` just for this one feature.
create or replace function public.toggle_reward_favorite(reward_id uuid, favorite boolean)
returns void as $$
begin
  update public.rewards set is_favorite = favorite where id = reward_id;
end;
$$ language plpgsql security definer;

-- increment_click() from schema.sql is already SECURITY DEFINER and
-- column-scoped, so click tracking stays public with no change needed.
