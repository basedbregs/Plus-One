# Plus One

> **A hyperlocal social platform for Knoxville, TN.** Real humans only. No bots. No fakes. Built on the thesis that early-Facebook magic — real people, real places, real plans — got lost when the internet optimized for retention. Plus One starts in Downtown Knoxville + UTK Campus and expands outward.

**Domain:** [plusoneknox.com](https://plusoneknox.com) (in development)
**Stack:** Expo / React Native + Supabase + (planned: NotebookLM Enterprise + Vertex AI Search Web Widget)
**Status:** in-progress, pre-launch
**Owner:** Bryce Ogle ([SoftKnox LLC](https://softknox.com))

---

## The THREE LAWS

These are non-negotiable product principles. Any feature proposal that violates one is rejected.

1. **Absolutely everyone is a real human.** Verified at signup via one of four paths: `.edu` email from UTK / Maryville / Pellissippi / Carson-Newman / etc.; in-person sign-up at a partner venue; vouching by 2 verified users (after 100-user threshold); 3 cross-validated social media accounts.

2. **Plus One will never combine infinite content with retention as the objective function.** Algorithms can optimize for user value (event-find rate, match satisfaction, AI answer quality). They cannot optimize for time-in-app, scroll-depth, swipe-count, or watch-time. Doom-scroll feeds are bounded by real supply or ordered by recency / randomness, never retention-tuned.

3. **The product knows everything about Knoxville.** A frontier-level AI grounded in the full Knoxville corpus — every business, event, hidden gem, scheduled happening, daily special, neighborhood quirk. Goal-state: ask "what's the best karaoke spot that has good food but isn't too loud?" and get the right answer with a citation.

The full canonical version of these laws + their reasoning lives in the [project bible](#project-bible).

---

## Quick start

```bash
git clone https://github.com/basedbregs/plusone.git
cd plusone
npm install
cp .env.example .env.local
# Fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
npx expo start --web
```

The app opens at `http://localhost:8081`.

### Test accounts (dev only)

| Email | Password | Notes |
|---|---|---|
| `test@utk.edu` | `test1234` | "Knox Tester" — onboarding complete |
| `test2@utk.edu` | `test1234` | "Smokey Vol" — onboarding complete |

The sign-in screen has a **Dev Bypass** button (visible only when `__DEV__`) that auto-signs in as `test@utk.edu`.

---

## Project structure

```
PlusOne/
├── app/                          # Expo Router file-based routes
│   ├── welcome.tsx               # Public landing (browse-before-signup)
│   ├── index.tsx                 # Auth-state router
│   ├── _layout.tsx               # Root layout with AuthGate
│   ├── (auth)/                   # Sign-in, Sign-up
│   ├── (onboarding)/             # Profile setup
│   ├── (tabs)/                   # Discover, Openings, Activity, Profile
│   ├── event/[id].tsx            # Event detail
│   ├── opening/[id].tsx          # +1 opening detail
│   ├── chat/[matchId].tsx        # Realtime chat
│   └── post-opening.tsx          # Create a +1 opening
├── components/                   # Reusable UI (EventCard, OpeningCard)
├── lib/
│   ├── supabase.ts               # Supabase client (env-driven)
│   ├── types.ts                  # Generated Postgres types
│   └── constants.ts              # Brand COLORS, categories, bounds
├── hooks/                        # Custom hooks (useAuth — deprecated, use authStore)
├── stores/
│   └── authStore.ts              # Zustand auth state machine
├── supabase/
│   ├── functions/                # Edge functions (Deno)
│   │   └── scrape-facebook-events/   # Apify-driven FB Events ingestion
│   └── migrations/               # SQL migrations (append-only)
├── dashboard/                    # Local orchestrator dashboard (port 4444)
├── assets/                       # Images, fonts
├── AGENTS.md                     # Read this if you're an AI agent
└── CLAUDE.md                     # Read this if you're Claude Code
```

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Mobile/Web | Expo (React Native) + Expo Router | File-based routing, web export via Metro |
| Backend | Supabase (Postgres + Auth + Edge Functions + Realtime + Storage) | Project ID: `utoykngdauuglqttjlvw` |
| Database extensions | PostGIS, pgvector, pg_cron, pg_net | Geofencing, embeddings, scheduled jobs |
| State | Zustand (auth) + TanStack Query (server state) | |
| Styling | Inline StyleSheet (no Tailwind/NativeWind currently) | |
| Maps | (planned) Mapbox | Bounded to Downtown Knoxville + UTK Campus |
| In-app AI chat | (planned) NotebookLM Enterprise + Vertex AI Search Web Widget | per ADR-002 |
| Hosting (web) | Vercel | Static export from `npx expo export -p web` |
| Hosting (mobile) | EAS Build (planned) | iOS + Android via Expo Application Services |

---

## Database

8 core tables + 11 AI concierge tables, all with RLS:

**Core:** `profiles`, `venues`, `events`, `openings`, `applications`, `matches`, `messages`, `ratings`

**AI Concierge:** `user_preferences`, `interactions`, `event_rsvps`, `communities`, `community_members`, `posts`, `comments`, `votes`, `knowledge_chunks` (pgvector HNSW), `ai_conversations`, `ai_messages`

Migrations are append-only and live in `supabase/migrations/`. To regenerate types:

```bash
npx supabase gen types typescript --project-id utoykngdauuglqttjlvw > lib/types.ts
```

---

## Scheduled tasks

The Apify Facebook Events scraper runs daily at **6am UTC (1am Knoxville)** via `pg_cron`. It pulls public events from Facebook for Knoxville-area searches, filters to the Downtown + UTK bounding box, deduplicates by source URL, and inserts into `events`.

Requires `APIFY_API_TOKEN` and `plusone_service_role_key` in Supabase Vault. See `.env.example` for the full list of server-side secrets.

---

## Branding

- **Theme:** warm cream (`#FFF9F5`) + coral (`#E8593A`) accents — refined throughout `lib/constants.ts`
- **Voice:** real-humans-first, anti-bot, friendly. NOT velvet-rope or members-only-feeling.
- **Logo:** WIP. See `dashboard/logo-recolor.html` for the current candidate matrix.

---

## Project bible

The full strategic context — sale thesis, target buyer, beta test plan, verification strategy, AI provider decisions — lives in the SoftKnox project bible:

`~/.openclaw/workspace/softknox/projects/plusone/`

Key documents:
- `manifest.md` — canonical product description
- `BETA_TEST_PLAN.md` — empirical test of LAW #2
- `corpus/` — Knoxville knowledge base (LAW #3 seed, ~9,578 words)
- `sessions/` — session logs from each focused work session
- `PLAN_2026-04-17_GITHUB_VERCEL_CODEX.md` — current handoff plan
- `decisions/ADR-002-in-app-chat-providers.md` — AI chat stack rationale

---

## Contributing (and AI agents)

Any AI agent (Codex, future Claude sessions, etc.) should read `AGENTS.md` first. It captures conventions, what to touch / not touch, and how to log work back to the bible.

**For all contributors:**
1. Branch off `main`, name it `feat/<short-desc>`, `fix/<short-desc>`, or `chore/<short-desc>`
2. Open a PR; reference the corresponding bible session log if you wrote one
3. Schema changes require an ADR in the bible's `decisions/` folder
4. Don't commit secrets; `.env.local` is the only place for keys, and it's gitignored

---

## License

UNLICENSED — proprietary. SoftKnox LLC, all rights reserved (filing pending).
