import "server-only";
import { lang as langParam } from "next/root-params";
import { DEFAULT_LANG, isLang, ui, type Lang } from "./i18n";

// Current website language, from the /[lang] root segment.
export async function getLang(): Promise<Lang> {
  const value = await langParam();
  return isLang(value) ? value : DEFAULT_LANG;
}

// Language plus its fixed interface labels.
export async function getUi() {
  const lang = await getLang();
  return { lang, t: ui[lang] };
}
