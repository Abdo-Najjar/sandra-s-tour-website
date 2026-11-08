import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/admin/new-link";
import { getT } from "@/lib/admin/lang";
import { ContentSkeleton, PageHeader } from "@/components/ui";
import { PostForm } from "@/components/admin/site-forms";
import { getAdminPost } from "@/lib/queries";

export const metadata = { title: "Edit article" };

export default async function EditPage(props: PageProps<"/admin/blog/[id]">) {
  const t = await getT();
  return (
    <>
      <BackLink href="/admin/blog" label={t("Blog")} />
      <PageHeader title={t("Edit article")} />
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
