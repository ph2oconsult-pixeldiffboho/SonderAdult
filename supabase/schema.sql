-- ─────────────────────────────────────────────
-- SONDER ADULT — SUPABASE SCHEMA v2
-- Run this ONCE in Supabase SQL Editor
-- Safe to re-run (drops and recreates)
-- ─────────────────────────────────────────────

-- ── CLEAN SLATE ──
drop view if exists user_progress;
drop table if exists sessions;
drop table if exists user_state;

-- ── USER STATE ──
create table user_state (
  user_id text primary key,
  current_sequence text not null default 'overthinking',
  current_day integer not null default 1 check (current_day between 1 and 7),
  sequence_started_at timestamptz default now(),
  last_completed_at timestamptz,
  sequences_completed text[] default '{}'::text[],
  pending_transition boolean not null default false,
  last_notification_at timestamptz,
  last_transition_declined_at timestamptz,
  created_at timestamptz default now()
);

-- ── SESSION LOG ──
create table sessions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  sequence_id text not null,
  day_number integer not null check (day_number between 1 and 7),
  duration_ms integer not null default 0,
  completed_at timestamptz default now()
);

-- ── INDEXES ──
create index idx_sessions_user on sessions (user_id);
create index idx_sessions_time on sessions (user_id, completed_at desc);

-- ── ROW LEVEL SECURITY ──
alter table user_state enable row level security;
alter table sessions enable row level security;

create policy "Insert own state" on user_state for insert with check (true);
create policy "Read own state" on user_state for select using (true);
create policy "Update own state" on user_state for update using (true);

create policy "Insert sessions" on sessions for insert with check (true);
create policy "Read own sessions" on sessions for select using (true);

-- ── ANALYTICS VIEW ──
create or replace view user_progress as
select
  u.user_id,
  u.current_sequence,
  u.current_day,
  u.pending_transition,
  u.last_completed_at,
  array_length(u.sequences_completed, 1) as total_sequences_completed,
  count(s.id) as total_sessions,
  round(avg(s.duration_ms)) as avg_duration_ms
from user_state u
left join sessions s on s.user_id = u.user_id
group by u.user_id, u.current_sequence, u.current_day,
         u.pending_transition, u.last_completed_at, u.sequences_completed;
