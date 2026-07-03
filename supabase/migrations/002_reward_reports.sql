-- ============================================================
-- Migration: reward_reports
-- Additive only — does NOT modify any existing table/column.
-- Run this once in the Supabase SQL editor after schema.sql.
-- Powers the "資料回報" (report an issue) button added in v2:
-- general visitors can no longer edit rewards directly, so this
-- table lets them flag a problem for the admin to review instead.
-- ============================================================

create table if not exists public.reward_reports (
  id           uuid primary key default gen_random_uuid(),
  reward_id    uuid not null references public.rewards(id) on delete cascade,
  message      text not null,
  contact      text,                                   -- optional email, for admin follow-up
  status       text not null default 'pending' check (status in ('pending', 'resolved')),
  created_at   timestamptz not null default now()
);

create index if not exists reward_reports_reward_id_idx on public.reward_reports (reward_id);
create index if not exists reward_reports_status_idx on public.reward_reports (status, created_at desc);

alter table public.reward_reports enable row level security;

-- Anyone can submit a report (this is the only front-end "write" left after v2).
create policy "anyone can submit a report" on public.reward_reports
  for insert with check (true);

-- Only signed-in admins can read/manage the report queue.
create policy "authenticated users can read reports" on public.reward_reports
  for select using (auth.role() = 'authenticated');

create policy "authenticated users can update reports" on public.reward_reports
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated users can delete reports" on public.reward_reports
  for delete using (auth.role() = 'authenticated');
