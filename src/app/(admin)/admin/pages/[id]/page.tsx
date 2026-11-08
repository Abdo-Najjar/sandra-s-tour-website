import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/admin/new-link";
import { getT } from "@/lib/admin/lang";
import { ContentSkeleton, PageHeader } from "@/components/ui";
import { PageForm } from "@/components/admin/site-forms";
import { getAdminPage } from "@/lib/queries";

export const metadata = { title: "Edit page" };

export default async function EditPage(props: PageProps<"/admin/pages/[id]">) {
  const t = await getT();
  return (
    <>
      <BackLink href="/admin/pages" label={t("Extra pages")} />
      <PageHeader title={t("Edit page")} />
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
