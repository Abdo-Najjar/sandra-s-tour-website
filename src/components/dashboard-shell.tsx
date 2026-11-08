"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  CalendarCheck,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Map as MapIcon,
  Menu,
  Newspaper,
  PanelsTopLeft,
  Settings,
  Users,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { logout } from "@/lib/actions";
import { AdminLangSwitch, useT } from "@/components/admin/admin-lang";
import type { T } from "@/lib/admin/i18n";

type NavItem = { href: string; label: string; icon: LucideIcon };

const groups: { title?: string; items: NavItem[] }[] = [
  { items: [{ href: "/admin", label: "Overview", icon: LayoutDashboard }] },
  {
    title: "Website",
    items: [
      { href: "/admin/site", label: "Website content", icon: PanelsTopLeft },
      { href: "/admin/tours", label: "Tours", icon: MapIcon },
      { href: "/admin/blog", label: "Blog", icon: Newspaper },
      { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
      { href: "/admin/messages", label: "Messages & partners", icon: Mail },
      { href: "/admin/subscribers", label: "Subscribers", icon: UsersRound },
      { href: "/admin/pages", label: "Extra pages", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

type Badges = Record<string, React.ReactNode>;

function CurrentNav(props: { badges: Badges; onNavigate: () => void; t: T }) {
  return <NavGroups pathname={usePathname()} {...props} />;
}

function NavGroups({ pathname, badges, onNavigate, t }: { pathname: string; badges: Badges; onNavigate: () => void; t: T }) {
  return (
    <>
      {groups.map((g, i) => (
        <div key={i}>
          {g.title && <div className="mb-1.5 px-3 text-[11px] font-bold tracking-wide text-accent">{t(g.title)}</div>}
          <div className="space-y-0.5">
            {g.items.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-primary text-white shadow-sm" : "text-muted hover:bg-surface-2 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-[18px]" />
                  <span className="flex-1">{t(label)}</span>
                  {badges[href]}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

export function DashboardShell({
  children,
  user,
  badges = {},
}: {
  children: React.ReactNode;
  user: React.ReactNode;
  // Small server-rendered counters next to some links, keyed by href.
  badges?: Record<string, React.ReactNode>;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Phone menu: Escape closes it, and the page behind it doesn't scroll.
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
    <div className="flex min-h-screen">
      {open && (
        <button aria-label={t("Close menu")} className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 start-0 z-40 flex w-64 flex-col border-e border-border bg-surface transition-transform lg:sticky lg:top-0 lg:h-screen ${
          open ? "" : "max-lg:-translate-x-full max-lg:rtl:translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-5">
          <Link href="/admin" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/site/logo.png" alt="" className="size-10 rounded-full border border-accent/40 bg-white object-contain p-0.5" />
            <span className="leading-tight">
              <span className="block font-bold">{t("Dashboard")}</span>
              <span className="block text-xs text-accent" dir="ltr">Syria Guide Tours</span>
            </span>
          </Link>
          <button className="-me-2 flex size-10 items-center justify-center rounded-lg hover:bg-surface-2 lg:hidden" onClick={() => setOpen(false)} aria-label={t("Close")}>
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-2">
          {/* The active link needs the URL, which only exists at request time. */}
          <Suspense fallback={<NavGroups pathname="" badges={badges} onNavigate={close} t={t} />}>
            <CurrentNav badges={badges} onNavigate={close} t={t} />
          </Suspense>
        </nav>

        <div className="space-y-1 border-t border-border p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-surface-2 hover:text-foreground"
          >
            <ExternalLink className="size-[18px]" />
            {t("View website")}
          </a>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-danger-soft hover:text-danger">
              <LogOut className="size-[18px] rtl:-scale-x-100" />
              {t("Log out")}
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur sm:px-6">
          <button className="-ms-2 flex size-10 items-center justify-center rounded-lg hover:bg-surface-2 lg:hidden" onClick={() => setOpen(true)} aria-label={t("Open menu")} aria-expanded={open}>
            <Menu className="size-6" />
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground sm:inline-flex"
          >
            <ExternalLink className="size-4" />
            {t("View website")}
          </a>
          <div className="ms-auto flex items-center gap-2 sm:gap-3">
            <AdminLangSwitch />
            {user}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
