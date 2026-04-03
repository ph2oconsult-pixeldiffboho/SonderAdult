# Sonder (Adult)

A minimal awareness system. Not self-help. Not journaling. Not meditation.

One interaction per day. Under 30 seconds. Something unfolds over seven days.

---

## How it works

You open the app. You see one line. You tap through four screens. You leave.

The next day, the line connects to the one before it. By day seven, something has shifted — not because you were taught anything, but because you kept noticing.

---

## Architecture

### Narrative Engine

The app runs on **sequenced 7-day arcs**, not random content pools.

Each sequence follows an invisible progression:
- Days 1–2: Awareness (something surfaces)
- Days 3–5: Pattern recognition (it's not random)
- Days 6–7: Perceptual shift (something changes)

The user never sees this structure. They just feel it.

### 10 Sequences (70 days of content)

| # | Pattern | Internal Reference |
|---|---------|-------------------|
| 1 | Avoidance | The thing you won't look at |
| 2 | Overthinking | The loop that feels like progress |
| 3 | Seeking Approval | The audience that isn't there |
| 4 | Control | The grip that won't open |
| 5 | Comparison | The mirror that isn't yours |
| 6 | Emotional Reaction | The speed before the thought |
| 7 | Distraction | The exit you don't remember taking |
| 8 | Unfinished Decisions | The thing you keep almost doing |
| 9 | Internal Conflict | The argument you're having with yourself |
| 10 | Uncertainty | The ground that isn't there |

### Day Tracking

- Anonymous user ID (crypto UUID, localStorage)
- Supabase `user_state` table tracks current sequence + day
- One session per day (returning same day shows "Come back tomorrow")
- On day 7 completion, auto-assigns next sequence
- After all 10, cycles back

### File Structure

```
app/
  layout.tsx              Root layout
  page.tsx                Mounts NowContainer (force-dynamic)

components/
  NowContainer.tsx        State machine + session orchestration
  EntryScreen.tsx         Day label + entry line
  ResponseScreen.tsx      Reflection line
  ActionScreen.tsx        Micro-action
  CloseScreen.tsx         Close line
  DoneScreen.tsx          Completion (mid-sequence or end-of-sequence)
  AlreadyDoneScreen.tsx   "Come back tomorrow"
  FadeIn.tsx              Framer Motion wrapper

lib/
  content.ts              10 sequences × 7 days (all content)
  sessions.ts             User state, day tracking, progression logic
  supabase.ts             Lazy-init Supabase client

supabase/
  schema.sql              user_state + sessions tables, RLS, analytics view
```

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd sonder-adult
npm install
```

### 2. Supabase

1. Create a Supabase project
2. Run `supabase/schema.sql` in the SQL Editor
3. Copy Project URL + anon key from Settings → API
4. Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run locally

```bash
npm run dev
```

### 4. Deploy

```bash
npx vercel
```

Add env vars in Vercel → Settings → Environment Variables.

---

## Design Principles

- One interaction per day
- Under 30 seconds
- No journaling, no gamification, no progress bars
- No teaching, explaining, or advising
- Content is sequenced, not random
- Language sharpens across the week
- Day 7 is earned, not motivational

---

## License

Private. All rights reserved.
