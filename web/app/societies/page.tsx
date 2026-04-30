import Link from "next/link";
import { currentUserId, getUser, societies, users } from "@/lib/mockData";
import type { SecretSociety, User } from "@/lib/types";

export const metadata = { title: "Secret Societies · Plus One" };

export default function SocietiesPage() {
  const me = getUser(currentUserId)!;
  const myIds = new Set(me.societyIds);
  const mine = societies.filter(s => myIds.has(s.id));
  const others = societies.filter(s => !myIds.has(s.id));

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-widest text-cyan">Sealed Rooms</p>
        <h1 className="mt-1 text-3xl font-bold">Secret Societies</h1>
        <p className="mt-2 max-w-2xl text-white/70">
          Curated, low-key, invitation-only groups. Some rooms you&apos;re already in. Others, you can
          knock — but they decide who comes through.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold">Your societies</h2>
        {mine.length === 0 ? (
          <p className="mt-2 text-sm text-white/60">No memberships yet. The right invite finds you.</p>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {mine.map(s => (
              <MemberCard key={s.id} s={s} members={users.filter(u => u.societyIds.includes(s.id))} />
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold">Other rooms</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {others.map(s => (
            <NonMemberCard key={s.id} s={s} />
          ))}
        </ul>
      </section>

      <p className="text-xs text-white/40">
        Don&apos;t see your circle?{" "}
        <Link className="underline" href="#">
          Propose a society →
        </Link>
      </p>
    </div>
  );
}

function MemberCard({ s, members }: { s: SecretSociety; members: User[] }) {
  return (
    <li className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{s.name}</h3>
          <p className="mt-0.5 text-sm italic text-white/70">“{s.motto}”</p>
        </div>
        <span className="pill bg-gold/20 text-gold">Member</span>
      </div>
      <p className="mt-3 text-sm text-white/70">
        {s.memberCount} members · {members.length} you know
      </p>
      <div className="mt-4 flex gap-2">
        <button className="rounded-full bg-neon px-3 py-1.5 text-sm font-semibold text-ink">
          Open chamber
        </button>
        <button className="rounded-full border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5">
          Tonight&apos;s gathering
        </button>
      </div>
    </li>
  );
}

function NonMemberCard({ s }: { s: SecretSociety }) {
  return (
    <li className="glass rounded-2xl p-5 opacity-90">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{s.name}</h3>
          <p className="mt-0.5 text-sm italic text-white/60">“{s.motto}”</p>
        </div>
        <span
          className={
            s.invitationOnly
              ? "pill bg-white/10 text-white/60"
              : "pill bg-cyan/20 text-cyan"
          }
        >
          {s.invitationOnly ? "Invite only" : "Knock to enter"}
        </span>
      </div>
      <p className="mt-3 text-sm text-white/60">{s.memberCount} members · details sealed</p>
      <div className="mt-4 flex gap-2">
        {s.invitationOnly ? (
          <button
            disabled
            className="cursor-not-allowed rounded-full border border-white/10 px-3 py-1.5 text-sm text-white/50"
          >
            Awaiting invitation
          </button>
        ) : (
          <button className="rounded-full border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5">
            Request entry
          </button>
        )}
      </div>
    </li>
  );
}
