import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, RichText } from "@/components/site/bits";
import { getPublicPage, getPublishedSlugs } from "@/lib/site/data";
import { getUi } from "@/lib/site/lang";
import { safeUrl } from "@/lib/site/shape";

// Extra pages created from the dashboard (terms, privacy, ...).
export async function generateStaticParams() {
  const slugs = await getPublishedSlugs("pages");
  return (slugs.length ? slugs : ["__none__"]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/p/[slug]">): Promise<Metadata> {
  const page = await getPublicPage((await params).slug, (await getUi()).lang);
  return page ? { title: page.title, description: page.subtitle || undefined } : {};
}

export default async function CustomPage({ params }: PageProps<"/[lang]/p/[slug]">) {
  const page = await getPublicPage((await params).slug, (await getUi()).lang);
  if (!page) notFound();

  return (
    <>
      <header className="relative overflow-hidden bg-primary py-space-3xl text-white">
        {page.image && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={safeUrl(page.image, "")} alt="" className="absolute inset-0 size-full object-cover opacity-35" />
          </>
        )}
        <Container className="relative">
          <h1 className="max-w-4xl font-display text-display-hero-mobile font-bold md:text-display-hero">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="mt-space-sm max-w-2xl text-body-lead text-surface-container-high">
              {page.subtitle}
            </p>
          )}
        </Container>
      </header>
      <Container className="py-space-2xl">
        <div className="max-w-3xl">
          <RichText source={page.body} />
        </div>
      </Container>
    </>
  );
}
