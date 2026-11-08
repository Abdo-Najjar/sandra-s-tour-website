import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getT } from "@/lib/admin/lang";
import { PageHeader } from "@/components/ui";
import { SITE_SECTIONS } from "@/lib/site/content";

export const metadata = { title: "Website content" };

export default async function SiteContentPage() {
  const t = await getT();
  return (
    <>
      <PageHeader
        title={t("Website content")}
        subtitle={t("Edit all the website text and images, in English and Arabic. Changes show as soon as you save.")}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SITE_SECTIONS.map((s) => (
          <Link
            key={s.key}
            href={`/admin/site/${s.key}`}
            className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary"
          >
            <div className="flex-1">
              <h2 className="font-bold group-hover:text-primary">{t(s.label)}</h2>
              <p className="mt-1 text-sm text-muted">{t(s.description)}</p>
            </div>
            <ChevronRight className="size-5 text-muted group-hover:text-primary rtl:-scale-x-100" />
          </Link>
        ))}
      </div>
    </>
  );
}
