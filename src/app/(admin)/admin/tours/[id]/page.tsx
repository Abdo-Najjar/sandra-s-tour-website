import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/admin/new-link";
import { getT } from "@/lib/admin/lang";
import { ContentSkeleton, PageHeader } from "@/components/ui";
import { TourEditor } from "../tour-editor";

export const metadata = { title: "Edit tour" };

export default async function EditTourPage(props: PageProps<"/admin/tours/[id]">) {
  const t = await getT();
  return (
    <>
      <BackLink href="/admin/tours" label={t("Tours", "الجولات")} />
      <PageHeader title={t("Edit tour", "تعديل جولة")} />
      <Suspense fallback={<ContentSkeleton />}>
        <Content {...props} />
      </Suspense>
    </>
  );
}

async function Content({ params, searchParams }: PageProps<"/admin/tours/[id]">) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  return <TourEditor id={id} saved={(await searchParams).saved === "1"} />;
}
