import { Suspense } from "react";
import Link from "next/link";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { NewLink } from "@/components/admin/new-link";
import { TourRowActions } from "@/components/admin/site-forms";
import { formatMoney } from "@/lib/format";
import { getAdminTours } from "@/lib/queries";
import { pick } from "@/lib/site/translatable";

export const metadata = { title: "الجولات" };

export default function ToursPage() {
  return (
    <>
      <PageHeader title="الجولات" subtitle="أضف جولات جديدة وعدّل أسعارها وصورها وبرامجها" action={<NewLink href="/admin/tours/new" label="جولة جديدة" />} />
      <Suspense fallback={<ContentSkeleton />}>
        <ToursList />
      </Suspense>
    </>
  );
}

async function ToursList() {
  const tours = await getAdminTours();
  if (!tours.length) return <Card className="py-12 text-center text-muted">لا توجد جولات بعد. أضف أول جولة.</Card>;

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-muted">
            <tr>
              <th className="px-5 py-3 text-right font-medium">الجولة</th>
              <th className="px-5 py-3 text-right font-medium">المدة</th>
              <th className="px-5 py-3 text-right font-medium">السعر</th>
              <th className="px-5 py-3 text-right font-medium">الحجوزات</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {tours.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="px-5 py-3">
                  <Link href={`/admin/tours/${t.id}`} className="flex items-center gap-3 hover:text-primary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.image || "/site/logo.png"} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
                    <div>
                      <div className="font-semibold" dir="auto">{pick(t.title, "ar")}</div>
                      <div className="text-xs text-muted" dir="ltr">{pick(t.title, "en")}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">{t.durationDays} {t.durationDays === 1 ? "يوم" : "أيام"}</td>
                <td className="px-5 py-3 font-semibold">{formatMoney(t.price)}</td>
                <td className="px-5 py-3">{t.bookings}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end">
                    <TourRowActions id={t.id} featured={t.featured} published={t.published} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
