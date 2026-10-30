import { conform } from "./shape";

// Extra tour fields stored in the `details` JSON column. Arrays hold one
// sample item that defines the shape of each entry (an empty tour gets []).
export const tourDetailsTemplate = {
  badge: "", // English badge on the card, e.g. "UNESCO Highlights"
  badgeAr: "", // Arabic kicker on the card, e.g. "رحلة ثابتة مجدولة"
  subtitle: "", // italic line under the title on the tour page
  durationLabel: "", // "10 Days / 9 Nights"
  groupIcon: "group",
  groupLabel: "", // "Max 8 Guests"
  pace: "", // "Moderate"
  departureIcon: "verified",
  departure: "", // "انطلاق ثابت: السبت الأول والثالث من كل شهر"
  departureTag: "", // "كافة الأشهر"
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

export const tourDurationGroups = [
  { key: "short", label: "جولات قصيرة (1 - 3 أيام)", min: 1, max: 3 },
  { key: "medium", label: "جولات متوسطة (4 - 7 أيام)", min: 4, max: 7 },
  { key: "long", label: "جولات شاملة (8+ أيام)", min: 8, max: 999 },
] as const;
