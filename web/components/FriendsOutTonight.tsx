"use client";

import { useState } from "react";
import Avatar from "./Avatar";
import { timeAgo } from "@/lib/format";
import type { Bar, User } from "@/lib/types";

type Group = { bar: Bar; friends: User[] };

export default function FriendsOutTonight({ groups }: { groups: Group[] }) {
  if (groups.length === 0) {
    return (
      <p className="text-white/60">
        None of your friends are out yet. Be the first — head to{" "}
        <a className="text-neon underline" href="/wingman">
          Wingman
        </a>{" "}
        to broadcast.
      </p>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {groups.map(g => (
        <FriendGroup key={g.bar.id} bar={g.bar} friends={g.friends} />
      ))}
    </div>
  );
}

function FriendGroup({ bar, friends }: { bar: Bar; friends: User[] }) {
  const [sent, setSent] = useState(false);
  const names = friends.map(f => f.name);
  const headline =
    names.length === 1
      ? `${names[0]} is out tonight!`
      : names.length === 2
        ? `${names[0]} and ${names[1]} are out tonight!`
        : `${names.slice(0, -1).join(", ")} and ${names.at(-1)} are out tonight!`;
  return (
    <article className="glass rounded-2xl p-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold leading-tight">{headline}</h3>
          <p className="text-sm text-white/60">
            At <span className="text-white">{bar.name}</span> · {bar.neighborhood}
          </p>
        </div>
        <div className="flex -space-x-2">
          {friends.map(f => (
            <Avatar key={f.id} name={f.name} color={f.avatarColor} size={32} />
          ))}
        </div>
      </header>
      <ul className="mt-3 space-y-1 text-sm text-white/70">
        {friends.map(f => (
          <li key={f.id}>
            <span className="text-white">{f.name}</span> · arrived {timeAgo(f.outTonight!.arrivedAt)}
            {f.outTonight?.note && <span className="text-white/60"> — “{f.outTonight.note}”</span>}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setSent(true)}
          disabled={sent}
          className="rounded-full bg-neon px-3 py-1.5 text-sm font-semibold text-ink disabled:opacity-50"
        >
          {sent ? "Message sent ✓" : "Send a message to link up"}
        </button>
        <a
          href={`/bars#${bar.id}`}
          className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/80 hover:bg-white/5"
        >
          About {bar.name}
        </a>
      </div>
    </article>
  );
}
