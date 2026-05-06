# AGENTS.md — for AI agents working on Plus One

> **Read this first.** It tells you what Plus One is, what's safe to touch, and how to leave the project better than you found it.

---

## Project in 30 seconds

**Plus One** is a hyperlocal social platform for Knoxville, TN. Real humans only — verified at signup. Anti-doomscroll by design. Built around an AI that knows everything about Knoxville.

**The first product** is event discovery + a "+1 marketplace" (find someone to go with you). Communities (Reddit-style channels), an AI concierge ("plan my night"), and full social-graph features come later.

**Stack:** Expo / React Native + Supabase. Deployed to Vercel for web. Mobile via EAS Build (planned). In-app chat AI uses NotebookLM Enterprise + Vertex AI Search Web Widget (planned, per ADR-002).

**Domain:** [plusoneknox.com](https://plusoneknox.com).

---

## The THREE LAWS (non-negotiable)

If a feature you're building violates one of these, stop and surface to the human reviewer.

1. **Real humans only.** Verified at signup via 4 paths: `.edu` email (UTK / neighboring unis), in-person at partner venues, vouching by 2 verified users (after 100-user threshold), or 3 cross-validated social media accounts. Bot resistance is the moat.

2. **No infinite content + retention objective.** Algorithms can optimize for user value (event-find rate, match satisfaction, AI answer quality) but NEVER for time-in-app, scroll-depth, swipe-count, or watch-time. Doom-scroll feeds either bound by real supply OR ordered by recency / randomness. No variable-reward swipe mechanics. No streaks tuned for duration.

3. **Knows everything about Knoxville.** Goal-state: ask "best karaoke spot with good food but not too loud?" → get the right answer with citation. Achieved via NotebookLM Enterprise grounded on the Knoxville corpus at `~/.openclaw/workspace/softknox/projects/plusone/corpus/`.

---

## Brand voice

- **Anti-bot, not anti-people.** "Real humans only" is the value prop. Not "exclusive," not "members only," not "velvet rope."
- **Friendly, direct, low-fluff.** Avoid pretentious framing. Avoid corporate-speak ("application," "submit," "applicant").
- **Verification = feature.** Frame ID/.edu checks as "we keep it clean" not "you might not be allowed in."
- **Knoxville-rooted.** References to local places, events, vibe are good. Generic city talk is bad.

Avoid: "Apply for Access," "I'm a Member," "curated circle," "the room your city's been missing"
Prefer: "Sign up like a person," "Real Knoxvillians, no bots," "Anyone real is welcome"

---

## What you can touch freely

| Area | Why it's safe |
|---|---|
| `app/**/*.tsx` (UI screens) | Routes are file-based; iterate freely |
| `components/**/*.tsx` | Reusable UI primitives |
| `lib/constants.ts` | Brand COLORS, categories, geo bounds |
| `hooks/**/*.ts`, `stores/**/*.ts` | Client state — refactor as needed |
| `assets/**` | Images, fonts, icons |
| `dashboard/**` | Local-only orchestrator board (port 4444) |
| Documentation, comments, READMEs | Always welcome |

**Style polish, loading states, empty states, error handling, refactors, test scaffolding, type tightening — all welcome without prior approval.**

---

## What requires human review BEFORE you change

| Area | Why it's gated |
|---|---|
| `supabase/migrations/**` | Schema is append-only; new migration = potential ADR |
| `supabase/functions/**` | Edge Function behavior affects production data ingestion |
| `lib/types.ts` | Generated from Postgres schema; regenerate with `npx supabase gen types`, don't hand-edit |
| `lib/supabase.ts` | Auth / storage adapter logic; subtle SSR concerns |
| `app/_layout.tsx` AuthGate | Determines who sees what; security-adjacent |
| Anything touching `interactions`, `event_rsvps`, `user_preferences` data flow | These feed the AI Concierge profile model — wrong tracking = wrong recommendations |
| AI provider integration | Locked to NotebookLM + Vertex per ADR-002. Don't wire alternative providers without an ADR. |
| Verification system UX | LAW #1 territory. Surface design choices before building. |
| Welcome page copy | LAW-aligned framing matters. Run by the human first. |

---

## Project structure (file map)

```
PlusOne/
├── app/                          # Expo Router routes
│   ├── welcome.tsx               # Anonymous landing
│   ├── index.tsx                 # Auth-state router
│   ├── _layout.tsx               # AuthGate + theme + providers
│   ├── (auth)/sign-in.tsx        # Has dev bypass button
│   ├── (auth)/sign-up.tsx
│   ├── (onboarding)/resume.tsx   # Profile setup (TODO: 4-tier verification)
│   ├── (tabs)/discover.tsx       # Event feed (logged-in)
│   ├── (tabs)/openings.tsx       # +1 marketplace
│   ├── (tabs)/activity.tsx       # Matches + my postings
│   ├── (tabs)/profile.tsx        # User profile
│   ├── event/[id].tsx            # Event detail
│   ├── opening/[id].tsx          # +1 opening detail
│   ├── chat/[matchId].tsx        # Realtime chat
│   └── post-opening.tsx          # Create a +1 opening
├── components/EventCard.tsx      # Image + category fallback
├── components/OpeningCard.tsx    # Spots-left + poster preview
├── lib/supabase.ts               # Client (env-driven, no hardcoded keys)
├── lib/types.ts                  # Generated DB types
├── lib/constants.ts              # COLORS, EVENT_CATEGORIES, OPENING_TYPES, KNOXVILLE_BOUNDS
├── hooks/useAuth.ts              # DEPRECATED — use stores/authStore
├── stores/authStore.ts           # Zustand auth state
├── supabase/functions/scrape-facebook-events/index.ts  # Apify-driven daily scraper
├── supabase/migrations/*.sql     # Append-only
├── dashboard/dashboard.html      # Live orchestrator board
├── dashboard/state.json          # Polled by dashboard, written by orchestrator
└── .claude/launch.json           # Local dev server configs (Expo + dashboard)
```

---

## Conventions

- **TypeScript strict** — no `any` unless escaping a Supabase join-inference quirk (in which case cast to `as any` and add a TODO comment)
- **No relative imports for top-level dirs** — use `@/lib/...`, `@/components/...` (configured in `tsconfig.json`)
- **No CSS frameworks** currently — inline `StyleSheet.create({})` per component using `COLORS.*`
- **All DB access goes through Supabase client** — no raw fetch to the REST API
- **All tables have RLS** — never disable it; never bypass it client-side
- **All user-facing strings live near the component** — no central i18n yet
- **Date formatting uses `Date.toLocaleDateString` / `toLocaleTimeString`** — no date-fns or moment
- **Image URLs**: prefer `event.image_url` if present, fall back to category gradient (see `EventCard.tsx`)

---

## Testing

```bash
npx tsc --noEmit             # Type check
npx expo start --web         # Web preview at localhost:8081
npx expo start               # Full dev server (use Expo Go on phone via QR code)
```

Sign in with `test@utk.edu` / `test1234` or click the **Dev Bypass** button on the sign-in page.

---

## Branching + PRs

1. Branch off `main` as `feat/<short>`, `fix/<short>`, `chore/<short>`, or `docs/<short>`
2. Make focused commits (one concern per commit). Squashing is fine on merge.
3. Open a PR with:
   - **What** changed
   - **Why** (link to issue, manifest section, or ADR)
   - **Screenshots** for any UI change
   - **Bible session log link** if you wrote one (recommended for any non-trivial work)
4. The orchestrator (Claude) or Brogle reviews. Fast turnaround for low-risk changes.

---

## Logging back to the bible

Every meaningful work session should log to the SoftKnox project bible at:

`~/.openclaw/workspace/softknox/projects/plusone/sessions/YYYY-MM-DD_topic.md`

Template:
```markdown
# Session — YYYY-MM-DD — <topic>
> Surface: <Codex / Claude / etc.>
> Duration: ~Xh

## What was decided
## What was built (file paths)
## What was deferred
## Pushback Duty items raised
## Open questions for next session
```

If you snapshot a load-bearing file (schema, edge function, auth gate), copy it to:

`~/.openclaw/workspace/softknox/projects/plusone/code-snapshots/YYYY-MM-DD/<filename>`

---

## When in doubt

- Read the **manifest** at `~/.openclaw/workspace/softknox/projects/plusone/manifest.md` for the strategic context
- Read **ADRs** in `~/.openclaw/workspace/softknox/decisions/` for architectural decisions
- Read recent **session logs** in `~/.openclaw/workspace/softknox/projects/plusone/sessions/` for current state
- Read this file's referenced TODOs in the project; surface anything that conflicts

If a question stays open, write a comment in the PR like `// AGENT-QUESTION:` and the human reviewer will pick it up.

---

## Active TODOs (high priority)

These come from the most recent session log + audit:

- [ ] Apply chosen logo + palette across app once Brogle picks (currently iterating on `dashboard/logo-recolor.html`)
- [ ] Realign welcome page copy around anti-bot framing (NOT exclusivity)
- [ ] Build 4-tier verification UX (LAW #1)
- [ ] Build onboarding quiz (writes to `user_preferences`)
- [ ] Build save / RSVP buttons on event cards (writes to `event_rsvps`)
- [ ] Build communities feature (`communities` + `posts` + `comments` + `votes` schema is ready)
- [ ] Wire NotebookLM Enterprise + Vertex AI Search Web Widget for in-app chat (ADR-002)
- [ ] Build VisitKnoxville scraper (no JSON-LD; HTML parse from category subpages)
- [ ] Build UTK iCal calendar ingester
- [ ] Build Reddit r/Knoxville + r/UTK ingester
- [ ] Wire actual Mapbox view (currently a placeholder in `app/(tabs)/discover.tsx`)
- [ ] Add image upload to onboarding (`expo-image-picker` is installed but unused)
- [ ] Auth: decide email verification ON or OFF for closed beta

Live status: `dashboard/state.json` (polled by `dashboard/dashboard.html` at port 4444).
