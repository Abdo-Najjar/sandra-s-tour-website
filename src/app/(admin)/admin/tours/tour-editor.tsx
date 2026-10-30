import { notFound } from "next/navigation";
import { TourForm } from "@/components/admin/site-forms";
import { getAdminTour, getSiteContent } from "@/lib/queries";

// Loads what the tour form needs. id null = new tour.
export async function TourEditor({ id, saved }: { id: number | null; saved?: boolean }) {
  const [site, tour] = await Promise.all([getSiteContent(), id ? getAdminTour(id) : null]);
  if (id && !tour) notFound();
  const categories = site.tours.filters.categories.map((c) => ({ key: c.key, label: c.ar || c.en || c.key }));
  const regions = site.tours.filters.regions.map((r) => ({ key: r.key, label: r.label || r.key }));
  // Keep a value that's no longer in the lists selectable.
  if (tour?.category && !categories.some((c) => c.key === tour.category)) categories.push({ key: tour.category, label: tour.category });
  if (tour?.region && !regions.some((r) => r.key === tour.region)) regions.push({ key: tour.region, label: tour.region });
  return <TourForm key={tour?.updatedAt} tour={tour} categories={categories} regions={regions} saved={saved} />;
}
