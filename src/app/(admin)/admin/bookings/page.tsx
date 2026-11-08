import { Suspense } from "react";
import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { BookingStatusSelect, DeleteBookingButton } from "@/components/admin/site-forms";
import { bookingStatusLabel } from "@/lib/site/labels";
import { getT } from "@/lib/admin/lang";
import { BOOKING_STATUSES, type BookingStatus } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getBookingCounts, getBookings } from "@/lib/queries";
import { whatsappLink } from "@/lib/site/shape";

export const metadata = { title: "Bookings" };

const sources: Record<string, [en: string, ar: string]> = {
  contact: ["Contact page", "صفحة التواصل"],
  tour: ["Tour page", "صفحة جولة"],
  guide: ["Guide page", "صفحة المرشدة"],
};

export default async function BookingsPage(props: PageProps<"/admin/bookings">) {
  const t = await getT();
  return (
    <>
      <PageHeader title={t("Bookings", "الحجوزات")} subtitle={t("Booking requests from the website forms", "طلبات الحجز القادمة من نماذج الموقع")} />
      <Suspense fallback={<ContentSkeleton />}>
        <BookingsContent {...props} />
      </Suspense>
    </>
  );
}

async function BookingsContent({ searchParams }: PageProps<"/admin/bookings">) {
  const raw = (await searchParams).status;
  const status = BOOKING_STATUSES.includes(raw as BookingStatus) ? (raw as BookingStatus) : undefined;
  const [me, list, counts, t] = await Promise.all([requireUser(), getBookings(status), getBookingCounts(), getT()]);
  const tabs: [string, string, number][] = [
    ["", t("All", "الكل"), counts.all],
    ...BOOKING_STATUSES.map((s): [string, string, number] => [s, bookingStatusLabel(s, t), counts[s]]),
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map(([key, label, n]) => (
          <Link
            key={key}
            href={key ? `/admin/bookings?status=${key}` : "/admin/bookings"}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              (status ?? "") === key ? "bg-primary text-white" : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            {label} <span className="opacity-70">({n})</span>
          </Link>
        ))}
      </div>

      {list.length === 0 && <Card className="py-12 text-center text-muted">{t("No bookings here.", "لا توجد حجوزات هنا.")}</Card>}

      <div className="grid gap-3">
        {list.map((b) => (
          <Card key={b.id}>
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold" dir="auto">{b.name}</h2>
                  <BookingStatusSelect key={b.status} id={b.id} status={b.status} />
                </div>
                <div className="mt-1 text-start text-sm text-muted">
                  {b.tourTitle || t("Custom / not chosen yet", "رحلة مخصصة / غير محددة")}
                  {b.tourClass && ` · ${b.tourClass}`}
                </div>
              </div>
              <div className="text-end text-xs text-muted">
                <div dir="ltr">{formatDate(b.createdAt)}</div>
                <div>{sources[b.source] ? t(...sources[b.source]) : b.source}</div>
              </div>
            </div>

            <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {b.arrivalDate && <Info label={t("Arrival", "الوصول")} value={b.arrivalDate} />}
              <Info
                label={t("Guests", "الأشخاص")}
                value={t(
                  `${b.adults} adult${b.adults === 1 ? "" : "s"}${b.children ? ` + ${b.children} child${b.children === 1 ? "" : "ren"}` : ""}`,
                  `${b.adults} بالغ${b.children ? ` + ${b.children} طفل` : ""}`,
                )}
              />
              {b.nationality && <Info label={t("Nationality", "الجنسية")} value={b.nationality} />}
              {b.flexibility && <Info label={t("Flexibility", "المرونة")} value={b.flexibility} />}
            </dl>
            {b.note && (
              <p className="mt-3 rounded-lg bg-surface-2 p-3 text-sm whitespace-pre-line" dir="auto">
                {b.note}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-sm">
              {b.phone && (
                <>
                  <a
                    href={whatsappLink(b.phone)}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-success-soft px-3 py-1.5 font-medium text-success"
                  >
                    <MessageCircle className="size-4" /> WhatsApp
                  </a>
                  <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5" dir="ltr">
                    <Phone className="size-4" /> {b.phone}
                  </a>
                </>
              )}
              {b.email && (
                <a href={`mailto:${b.email}`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5" dir="ltr">
                  <Mail className="size-4" /> {b.email}
                </a>
              )}
              {me.role === "admin" && (
                <div className="ms-auto">
                  <DeleteBookingButton id={b.id} />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1.5">
      <dt className="text-muted">{label}:</dt>
      <dd className="font-medium" dir="auto">
        {value}
      </dd>
    </div>
  );
}
