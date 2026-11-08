// Dashboard languages: English (default) and Arabic. The choice is kept in a
// cookie, so the dashboard keeps its plain /admin addresses.
// Text is written in place as a pair: t("Bookings", "الحجوزات").

export type AdminLang = "en" | "ar";
export const ADMIN_LANG_COOKIE = "admin_lang";
export const DEFAULT_ADMIN_LANG: AdminLang = "en";

export type T = (en: string, ar: string) => string;
export const makeT = (lang: AdminLang): T => (en, ar) => (lang === "ar" ? ar : en);
export const adminDir = (lang: AdminLang) => (lang === "ar" ? "rtl" : "ltr");
export const toAdminLang = (v: unknown): AdminLang => (v === "ar" ? "ar" : "en");
