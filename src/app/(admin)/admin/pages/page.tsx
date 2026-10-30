import { Suspense } from "react";
import Link from "next/link";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { NewLink } from "@/components/admin/new-link";
import { DeletePageButton } from "@/components/admin/site-forms";
import { getAdminPages } from "@/lib/queries";

export const metadata = { title: "صفحات إضافية" };

export default function PagesAdminPage() {
  return (
    <>
      <PageHeader
        title="صفحات إضافية"
        subtitle="صفحات مثل الشروط والأحكام أو سياسة الخصوصية، ويمكن إظهارها في القائمة العلوية"
        action={<NewLink href="/admin/pages/new" label="صفحة جديدة" />}
      />
      <Suspense fallback={<ContentSkeleton />}>
        <PagesList />
      </Suspense>
    </>
  );
}

async function PagesList() {
  const pages = await getAdminPages();
  if (!pages.length) return <Card className="py-12 text-center text-muted">لا توجد صفحات بعد.</Card>;
  return (
    <div className="grid gap-3">
      {pages.map((p) => (
        <Card key={p.id} className="flex flex-wrap items-center gap-3">
          <Link href={`/admin/pages/${p.id}`} className="flex-1 hover:text-primary">
            <div className="font-semibold" dir="auto">{p.title}</div>
            <div className="text-xs text-muted" dir="ltr">/p/{p.slug}</div>
          </Link>
          {p.showInMenu && <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">في القائمة</span>}
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.published ? "bg-success-soft text-success" : "bg-surface-2 text-muted"}`}>
            {p.published ? "منشورة" : "مسودة"}
          </span>
          <DeletePageButton id={p.id} />
        </Card>
      ))}
    </div>
  );
}
