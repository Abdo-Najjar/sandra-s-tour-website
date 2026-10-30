import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { SITE_SECTIONS } from "@/lib/site/content";

export const metadata = { title: "محتوى الموقع" };

export default function SiteContentPage() {
  return (
    <>
      <PageHeader title="محتوى الموقع" subtitle="عدّل كل نصوص وصور الموقع. التغييرات تظهر مباشرة بعد الحفظ." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SITE_SECTIONS.map((s) => (
          <Link
            key={s.key}
            href={`/admin/site/${s.key}`}
            className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary"
          >
            <div className="flex-1">
              <h2 className="font-bold group-hover:text-primary">{s.label}</h2>
              <p className="mt-1 text-sm text-muted">{s.description}</p>
            </div>
            <ChevronLeft className="size-5 text-muted group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </>
  );
}
