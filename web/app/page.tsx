import Link from "next/link";
import FriendsOutTonight from "@/components/FriendsOutTonight";
import { bars, currentUserId, getBar, users } from "@/lib/mockData";
import type { Bar, User } from "@/lib/types";

export default function HomePage() {
  const friendsOut = users.filter(u => u.id !== currentUserId && u.outTonight);
  const grouped = new Map<string, { bar: Bar; friends: User[] }>();
  for (const f of friendsOut) {
    const bar = getBar(f.outTonight!.venueId);
    if (!bar) continue;
    if (!grouped.has(bar.id)) grouped.set(bar.id, { bar, friends: [] });
    grouped.get(bar.id)!.friends.push(f);
  }
  const groups = Array.from(grouped.values()).sort((a, b) => b.friends.length - a.friends.length);

  return (
    <div className="space-y-10">
      <section className="glass rounded-3xl p-6 sm:p-8">
        <p className="text-sm uppercase tracking-widest text-neon/80">Tonight</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Going out is better with a plus one.</h1>
        <p className="mt-2 max-w-2xl text-white/70">
          See who&apos;s out, broadcast that you need a wingman, ask the AI for the right bar — and pull
          your people together before the night gets away.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/wingman?compose=1"
            className="rounded-full bg-neon px-4 py-2 text-sm font-semibold text-ink"
          >
            I&apos;m going out tonight — need a wingman
          </Link>
          <Link
            href="/bars"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/5"
          >
            Ask AI: where should I go?
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-sm sm:max-w-md">
          <Stat label="Friends out" value={friendsOut.length} />
          <Stat label="Open wingman calls" value={2} />
          <Stat label="Bars near you" value={bars.length} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Your people, right now</h2>
        <p className="text-sm text-white/60">Pull up, link up, or send a message.</p>
        <div className="mt-4">
          <FriendsOutTonight groups={groups} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <PromoCard
          eyebrow="New"
          title="Secret Societies"
          body="Quiet rooms, curated invites. See if any of your circles have a chair open."
          href="/societies"
        />
        <PromoCard
          eyebrow="Greek life"
          title="Members-only events"
          body="Mixers, formals, philanthropy nights — verified Greeks only."
          href="/greek"
        />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
    </div>
  );
}

function PromoCard({
  eyebrow,
  title,
  body,
  href,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link href={href} className="glass block rounded-2xl p-5 transition hover:bg-white/[0.06]">
      <p className="text-xs uppercase tracking-widest text-cyan">{eyebrow}</p>
      <h3 className="mt-1 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-white/70">{body}</p>
      <p className="mt-3 text-sm font-medium text-neon">Open →</p>
    </Link>
  );
}
