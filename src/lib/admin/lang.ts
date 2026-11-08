import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { ADMIN_LANG_COOKIE, makeT, toAdminLang } from "./i18n";

// The dashboard language of this request (cookie, English by default).
export const getAdminLang = cache(async () => toAdminLang((await cookies()).get(ADMIN_LANG_COOKIE)?.value));

export async function getT() {
  return makeT(await getAdminLang());
}
