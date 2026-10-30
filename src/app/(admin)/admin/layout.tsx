import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Skeleton } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { roleLabels } from "@/lib/format";
import { getInboxCounts } from "@/lib/queries";

async function UserBadge() {
  const user = await requireUser();
  return (
    <div className="flex items-center gap-2">
      <div className="grid size-9 place-items-center rounded-full bg-primary-soft font-bold text-primary">{user.name[0]}</div>
      <div className="hidden text-sm leading-tight sm:block">
        <div className="font-semibold">{user.name}</div>
        <div className="text-xs text-muted">{roleLabels[user.role]}</div>
      </div>
    </div>
  );
}

async function Count({ kind }: { kind: "bookings" | "messages" }) {
  const n = (await getInboxCounts())[kind];
  if (!n) return null;
  return <span className="rounded-full bg-danger px-1.5 text-xs leading-5 font-bold text-white">{n}</span>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
