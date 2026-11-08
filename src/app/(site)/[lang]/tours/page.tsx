import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, Icon } from "@/components/site/bits";
import { Link } from "@/components/site/lang";
import { TourCatalog, TourCatalogFromUrl } from "@/components/site/tour-catalog";
import { getSite, getTours } from "@/lib/site/data";
import { getUi } from "@/lib/site/lang";
import { whatsappLink } from "@/lib/site/shape";

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getUi();
  const { tours } = await getSite(lang);
  return { title: tours.hero.title, description: tours.hero.text };
}

export default async function ToursPage() {
  const { lang, t } = await getUi();
  const [site, tours] = await Promise.all([getSite(lang), getTours(lang)]);
  const page = site.tours;

  return (
    <>
      <section className="relative overflow-hidden bg-primary pt-space-2xl pb-space-3xl text-white">
        <div className="pointer-events-none absolute -top-32 -end-32 size-96 rounded-full bg-antique-gold/15 blur-3xl" />
        <Container className="relative">
          <div className="flex flex-col justify-between gap-space-xl lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-space-md inline-flex flex-wrap items-center gap-2 rounded-full border border-antique-gold/30 bg-white/10 px-3 py-1.5 text-label-md">
                <Icon name="stars" className="text-[18px] text-antique-gold" />
                {page.hero.badge}
              </div>
              <h1 className="font-display text-display-hero-mobile font-bold tracking-tight md:text-display-hero">{page.hero.title}</h1>
              <p className="mt-space-md max-w-2xl text-body-lead text-surface-container-high">{page.hero.text}</p>
            </div>
            {page.hero.statValue && (
              <div className="flex shrink-0 items-center gap-3 rounded-xl border border-antique-gold/30 bg-white/5 px-space-lg py-space-md">
                <Icon name="travel_explore" className="text-[36px] text-antique-gold" />
                <div>
                  <div className="font-display text-headline-lg font-bold">{page.hero.statValue}</div>
                  <div className="text-label-md text-surface-container-high">{page.hero.statLabel}</div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      <Suspense fallback={<TourCatalog tours={tours} filters={page.filters} labels={page.scheduled} />}>
        <TourCatalogFromUrl tours={tours} filters={page.filters} labels={page.scheduled} />
      </Suspense>

      {/* Bespoke / private tours */}
      <section className="relative overflow-hidden bg-basalt-charcoal py-space-3xl text-white">
        <div className="pointer-events-none absolute -bottom-40 -start-40 size-96 rounded-full bg-antique-gold/20 blur-3xl" />
        <Container className="relative">
          <div className="mb-space-lg flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-antique-gold/40 bg-white/10 px-3 py-1.5 text-label-lg text-antique-gold">
              <Icon name="hotel_class" className="text-[18px]" />
              {page.bespoke.badge}
            </span>
            <span className="rounded-full bg-heritage-olive px-3 py-1.5 text-label-md">{page.bespoke.badgeNote}</span>
          </div>
          <div className="grid gap-space-2xl lg:grid-cols-2">
            <div>
              <h2 className="font-display text-headline-xl-mobile font-bold md:text-headline-xl">{page.bespoke.title}</h2>
              <ul className="mt-space-md space-y-2">
                {page.bespoke.checks.map((c) => (
                  <li key={c.text} className="flex items-start gap-2 text-body-lead text-surface-container-high">
                    <Icon name="check" className="mt-1 text-[20px] text-antique-gold" />
                    {c.text}
                  </li>
                ))}
              </ul>
              {page.bespoke.highlight && (
                <p className="mt-space-md rounded-xl border border-antique-gold/30 bg-antique-gold/10 p-space-md text-body-lead font-bold text-antique-gold">
                  {page.bespoke.highlight}
                </p>
              )}
            </div>
            <div className="grid gap-space-md sm:grid-cols-2">
              {page.bespoke.perks.map((p) => (
                <div key={p.title} className="rounded-xl border border-white/10 bg-white/5 p-space-lg">
                  <Icon name={p.icon} className="text-[28px] text-antique-gold" />
                  <h3 className="mt-2 font-sans text-headline-sm font-bold">{p.title}</h3>
                  <p className="mt-1 text-body-sm text-surface-container-high">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-space-2xl flex flex-col items-center justify-between gap-space-lg rounded-xl border border-antique-gold/30 bg-primary p-space-lg lg:flex-row">
            <div className="flex items-center gap-space-md">
              <Icon name="support_agent" className="text-[40px] text-antique-gold" />
              <div>
                <h3 className="font-sans text-headline-sm font-bold">{page.bespoke.ctaTitle}</h3>
                <p className="text-body-sm text-surface-container-high">{page.bespoke.ctaText}</p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <a
                href={whatsappLink(site.contact.whatsapp, t.privateTourMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-[#25d366] px-space-lg py-3 text-label-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
              >
                <Icon name="chat" className="text-[20px]" />
                {page.bespoke.whatsappButton}
              </a>
              <Link
                href="/contact#booking"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-space-lg py-3 text-label-lg font-bold text-white transition-colors hover:bg-white/20"
              >
                <Icon name="mail" className="text-[20px] text-antique-gold" />
                {page.bespoke.formButton}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Inclusions */}
      <section className="bg-surface-container py-space-3xl">
        <Container>
          <div className="mx-auto mb-space-2xl max-w-2xl text-center">
            <h2 className="font-display text-headline-xl-mobile text-primary md:text-headline-xl">{page.inclusions.title}</h2>
            <p className="mt-2 text-body-lead text-on-surface-variant">{page.inclusions.text}</p>
          </div>
          <div className="grid gap-space-lg sm:grid-cols-2 lg:grid-cols-4">
            {page.inclusions.items.map((i) => (
              <div key={i.title} className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-lg shadow-sm">
                <span className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={i.icon} className="text-[28px]" />
                </span>
                <h3 className="mt-space-sm font-sans text-headline-sm font-semibold text-primary">{i.title}</h3>
                <p className="mt-1 text-body-sm text-on-surface-variant">{i.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
