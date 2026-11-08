"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, type ComponentProps } from "react";
import { DEFAULT_LANG, localHref, switchLangHref, ui, type Lang } from "@/lib/site/i18n";

// The website language for client components. Set once by the root layout
// from the URL segment, so server and client always agree.
const LangContext = createContext<Lang>(DEFAULT_LANG);

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
export const useUi = () => ui[useContext(LangContext)];

// next/link that keeps visitors in their language (/tours -> /ar/tours).
export function Link({ href, ...props }: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  const lang = useLang();
  return <NextLink href={localHref(href, lang)} {...props} />;
}

// EN | ع button: the same page in the other language.
export function LanguageSwitch({ className = "" }: { className?: string }) {
  const lang = useLang();
  const pathname = usePathname();
  const t = ui[lang];
  const to: Lang = lang === "ar" ? "en" : "ar";
  return (
    <NextLink
      href={switchLangHref(pathname, to)}
      hrefLang={to}
      lang={to}
      aria-label={t.switchLang}
      title={t.otherLangName}
      className={`inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border border-surface-container-high px-3 text-label-lg font-semibold text-primary transition-colors hover:border-antique-gold/50 hover:text-antique-gold-dark ${className}`}
    >
      <span aria-hidden className="material-symbols-outlined text-[18px] text-antique-gold-dark">
        translate
      </span>
      <span className={to === "ar" ? "font-arabic" : "font-sans"}>{t.otherLangShort}</span>
    </NextLink>
  );
}
