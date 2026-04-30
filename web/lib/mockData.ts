import type { Bar, GreekOrg, SecretSociety, User, WingmanRequest } from "./types";

export const greekOrgs: GreekOrg[] = [
  { id: "sae", letters: "ΣΑΕ", name: "Sigma Alpha Epsilon", chapter: "Theta", kind: "fraternity" },
  { id: "kkg", letters: "ΚΚΓ", name: "Kappa Kappa Gamma", chapter: "Beta Pi", kind: "sorority" },
  { id: "fiji", letters: "ΦΓΔ", name: "Phi Gamma Delta", chapter: "Iota Mu", kind: "fraternity" },
  { id: "tridelt", letters: "ΔΔΔ", name: "Delta Delta Delta", chapter: "Theta Xi", kind: "sorority" },
];

export const societies: SecretSociety[] = [
  {
    id: "skull-key",
    name: "Skull & Key",
    motto: "Quiet hands, loud nights.",
    invitationOnly: true,
    memberCount: 31,
  },
  {
    id: "midnight-table",
    name: "The Midnight Table",
    motto: "We dine when the city sleeps.",
    invitationOnly: true,
    memberCount: 17,
  },
  {
    id: "order-velvet",
    name: "Order of the Velvet Rope",
    motto: "Doors open for those who knock right.",
    invitationOnly: false,
    memberCount: 84,
  },
];

export const bars: Bar[] = [
  {
    id: "the-corner",
    name: "The Corner",
    neighborhood: "Downtown",
    vibe: ["dive", "cozy", "regulars"],
    soloFriendly: 5,
    meetPeople: 4,
    crowd: "mixed locals, late-20s",
    priceLevel: 1,
    description: "Bartenders remember your name by drink two. A long bar built for solo arrivals.",
  },
  {
    id: "neon-room",
    name: "Neon Room",
    neighborhood: "Warehouse District",
    vibe: ["dance", "loud", "late-night"],
    soloFriendly: 3,
    meetPeople: 5,
    crowd: "early-20s, students, party",
    priceLevel: 2,
    description: "Strangers become friends on the dance floor. Show up after 11.",
  },
  {
    id: "the-study",
    name: "The Study",
    neighborhood: "University Hill",
    vibe: ["chill", "trivia", "conversation"],
    soloFriendly: 5,
    meetPeople: 5,
    crowd: "grad students, young professionals",
    priceLevel: 2,
    description: "Trivia Tuesdays; communal tables; easy to join a group mid-round.",
  },
  {
    id: "rooftop-12",
    name: "Rooftop 12",
    neighborhood: "Midtown",
    vibe: ["upscale", "views", "date"],
    soloFriendly: 2,
    meetPeople: 3,
    crowd: "late-20s, dressed up",
    priceLevel: 4,
    description: "Better with company. Skyline view, $18 cocktails, slow service.",
  },
  {
    id: "back-alley",
    name: "Back Alley",
    neighborhood: "Old Town",
    vibe: ["speakeasy", "intimate", "live music"],
    soloFriendly: 4,
    meetPeople: 4,
    crowd: "mid-20s to 30s, eclectic",
    priceLevel: 3,
    description: "Live jazz Thurs-Sat. Sit at the bar; the regulars will pull you in.",
  },
  {
    id: "tap-house",
    name: "Tap House",
    neighborhood: "Stadium District",
    vibe: ["sports", "casual", "rowdy"],
    soloFriendly: 4,
    meetPeople: 5,
    crowd: "fans, post-game",
    priceLevel: 2,
    description: "Game nights = instant strangers-to-friends. Wear a jersey, get a high-five.",
  },
];

export const users: User[] = [
  {
    id: "you",
    name: "You",
    handle: "@you",
    school: "State U",
    avatarColor: "#ff3da6",
    greekOrgId: "sae",
    societyIds: ["skull-key"],
  },
  {
    id: "bryce",
    name: "Bryce",
    handle: "@bryce",
    school: "State U",
    avatarColor: "#3df0ff",
    greekOrgId: "sae",
    societyIds: [],
    outTonight: {
      venueId: "neon-room",
      arrivedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      note: "Pregaming on the patio. Pull up.",
    },
  },
  {
    id: "ty",
    name: "Ty",
    handle: "@ty",
    school: "State U",
    avatarColor: "#f5c451",
    greekOrgId: "fiji",
    societyIds: ["midnight-table"],
    outTonight: {
      venueId: "neon-room",
      arrivedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    },
  },
  {
    id: "maya",
    name: "Maya",
    handle: "@maya",
    school: "State U",
    avatarColor: "#a78bfa",
    greekOrgId: "kkg",
    societyIds: ["skull-key"],
    outTonight: {
      venueId: "the-study",
      arrivedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      note: "Trivia. We need a 4th.",
    },
  },
  {
    id: "jordan",
    name: "Jordan",
    handle: "@jordan",
    school: "State U",
    avatarColor: "#34d399",
    societyIds: [],
  },
  {
    id: "alex",
    name: "Alex",
    handle: "@alex",
    school: "State U",
    avatarColor: "#f97316",
    greekOrgId: "tridelt",
    societyIds: [],
  },
];

export const wingmanRequestsSeed: WingmanRequest[] = [
  {
    id: "wm-1",
    userId: "jordan",
    when: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    area: "Downtown",
    vibe: "low-key, dive bar",
    note: "First time going out solo in this city — anyone down?",
    status: "open",
  },
  {
    id: "wm-2",
    userId: "alex",
    when: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    area: "Warehouse District",
    vibe: "dance, late-night",
    status: "open",
  },
];

export function getBar(id: string): Bar | undefined {
  return bars.find(b => b.id === id);
}

export function getUser(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function getSociety(id: string): SecretSociety | undefined {
  return societies.find(s => s.id === id);
}

export function getGreekOrg(id: string): GreekOrg | undefined {
  return greekOrgs.find(g => g.id === id);
}

export const currentUserId = "you";
