import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ContentSkeleton, PageHeader } from "@/components/ui";
import { TourEditor } from "../tour-editor";

export const metadata = { title: "تعديل جولة" };

export default function EditTourPage(props: PageProps<"/admin/tours/[id]">) {
  return (
    <>
      <Link href="/admin/tours" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ChevronRight className="size-4" /> الجولات
      </Link>
      <PageHeader title="تعديل جولة" />
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
