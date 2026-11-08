"use client";

import { createContext, useContext, useEffect, useTransition } from "react";
import { Languages } from "lucide-react";
import { adminDir, makeT, type AdminLang } from "@/lib/admin/i18n";
import { setAdminLang } from "@/lib/admin/lang-action";

const Ctx = createContext<AdminLang>("en");

export function AdminLangProvider({ lang, children }: { lang: AdminLang; children: React.ReactNode }) {
  // Keep <html> in step, so dialogs, scrollbars and the browser use the right direction.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = adminDir(lang);
  }, [lang]);
  return (
    <Ctx.Provider value={lang}>
      <div lang={lang} dir={adminDir(lang)} className="contents">
        {children}
      </div>
    </Ctx.Provider>
  );
}

export const useAdminLang = () => useContext(Ctx);
export const useT = () => makeT(useContext(Ctx));

export function AdminLangSwitch({ className = "" }: { className?: string }) {
  const lang = useAdminLang();
  const [pending, start] = useTransition();
  const next: AdminLang = lang === "ar" ? "en" : "ar";
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => setAdminLang(next))}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground disabled:opacity-60 ${className}`}
      aria-label={next === "ar" ? "التبديل إلى العربية" : "Switch to English"}
    >
      <Languages className="size-4" />
      <span lang={next}>{next === "ar" ? "عربي" : "English"}</span>
    </button>
  );
}
