import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ContentSkeleton, PageHeader } from "@/components/ui";
import { TourEditor } from "../tour-editor";

export const metadata = { title: "جولة جديدة" };

export default function NewTourPage() {
  return (
    <>
      <Link href="/admin/tours" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ChevronRight className="size-4" /> الجولات
      </Link>
      <PageHeader title="جولة جديدة" subtitle="تصنيفات ومناطق الجولات تُعدّل من: محتوى الموقع ← صفحة الجولات ← الفلاتر" />
      <Suspense fallback={<ContentSkeleton />}>
        <TourEditor id={null} />
      </Suspense>
    </>
  );
}
