# Sonder QA Checklist — 5 Key States

Open browser console and run `__sonderDebug()` at each step.

---

## State 1: Fresh User — Day 1 Session

**Setup:** Clear localStorage (`localStorage.clear()`) and reload.

**Expected debug output:**
- Sequence: `overthinking`
- Day: `1`
- Pending transition: `false`
- Last completed: `never`
- Notification: SEND → "It came back, didn't it."
- Deep link: `session`
- Tap target: `session`

**Test:**
- [ ] Entry screen shows "day 1" and overthinking entry line
- [ ] Tap through all 4 screens (entry → response → action → close)
- [ ] Each screen holds before tap hint appears (2.5s / 3s / 5s / 4s)
- [ ] Done screen appears after close
- [ ] Run `__sonderDebug()` — day should now be `2`, last completed is today

---

## State 2: Already Completed Today

**Setup:** Complete a session, then reload the page.

**Expected debug output:**
- Day: incremented from previous
- Last completed: today's date
- Notification: SUPPRESSED → `session_completed_today`
- Tap target: `already_done`

**Test:**
- [ ] Page shows "Come back tomorrow" screen
- [ ] No session content is shown
- [ ] Notification would be suppressed (check debug)

---

## State 3: Day 7 — No Notification, Transition Pending After

**Setup:** Advance to Day 7 (via Supabase: `UPDATE user_state SET current_day = 7, last_completed_at = '2025-01-01' WHERE user_id = 'YOUR_ID'`).

**Expected debug output (before completing):**
- Day: `7`
- Notification: SUPPRESSED → `day_7_no_notification`
- Tap target: `session`

**Test:**
- [ ] Day 7 session loads normally
- [ ] Complete the session
- [ ] Run `__sonderDebug()` — pending_transition should be `true`
- [ ] Reload — transition screen appears (not Day 1 of next sequence)

---

## State 4: Pending Transition — Begin

**Setup:** Be in pending_transition state (completed Day 7 above).

**Expected debug output:**
- Pending transition: `true`
- Notification: SEND → transition-specific text (e.g. "The loop let go. Something else is waiting.")
- Deep link: `transition`
- Tap target: `transition`

**Test:**
- [ ] Transition Screen 1 appears with recognition text
- [ ] Tap → Screen 2 with direction text
- [ ] Tap → Screen 3 with "Seven days." and [Begin] / [Not today]
- [ ] Tap [Begin]
- [ ] Run `__sonderDebug()` — sequence advanced, day = 1, pending_transition = false
- [ ] Reload — Day 1 of new sequence loads

---

## State 5: Pending Transition — Not Today

**Setup:** Get back to pending_transition (advance another sequence to Day 7, complete it).

**Expected debug output before decline:**
- Pending transition: `true`
- Tap target: `transition`

**Test:**
- [ ] Transition screens appear
- [ ] Tap [Not today] on Screen 3
- [ ] Screen shows "Come back tomorrow"
- [ ] Run `__sonderDebug()` — pending_transition still `true`, last_transition_declined_at is today
- [ ] Notification: SUPPRESSED → `transition_declined_today`
- [ ] Reload page — transition screens appear again (not skipped)
- [ ] Next day: notification should fire normally (decline only suppresses same-day)

---

## Bonus Checks

**Timezone consistency:**
- [ ] `__sonderDebug()` shows `localTimezone` matching your actual timezone
- [ ] All "Local" timestamps in debug output match your wall clock
- [ ] Complete a session at 11:55 PM, reload at 12:05 AM — should show new day's content, not "already done"

**Notification rejection reasons:**
- [ ] `notification_already_sent_today` — only when last_notification_at is today
- [ ] `transition_declined_today` — only blocks transition notifications, same day only
- [ ] `session_completed_today` — only when last_completed_at is today
- [ ] `day_7_no_notification` — only on Day 7
- [ ] `no_notification_content` — should never appear (all days 1–6 have content)

**Tap routing:**
- [ ] `deepLink: "session"` → lands on Entry screen with day label and content
- [ ] `deepLink: "transition"` → lands on Transition Screen 1
- [ ] Neither goes through splash, landing, or intermediate screen
