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
      <BackLink href="/admin/tours" label={t("Tours")} />
      <PageHeader title={t("New tour")} subtitle={t("Tour categories and regions are edited in: Website content → Tours page → Filters")} />
      <Suspense fallback={<ContentSkeleton />}>
        <TourEditor id={null} />
      </Suspense>
    </>
  );
}
