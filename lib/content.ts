// ─────────────────────────────────────────────
// SONDER ADULT — PATTERN RECOGNITION CONTENT
// ─────────────────────────────────────────────
// 10 sequences × 7 days = 70 days
// Model: Notice → See Again → Recognition → Holding
// No instruction. No intervention. No improvement language.
// The user sees. That's the product.

export interface DayContent {
  anchor?: string; // Day 1 only — shown before entry line
  entry: string;
  response: string;
  moment: string;
  close: string;
  notification?: string;
}

export interface Transition {
  screen1: string;
  screen2: string;
  screen3: string;
  primaryCta: string;
  secondaryCta: string;
  notification: string;
}

export interface Sequence {
  id: string;
  pattern: string;
  days: [DayContent, DayContent, DayContent, DayContent, DayContent, DayContent, DayContent];
  transition?: Transition;
}

export const SEQUENCES: Sequence[] = [

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. OVERTHINKING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "overthinking",
    pattern: "The loop that feels like progress",
    days: [
      {
        anchor: "It's been running.",
        entry: "What thought showed up more than once today?",
        response: "You've seen it before.",
        moment: "It stayed.",
        close: "It didn't end anywhere.",
        notification: "It circled back.",
      },
      {
        entry: "It came back.",
        response: "Same place it starts.",
        moment: "It ran again.",
        close: "Nothing settled.",
        notification: "Still running.",
      },
      {
        entry: "What are you trying to resolve?",
        response: "It hasn't moved.",
        moment: "It ran again.",
        close: "Same path.",
        notification: "You caught the restart.",
      },
      {
        entry: "You've been here before.",
        response: "This is the loop.",
        moment: "It starts the same way.",
        close: "It keeps going.",
        notification: "Same loop. You saw it.",
      },
      {
        entry: "It started again.",
        response: "Same beginning. But it slowed earlier.",
        moment: "It didn't go as far this time.",
        close: "It ran shorter.",
        notification: "You felt the rhythm.",
      },
      {
        entry: "It tried again.",
        response: "It was already running.",
        moment: "It didn't build the same way.",
        close: "It didn't build as far.",
        notification: "It didn't complete.",
      },
      {
        entry: "It's still there.",
        response: "It's quieter. Not gone.",
        moment: "It's visible as it starts.",
        close: "It's still there.",
      },
    ],
    transition: {
      screen1: "The loop is still running. But you're watching it now.",
      screen2: "Something else has been at the edge. You've been looking past it.",
      screen3: "Seven days.",
      primaryCta: "Begin",
      secondaryCta: "Not today",
      notification: "The loop is visible now. Something else is at the edge.",
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. AVOIDANCE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "avoidance",
    pattern: "The thing you won't look at",
    days: [
      {
        anchor: "You moved past something.",
        entry: "What did you move away from today?",
        response: "It was there.",
        moment: "It stayed where it was.",
        close: "It stayed.",
        notification: "It's at the edge again.",
      },
      {
        entry: "It's still there.",
        response: "It hasn't moved.",
        moment: "It was still there. The path went around it.",
        close: "Nothing changed.",
        notification: "You moved away again.",
      },
      {
        entry: "How many times did you pass it?",
        response: "More than once.",
        moment: "The redirect happened again.",
        close: "Same turn.",
        notification: "You caught a slide.",
      },
      {
        entry: "You know this moment.",
        response: "You know this one.",
        moment: "It happens quickly.",
        close: "Same pattern.",
        notification: "The story played again.",
      },
      {
        entry: "It showed up again.",
        response: "Same place. But it lasted a second longer.",
        moment: "The turn away was slower this time.",
        close: "It didn't disappear as fast.",
        notification: "Same shape underneath.",
      },
      {
        entry: "It was there again.",
        response: "It was visible a moment longer.",
        moment: "It was there. Briefly.",
        close: "It was still there when you looked back.",
        notification: "You felt the weight of carrying.",
      },
      {
        entry: "It's still there.",
        response: "It hasn't moved.",
        moment: "It was close again.",
        close: "It's still there.",
      },
    ],
    transition: {
      screen1: "The thing is still there. So are you.",
      screen2: "Something keeps almost happening. It surfaces and sinks.",
      screen3: "Seven days.",
      primaryCta: "Begin",
      secondaryCta: "Not today",
      notification: "You see the avoidance now. Something else keeps surfacing.",
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. DISTRACTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "distraction",
    pattern: "The exit you don't remember taking",
    days: [
      {
        anchor: "You left for a moment.",
        entry: "Where did the last hour go?",
        response: "Something left. Not physically.",
        moment: "Something was reached for. It's not clear what.",
        close: "There was an exit. It happened without deciding.",
        notification: "You left without deciding.",
      },
      {
        entry: "It happened again.",
        response: "Same door.",
        moment: "The exit happened before the noticing.",
        close: "Nothing stayed.",
        notification: "It moved again. Smooth.",
      },
      {
        entry: "How many times did you leave without choosing to?",
        response: "More than you counted.",
        moment: "The leaving happened before the deciding.",
        close: "Same exit.",
        notification: "You felt what was before the exit.",
      },
      {
        entry: "How many exits today without choosing?",
        response: "Most didn't feel like decisions.",
        moment: "The exits were automatic. Almost no friction.",
        close: "No friction. It doesn't stop here.",
        notification: "No friction at all.",
      },
      {
        entry: "It happened again.",
        response: "Same exit. But it took a moment longer to start.",
        moment: "The departure was slower this time.",
        close: "It didn't happen as smoothly.",
        notification: "Same arc. Different door.",
      },
      {
        entry: "What's on the other side of staying?",
        response: "Something you keep leaving instead of meeting. It's still there when you come back.",
        moment: "The not-leaving had a feeling. You were there for it briefly.",
        close: "It doesn't usually last long enough for that feeling.",
        notification: "You felt the not-leaving.",
      },
      {
        entry: "The exits are still there.",
        response: "The arc. The smoothness. The thing you leave instead of meeting. All visible.",
        moment: "The exits were visible. You were here at the same time.",
        close: "You see the exits now.",
      },
    ],
    transition: {
      screen1: "The arc. The smoothness. The leaving. All visible.",
      screen2: "Something hits before you think. Fast. Familiar. It's been landing the same way for a while.",
      screen3: "Seven days.",
      primaryCta: "Begin",
      secondaryCta: "Not today",
      notification: "You see the exits. Something else lands before you can think.",
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. INTERNAL CONFLICT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "conflict",
    pattern: "The argument you're having with yourself",
    days: [
      {
        anchor: "It pulled both ways.",
        entry: "What were you pulled between today?",
        response: "Both sides were there.",
        moment: "It stayed.",
        close: "Nothing settled.",
        notification: "Both sides spoke today.",
      },
      {
        entry: "It came back again.",
        response: "Same tension.",
        moment: "It went back and forth.",
        close: "No decision.",
        notification: "You switched again.",
      },
      {
        entry: "How many times did you go back and forth?",
        response: "Same two sides.",
        moment: "Both were held.",
        close: "Still open.",
        notification: "Old argument. New clothes.",
      },
      {
        entry: "You've been here before.",
        response: "This is the tension.",
        moment: "It pulls both ways.",
        close: "It doesn't resolve.",
        notification: "You heard what they're guarding.",
      },
      {
        entry: "It showed up again.",
        response: "Same pull. But it didn't escalate as fast.",
        moment: "The back-and-forth was slower this time.",
        close: "It didn't build the same way.",
        notification: "You saw it from outside.",
      },
      {
        entry: "It came back.",
        response: "It stayed.",
        moment: "It wasn't forced.",
        close: "It didn't collapse.",
        notification: "You heard what would go quiet.",
      },
      {
        entry: "It's still there.",
        response: "Both sides remain.",
        moment: "It sat there.",
        close: "It holds without closing.",
      },
    ],
    transition: {
      screen1: "Both sides are visible now. The argument is still running.",
      screen2: "Your hands are tighter than you think. Something has been gripping.",
      screen3: "Seven days.",
      primaryCta: "Begin",
      secondaryCta: "Not today",
      notification: "You see the argument. Something else is gripping.",
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. COMPARISON
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "comparison",
    pattern: "The mirror that isn't yours",
    days: [
      {
        anchor: "You measured it.",
        entry: "Who made you feel behind today?",
        response: "The measuring started before the noticing.",
        moment: "The comparison started before you chose it.",
        close: "It started before you chose it.",
        notification: "You measured again.",
      },
      {
        entry: "The check happened again.",
        response: "Same impulse.",
        moment: "The measuring came before the noticing.",
        close: "Nothing shifted.",
        notification: "Faster this time.",
      },
      {
        entry: "How many times did you check today?",
        response: "Same person. Same measurement.",
        moment: "The comparison started before the choosing.",
        close: "Same check.",
        notification: "You noticed what you filled in.",
      },
      {
        entry: "What do you skip about yourself when you compare?",
        response: "Everything that doesn't support what you've already decided.",
        moment: "The same thing got dismissed. Same as usual.",
        close: "The dismissal is automatic. Same things every time.",
        notification: "You saw what you skipped.",
      },
      {
        entry: "It ran again.",
        response: "Same sequence. But it stalled partway through.",
        moment: "The comparison didn't complete the same way.",
        close: "It broke earlier.",
        notification: "You saw the four moves.",
      },
      {
        entry: "If the person disappeared, the feeling wouldn't.",
        response: "They gave it a shape. The feeling was there before them.",
        moment: "Something was underneath. Before the person. Before the measuring.",
        close: "Something was there before the comparison. The comparison gave it somewhere to go.",
        notification: "You felt what was underneath.",
      },
      {
        entry: "The comparison is still there.",
        response: "The structure. The building up. The skipping. The feeling underneath. All visible.",
        moment: "The whole pattern was visible. The comparison and you, watching it.",
        close: "You see the comparison now.",
      },
    ],
    transition: {
      screen1: "The structure. The feeling underneath. All visible.",
      screen2: "There's an audience in your head. You've been performing without knowing it.",
      screen3: "Seven days.",
      primaryCta: "Begin",
      secondaryCta: "Not today",
      notification: "You see the comparison. There's also an audience you hadn't noticed.",
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. EMOTIONAL REACTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "reaction",
    pattern: "The speed before the thought",
    days: [
      {
        anchor: "It landed fast.",
        entry: "What hit you today before you had time to think?",
        response: "Something moved before you had a name for it.",
        moment: "It landed somewhere specific. Not the thought. The landing.",
        close: "It landed somewhere specific. It always does.",
        notification: "It landed again.",
      },
      {
        entry: "It landed again.",
        response: "Same place.",
        moment: "The response came before the choosing.",
        close: "Nothing slowed.",
        notification: "Same place in your body.",
      },
      {
        entry: "How many times has it landed the same way?",
        response: "Same place. Same speed.",
        moment: "It arrived the same way again.",
        close: "You know this one.",
        notification: "The arrival is old.",
      },
      {
        entry: "What happens right after it hits?",
        response: "Something fires. A response. Before you choose it.",
        moment: "The response came before the choosing. It was fast.",
        close: "The response is faster than the choosing. It doesn't stop when this ends.",
        notification: "The response came before the choosing.",
      },
      {
        entry: "It landed again.",
        response: "Same trigger. But the response was slightly delayed.",
        moment: "There was a gap that wasn't there before.",
        close: "It didn't fire as fast.",
        notification: "You saw the whole sequence.",
      },
      {
        entry: "There's a gap you usually skip.",
        response: "Between the landing and the response. Small. But there.",
        moment: "The gap was there. Between the landing and the response.",
        close: "The gap exists. You don't usually stay long enough to notice.",
        notification: "You felt the gap.",
      },
      {
        entry: "The reaction is still there.",
        response: "Same speed. Same sequence. But you can see it arrive.",
        moment: "The reaction was there. The seeing was there. Both at the same time.",
        close: "You see the reaction now.",
      },
    ],
    transition: {
      screen1: "The landing. The sequence. The gap. All visible.",
      screen2: "There's someone you keep measuring yourself against. It happens before you notice.",
      screen3: "Seven days.",
      primaryCta: "Begin",
      secondaryCta: "Not today",
      notification: "You see the reaction. Something else keeps measuring.",
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 7. CONTROL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "control",
    pattern: "The grip that won't open",
    days: [
      {
        anchor: "You were already holding it.",
        entry: "What did you manage before it started?",
        response: "There was a plan before the day started.",
        moment: "Your body was already holding something. Jaw. Shoulders. Hands.",
        close: "The holding was already there. Before anything happened.",
        notification: "You were holding already.",
      },
      {
        entry: "It fired again.",
        response: "Same speed.",
        moment: "The correction came before the thinking.",
        close: "Nothing loosened.",
        notification: "The correction was fast.",
      },
      {
        entry: "How many times did you rehearse something that hadn't happened?",
        response: "More than once. Same ones.",
        moment: "The rehearsal was already running.",
        close: "Same rehearsal.",
        notification: "You caught a simulation.",
      },
      {
        entry: "The grip has been there a long time.",
        response: "It started somewhere. It hasn't loosened.",
        moment: "The grip was there even when nothing was wrong. Its resting state.",
        close: "The grip has a resting state.",
        notification: "The grip has a resting state.",
      },
      {
        entry: "It fired again.",
        response: "Same correction. But it was slower to start.",
        moment: "The grip tightened later than usual.",
        close: "It didn't lock as fast.",
        notification: "The grip doesn't scale.",
      },
      {
        entry: "The control has a shape.",
        response: "Rehearsal. Correction. Rehearsal. Correction. Underneath everything.",
        moment: "The cycle was visible from above. The whole loop at once.",
        close: "From above it looks like a loop. Inside it feels like productivity.",
        notification: "You saw it from above.",
      },
      {
        entry: "The grip is still there.",
        response: "The rehearsal. The correction. The resting state. All visible.",
        moment: "The grip was there. It was being seen.",
        close: "You see the grip now.",
      },
    ],
    transition: {
      screen1: "The rehearsal. The correction. The loop. All visible.",
      screen2: "You've been leaving. Not physically. You check out and you're not sure when.",
      screen3: "Seven days.",
      primaryCta: "Begin",
      secondaryCta: "Not today",
      notification: "You see the grip. You've also been leaving without noticing.",
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 8. SEEKING APPROVAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "approval",
    pattern: "The audience that isn't there",
    days: [
      {
        anchor: "Someone was there.",
        entry: "Who were you thinking about when you made your last decision?",
        response: "Not what. Who. There was a face.",
        moment: "A face showed up. It usually does.",
        close: "A face appeared. It usually does.",
        notification: "A face showed up.",
      },
      {
        entry: "The scan ran again.",
        response: "Same search.",
        moment: "The edit happened before the speaking.",
        close: "Nothing settled.",
        notification: "The scan was running.",
      },
      {
        entry: "How many times did you edit yourself before speaking?",
        response: "More than once. Same edit.",
        moment: "The original got replaced again.",
        close: "Same edit.",
        notification: "You caught the edit.",
      },
      {
        entry: "Which version showed up today?",
        response: "There's who you were in the room. And who you were after.",
        moment: "There was a gap between the two. Sometimes wide. Sometimes almost nothing.",
        close: "The distance varies.",
        notification: "You felt the distance.",
      },
      {
        entry: "It ran again.",
        response: "Same scan. But the edit didn't finish.",
        moment: "The sequence stalled before the check.",
        close: "It didn't complete the same way.",
        notification: "Same sequence. Different room.",
      },
      {
        entry: "There's a version that doesn't edit.",
        response: "It appears sometimes. In quiet moments. When no one's looking.",
        moment: "The unedited version was there. Quieter. Less prepared.",
        close: "It's there. It doesn't stop being there.",
        notification: "You felt the unedited version.",
      },
      {
        entry: "The editing is still there.",
        response: "The scan. The adjust. The perform. The check. All visible.",
        moment: "The pattern was visible. The editing and you, watching it.",
        close: "You see the editing now.",
      },
    ],
    transition: {
      screen1: "The scan. The adjust. The perform. The check. All visible.",
      screen2: "There's something you don't know. You've been filling the space so you don't have to feel it.",
      screen3: "Seven days.",
      primaryCta: "Begin",
      secondaryCta: "Not today",
      notification: "You see the editing. Something else you don't know is humming underneath.",
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 9. UNFINISHED DECISIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "decisions",
    pattern: "The thing you keep almost doing",
    days: [
      {
        anchor: "Something almost happened.",
        entry: "What have you been meaning to decide?",
        response: "It surfaced. It does that. At the edges of busier thoughts.",
        moment: "It stayed for a moment. Then it sank.",
        close: "It surfaced. Then it sank.",
        notification: "It surfaced again.",
      },
      {
        entry: "It surfaced again.",
        response: "Same weight.",
        moment: "It was held for a moment. Then it sank back.",
        close: "Still open.",
        notification: "You pulled back again.",
      },
      {
        entry: "How many times have you almost decided?",
        response: "Close. Then back. Different reason each time. Same motion.",
        moment: "The pull-back happened again.",
        close: "Same motion. Same result.",
        notification: "Same pull-back. Different reason.",
      },
      {
        entry: "What is 'not ready' protecting?",
        response: "The bar keeps rising. The bar isn't the point.",
        moment: "'Not ready' sounded the same as last time.",
        close: "'Not ready' sounds the same every time. It doesn't stop here.",
        notification: "The bar moved again.",
      },
      {
        entry: "It surfaced again.",
        response: "Same weight. But it stayed up a moment longer.",
        moment: "The sinking was slower this time.",
        close: "It didn't disappear as quickly.",
        notification: "You felt the tightening.",
      },
      {
        entry: "The deliberation has become the thing.",
        response: "It's been there so long it feels like the room itself. Not something in the room.",
        moment: "The space without the deliberation was quiet.",
        close: "The space is quiet. The deliberation was filling it.",
        notification: "You felt the space without it.",
      },
      {
        entry: "The decision is still there. So is the pattern around it.",
        response: "The surfacing. The sinking. The pull-back. The tightening. All visible.",
        moment: "The whole shape was there at once.",
        close: "You see the whole shape now.",
      },
    ],
    transition: {
      screen1: "The pattern around the decision is visible. The decision is still yours.",
      screen2: "Two parts of you have been talking. You've been pretending they aren't.",
      screen3: "Seven days.",
      primaryCta: "Begin",
      secondaryCta: "Not today",
      notification: "You see the decision pattern. Something else is talking underneath.",
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 10. UNCERTAINTY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "uncertainty",
    pattern: "The ground that isn't there",
    days: [
      {
        anchor: "It's been there.",
        entry: "What don't you know right now?",
        response: "Something's been humming underneath. There's been noise over it.",
        moment: "The hum was there. Underneath the noise.",
        close: "It's there. Underneath the noise.",
        notification: "It's still humming.",
      },
      {
        entry: "It's still humming.",
        response: "Same frequency.",
        moment: "The filling came before the feeling.",
        close: "Nothing cleared.",
        notification: "The layers were fast.",
      },
      {
        entry: "How many times did you fill the space instead of sitting with it?",
        response: "Same fill. Same gap underneath.",
        moment: "The filling started again before the feeling arrived.",
        close: "Same fill.",
        notification: "You caught the filling impulse.",
      },
      {
        entry: "When did certainty become the requirement?",
        response: "Not knowing became unsafe. Solid ground has been chased since.",
        moment: "Something was being held. It might be solid. It was being held either way.",
        close: "Something is being held. It might be solid. It's being held either way.",
        notification: "You noticed what you're holding.",
      },
      {
        entry: "It came back.",
        response: "Same gap. But the filling was slower to start.",
        moment: "The gap was there a moment longer before the filling began.",
        close: "It didn't fill as fast.",
        notification: "You saw the rhythm.",
      },
      {
        entry: "What's in the gap before the filling?",
        response: "Something that doesn't have a name yet. Something that doesn't need one.",
        moment: "The gap was there for a moment. Before the filling started.",
        close: "The gap has a quality. Not empty. Not full. Something else.",
        notification: "You stayed in the gap.",
      },
      {
        entry: "The not-knowing is still there.",
        response: "The filling. The layers. The rhythm. The gap. All visible.",
        moment: "The not-knowing was there. The seeing was there. Both at the same time.",
        close: "You see the pattern around the not-knowing now.",
      },
    ],
    // No transition — last sequence
  },
];

// ─────────────────────────────────────────────
// CONTENT RETRIEVAL
// ─────────────────────────────────────────────

export function getSequence(id: string): Sequence | undefined {
  return SEQUENCES.find((s) => s.id === id);
}

export function getDayContent(sequenceId: string, day: number): DayContent | null {
  const seq = getSequence(sequenceId);
  if (!seq || day < 1 || day > 7) return null;
  return seq.days[day - 1];
}

export function getSequenceIds(): string[] {
  return SEQUENCES.map((s) => s.id);
}

export function getTransition(sequenceId: string): Transition | null {
  const seq = getSequence(sequenceId);
  return seq?.transition || null;
}
