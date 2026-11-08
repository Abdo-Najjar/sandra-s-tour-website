import { conform } from "./shape";

// Extra tour fields stored in the `details` JSON column. Arrays hold one
// sample item that defines the shape of each entry (an empty tour gets []).
export const tourDetailsTemplate = {
  badge: "", // badge on the card, e.g. "UNESCO Highlights"
  subtitle: "", // italic line under the title on the tour page
  durationLabel: "", // "10 Days / 9 Nights"
  groupIcon: "group",
  groupLabel: "", // "Max 8 Guests"
  pace: "", // "Moderate"
  departureIcon: "verified",
  departure: "", // "Fixed departure: 1st & 3rd Saturday of every month"
  departureTag: "", // "All months"
  rating: "", // "4.98"
  reviews: "", // "42"
  route: "", // "Ministry Route #482"
  checklist: [""],
  specs: [{ icon: "", label: "", value: "", note: "" }],
  gallery: [{ image: "", kicker: "", title: "", text: "" }],
  overviewEyebrow: "",
  overviewTitle: "",
  overview: "",
  quote: "",
  quoteBy: "",
  highlights: [{ icon: "", title: "", text: "" }],
  itinerary: [{ title: "", subtitle: "", body: "" }],
  includes: [""],
  excludes: [""],
  logistics: [{ icon: "", title: "", text: "" }],
  testimonials: [{ quote: "", name: "", role: "", date: "" }],
  faq: [{ q: "", a: "" }],
  mapImage: "",
  mapRoute: "",
  mapDistance: "",
};

export type TourDetails = typeof tourDetailsTemplate;

export const emptyTourDetails: TourDetails = conform({}, tourDetailsTemplate);
for (const [k, v] of Object.entries(tourDetailsTemplate)) {
  if (Array.isArray(v)) (emptyTourDetails as Record<string, unknown>)[k] = [];
}

export function tourDetails(stored: unknown): TourDetails {
  const d = conform(stored, tourDetailsTemplate);
  // conform() keeps the sample item when an array is missing; drop it.
  const src = (stored && typeof stored === "object" ? stored : {}) as Record<string, unknown>;
  for (const [k, v] of Object.entries(tourDetailsTemplate)) {
    if (Array.isArray(v) && !Array.isArray(src[k])) (d as Record<string, unknown>)[k] = [];
  }
  return d;
}

// Labels for each group are in i18n.ts (ui.durationGroups).
export const tourDurationGroups = [
  { key: "short", min: 1, max: 3 },
  { key: "medium", min: 4, max: 7 },
  { key: "long", min: 8, max: 999 },
] as const;

// ---------- Arabic versions ----------
// Tours, posts and pages keep their Arabic text in an `ar` JSON column.
// Any empty Arabic field falls back to the English one.

export const tourArTemplate = { title: "", summary: "", details: tourDetailsTemplate };
export const postArTemplate = { title: "", category: "", excerpt: "", author: "", tags: "", body: "" };
export const pageArTemplate = { title: "", subtitle: "", body: "" };

function filled(v: unknown) {
  return typeof v === "string" ? v.trim() !== "" : Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null;
}

// English values overlaid with the non-empty Arabic ones (one level deep).
export function overlay<T extends Record<string, unknown>>(base: T, ar: Partial<T> | undefined): T {
  if (!ar) return base;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(ar)) if (filled(v)) out[k] = v;
  return out as T;
}

// Stored `ar` JSON for a tour: only the keys that were actually given.
export function tourAr(stored: unknown): { title?: string; summary?: string; details?: Partial<TourDetails> } {
  const src = stored && typeof stored === "object" ? (stored as Record<string, unknown>) : {};
  const details = src.details && typeof src.details === "object" ? (src.details as Record<string, unknown>) : {};
  const d: Record<string, unknown> = {};
  for (const [k, t] of Object.entries(tourDetailsTemplate)) {
    if (!(k in details)) continue;
    d[k] = Array.isArray(t) ? (Array.isArray(details[k]) ? conform(details[k], t) : []) : conform(details[k], t);
  }
  return {
    title: typeof src.title === "string" ? src.title : undefined,
    summary: typeof src.summary === "string" ? src.summary : undefined,
    details: d as Partial<TourDetails>,
  };
}
