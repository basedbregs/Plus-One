"use client";

import { useEffect, useMemo, useState } from "react";
import Avatar from "./Avatar";
import { timeUntil } from "@/lib/format";
import { getUser } from "@/lib/mockData";
import type { WingmanRequest } from "@/lib/types";

type Props = { initial: WingmanRequest[]; currentUserId: string; openComposer: boolean };

const STORAGE_KEY = "plus-one:wingman:v1";

export default function WingmanBoard({ initial, currentUserId, openComposer }: Props) {
  const [requests, setRequests] = useState<WingmanRequest[]>(initial);
  const [composerOpen, setComposerOpen] = useState(openComposer);
  const [matched, setMatched] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { added?: WingmanRequest[]; matched?: string[] };
        if (parsed.added?.length) setRequests(prev => [...parsed.added!, ...prev]);
        if (parsed.matched?.length) setMatched(new Set(parsed.matched));
      }
    } catch {
      // ignore
    }
  }, []);

  function persist(next: WingmanRequest[], nextMatched: Set<string>) {
    const added = next.filter(r => !initial.some(i => i.id === r.id));
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ added, matched: Array.from(nextMatched) }),
    );
  }

  function addRequest(r: WingmanRequest) {
    setRequests(prev => {
      const next = [r, ...prev];
      persist(next, matched);
      return next;
    });
  }

  function toggleMatch(id: string) {
    setMatched(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      persist(requests, next);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Wingman board</h2>
          <p className="text-sm text-white/60">
            Broadcast that you&apos;re going out, or hop on someone else&apos;s call.
          </p>
        </div>
        <button
          onClick={() => setComposerOpen(o => !o)}
          className="rounded-full bg-neon px-4 py-2 text-sm font-semibold text-ink"
        >
          {composerOpen ? "Close" : "I'm going out tonight — need a wingman"}
        </button>
      </div>

      {composerOpen && (
        <Composer
          onSubmit={r => {
            addRequest(r);
            setComposerOpen(false);
          }}
          currentUserId={currentUserId}
        />
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {requests.map(r => (
          <RequestCard
            key={r.id}
            r={r}
            mine={r.userId === currentUserId}
            matched={matched.has(r.id)}
            onMatch={() => toggleMatch(r.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function Composer({
  onSubmit,
  currentUserId,
}: {
  onSubmit: (r: WingmanRequest) => void;
  currentUserId: string;
}) {
  const [area, setArea] = useState("Downtown");
  const [vibe, setVibe] = useState("low-key, dive bar");
  const [whenOffset, setWhenOffset] = useState(60);
  const [note, setNote] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      id: `wm-${Date.now()}`,
      userId: currentUserId,
      area,
      vibe,
      when: new Date(Date.now() + whenOffset * 60_000).toISOString(),
      note: note.trim() || undefined,
      status: "open",
    });
  }

  return (
    <form onSubmit={submit} className="glass space-y-3 rounded-2xl p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Area">
          <input
            value={area}
            onChange={e => setArea(e.target.value)}
            className="input"
            placeholder="Downtown"
          />
        </Field>
        <Field label="Vibe">
          <input
            value={vibe}
            onChange={e => setVibe(e.target.value)}
            className="input"
            placeholder="dance, late-night"
          />
        </Field>
        <Field label="Heading out">
          <select
            value={whenOffset}
            onChange={e => setWhenOffset(Number(e.target.value))}
            className="input"
          >
            <option value={15}>in 15 min</option>
            <option value={30}>in 30 min</option>
            <option value={60}>in 1 hr</option>
            <option value={120}>in 2 hrs</option>
          </select>
        </Field>
      </div>
      <Field label="Note (optional)">
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
          className="input"
          placeholder="Two-for-one wells until 10. Pull up."
        />
      </Field>
      <div className="flex justify-end">
        <button className="rounded-full bg-neon px-4 py-2 text-sm font-semibold text-ink">
          Broadcast
        </button>
      </div>
    </form>
  );
}

function RequestCard({
  r,
  mine,
  matched,
  onMatch,
}: {
  r: WingmanRequest;
  mine: boolean;
  matched: boolean;
  onMatch: () => void;
}) {
  const user = useMemo(() => getUser(r.userId), [r.userId]);
  const name = mine ? "You" : user?.name ?? "Someone";
  const color = user?.avatarColor ?? "#888";
  return (
    <li className="glass rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <Avatar name={name} color={color} />
        <div className="flex-1">
          <p className="font-semibold">
            {name} needs a wingman {timeUntil(r.when)}
          </p>
          <p className="text-sm text-white/70">
            {r.area} · {r.vibe}
          </p>
          {r.note && <p className="mt-2 text-sm italic text-white/60">“{r.note}”</p>}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {mine ? (
          <span className="pill bg-white/10 text-white/70">Your call · waiting for matches</span>
        ) : (
          <button
            onClick={onMatch}
            className={
              matched
                ? "rounded-full bg-cyan px-3 py-1.5 text-sm font-semibold text-ink"
                : "rounded-full border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5"
            }
          >
            {matched ? "Matched ✓ — say hi" : "I'm in"}
          </button>
        )}
      </div>
    </li>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="text-white/60">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
