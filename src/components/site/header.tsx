"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { stripLang } from "@/lib/site/i18n";
import { safeUrl } from "@/lib/site/shape";
import { Icon } from "./bits";
import { LanguageSwitch, Link, useUi } from "./lang";

type MenuItem = { label: string; href: string };

function isActive(fullPath: string, href: string) {
  const pathname = stripLang(fullPath);
  const path = href.split("#")[0];
  if (!path || href.includes("#")) return false;
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

export function SiteHeader({
  name,
  tagline,
  logo,
  menu,
  bookLabel,
  bookHref,
}: {
  name: string;
  tagline: string;
  logo: string;
  menu: MenuItem[];
  bookLabel: string;
  bookHref: string;
}) {
  const pathname = usePathname();
  const t = useUi();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-surface-container-high bg-surface/95 shadow-[0_1px_8px_rgba(21,36,61,0.04)] backdrop-blur-xl">
      <div className="flex h-20 w-full items-center justify-between gap-gutter px-margin-mobile md:px-margin">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-antique-gold/30 bg-surface-container shadow-[0_2px_8px_rgba(21,36,61,0.06)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {logo && <img src={safeUrl(logo, "")} alt="" className="size-full object-contain p-0.5" />}
          </span>
          <span className="flex flex-col justify-center">
            <span className="font-display text-headline-sm leading-tight font-semibold tracking-tight text-primary">{name}</span>
            <span className="mt-0.5 hidden text-[10px] leading-tight font-semibold tracking-wider text-outline uppercase sm:block">
              {tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-space-xs xl:flex" aria-label="Main">
          {menu.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href + item.label}
                href={safeUrl(item.href, "/")}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-space-md py-space-sm text-label-lg transition-colors ${
                  active ? "bg-primary/10 font-semibold text-primary" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-space-sm">
          <LanguageSwitch />
          <Link
            href={safeUrl(bookHref, "/contact")}
            className="hidden items-center justify-center gap-2 rounded-lg border border-antique-gold/40 bg-primary px-space-lg py-2.5 text-label-lg font-medium text-white shadow-md transition-all hover:bg-primary-light hover:shadow-xl sm:inline-flex"
          >
            {bookLabel}
            <Icon name="calendar_month" className="text-[16px] text-antique-gold" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.closeMenu : t.openMenu}
            className="flex size-11 items-center justify-center rounded-lg border border-surface-container-high text-primary xl:hidden"
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-surface-container-high bg-surface px-margin-mobile pb-space-lg xl:hidden" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
          <ul className="flex flex-col py-space-sm">
            {menu.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href + item.label}>
                  <Link
                    href={safeUrl(item.href, "/")}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-space-md py-3 text-body-md ${
                      active ? "bg-primary/10 font-semibold text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={safeUrl(bookHref, "/contact")}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-space-lg py-3 text-label-lg font-medium text-white"
          >
            {bookLabel}
            <Icon name="calendar_month" className="text-[16px] text-antique-gold" />
          </Link>
        </nav>
      )}
    </header>
  );
}
