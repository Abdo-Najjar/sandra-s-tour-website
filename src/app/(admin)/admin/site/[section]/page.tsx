import { Suspense } from "react";
import Link from "next/link";
import { BackLink } from "@/components/admin/new-link";
import { getT } from "@/lib/admin/lang";
import { notFound } from "next/navigation";
import { ContentSkeleton, PageHeader } from "@/components/ui";
import { SectionForm } from "@/components/admin/site-forms";
import { defaultContent, SITE_SECTIONS } from "@/lib/site/content";
import { isLang } from "@/lib/site/i18n";
import { getSiteContent } from "@/lib/queries";

export const metadata = { title: "Edit content" };

export default async function SectionPage({ params, searchParams }: PageProps<"/admin/site/[section]">) {
  const t = await getT();
  return (
    <>
      <BackLink href="/admin/site" label={t("Website content")} />
      <Suspense fallback={<ContentSkeleton />}>
        <SectionContent params={params} searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function SectionContent({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { section } = await params;
  const { lang: langParam } = await searchParams;
  const lang = isLang(langParam) ? langParam : "en";
  const meta = SITE_SECTIONS.find((s) => s.key === section);
  if (!meta) notFound();
  const [content, t] = await Promise.all([getSiteContent(lang), getT()]);

  return (
    <>
      <PageHeader title={t(meta.label)} subtitle={t(meta.description)} />
      {/* Each language has its own copy of the text. */}
      <div className="mb-4 inline-flex rounded-lg border border-border bg-surface p-1 text-sm" role="tablist" aria-label={t("Content language")}>
        {[
          { key: "en", label: t("English website") },
          { key: "ar", label: t("Arabic website") },
        ].map((l) => (
          <Link
            key={l.key}
            href={`/admin/site/${meta.key}${l.key === "en" ? "" : "?lang=ar"}`}
            role="tab"
            aria-selected={lang === l.key}
            className={`rounded-md px-4 py-1.5 font-semibold ${lang === l.key ? "bg-primary text-white" : "text-muted hover:text-foreground"}`}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <SectionForm
        key={lang}
        section={meta.key}
        lang={lang}
        template={defaultContent(lang)[meta.key]}
        initial={content[meta.key]}
        preview={meta.preview}
      />
    </>
  );
}
