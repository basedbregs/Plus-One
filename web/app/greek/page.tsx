import Link from "next/link";
import {
  currentUserId,
  getGreekOrg,
  getUser,
  greekOrgs,
  users,
} from "@/lib/mockData";

export const metadata = { title: "Greek life · Plus One" };

const eventsByOrg: Record<string, { title: string; when: string; where: string; tag: string }[]> = {
  sae: [
    { title: "Brothers-only mixer with ΔΔΔ", when: "Fri 9:00 PM", where: "Chapter house", tag: "Mixer" },
    { title: "Spring formal headcount", when: "Sun by 6 PM", where: "RSVP", tag: "Formal" },
    { title: "Philanthropy 5K", when: "Sat 8:00 AM", where: "Riverside Park", tag: "Service" },
  ],
  fiji: [
    { title: "FIJI x KKΓ darty", when: "Sat 2:00 PM", where: "House lawn", tag: "Mixer" },
    { title: "Pledge ride-along", when: "Thu 7:00 PM", where: "Chapter house", tag: "Brotherhood" },
  ],
  kkg: [
    { title: "Sisters-only wine night", when: "Wed 8:00 PM", where: "Chapter room", tag: "Sisterhood" },
    { title: "Mixer with ΦΓΔ", when: "Sat 2:00 PM", where: "House lawn", tag: "Mixer" },
  ],
  tridelt: [
    { title: "St. Jude bake sale", when: "Tue 11:00 AM", where: "Quad", tag: "Philanthropy" },
  ],
};

export default function GreekPage() {
  const me = getUser(currentUserId)!;
  const myOrg = me.greekOrgId ? getGreekOrg(me.greekOrgId) : undefined;

  if (!myOrg) {
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <p className="text-xs uppercase tracking-widest text-gold">Members only</p>
        <h1 className="mt-2 text-2xl font-bold">Greek life is verified-only.</h1>
        <p className="mx-auto mt-2 max-w-md text-white/70">
          Verify with your chapter to unlock chapter events, mixers, philanthropy, and Greek-wide
          calendars.
        </p>
        <button className="mt-5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink">
          Verify with my chapter
        </button>
      </div>
    );
  }

  const myEvents = eventsByOrg[myOrg.id] ?? [];
  const sisterFraternities = greekOrgs.filter(g => g.id !== myOrg.id);
  const brothersOrSisters = users.filter(
    u => u.greekOrgId === myOrg.id && u.id !== currentUserId,
  );

  return (
    <div className="space-y-8">
      <header className="glass flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">Verified · Members only</p>
          <h1 className="mt-1 text-3xl font-bold">
            <span className="mr-2 text-gold">{myOrg.letters}</span>
            {myOrg.name}
          </h1>
          <p className="text-sm text-white/70">
            {myOrg.chapter} chapter · {myOrg.kind === "fraternity" ? "Fraternity" : "Sorority"}
          </p>
        </div>
        <div className="text-right text-sm text-white/60">
          <p>{brothersOrSisters.length} {myOrg.kind === "fraternity" ? "brothers" : "sisters"} active</p>
          <Link href="#" className="text-neon underline">Chapter directory →</Link>
        </div>
      </header>

      <section>
        <h2 className="text-lg font-semibold">Chapter events this week</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {myEvents.map(e => (
            <li key={e.title} className="glass rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{e.title}</h3>
                <span className="pill bg-gold/20 text-gold">{e.tag}</span>
              </div>
              <p className="mt-1 text-sm text-white/70">
                {e.when} · {e.where}
              </p>
              <div className="mt-3 flex gap-2">
                <button className="rounded-full bg-neon px-3 py-1.5 text-xs font-semibold text-ink">
                  RSVP
                </button>
                <button className="rounded-full border border-white/15 px-3 py-1.5 text-xs hover:bg-white/5">
                  Bring a +1
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Other Greek orgs on campus</h2>
        <p className="text-sm text-white/60">Cross-chapter mixers, philanthropy collabs, formal swaps.</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {sisterFraternities.map(g => (
            <li key={g.id} className="glass rounded-2xl p-3 text-center">
              <div className="text-2xl font-bold text-gold">{g.letters}</div>
              <div className="text-xs text-white/70">{g.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40">{g.chapter}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
