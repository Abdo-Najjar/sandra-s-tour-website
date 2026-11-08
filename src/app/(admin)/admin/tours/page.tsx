import { Suspense } from "react";
import Link from "next/link";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { NewLink } from "@/components/admin/new-link";
import { TourRowActions } from "@/components/admin/site-forms";
import { formatMoney } from "@/lib/format";
import { getAdminTours } from "@/lib/queries";
import { pick } from "@/lib/site/translatable";
import { getAdminLang, getT } from "@/lib/admin/lang";

export const metadata = { title: "Tours" };

export default async function ToursPage() {
  const t = await getT();
  return (
    <>
      <PageHeader
        title={t("Tours")}
        subtitle={t("Add tours and edit their prices, photos and itineraries")}
        action={<NewLink href="/admin/tours/new" label={t("New tour")} />}
      />
      <Suspense fallback={<ContentSkeleton />}>
        <ToursList />
      </Suspense>
    </>
  );
}

async function ToursList() {
  const [tours, lang, t] = await Promise.all([getAdminTours(), getAdminLang(), getT()]);
  const other = lang === "ar" ? "en" : "ar";
  if (!tours.length) return <Card className="py-12 text-center text-muted">{t("No tours yet. Add the first one.")}</Card>;

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="rtable w-full text-sm">
          <thead className="bg-surface-2 text-muted">
            <tr>
              <th className="px-5 py-3 text-start font-medium">{t("Tour")}</th>
              <th className="px-5 py-3 text-start font-medium">{t("Length")}</th>
              <th className="px-5 py-3 text-start font-medium">{t("Price")}</th>
              <th className="px-5 py-3 text-start font-medium">{t("Bookings")}</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id} className="border-t border-border">
                <td className="px-5 py-3">
                  <Link href={`/admin/tours/${tour.id}`} className="flex items-center gap-3 hover:text-primary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tour.image || "/site/logo.png"} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
                    <div>
                      <div className="font-semibold" dir="auto">{pick(tour.title, lang)}</div>
                      <div className="text-xs text-muted" dir="auto">{pick(tour.title, other)}</div>
                    </div>
                  </Link>
                </td>
                <td data-label={t("Length")} className="px-5 py-3 whitespace-nowrap">
                  {tour.durationDays} {tour.durationDays === 1 ? t("day") : t("days")}
                </td>
                <td data-label={t("Price")} className="px-5 py-3 font-semibold">{formatMoney(tour.price)}</td>
                <td data-label={t("Bookings")} className="px-5 py-3">{tour.bookings}</td>
                <td className="rtable-end px-5 py-3">
                  <div className="flex justify-end">
                    <TourRowActions id={tour.id} featured={tour.featured} published={tour.published} />
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
