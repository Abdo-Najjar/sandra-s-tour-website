import type { Lang } from "./i18n";

// Bilingual values as stored in the database:
//   {"en": "Old Damascus", "ar": "دمشق القديمة"}
// An empty Arabic value falls back to the English one on the Arabic website.
export type Tr<En = string, Ar = En> = { en: En; ar: Ar };

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

// A stored text value as {en, ar}. Plain text (older data) counts as English.
export function trText(stored: unknown): Tr {
  if (typeof stored === "string") return { en: stored, ar: "" };
  const o = isObj(stored) ? stored : {};
  return { en: typeof o.en === "string" ? o.en : "", ar: typeof o.ar === "string" ? o.ar : "" };
}

// The text for one language (Arabic falls back to English when empty).
export function pick(stored: unknown, lang: Lang): string {
  const v = trText(stored);
  return lang === "ar" && v.ar.trim() ? v.ar : v.en;
}

export const tr = (en: string, ar = ""): Tr => ({ en, ar });

// A stored {en, ar} object value. An object without en/ar keys (older data) counts as English.
export function trObject(stored: unknown): Tr<unknown> {
  const o = isObj(stored) ? stored : {};
  if (!("en" in o) && !("ar" in o)) return { en: o, ar: {} };
  return { en: o.en, ar: o.ar };
}
