import {
  getDayContent,
  getTransition,
} from "./content";

// ─────────────────────────────────────────────
// NOTIFICATION RESOLUTION
// ─────────────────────────────────────────────
// Determines WHAT to send and WHY (or why not).
// Delivery (push API, service worker) is separate.
//
// TIMEZONE: All "today" checks use the browser's local
// timezone via Date methods (.getFullYear, .getMonth, .getDate).
// Supabase stores UTC (timestamptz), but new Date(utcString)
// automatically converts to local when accessed via these methods.
// This means "today" is always the user's local day.

export interface NotificationPayload {
  text: string;
  deepLink: "session" | "transition";
}

export type NotificationRejection =
  | "outside_send_window"
  | "notification_already_sent_today"
  | "transition_declined_today"
  | "session_completed_today"
  | "recently_seen_today"
  | "day_7_no_notification"
  | "pending_transition_no_content"
  | "no_notification_content"
  | "journey_complete";

export interface NotificationResult {
  send: boolean;
  payload: NotificationPayload | null;
  rejection: NotificationRejection | null;
}

export interface NotificationContext {
  currentSequence: string;
  currentDay: number;
  pendingTransition: boolean;
  lastCompletedAt: string | null;
  lastNotificationAt: string | null;
  lastTransitionDeclinedAt: string | null;
  lastSeenAt: string | null;
  checkSendWindow?: boolean;
}

/**
 * Resolve whether to send a notification and what it should say.
 * Always returns a result with either a payload or a rejection reason.
 *
 * Rules (in priority order):
 * 0. Don't send if outside send window (when checkSendWindow is true)
 * 1. Don't send if notification already sent today
 * 2. Don't send if user declined transition today
 *    (this ONLY blocks transition notifications, not next-day session notifications)
 * 3. Don't send if session already completed today
 * 4. Pending transition → send transition-specific notification
 * 5. Day 7 → no notification
 * 6. Days 1–6 → send day notification
 */
export function resolveNotification(
  ctx: NotificationContext
): NotificationResult {
  const now = new Date();

  // 0. Send window check (only enforced when delivery layer sets checkSendWindow)
  if (ctx.checkSendWindow && !isInSendWindow(now)) {
    return reject("outside_send_window");
  }

  // 0b. Suppress if user already opened the app today (pattern recently seen)
  if (ctx.lastSeenAt && isSameLocalDay(new Date(ctx.lastSeenAt), now)) {
    return reject("recently_seen_today");
  }

  // 1. Already sent today
  if (ctx.lastNotificationAt && isSameLocalDay(new Date(ctx.lastNotificationAt), now)) {
    return reject("notification_already_sent_today");
  }

  // 2. Declined transition today — only suppresses transition notifications
  const declinedToday = ctx.lastTransitionDeclinedAt
    && isSameLocalDay(new Date(ctx.lastTransitionDeclinedAt), now);

  if (declinedToday && ctx.pendingTransition) {
    return reject("transition_declined_today");
  }

  // 3. Session completed today
  if (ctx.lastCompletedAt && isSameLocalDay(new Date(ctx.lastCompletedAt), now)) {
    return reject("session_completed_today");
  }

  // 4. Pending transition
  if (ctx.pendingTransition) {
    const transition = getTransition(ctx.currentSequence);
    if (!transition) {
      return reject("pending_transition_no_content");
    }
    return send({
      text: transition.notification || "Something is waiting.",
      deepLink: "transition",
    });
  }

  // 5. Day 7
  if (ctx.currentDay === 7) {
    return reject("day_7_no_notification");
  }

  // 6. Days 1–6
  const dayContent = getDayContent(ctx.currentSequence, ctx.currentDay);
  if (!dayContent?.notification) {
    return reject("no_notification_content");
  }

  return send({
    text: dayContent.notification,
    deepLink: "session",
  });
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function send(payload: NotificationPayload): NotificationResult {
  return { send: true, payload, rejection: null };
}

function reject(reason: NotificationRejection): NotificationResult {
  return { send: false, payload: null, rejection: reason };
}

/**
 * Compare two dates using LOCAL timezone.
 * Both Date objects are converted to local year/month/date.
 * This is correct because:
 * - Supabase timestamps are UTC (timestamptz)
 * - new Date(utcString) stores UTC internally
 * - .getFullYear()/.getMonth()/.getDate() return LOCAL values
 * - So both sides are compared in the user's local timezone
 */
function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Check if a given time is within the send window (12:30 local).
 * Uses local hour/minute. No retries — if missed, skip entirely.
 */
function isInSendWindow(now: Date): boolean {
  return now.getHours() === 12 && now.getMinutes() === 30;
}

/**
 * Get the next 12:30 local time as a Date.
 * If 12:30 has already passed today, returns tomorrow's.
 * Exported for the delivery layer when it's built.
 */
export function getNextSendTime(): Date {
  const now = new Date();
  const sendTime = new Date(now);
  sendTime.setHours(12, 30, 0, 0);
  if (now > sendTime) {
    sendTime.setDate(sendTime.getDate() + 1);
  }
  return sendTime;
}
