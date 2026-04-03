import { getSupabase } from "./supabase";
import {
  SEQUENCES,
  getDayContent,
  getTransition,
  type DayContent,
  type Transition,
} from "./content";

// ─────────────────────────────────────────────
// ANONYMOUS USER ID
// ─────────────────────────────────────────────

const STORAGE_KEY = "sonder_uid";

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";
  let uid = localStorage.getItem(STORAGE_KEY);
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, uid);
  }
  return uid;
}

// ─────────────────────────────────────────────
// USER STATE
// ─────────────────────────────────────────────

export interface UserState {
  user_id: string;
  current_sequence: string;
  current_day: number;
  sequence_started_at: string;
  last_completed_at: string | null;
  sequences_completed: string[];
  pending_transition: boolean;
  last_notification_at: string | null;
  last_transition_declined_at: string | null;
  last_seen_at: string | null;
}

export async function getUserState(userId: string): Promise<UserState> {
  try {
    const { data, error } = await getSupabase()
      .from("user_state")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data && !error) {
      return {
        ...data,
        pending_transition: data.pending_transition ?? false,
        last_notification_at: data.last_notification_at ?? null,
        last_transition_declined_at: data.last_transition_declined_at ?? null,
        last_seen_at: data.last_seen_at ?? null,
      } as UserState;
    }
  } catch {
    // No state — fall through
  }

  const newState: UserState = {
    user_id: userId,
    current_sequence: SEQUENCES[0].id,
    current_day: 1,
    sequence_started_at: new Date().toISOString(),
    last_completed_at: null,
    sequences_completed: [],
    pending_transition: false,
    last_notification_at: null,
    last_transition_declined_at: null,
    last_seen_at: null,
  };

  try {
    await getSupabase().from("user_state").insert([newState]);
  } catch (e) {
    console.error("Failed to create user state:", e);
  }

  return newState;
}

// ─────────────────────────────────────────────
// WHAT TO SHOW THE USER
// ─────────────────────────────────────────────

export type UserView =
  | { type: "first_entry"; session: TodaySession }
  | { type: "reanchor"; line: string; session: TodaySession }
  | { type: "session"; session: TodaySession }
  | { type: "transition"; transition: Transition; fromSequenceId: string }
  | { type: "already_done" }
  | { type: "journey_complete" };

export interface TodaySession {
  content: DayContent;
  sequenceId: string;
  day: number;
  isLastDay: boolean;
}

/**
 * Calculate days since a given ISO timestamp.
 * Uses local timezone for day boundaries.
 */
function daysSince(isoString: string): number {
  const then = new Date(isoString);
  const now = new Date();
  // Reset to midnight local for both
  const thenDay = new Date(then.getFullYear(), then.getMonth(), then.getDate());
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((nowDay.getTime() - thenDay.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Determine what the user should see right now.
 *
 * Priority:
 * 0. If brand new user → show first entry flow then session
 * 1. If pending_transition → show transition
 * 2. If already completed today → show "come back tomorrow"
 * 3. If returning after gap (2+ days) → show reanchor then session
 * 4. Otherwise → show today's session
 */
export async function getUserView(userId: string): Promise<UserView> {
  const state = await getUserState(userId);

  // Record this visit
  recordSeen(userId);

  // 0. Brand new user — never completed anything, on Day 1, no sequences done
  const isNewUser =
    !state.last_completed_at &&
    state.current_day === 1 &&
    (!state.sequences_completed || state.sequences_completed.length === 0);

  // 1. Pending transition
  if (state.pending_transition) {
    const transition = getTransition(state.current_sequence);
    if (transition) {
      return {
        type: "transition",
        transition,
        fromSequenceId: state.current_sequence,
      };
    }
    return { type: "journey_complete" };
  }

  // 2. Already completed today
  const alreadyCompletedToday = state.last_completed_at
    ? isSameDay(new Date(state.last_completed_at), new Date())
    : false;

  if (alreadyCompletedToday) {
    return { type: "already_done" };
  }

  // 3. Build session content
  const content = getDayContent(state.current_sequence, state.current_day);

  const safeContent: DayContent = content || {
    entry: "What's here right now?",
    response: "Something is present. You can feel it.",
    moment: "See if you can stay with what's here for a moment.",
    close: "It's still there.",
  };

  const session: TodaySession = {
    content: safeContent,
    sequenceId: state.current_sequence,
    day: state.current_day,
    isLastDay: state.current_day === 7,
  };

  // New user gets the entry flow first, then flows into session
  if (isNewUser) {
    return { type: "first_entry", session };
  }

  // 4. Check for gap return (use last_completed_at since that's the last engagement)
  if (state.last_completed_at) {
    const gap = daysSince(state.last_completed_at);
    if (gap >= 7) {
      return { type: "reanchor", line: "It didn't go anywhere.", session };
    }
    if (gap >= 2) {
      return { type: "reanchor", line: "It's been happening.", session };
    }
  }

  return { type: "session", session };
}

/**
 * Record that the user opened the app.
 * Fire-and-forget — don't block the view.
 */
function recordSeen(userId: string): void {
  getSupabase()
    .from("user_state")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("user_id", userId)
    .then(() => {})
    .catch(() => {});
}

// ─────────────────────────────────────────────
// COMPLETE SESSION
// ─────────────────────────────────────────────

/**
 * Record completed session and advance.
 * - Day < 7: advance to next day
 * - Day 7: set pending_transition = true (do NOT advance yet)
 */
export async function completeSession(
  userId: string,
  sequenceId: string,
  day: number,
  durationMs: number
): Promise<void> {
  const now = new Date().toISOString();

  // Log the session
  try {
    await getSupabase().from("sessions").insert([
      {
        user_id: userId,
        sequence_id: sequenceId,
        day_number: day,
        duration_ms: durationMs,
        completed_at: now,
      },
    ]);
  } catch (e) {
    console.error("Session log failed:", e);
  }

  // Advance state
  try {
    if (day < 7) {
      await getSupabase()
        .from("user_state")
        .update({
          current_day: day + 1,
          last_completed_at: now,
        })
        .eq("user_id", userId);
    } else {
      // Day 7 complete — enter transition state
      // Do NOT advance to next sequence yet
      await getSupabase()
        .from("user_state")
        .update({
          last_completed_at: now,
          pending_transition: true,
        })
        .eq("user_id", userId);
    }
  } catch (e) {
    console.error("State advance failed:", e);
  }
}

// ─────────────────────────────────────────────
// TRANSITION ACTIONS
// ─────────────────────────────────────────────

/**
 * User chose "Begin" — advance to next sequence, clear transition flag.
 */
export async function acceptTransition(userId: string): Promise<void> {
  const now = new Date().toISOString();
  const state = await getUserState(userId);
  const completed = [...(state.sequences_completed || []), state.current_sequence];
  const nextSequence = pickNextSequence(completed);

  try {
    await getSupabase()
      .from("user_state")
      .update({
        current_sequence: nextSequence,
        current_day: 1,
        sequence_started_at: now,
        last_completed_at: now,
        sequences_completed: completed,
        pending_transition: false,
        last_transition_declined_at: null,
      })
      .eq("user_id", userId);
  } catch (e) {
    console.error("Accept transition failed:", e);
  }
}

/**
 * User chose "Not today" — record the decline.
 * pending_transition stays true.
 * Timestamp prevents same-day notification re-send.
 * Next visit brings them back to the same transition.
 */
export async function declineTransition(userId: string): Promise<void> {
  try {
    await getSupabase()
      .from("user_state")
      .update({
        last_transition_declined_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
  } catch (e) {
    console.error("Decline transition failed:", e);
  }
}

// ─────────────────────────────────────────────
// SEQUENCE ASSIGNMENT
// ─────────────────────────────────────────────

function pickNextSequence(completedIds: string[]): string {
  const allIds = SEQUENCES.map((s) => s.id);
  const unseen = allIds.filter((id) => !completedIds.includes(id));
  if (unseen.length > 0) return unseen[0];
  return allIds[0];
}

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
