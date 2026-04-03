import { getUserState, type UserState } from "./sessions";
import { getSequence } from "./content";
import {
  resolveNotification,
  type NotificationContext,
  type NotificationResult,
} from "./notifications";

// ─────────────────────────────────────────────
// SONDER DEBUG
// ─────────────────────────────────────────────
// Call window.__sonderDebug() from browser console.
// Shows full user state, notification resolution, and routing.
//
// Usage:
//   Open browser console → type: __sonderDebug()

export interface DebugOutput {
  timestamp: string;
  localTimezone: string;

  // User state
  userId: string;
  currentSequence: string;
  sequencePattern: string | null;
  currentDay: number;
  pendingTransition: boolean;
  lastCompletedAt: string | null;
  lastCompletedLocal: string | null;
  lastNotificationAt: string | null;
  lastNotificationLocal: string | null;
  lastTransitionDeclinedAt: string | null;
  lastTransitionDeclinedLocal: string | null;
  lastSeenAt: string | null;
  lastSeenLocal: string | null;
  daysSinceLastCompletion: number | null;
  sequencesCompleted: string[];

  // Notification
  notification: NotificationResult;
  notificationWithWindow: NotificationResult;

  // Routing
  tapTarget: "session" | "transition" | "reanchor" | "already_done" | "none";
}

function toLocalString(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleString();
}

export async function generateDebugOutput(userId: string): Promise<DebugOutput> {
  const state = await getUserState(userId);
  const sequence = getSequence(state.current_sequence);

  const ctx: NotificationContext = {
    currentSequence: state.current_sequence,
    currentDay: state.current_day,
    pendingTransition: state.pending_transition,
    lastCompletedAt: state.last_completed_at,
    lastNotificationAt: state.last_notification_at,
    lastTransitionDeclinedAt: state.last_transition_declined_at,
    lastSeenAt: state.last_seen_at,
  };

  const notification = resolveNotification(ctx);
  const notificationWithWindow = resolveNotification({ ...ctx, checkSendWindow: true });

  // Calculate days since last completion
  let daysSinceLastCompletion: number | null = null;
  if (state.last_completed_at) {
    const then = new Date(state.last_completed_at);
    const now = new Date();
    const thenDay = new Date(then.getFullYear(), then.getMonth(), then.getDate());
    const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    daysSinceLastCompletion = Math.floor((nowDay.getTime() - thenDay.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Determine tap target
  let tapTarget: DebugOutput["tapTarget"] = "none";
  if (state.pending_transition) {
    tapTarget = "transition";
  } else {
    const now = new Date();
    const completedToday = state.last_completed_at
      ? isSameLocalDay(new Date(state.last_completed_at), now)
      : false;
    if (completedToday) {
      tapTarget = "already_done";
    } else if (daysSinceLastCompletion !== null && daysSinceLastCompletion >= 2) {
      tapTarget = "reanchor";
    } else {
      tapTarget = "session";
    }
  }

  return {
    timestamp: new Date().toISOString(),
    localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

    userId: state.user_id,
    currentSequence: state.current_sequence,
    sequencePattern: sequence?.pattern ?? null,
    currentDay: state.current_day,
    pendingTransition: state.pending_transition,
    lastCompletedAt: state.last_completed_at,
    lastCompletedLocal: toLocalString(state.last_completed_at),
    lastNotificationAt: state.last_notification_at,
    lastNotificationLocal: toLocalString(state.last_notification_at),
    lastTransitionDeclinedAt: state.last_transition_declined_at,
    lastTransitionDeclinedLocal: toLocalString(state.last_transition_declined_at),
    lastSeenAt: state.last_seen_at,
    lastSeenLocal: toLocalString(state.last_seen_at),
    daysSinceLastCompletion,
    sequencesCompleted: state.sequences_completed || [],

    notification,
    notificationWithWindow,

    tapTarget,
  };
}

/**
 * Install the debug helper on the window object.
 * Call from a client component's useEffect.
 */
export function installDebugHelper(userId: string) {
  if (typeof window === "undefined") return;

  (window as any).__sonderDebug = async () => {
    const output = await generateDebugOutput(userId);
    console.group("🔍 Sonder Debug");
    console.log("Timestamp:", output.timestamp);
    console.log("Timezone:", output.localTimezone);
    console.log("");
    console.log("── State ──");
    console.log("Sequence:", output.currentSequence, `(${output.sequencePattern})`);
    console.log("Day:", output.currentDay);
    console.log("Pending transition:", output.pendingTransition);
    console.log("Completed:", output.sequencesCompleted.length, "sequences");
    console.log("");
    console.log("── Timestamps ──");
    console.log("Last completed:", output.lastCompletedLocal || "never");
    console.log("Last seen:", output.lastSeenLocal || "never");
    console.log("Last notification:", output.lastNotificationLocal || "never");
    console.log("Last declined:", output.lastTransitionDeclinedLocal || "never");
    console.log("Days since completion:", output.daysSinceLastCompletion ?? "n/a");
    console.log("");
    console.log("── Notification (content only) ──");
    if (output.notification.send) {
      console.log("Would send:", output.notification.payload?.text);
      console.log("Deep link:", output.notification.payload?.deepLink);
    } else {
      console.log("Blocked:", output.notification.rejection);
    }
    console.log("");
    console.log("── Notification (with send window) ──");
    if (output.notificationWithWindow.send) {
      console.log("Would send:", output.notificationWithWindow.payload?.text);
    } else {
      console.log("Blocked:", output.notificationWithWindow.rejection);
    }
    console.log("");
    console.log("── Tap Routing ──");
    console.log("Target:", output.tapTarget);
    console.groupEnd();
    return output;
  };
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
