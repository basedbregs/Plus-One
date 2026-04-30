type Props = { name: string; color: string; size?: number };

export default function Avatar({ name, color, size = 36 }: Props) {
  const initials = name
    .split(" ")
    .map(p => p[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      className="grid place-items-center rounded-full font-semibold text-ink"
      style={{ background: color, width: size, height: size, fontSize: size * 0.42 }}
      aria-label={name}
    >
      {initials}
    </span>
  );
}
