"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { logout } from "@/lib/actions";

const nav = [
  { href: "/", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/products", label: "المنتجات", icon: Package },
  { href: "/users", label: "المستخدمون", icon: Users },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

export function DashboardShell({ children, user }: { children: React.ReactNode; user: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {open && (
        <button
          aria-label="إغلاق القائمة"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-40 flex w-64 flex-col border-l border-border bg-surface transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-lg bg-primary text-lg font-bold text-white">
              س
            </div>
            <span className="text-lg font-bold">لوحة التحكم</span>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="إغلاق">
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-muted hover:bg-surface-2 hover:text-foreground"
                }`}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-danger-soft hover:text-danger">
              <LogOut className="size-5" />
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur sm:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="فتح القائمة">
            <Menu className="size-6" />
          </button>
          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
            <input
              placeholder="ابحث..."
              className="w-full rounded-lg border border-border bg-surface-2 py-2 pr-9 pl-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="mr-auto flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-muted hover:bg-surface-2" aria-label="الإشعارات">
              <Bell className="size-5" />
              <span className="absolute top-1.5 left-1.5 size-2 rounded-full bg-danger" />
            </button>
            {user}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
