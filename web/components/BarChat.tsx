"use client";

import { useState } from "react";
import { priceTag } from "@/lib/format";

type Result = {
  id: string;
  name: string;
  neighborhood: string;
  description: string;
  vibe: string[];
  priceLevel: number;
  soloFriendly: number;
  meetPeople: number;
  reasons: string[];
};

type Turn = { role: "user" | "assistant"; text: string; results?: Result[] };

const SUGGESTIONS = [
  "What bars are best suited for going alone?",
  "Where can I meet new people tonight?",
  "Cheap dive bar with regulars?",
  "Upscale rooftop for a date night",
  "Late-night dance floor",
];

export default function BarChat() {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);

  async function ask(message: string) {
    if (!message.trim() || loading) return;
    setTurns(t => [...t, { role: "user", text: message }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/bar-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = (await res.json()) as { summary: string; results: Result[] };
      setTurns(t => [...t, { role: "assistant", text: data.summary, results: data.results }]);
    } catch {
      setTurns(t => [
        ...t,
        { role: "assistant", text: "Couldn't reach the recommender. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Find a bar</h2>
        <p className="text-sm text-white/60">
          Ask in your own words — “going alone,” “meeting new people,” “late-night dance,” etc.
        </p>
      </div>

      {turns.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <ul className="space-y-4">
        {turns.map((t, i) => (
          <li key={i} className={t.role === "user" ? "text-right" : ""}>
            <div
              className={
                t.role === "user"
                  ? "inline-block rounded-2xl bg-neon px-4 py-2 text-sm font-medium text-ink"
                  : "glass inline-block max-w-full rounded-2xl px-4 py-3 text-sm"
              }
            >
              {t.text}
            </div>
            {t.results && t.results.length > 0 && (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {t.results.map(r => (
                  <li key={r.id} id={r.id} className="glass rounded-2xl p-4 text-left">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-semibold">{r.name}</h3>
                      <span className="text-xs text-white/50">{priceTag(r.priceLevel)}</span>
                    </div>
                    <p className="text-xs text-white/60">{r.neighborhood}</p>
                    <p className="mt-2 text-sm text-white/80">{r.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {r.vibe.map(v => (
                        <span key={v} className="pill bg-white/10 text-white/70">
                          {v}
                        </span>
                      ))}
                    </div>
                    {r.reasons.length > 0 && (
                      <ul className="mt-3 space-y-0.5 text-xs text-cyan/80">
                        {r.reasons.map(reason => (
                          <li key={reason}>• {reason}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <form
        onSubmit={e => {
          e.preventDefault();
          ask(input);
        }}
        className="glass flex gap-2 rounded-full p-1.5"
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask the bar concierge…"
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/40"
        />
        <button
          disabled={loading || !input.trim()}
          className="rounded-full bg-neon px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50"
        >
          {loading ? "…" : "Ask"}
        </button>
      </form>
    </div>
  );
}
