import { NextResponse } from "next/server";
import { recommend, summarize } from "@/lib/recommend";

export const runtime = "edge";

export async function POST(req: Request) {
  const { message } = (await req.json()) as { message?: string };
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }
  const { intent, results } = recommend(message);
  return NextResponse.json({
    intent,
    summary: summarize(intent, results),
    results: results.map(r => ({
      id: r.bar.id,
      name: r.bar.name,
      neighborhood: r.bar.neighborhood,
      description: r.bar.description,
      vibe: r.bar.vibe,
      priceLevel: r.bar.priceLevel,
      soloFriendly: r.bar.soloFriendly,
      meetPeople: r.bar.meetPeople,
      reasons: r.reasons,
    })),
  });
}
