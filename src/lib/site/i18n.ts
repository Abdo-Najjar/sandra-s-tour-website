// Languages of the public website. English lives at the plain URLs (/tours),
// Arabic under /ar (/ar/tours). Editable text comes from the database (one
// copy per language, see content.ts); the fixed interface labels live in
// src/messages/{en,ar}.json.

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

export const LANGS = ["en", "ar"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

export const isLang = (v: unknown): v is Lang => v === "en" || v === "ar";
export const dirOf = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");

// Site-relative links get the /ar prefix in Arabic. Anchors, external links
// and files (images, uploads) are left alone.
export function localHref(href: string, lang: Lang) {
  if (lang === DEFAULT_LANG || !href.startsWith("/") || href.startsWith("//")) return href;
  if (/^\/(site|uploads|api|_next)(\/|$)/.test(href)) return href;
  if (href === "/ar" || href.startsWith("/ar/") || href.startsWith("/ar?") || href.startsWith("/ar#")) return href;
  return href === "/" ? "/ar" : href.match(/^\/[?#]/) ? `/ar${href.slice(1)}` : `/ar${href}`;
}

// The same page in the other language ("/ar/tours?x" <-> "/tours?x").
export function switchLangHref(pathname: string, to: Lang) {
  const bare = pathname.replace(/^\/(ar|en)(?=\/|$)/, "") || "/";
  return localHref(bare, to);
}

// Path without the language prefix, for "is this menu item active?".
export const stripLang = (pathname: string) => pathname.replace(/^\/(ar|en)(?=\/|$)/, "") || "/";

type Vars = Record<string, string | number>;
const fill = (text: string, vars: Vars) => text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));

// The labels live in src/messages/en.json and src/messages/ar.json ("site").
// Text with {placeholders} becomes a small function here, so pages call
// t.tourCount(3) and get "3 Tours" / "3 رحلات".
function build(m: typeof enMessages.site) {
  return {
    ...m,
    durationGroups: m.durationGroups as Record<string, string>,
    daysRange: (min: number, max: number) => (max < 999 ? fill(m.daysRange, { min, max }) : fill(m.daysFrom, { min })),
    showingRoutes: (shown: number, total: number) => fill(m.showingRoutes, { shown, total }),
    tourCount: (n: number) => (n === 1 ? m.tourCountOne : n === 2 ? m.tourCountTwo : fill(m.tourCountMany, { n })),
    toursAvailable: (n: number) => (n === 1 ? m.toursAvailableOne : fill(m.toursAvailableMany, { n })),
    reviews: (n: string) => fill(m.reviews, { n }),
    verifiedReviews: (n: string) => fill(m.verifiedReviews, { n }),
    viewAllTours: (n: number) => fill(m.viewAllTours, { n }),
    tourWhatsapp: (title: string) => fill(m.tourWhatsapp, { title }),
    instantWhatsapp: (phone: string) => fill(m.instantWhatsapp, { phone }),
    minRead: (n: number) => fill(m.minRead, { n }),
    minReading: (n: number) => fill(m.minReading, { n }),
    by: (author: string) => fill(m.by, { author }),
    index: (n: number) => fill(m.index, { n: String(n).padStart(2, "0") }),
    reviewsShort: (n: string) => fill(m.reviewsShort, { n }),
    askSandraMessage: (title: string) => fill(m.askSandraMessage, { title }),
    showingPosts: (shown: number, total: number) => fill(m.showingPosts, { shown, total }),
  };
}

export type UI = ReturnType<typeof build>;

// ar.json must have every key en.json has (checked by the type below).
export const ui: Record<Lang, UI> = { en: build(enMessages.site), ar: build(arMessages.site) };
