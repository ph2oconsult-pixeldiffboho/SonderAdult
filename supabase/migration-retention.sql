-- ─────────────────────────────────────────────
-- SONDER ADULT — MIGRATION: Retention Fields
-- Run in Supabase SQL Editor
-- ADDITIVE ONLY — safe to run multiple times
-- ─────────────────────────────────────────────

-- Add last_seen_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_state' AND column_name = 'last_seen_at'
  ) THEN
    ALTER TABLE user_state ADD COLUMN last_seen_at timestamptz;
  END IF;
END $$;

-- Drop existing view first (column order changed)
DROP VIEW IF EXISTS user_progress;

-- Recreate analytics view with all fields
CREATE OR REPLACE VIEW user_progress AS
SELECT
  u.user_id,
  u.current_sequence,
  u.current_day,
  u.pending_transition,
  u.last_completed_at,
  u.last_notification_at,
  u.last_transition_declined_at,
  u.last_seen_at,
  array_length(u.sequences_completed, 1) AS total_sequences_completed,
  count(s.id) AS total_sessions,
  round(avg(s.duration_ms)) AS avg_duration_ms
FROM user_state u
LEFT JOIN sessions s ON s.user_id = u.user_id
GROUP BY u.user_id, u.current_sequence, u.current_day,
         u.pending_transition, u.last_completed_at,
         u.last_notification_at, u.last_transition_declined_at,
         u.last_seen_at, u.sequences_completed;
