import { notFound } from "next/navigation";
import { TourForm } from "@/components/admin/site-forms";
import { getAdminTour, getSiteContent } from "@/lib/queries";
import { getAdminLang } from "@/lib/admin/lang";

// Loads what the tour form needs. id null = new tour.
export async function TourEditor({ id, saved }: { id: number | null; saved?: boolean }) {
  const [site, siteAr, tour, lang] = await Promise.all([getSiteContent("en"), getSiteContent("ar"), id ? getAdminTour(id) : null, getAdminLang()]);
  if (id && !tour) notFound();
  // Category names in the dashboard's language (from the website text).
  const arLabel = (key: string) => siteAr.tours.filters.categories.find((c) => c.key === key)?.label;
  const categories = site.tours.filters.categories.map((c) => ({
    key: c.key,
    label: (lang === "ar" && arLabel(c.key)) || c.label || c.key,
  }));
  const regions = site.tours.filters.regions.map((r) => ({ key: r.key, label: r.label || r.key }));
  // Keep a value that's no longer in the lists selectable.
  if (tour?.category && !categories.some((c) => c.key === tour.category)) categories.push({ key: tour.category, label: tour.category });
  if (tour?.region && !regions.some((r) => r.key === tour.region)) regions.push({ key: tour.region, label: tour.region });
  return <TourForm key={tour?.updatedAt} tour={tour} categories={categories} regions={regions} saved={saved} />;
}
