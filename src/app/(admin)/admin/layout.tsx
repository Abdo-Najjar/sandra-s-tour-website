import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { AdminLangProvider } from "@/components/admin/admin-lang";
import { Skeleton } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAdminLang, getT } from "@/lib/admin/lang";
import { roleLabel } from "@/lib/format";
import { getInboxCounts } from "@/lib/queries";

async function UserBadge() {
  const [user, t] = await Promise.all([requireUser(), getT()]);
  return (
    <div className="flex items-center gap-2">
      <div className="grid size-9 place-items-center rounded-full bg-primary-soft font-bold text-primary">{user.name[0]}</div>
      <div className="hidden text-sm leading-tight sm:block">
        <div className="font-semibold">{user.name}</div>
        <div className="text-xs text-muted">{roleLabel(user.role, t)}</div>
      </div>
    </div>
  );
}

async function Count({ kind }: { kind: "bookings" | "messages" }) {
  const n = (await getInboxCounts())[kind];
  if (!n) return null;
  return <span className="rounded-full bg-danger px-1.5 text-xs leading-5 font-bold text-white">{n}</span>;
}

// The whole dashboard depends on the user's language cookie, so it renders per request.
async function LangShell({ children }: { children: React.ReactNode }) {
  const lang = await getAdminLang();
  return (
    <AdminLangProvider lang={lang}>
      <DashboardShell
        user={
          <Suspense fallback={<Skeleton className="h-9 w-32" />}>
            <UserBadge />
          </Suspense>
        }
        badges={{
          "/admin/bookings": (
            <Suspense fallback={null}>
              <Count kind="bookings" />
            </Suspense>
          ),
          "/admin/messages": (
            <Suspense fallback={null}>
              <Count kind="messages" />
            </Suspense>
          ),
        }}
      >
        {children}
      </DashboardShell>
    </AdminLangProvider>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LangShell>{children}</LangShell>
    </Suspense>
  );
}
