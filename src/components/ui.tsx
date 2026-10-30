import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import type { OrderStatus } from "@/db/schema";
import { statusLabels } from "@/lib/format";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-xl border border-border bg-surface p-5 ${className}`}>{children}</div>;
}

export function StatCard({
  label,
  value,
  change,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: number | null;
  note?: string;
  icon: LucideIcon;
}) {
  const up = (change ?? 0) >= 0;
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <div className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
          <Icon className="size-5" />
        </div>
      </div>
      {change != null ? (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${up ? "text-success" : "text-danger"}`}>
          {up ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          <span dir="ltr">{up ? "+" : ""}{change}%</span>
          <span className="text-muted">عن الشهر الماضي</span>
        </div>
      ) : (
        <div className="mt-3 text-xs text-muted">{note ?? " "}</div>
      )}
    </Card>
  );
}

const statusStyle: Record<OrderStatus, string> = {
  completed: "bg-success-soft text-success",
  processing: "bg-warning-soft text-warning",
  cancelled: "bg-danger-soft text-danger",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-primary text-white hover:opacity-90"
      : "border border-border bg-surface text-foreground hover:bg-surface-2";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-2 ${className}`} />;
}

export function ContentSkeleton() {
  return (
    <div aria-busy="true" aria-label="جارٍ التحميل" className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-80" />
    </div>
  );
}
