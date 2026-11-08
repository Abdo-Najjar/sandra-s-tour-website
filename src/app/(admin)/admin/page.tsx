import { Suspense } from "react";
import Link from "next/link";
import { CalendarCheck, ExternalLink, Mail, Map as MapIcon, Newspaper, PanelsTopLeft, Plus, UsersRound, type LucideIcon } from "lucide-react";
import { bookingStatusLabels } from "@/lib/site/labels";
import type { BookingStatus } from "@/db/schema";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { formatDate, formatNumber } from "@/lib/format";
import { requireUser } from "@/lib/auth";
import { getBookingCounts, getBookings, getMessages, getWebsiteStats } from "@/lib/queries";

export default function OverviewPage() {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <OverviewContent />
    </Suspense>
  );
}

const bookingStyle: Record<BookingStatus, string> = {
  new: "bg-accent-soft text-accent",
  contacted: "bg-primary-soft text-primary",
  confirmed: "bg-success-soft text-success",
  cancelled: "bg-danger-soft text-danger",
};

async function OverviewContent() {
  const [me, stats, bookings, counts, messages] = await Promise.all([
    requireUser(),
    getWebsiteStats(),
    getBookings(),
    getBookingCounts(),
    getMessages(),
  ]);

  const tiles: { label: string; value: number; note: string; href: string; icon: LucideIcon; highlight?: boolean }[] = [
    { label: "حجوزات جديدة", value: stats.newBookings, note: `${formatNumber(counts.confirmed)} مؤكدة من ${formatNumber(counts.all)}`, href: "/admin/bookings?status=new", icon: CalendarCheck, highlight: stats.newBookings > 0 },
    { label: "رسائل غير مقروءة", value: stats.unreadMessages, note: `${formatNumber(messages.length)} رسالة وطلب شراكة`, href: "/admin/messages", icon: Mail, highlight: stats.unreadMessages > 0 },
    { label: "جولات منشورة", value: stats.tours, note: "تظهر في صفحة الجولات", href: "/admin/tours", icon: MapIcon },
    { label: "مقالات منشورة", value: stats.posts, note: `${formatNumber(stats.subscribers)} مشترك في النشرة`, href: "/admin/blog", icon: Newspaper },
  ];

  const quick: { label: string; href: string; icon: LucideIcon; external?: boolean }[] = [
    { label: "جولة جديدة", href: "/admin/tours/new", icon: Plus },
    { label: "مقال جديد", href: "/admin/blog/new", icon: Plus },
    { label: "تعديل نصوص الموقع", href: "/admin/site", icon: PanelsTopLeft },
    { label: "المشتركون", href: "/admin/subscribers", icon: UsersRound },
    { label: "فتح الموقع", href: "/", icon: ExternalLink, external: true },
  ];

  return (
    <>
      <PageHeader title={`مرحباً ${me.name.split(" ")[0]} 👋`} subtitle="ملخص حجوزات ورسائل موقع Syria Guide Tours" />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group rounded-xl border border-border bg-surface p-4 transition-all sm:p-5 hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted">{t.label}</p>
                <p className={`mt-2 text-2xl font-bold sm:text-3xl ${t.highlight ? "text-accent" : ""}`}>{formatNumber(t.value)}</p>
              </div>
              <div className="hidden size-11 shrink-0 place-items-center rounded-xl bg-primary-soft sm:grid text-primary transition-colors group-hover:bg-accent-soft group-hover:text-accent">
                <t.icon className="size-5" />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">{t.note}</p>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quick.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            target={q.external ? "_blank" : undefined}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            <q.icon className="size-4" />
            {q.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-5">
        <Card className="overflow-hidden p-0 xl:col-span-3">
          <div className="flex items-center justify-between p-5 pb-3">
            <h2 className="font-bold">آخر الحجوزات</h2>
            <Link href="/admin/bookings" className="text-sm font-semibold text-accent hover:underline">عرض الكل</Link>
          </div>
          {bookings.length === 0 ? (
            <p className="border-t border-border px-5 py-10 text-center text-sm text-muted">لا توجد حجوزات بعد.</p>
          ) : (
            <ul>
              {bookings.slice(0, 6).map((b) => (
                <li key={b.id} className="flex items-center gap-3 border-t border-border px-5 py-3 text-sm">
                  <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft font-bold text-primary">{b.name.trim()[0]?.toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold" dir="auto">{b.name}</div>
                    <div className="truncate text-xs text-muted" dir="auto">{b.tourTitle || "رحلة مخصصة"}</div>
                  </div>
                  <div className="shrink-0 text-left">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${bookingStyle[b.status]}`}>{bookingStatusLabels[b.status]}</span>
                    <div className="mt-1 text-xs text-muted" dir="ltr">{formatDate(b.createdAt)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="overflow-hidden p-0 xl:col-span-2">
          <div className="flex items-center justify-between p-5 pb-3">
            <h2 className="font-bold">آخر الرسائل</h2>
            <Link href="/admin/messages" className="text-sm font-semibold text-accent hover:underline">عرض الكل</Link>
          </div>
          {messages.length === 0 ? (
            <p className="border-t border-border px-5 py-10 text-center text-sm text-muted">لا توجد رسائل بعد.</p>
          ) : (
            <ul>
              {messages.slice(0, 5).map((m) => (
                <li key={m.id} className="border-t border-border px-5 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    {!m.read && <span className="size-2 shrink-0 rounded-full bg-accent" aria-label="غير مقروءة" />}
                    <span className={`min-w-0 flex-1 truncate ${m.read ? "" : "font-semibold"}`} dir="auto">{m.name}</span>
                    <span className="shrink-0 text-xs text-muted" dir="ltr">{formatDate(m.createdAt)}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted" dir="auto">{m.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
