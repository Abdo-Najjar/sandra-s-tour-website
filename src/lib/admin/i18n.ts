// Dashboard languages: English (default) and Arabic. The choice is kept in a
// cookie, so the dashboard keeps its plain /admin addresses.
//
// Text is written in English in the code: t("Bookings"). The Arabic lives in
// src/messages/ar.json under "dashboard", keyed by that English text.
// Placeholders: t("Delete {name}", { name }) with "حذف {name}" in ar.json.
// A missing Arabic entry shows the English (run `npm run i18n:check`).
import ar from "@/messages/ar.json";

export type AdminLang = "en" | "ar";
export const ADMIN_LANG_COOKIE = "admin_lang";
export const DEFAULT_ADMIN_LANG: AdminLang = "en";

type Vars = Record<string, string | number>;
export type T = (text: string, vars?: Vars) => string;

const arabic: Record<string, string> = ar.dashboard;

const fill = (text: string, vars?: Vars) =>
  vars ? text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : text;

export const makeT =
  (lang: AdminLang): T =>
  (text, vars) =>
    fill(lang === "ar" ? (arabic[text] ?? text) : text, vars);

export const adminDir = (lang: AdminLang) => (lang === "ar" ? "rtl" : "ltr");
export const toAdminLang = (v: unknown): AdminLang => (v === "ar" ? "ar" : "en");
