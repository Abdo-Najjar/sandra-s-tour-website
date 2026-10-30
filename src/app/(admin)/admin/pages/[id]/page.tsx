import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ContentSkeleton, PageHeader } from "@/components/ui";
import { PageForm } from "@/components/admin/site-forms";
import { getAdminPage } from "@/lib/queries";

export const metadata = { title: "تعديل صفحة" };

export default function EditPage(props: PageProps<"/admin/pages/[id]">) {
  return (
    <>
      <Link href="/admin/pages" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ChevronRight className="size-4" /> صفحات إضافية
      </Link>
      <PageHeader title="تعديل صفحة" />
      <Suspense fallback={<ContentSkeleton />}>
        <Content {...props} />
      </Suspense>
    </>
  );
}

async function Content({ params, searchParams }: PageProps<"/admin/pages/[id]">) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const item = await getAdminPage(id);
  if (!item) notFound();
  return <PageForm key={item.updatedAt} page={item} saved={(await searchParams).saved === "1"} />;
}
