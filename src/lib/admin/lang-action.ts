"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { ADMIN_LANG_COOKIE, toAdminLang } from "./i18n";

export async function setAdminLang(lang: string) {
  (await cookies()).set(ADMIN_LANG_COOKIE, toAdminLang(lang), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  refresh();
}
