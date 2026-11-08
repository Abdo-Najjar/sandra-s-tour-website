import { Suspense } from "react";
import { BackLink } from "@/components/admin/new-link";
import { getT } from "@/lib/admin/lang";
import { ContentSkeleton, PageHeader } from "@/components/ui";
import { TourEditor } from "../tour-editor";

export const metadata = { title: "New tour" };

export default async function NewTourPage() {
  const t = await getT();
  return (
    <>
      <BackLink href="/admin/tours" label={t("Tours", "الجولات")} />
      <PageHeader title={t("New tour", "جولة جديدة")} subtitle={t("Tour categories and regions are edited in: Website content → Tours page → Filters", "تصنيفات ومناطق الجولات تُعدّل من: محتوى الموقع ← صفحة الجولات ← الفلاتر")} />
      <Suspense fallback={<ContentSkeleton />}>
        <TourEditor id={null} />
      </Suspense>
    </>
  );
}
