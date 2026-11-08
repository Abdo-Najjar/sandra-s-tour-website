import { BackLink } from "@/components/admin/new-link";
import { getT } from "@/lib/admin/lang";
import { PageHeader } from "@/components/ui";
import { PostForm } from "@/components/admin/site-forms";

export const metadata = { title: "New article" };

export default async function NewPage() {
  const t = await getT();
  return (
    <>
      <BackLink href="/admin/blog" label={t("Blog")} />
      <PageHeader title={t("New article")} />
      <PostForm post={null} />
    </>
  );
}
