// Downtown Knoxville + UTK Campus bounding box
export const KNOXVILLE_BOUNDS = {
  ne: { latitude: 35.975, longitude: -83.905 }, // Northeast corner
  sw: { latitude: 35.945, longitude: -83.945 }, // Southwest corner
};

export const KNOXVILLE_CENTER = {
  latitude: 35.9606,
  longitude: -83.9207,
};

export const DEFAULT_ZOOM = 14;

export const EVENT_CATEGORIES = [
  'music',
  'sports',
  'food',
  'nightlife',
  'festival',
  'study',
  'campus',
  'arts',
  'comedy',
  'other',
] as const;

export const OPENING_TYPES = [
  'spare_ticket',
  'solo_plus_one',
  'group_plus_one',
  'wingman',
  'tailgate_buddy',
  'study_break',
  'other',
] as const;

export const OPENING_TYPE_LABELS: Record<string, string> = {
  spare_ticket: 'Spare Ticket',
  solo_plus_one: 'Solo +1',
  group_plus_one: 'Group +1',
  wingman: 'Wingman/Wingwoman',
  tailgate_buddy: 'Tailgate Buddy',
  study_break: 'Study Break +1',
  other: 'Other',
};

export const CATEGORY_ICONS: Record<string, string> = {
  music: 'music',
  sports: 'football',
  food: 'restaurant',
  nightlife: 'moon',
  festival: 'star',
  study: 'book',
  campus: 'school',
  arts: 'color-palette',
  comedy: 'happy',
  other: 'ellipsis-horizontal',
};

// Brand colors — Warm & Inviting
export const COLORS = {
  primary: '#E8593A',     // Warm coral
  secondary: '#D4572A',   // Deeper coral
  accent: '#D4A574',      // Warm amber
  background: '#FFF9F5',  // Soft cream
  surface: '#FFFFFF',     // White cards
  surfaceLight: '#FFF0E8', // Light peach
  text: '#2D1810',        // Warm dark brown
  textSecondary: '#9B7B6B', // Muted warm brown
  success: '#2D8B4E',
  warning: '#C4850C',
  error: '#D4382C',
  border: '#F0DDD0',      // Warm border
};
