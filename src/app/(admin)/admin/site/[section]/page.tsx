import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ContentSkeleton, PageHeader } from "@/components/ui";
import { SectionForm } from "@/components/admin/site-forms";
import { defaultSiteContent, SITE_SECTIONS } from "@/lib/site/content";
import { getSiteContent } from "@/lib/queries";

export const metadata = { title: "تعديل المحتوى" };

export default function SectionPage({ params }: PageProps<"/admin/site/[section]">) {
  return (
    <>
      <Link href="/admin/site" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ChevronRight className="size-4" /> محتوى الموقع
      </Link>
      <Suspense fallback={<ContentSkeleton />}>
        <SectionContent params={params} />
      </Suspense>
    </>
  );
}

async function SectionContent({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const meta = SITE_SECTIONS.find((s) => s.key === section);
  if (!meta) notFound();
  const content = await getSiteContent();

  return (
    <>
      <PageHeader title={meta.label} subtitle={meta.description} />
      <SectionForm
        section={meta.key}
        template={defaultSiteContent[meta.key]}
        initial={content[meta.key]}
        preview={meta.preview}
      />
    </>
  );
}
