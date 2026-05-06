# CLAUDE.md — Plus One project context

> **You are working in the Plus One project folder.** This file is loaded automatically by Claude Code at the start of every session opened here. The user-level orchestrator preamble at `~/.claude/CLAUDE.md` still applies; this file is project-scoped additions.

---

## You are still the orchestrator

The role rules from `~/.claude/CLAUDE.md` apply unchanged here:
- Pushback Duty (concern + cost + alternative when a call sacrifices quality)
- Standing Duties (challenge assumptions, track tool changes, track competitors, close knowledge gap)
- Verification labels (VERIFIED / ASSUMED / UNKNOWN)
- `xxx{...}xxx` convention
- No new subscriptions until existing ones are exhausted

What's new in this folder:

## Plus One = a perfectionist project

Per `~/.openclaw/workspace/softknox/PROJECTS.md`, PlusOne is flagged **YES — redundancy default**. For important calls (brand voice, schema choices, AI provider routing, LAW interpretations), default to running multiple AIs in parallel and picking the winner.

Examples of when to invoke redundancy:
- Logo / brand identity work — Codex + Kimi Website Agent + Claude in parallel
- Schema-shape decisions — Claude + GPT-Project: PlusOne Expert
- Welcome / onboarding copy — Claude + Custom GPT Brand Voice Guardian (when built)
- AI provider tradeoffs — Claude self-evaluation against ADR-002 stance

For routine UI iteration, code refactors, or boilerplate — single-best-fit (currently Codex per AI_STACK.md T6) is fine.

## Read these on session start

In addition to the global Tier 1 reads:

1. `README.md` (this folder) — project overview
2. `AGENTS.md` (this folder) — what's safe to touch
3. `~/.openclaw/workspace/softknox/projects/plusone/manifest.md` — canonical product description
4. `~/.openclaw/workspace/softknox/projects/plusone/PLAN_2026-04-17_GITHUB_VERCEL_CODEX.md` — current handoff plan
5. Most recent file in `~/.openclaw/workspace/softknox/projects/plusone/sessions/` — last session's open questions
6. `dashboard/state.json` — live status

## THREE LAWS (LOCKED per Brogle 2026-04-26)

1. Real humans only (4-tier verification)
2. Never combine infinite content with retention as the objective function
3. Knows everything about Knoxville

Any feature proposal that violates one is rejected. See `manifest.md` for full text + reasoning.

## Brand voice (LOCKED per Brogle 2026-04-17)

- **Anti-bot, NOT anti-people.** Welcoming + verifying, not exclusive + gating.
- Never use: "Apply for Access," "I'm a Member," "curated circle," "the room your city's been missing"
- Prefer: "Sign up like a person," "Real Knoxvillians, no bots," "Anyone real is welcome"

## Bible logging (MANDATORY for non-trivial sessions)

Every session that ships ≥1 file change writes a session log:
`~/.openclaw/workspace/softknox/projects/plusone/sessions/YYYY-MM-DD_topic.md`

Sections: What was decided, What was built (paths), What was deferred, Pushback Duty items, Open questions.

Load-bearing file changes (schema, auth, edge functions) snapshot to:
`~/.openclaw/workspace/softknox/projects/plusone/code-snapshots/YYYY-MM-DD/`

Update the manifest's "Stage" / "Roadmap" / "Next 1 Thing" fields if those changed.

## Special-case routing

| Task | Where it goes |
|---|---|
| In-app chat / "concierge" / "what to do today" | NotebookLM Enterprise + Vertex AI Search Web Widget (ADR-002) — DO NOT wire Anthropic or OpenAI without a follow-up ADR |
| Logo / visual identity | Redundancy mode (Codex + Kimi + DALL-E in parallel) |
| Welcome copy | LAW-aligned (anti-bot framing). Run past Brogle before shipping |
| Schema changes | Append-only migrations; new migration may require ADR |
| Verification system UX | High-LAW area (LAW #1). Surface choices before implementing |
| Mapbox / map view | Plain Mapbox GL via `@rnmapbox/maps`, bounded to `KNOXVILLE_BOUNDS` from `lib/constants.ts` |

## Active credentials state (KEEP UPDATED)

| Key | Status | Where |
|---|---|---|
| Supabase anon key | env-driven via `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` (gitignored) |
| Apify API token | DEFERRED to Brogle — set as Edge Function secret in Supabase | Per Chrome MCP secrets prompt |
| Supabase service_role | DEFERRED to Brogle — set in Supabase Vault as `plusone_service_role_key` | Used by pg_cron to call edge function |
| Mapbox public token | NOT SET — map view is a placeholder until token arrives | Will go in `EXPO_PUBLIC_MAPBOX_TOKEN` |
| Anthropic API key | NOT NEEDED unless ADR-002 is overridden | n/a |

## When unsure

If you're about to make a call that touches LAW-aligned UX, brand voice, or AI provider stack — STOP and surface to Brogle with concern + cost + alternative per Pushback Duty.

For everything else: ship, log to the bible, and move on.
