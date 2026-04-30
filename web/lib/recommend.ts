import { bars } from "./mockData";
import type { Bar } from "./types";

type Intent = {
  solo: boolean;
  meetPeople: boolean;
  budget: "cheap" | "midrange" | "splurge" | null;
  vibes: string[];
};

const VIBE_KEYWORDS: Record<string, string[]> = {
  dive: ["dive", "hole-in-the-wall", "cheap"],
  cozy: ["cozy", "chill", "intimate", "quiet"],
  dance: ["dance", "club", "edm", "loud", "party"],
  upscale: ["upscale", "fancy", "rooftop", "skyline", "date"],
  speakeasy: ["speakeasy", "jazz", "cocktail", "live music"],
  sports: ["sports", "game", "watch party", "jersey"],
  trivia: ["trivia"],
  conversation: ["conversation", "talk"],
  "late-night": ["late", "after midnight", "after 11", "late-night"],
};

export function parseIntent(input: string): Intent {
  const q = input.toLowerCase();
  const solo =
    /\b(alone|solo|by myself|on my own|single)\b/.test(q) || /going alone/.test(q);
  const meetPeople =
    /(meet|meeting) (new )?(people|friends|someone|girls|guys)/.test(q) ||
    /\b(strangers|new people|chat people up|mingl)/.test(q);
  let budget: Intent["budget"] = null;
  if (/\b(cheap|broke|budget|dive)\b/.test(q)) budget = "cheap";
  else if (/\b(splurge|fancy|upscale|nice|date night)\b/.test(q)) budget = "splurge";
  else if (/\b(midrange|moderate)\b/.test(q)) budget = "midrange";

  const vibes: string[] = [];
  for (const [vibe, words] of Object.entries(VIBE_KEYWORDS)) {
    if (words.some(w => q.includes(w))) vibes.push(vibe);
  }
  return { solo, meetPeople, budget, vibes };
}

export type Scored = { bar: Bar; score: number; reasons: string[] };

export function recommend(input: string, limit = 3): { intent: Intent; results: Scored[] } {
  const intent = parseIntent(input);
  const scored: Scored[] = bars.map(bar => {
    let score = 0;
    const reasons: string[] = [];
    if (intent.solo) {
      score += bar.soloFriendly * 2;
      if (bar.soloFriendly >= 4) reasons.push(`solo-friendly (${bar.soloFriendly}/5)`);
    }
    if (intent.meetPeople) {
      score += bar.meetPeople * 2;
      if (bar.meetPeople >= 4) reasons.push(`great for meeting people (${bar.meetPeople}/5)`);
    }
    for (const v of intent.vibes) {
      if (bar.vibe.includes(v)) {
        score += 3;
        reasons.push(`matches “${v}”`);
      }
    }
    if (intent.budget === "cheap" && bar.priceLevel <= 2) {
      score += 2;
      reasons.push("budget-friendly");
    }
    if (intent.budget === "splurge" && bar.priceLevel >= 3) {
      score += 2;
      reasons.push("upscale pricing");
    }
    if (!intent.solo && !intent.meetPeople && intent.vibes.length === 0) {
      score += bar.soloFriendly + bar.meetPeople;
      reasons.push("good general pick");
    }
    return { bar, score, reasons };
  });
  scored.sort((a, b) => b.score - a.score);
  return { intent, results: scored.slice(0, limit) };
}

export function summarize(intent: Intent, results: Scored[]): string {
  if (results.length === 0) return "I couldn't find anything that fits — try describing the vibe.";
  const tags: string[] = [];
  if (intent.solo) tags.push("going alone");
  if (intent.meetPeople) tags.push("meeting new people");
  if (intent.budget) tags.push(intent.budget);
  tags.push(...intent.vibes);
  const lead = tags.length
    ? `For ${tags.join(", ")}, here are my picks:`
    : "Here are a few solid bars near you:";
  return lead;
}
