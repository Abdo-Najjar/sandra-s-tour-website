import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ContentSkeleton, PageHeader } from "@/components/ui";
import { PostForm } from "@/components/admin/site-forms";
import { getAdminPost } from "@/lib/queries";

export const metadata = { title: "تعديل مقال" };

export default function EditPage(props: PageProps<"/admin/blog/[id]">) {
  return (
    <>
      <Link href="/admin/blog" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ChevronRight className="size-4" /> المدونة
      </Link>
      <PageHeader title="تعديل مقال" />
      <Suspense fallback={<ContentSkeleton />}>
        <Content {...props} />
      </Suspense>
    </>
  );
}

async function Content({ params, searchParams }: PageProps<"/admin/blog/[id]">) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const item = await getAdminPost(id);
  if (!item) notFound();
  return <PostForm key={item.updatedAt} post={item} saved={(await searchParams).saved === "1"} />;
}
