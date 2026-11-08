import { Suspense } from "react";
import Link from "next/link";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { NewLink } from "@/components/admin/new-link";
import { DeletePageButton } from "@/components/admin/site-forms";
import { getAdminPages } from "@/lib/queries";
import { pick } from "@/lib/site/translatable";
import { getAdminLang, getT } from "@/lib/admin/lang";

export const metadata = { title: "Extra pages" };

export default async function PagesAdminPage() {
  const t = await getT();
  return (
    <>
      <PageHeader
        title={t("Extra pages", "صفحات إضافية")}
        subtitle={t("Pages such as terms and conditions or a privacy policy; they can be shown in the top menu", "صفحات مثل الشروط والأحكام أو سياسة الخصوصية، ويمكن إظهارها في القائمة العلوية")}
        action={<NewLink href="/admin/pages/new" label={t("New page", "صفحة جديدة")} />}
      />
      <Suspense fallback={<ContentSkeleton />}>
        <PagesList />
      </Suspense>
    </>
  );
}

async function PagesList() {
  const [pages, lang, t] = await Promise.all([getAdminPages(), getAdminLang(), getT()]);
  if (!pages.length) return <Card className="py-12 text-center text-muted">{t("No pages yet.", "لا توجد صفحات بعد.")}</Card>;
  return (
    <div className="grid gap-3">
      {pages.map((p) => (
        <Card key={p.id} className="flex flex-wrap items-center gap-3">
          <Link href={`/admin/pages/${p.id}`} className="min-w-0 flex-1 hover:text-primary">
            <div className="font-semibold" dir="auto">{pick(p.title, lang)}</div>
            <div className="text-xs text-muted" dir="ltr">/p/{p.slug}</div>
          </Link>
          {p.showInMenu && <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">{t("In menu", "في القائمة")}</span>}
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.published ? "bg-success-soft text-success" : "bg-surface-2 text-muted"}`}>
            {p.published ? t("Published", "منشورة") : t("Draft", "مسودة")}
          </span>
          <DeletePageButton id={p.id} />
        </Card>
      ))}
    </div>
  );
}
