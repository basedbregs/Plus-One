import Link from "next/link";

const links = [
  { href: "/", label: "Tonight" },
  { href: "/wingman", label: "Wingman" },
  { href: "/bars", label: "Find a bar" },
  { href: "/societies", label: "Societies" },
  { href: "/greek", label: "Greek" },
];

export default function Nav() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-neon text-ink font-black">+1</span>
        <span className="text-lg font-semibold tracking-tight">Plus One</span>
      </Link>
      <nav className="glass rounded-full px-2 py-1">
        <ul className="flex items-center gap-1 text-sm">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-full px-3 py-1.5 text-white/80 hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
