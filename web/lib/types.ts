export type GreekOrg = {
  id: string;
  letters: string;
  name: string;
  chapter: string;
  kind: "fraternity" | "sorority";
};

export type SecretSociety = {
  id: string;
  name: string;
  motto: string;
  invitationOnly: boolean;
  memberCount: number;
};

export type User = {
  id: string;
  name: string;
  handle: string;
  school: string;
  avatarColor: string;
  greekOrgId?: string;
  societyIds: string[];
  outTonight?: {
    venueId: string;
    arrivedAt: string; // ISO
    note?: string;
  };
};

export type Bar = {
  id: string;
  name: string;
  neighborhood: string;
  vibe: string[];
  soloFriendly: number; // 1-5
  meetPeople: number;   // 1-5
  crowd: string;
  priceLevel: 1 | 2 | 3 | 4;
  description: string;
};

export type WingmanRequest = {
  id: string;
  userId: string;
  when: string; // ISO
  area: string;
  vibe: string;
  note?: string;
  status: "open" | "matched" | "closed";
};
