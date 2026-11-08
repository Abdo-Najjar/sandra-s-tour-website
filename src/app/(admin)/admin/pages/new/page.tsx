import { BackLink } from "@/components/admin/new-link";
import { getT } from "@/lib/admin/lang";
import { PageHeader } from "@/components/ui";
import { PageForm } from "@/components/admin/site-forms";

export const metadata = { title: "New page" };

export default async function NewPage() {
  const t = await getT();
  return (
    <>
      <BackLink href="/admin/pages" label={t("Extra pages")} />
      <PageHeader title={t("New page")} />
      <PageForm page={null} />
    </>
  );
}
