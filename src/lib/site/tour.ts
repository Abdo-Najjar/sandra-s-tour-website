import type { Lang } from "./i18n";
import { conform } from "./shape";
import { trObject, type Tr } from "./translatable";

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

// ---------- Bilingual details ----------
// The `details` column holds {"en": TourDetails, "ar": Partial<TourDetails>}.
// Arabic keeps only the fields that were filled in; the rest falls back to English.

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

// Only the given (non-empty) fields, each in the right shape.
export function partialDetails(stored: unknown): Partial<TourDetails> {
  const src = stored && typeof stored === "object" ? (stored as Record<string, unknown>) : {};
  const d: Record<string, unknown> = {};
  for (const [k, t] of Object.entries(tourDetailsTemplate)) {
    if (!(k in src)) continue;
    const v = Array.isArray(t) ? (Array.isArray(src[k]) ? conform(src[k], t) : []) : conform(src[k], t);
    if (filled(v)) d[k] = v;
  }
  return d as Partial<TourDetails>;
}

export function tourDetailsTr(stored: unknown): Tr<TourDetails, Partial<TourDetails>> {
  const v = trObject(stored);
  return { en: tourDetails(v.en), ar: partialDetails(v.ar) };
}

// The details for one language.
export function localDetails(stored: unknown, lang: Lang): TourDetails {
  const v = tourDetailsTr(stored);
  return lang === "ar" ? overlay(v.en, v.ar) : v.en;
}
