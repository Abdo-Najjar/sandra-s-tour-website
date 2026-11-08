import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { Icon, Paragraphs, Stars, formatPrice } from "@/components/site/bits";
import { MiniTourCard } from "@/components/site/cards";
import { NewsletterForm, TourBookingForm } from "@/components/site/forms";
import { Link } from "@/components/site/lang";
import { getPublishedSlugs, getSite, getTour, getTours } from "@/lib/site/data";
import { getUi } from "@/lib/site/lang";
import { safeUrl, whatsappLink } from "@/lib/site/shape";

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs("tours");
  // Cache Components needs at least one entry; unknown slugs still render on demand.
  return (slugs.length ? slugs : ["__none__"]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/tours/[slug]">): Promise<Metadata> {
  const { lang } = await getUi();
  const tour = await getTour((await params).slug, lang);
  if (!tour) return {};
  return {
    title: tour.title,
    description: tour.details.subtitle || tour.summary,
    openGraph: { images: tour.image ? [safeUrl(tour.image, "")] : undefined },
  };
}

const sectionLabel = "block text-label-sm font-semibold tracking-widest text-secondary uppercase";
const sectionTitle = "font-display text-headline-lg text-primary";
const panel = "rounded-xl bg-surface-container-low shadow-sm";

// "07:30 — text" lines get a bold time.
function ItineraryBody({ body }: { body: string }) {
  return (
    <div className="space-y-3 pt-3 text-body-md text-on-surface-variant">
      {body
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line, i) => {
          const m = line.match(/^([\d:–\- ]{2,15}?)\s+—\s+(.*)$/);
          return (
            <p key={i}>
              {m ? (
                <>
                  <strong className="text-on-surface">{m[1]}</strong> — {m[2]}
                </>
              ) : (
                line
              )}
            </p>
          );
        })}
    </div>
  );
}

export default async function TourPage({ params }: PageProps<"/[lang]/tours/[slug]">) {
  const { slug } = await params;
  const { lang, t } = await getUi();
  const [tour, site, allTours] = await Promise.all([getTour(slug, lang), getSite(lang), getTours(lang)]);
  if (!tour) notFound();

  const d = tour.details;
  const detail = site.tours.detail;
  const related = allTours.filter((x) => x.id !== tour.id).slice(0, 3);
  const whatsapp = whatsappLink(site.contact.whatsapp, t.tourWhatsapp(tour.title));
  const [main, ...rest] = d.gallery.length ? d.gallery : [{ image: tour.image, kicker: "", title: tour.title, text: "" }];
  const guide = site.about.founder;

  return (
    <>
      {/* Breadcrumb ribbon */}
      <section className="w-full bg-surface-container-low px-margin-mobile py-3 shadow-sm md:px-margin">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-label-sm tracking-wider text-on-surface-variant uppercase">
            <Link href="/" className="hover:text-primary">
              {t.home}
            </Link>
            <Icon name="chevron_right" className="text-[14px] text-outline" />
            <Link href="/tours" className="hover:text-primary">
              {t.tours}
            </Link>
            <Icon name="chevron_right" className="text-[14px] text-outline" />
            <span className="font-semibold text-secondary">{tour.title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-4 text-label-sm">
            {d.route && (
              <span className="inline-flex items-center gap-1.5 rounded bg-surface px-2.5 py-1 shadow-sm">
                <Icon name="verified" fill className="text-[16px] text-secondary" />
                <span className="font-medium">{d.route}</span>
              </span>
            )}
            {d.groupLabel && (
              <span className="hidden items-center gap-1.5 rounded bg-surface px-2.5 py-1 shadow-sm sm:inline-flex">
                <Icon name="groups" className="text-[16px] text-secondary" />
                {d.groupLabel}
              </span>
            )}
            {d.rating && (
              <span className="inline-flex items-center gap-1 font-semibold text-secondary">
                <Icon name="star" fill className="text-[16px]" />
                <span className="text-on-surface">{d.rating}</span>
                {d.reviews && <span className="font-normal text-on-surface-variant">{t.verifiedReviews(d.reviews)}</span>}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Title + specs */}
      <section className="w-full bg-surface px-margin-mobile pt-space-lg pb-space-xl md:px-margin">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-space-lg">
          <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-end">
            <div className="max-w-4xl space-y-space-xs">
              {(d.badge || d.durationLabel) && (
                <div className="inline-flex flex-wrap items-center gap-2 text-label-md font-semibold tracking-widest text-secondary uppercase">
                  <span className="size-2 rounded-full bg-secondary" />
                  {d.badge}
                  {d.badge && d.durationLabel && <span className="text-outline">/</span>}
                  <span className="font-display font-normal text-on-surface-variant normal-case italic">{d.durationLabel}</span>
                </div>
              )}
              <h1 className="font-display text-headline-xl-mobile tracking-tight text-primary md:text-[48px] md:leading-[58px]">{tour.title}</h1>
              {d.subtitle && <p className="font-display text-headline-md text-secondary italic">{d.subtitle}</p>}
            </div>
            <a
              href="#booking-card"
              className="flex shrink-0 items-center gap-2 self-start rounded bg-primary px-space-md py-3 text-label-md tracking-wider text-white uppercase shadow-md hover:bg-primary-light lg:self-auto"
            >
              {t.bookTour} <span className="font-semibold text-secondary-fixed">• {formatPrice(tour.price)}{t.pp}</span>
            </a>
          </div>
          {d.specs.length > 0 && (
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-container-low p-space-md shadow-sm md:grid-cols-3 lg:grid-cols-6">
              {d.specs.map((s) => (
                <div key={s.label + s.value} className="flex items-start gap-3 p-2">
                  <Icon name={s.icon} className="shrink-0 text-secondary" />
                  <div>
                    <span className="block text-label-sm tracking-wider text-outline uppercase">{s.label}</span>
                    <span className="text-body-md font-semibold text-primary">{s.value}</span>
                    {s.note && <span className="block text-body-sm text-on-surface-variant">{s.note}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="w-full bg-surface-container-low px-margin-mobile py-space-md md:px-margin">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-space-sm md:h-[540px] md:grid-cols-12">
          <figure className={`relative h-[320px] overflow-hidden rounded-xl shadow-md md:h-full ${rest.length ? "md:col-span-6" : "md:col-span-12"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={safeUrl(main.image, safeUrl(tour.image, ""))} alt={main.title} className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-4 bottom-4 text-white">
              {main.kicker && <span className="mb-1 inline-block rounded bg-secondary px-2 py-0.5 text-label-sm tracking-widest uppercase">{main.kicker}</span>}
              <h2 className="font-display text-headline-md text-white">{main.title}</h2>
              {main.text && <p className="line-clamp-1 text-body-sm opacity-90">{main.text}</p>}
            </figcaption>
          </figure>
          {rest.length > 0 && (
            <div className="grid h-full grid-cols-2 gap-space-sm md:col-span-6">
              {rest.slice(0, 3).map((g, i) => (
                <figure key={g.image + i} className={`relative h-[200px] overflow-hidden rounded-xl shadow-sm md:h-auto ${i === 2 || rest.length === 1 ? "col-span-2" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={safeUrl(g.image, "")} alt={g.title} loading="lazy" className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-transparent to-transparent" />
                  <figcaption className="absolute inset-x-3 bottom-3 text-white">
                    {g.kicker && <span className="block text-label-sm text-secondary-fixed uppercase">{g.kicker}</span>}
                    <p className="line-clamp-1 font-display text-body-lg">{g.title}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content + booking */}
      <section className="w-full bg-surface px-margin-mobile py-space-xl md:px-margin">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 items-start gap-space-xl lg:grid-cols-12">
          <div className="space-y-space-2xl lg:col-span-8">
            {(d.overviewTitle || d.overview) && (
              <article className="space-y-space-md">
                {d.overviewEyebrow && (
                  <div className="flex items-center gap-2 text-label-sm font-semibold tracking-widest text-secondary uppercase">
                    <Icon name="history_edu" className="text-[20px]" />
                    {d.overviewEyebrow}
                  </div>
                )}
                {d.overviewTitle && <h2 className={sectionTitle}>{d.overviewTitle}</h2>}
                <div className="space-y-4 text-body-lg text-on-surface-variant">
                  <Paragraphs text={d.overview || tour.summary} />
                </div>
                {d.quote && (
                  <blockquote className="border-s-4 border-antique-gold bg-surface-container p-space-lg font-display text-headline-sm text-primary italic">
                    «{d.quote}»
                    {d.quoteBy && <footer className="mt-2 font-sans text-label-md text-on-surface-variant not-italic">— {d.quoteBy}</footer>}
                  </blockquote>
                )}
              </article>
            )}

            {d.highlights.length > 0 && (
              <section className="space-y-space-md">
                <div>
                  <span className={sectionLabel}>{t.highlightsEyebrow}</span>
                  <h2 className={sectionTitle}>{t.highlightsTitle}</h2>
                </div>
                <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
                  {d.highlights.map((h) => (
                    <div key={h.title} className={`${panel} space-y-2 p-space-lg`}>
                      <span className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                        <Icon name={h.icon || "star"} className="text-[22px]" />
                      </span>
                      <h3 className="font-display text-headline-md text-primary">{h.title}</h3>
                      <p className="text-body-md text-on-surface-variant">{h.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {d.itinerary.length > 0 && (
              <section className="space-y-space-md">
                <div className="flex items-end justify-between">
                  <div>
                    <span className={sectionLabel}>{t.itineraryEyebrow}</span>
                    <h2 className={sectionTitle}>{t.itineraryTitle}</h2>
                  </div>
                  {d.durationLabel && <span className="hidden text-label-md text-on-surface-variant sm:inline">{d.durationLabel}</span>}
                </div>
                <ol className="space-y-space-md">
                  {d.itinerary.map((day, i) => (
                    <li key={day.title + i} className={`${panel} p-space-lg`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex size-8 shrink-0 items-center justify-center rounded-full text-label-md font-bold ${
                              i % 2 ? "bg-secondary text-white" : "bg-primary text-white"
                            }`}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <h3 className="font-display text-headline-md text-primary">{day.title}</h3>
                            {day.subtitle && <span className="text-body-sm text-secondary">{day.subtitle}</span>}
                          </div>
                        </div>
                      </div>
                      {day.body && <ItineraryBody body={day.body} />}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {(d.includes.length > 0 || d.excludes.length > 0) && (
              <section className="space-y-space-md">
                <div>
                  <span className={sectionLabel}>{t.inclusionsEyebrow}</span>
                  <h2 className={sectionTitle}>{t.inclusionsTitle}</h2>
                </div>
                <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
                  {[
                    { title: t.included, icon: "check_circle", item: "check", tone: "text-secondary", list: d.includes },
                    { title: t.notIncluded, icon: "cancel", item: "close", tone: "text-outline", list: d.excludes },
                  ]
                    .filter((g) => g.list.length)
                    .map((g) => (
                      <div key={g.title} className={`${panel} space-y-3 p-space-lg`}>
                        <h3 className="flex items-center gap-2 font-display text-headline-md text-primary">
                          <Icon name={g.icon} fill className={g.tone} />
                          {g.title}
                        </h3>
                        <ul className="space-y-2.5 text-body-md text-on-surface-variant">
                          {g.list.map((x) => (
                            <li key={x} className="flex items-start gap-2">
                              <Icon name={g.item} className={`mt-0.5 shrink-0 text-[20px] ${g.tone}`} />
                              <span>{x}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Lead guide */}
            <section className={`${panel} p-space-lg`}>
              <div className="flex flex-col items-center gap-space-lg md:flex-row">
                <div className="size-40 shrink-0 overflow-hidden rounded-full shadow-md md:size-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={safeUrl(site.guide.profile.image, "")} alt={site.guide.profile.name} loading="lazy" className="size-full object-cover" />
                </div>
                <div className="space-y-space-xs text-center md:text-start">
                  <div className="inline-flex items-center gap-2 rounded bg-secondary/10 px-2.5 py-0.5 text-label-sm font-semibold tracking-wider text-secondary uppercase">
                    <Icon name="school" className="text-[14px]" />
                    {guide.badge}
                  </div>
                  <h2 className={sectionTitle}>{site.guide.profile.name}</h2>
                  <p className="text-body-md font-medium text-secondary">{site.guide.profile.credentials}</p>
                  <p className="text-body-md text-on-surface-variant">{guide.paragraphs[0]?.text}</p>
                  <Link href="/guide" className="inline-flex items-center gap-1 pt-1 text-label-md font-semibold text-primary underline underline-offset-4">
                    {t.meetGuide} <Icon name="arrow_forward" className="text-[16px]" />
                  </Link>
                </div>
              </div>
            </section>

            {d.logistics.length > 0 && (
              <section className="space-y-space-md">
                <div>
                  <span className={sectionLabel}>{t.logisticsEyebrow}</span>
                  <h2 className={sectionTitle}>{t.logisticsTitle}</h2>
                </div>
                <div className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
                  {d.logistics.map((l) => (
                    <div key={l.title} className={`${panel} space-y-2 p-space-md`}>
                      <Icon name={l.icon || "info"} className="text-secondary" />
                      <h3 className="font-display text-body-lg text-primary">{l.title}</h3>
                      <p className="text-body-sm text-on-surface-variant">{l.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {d.testimonials.length > 0 && (
              <section className="space-y-space-md">
                <div>
                  <span className={sectionLabel}>{t.testimonialsEyebrow}</span>
                  <h2 className={sectionTitle}>{t.testimonialsTitle}</h2>
                </div>
                <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
                  {d.testimonials.map((r) => (
                    <figure key={r.name} className={`${panel} space-y-3 p-space-lg`}>
                      <Stars />
                      <blockquote className="text-body-md text-on-surface italic">&ldquo;{r.quote}&rdquo;</blockquote>
                      <figcaption className="flex items-center justify-between pt-2 text-label-sm">
                        <div>
                          <span className="block font-semibold text-primary">{r.name}</span>
                          <span className="text-on-surface-variant">{r.role}</span>
                        </div>
                        <span className="font-medium text-secondary">{r.date}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {d.faq.length > 0 && (
              <section className="space-y-space-md">
                <div>
                  <span className={sectionLabel}>{t.faqEyebrow}</span>
                  <h2 className={sectionTitle}>{t.faqTitle}</h2>
                </div>
                <div className="space-y-3">
                  {d.faq.map((f, i) => (
                    <details key={f.q} open={i === 0} className={`${panel} group overflow-hidden`}>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-space-md font-display text-body-lg text-primary">
                        {f.q}
                        <Icon name="keyboard_arrow_down" className="text-secondary transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="px-space-md pb-space-md text-body-md text-on-surface-variant">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Booking card */}
          <aside id="booking-card" className="space-y-space-md lg:sticky lg:top-24 lg:col-span-4">
            <div className="space-y-space-md rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="block text-label-sm tracking-wider text-outline uppercase">{t.tariff}</span>
                  <span className="font-display text-headline-lg font-bold text-primary">{formatPrice(tour.price)}</span>
                  <span className="text-body-sm text-on-surface-variant"> {t.perPerson}</span>
                </div>
                <span className="rounded bg-secondary/10 px-2.5 py-1 text-label-sm font-semibold text-secondary uppercase">{t.allInclusive}</span>
              </div>
              {detail.bookingNote && <p className="text-body-sm text-on-surface-variant">{detail.bookingNote}</p>}
              <TourBookingForm tourId={tour.id} whatsappHref={whatsapp} />
              <div className="space-y-2 pt-space-xs text-body-sm text-on-surface-variant">
                {detail.bookingPerks.map((p) => (
                  <div key={p.text} className="flex items-center gap-2">
                    <Icon name={p.icon} className="text-[18px] text-secondary" />
                    {p.text}
                  </div>
                ))}
              </div>
              {detail.customTitle && (
                <div className="space-y-1 rounded-lg bg-surface-container-low p-3 text-center">
                  <span className="block text-label-sm font-semibold tracking-wider text-secondary uppercase">{detail.customTitle}</span>
                  <p className="text-body-sm text-on-surface-variant">{detail.customText}</p>
                  <Link href="/contact#booking" className="inline-block pt-1 text-label-md font-semibold text-primary underline underline-offset-4">
                    {t.requestTailored}
                  </Link>
                </div>
              )}
            </div>
            {d.mapImage && (
              <div className={`${panel} space-y-2 p-space-md`}>
                <div className="flex items-center justify-between">
                  <span className="text-label-sm font-semibold tracking-wider text-outline uppercase">{t.route}</span>
                  <span className="text-label-sm text-secondary">{d.mapDistance}</span>
                </div>
                <div
                  className="relative flex h-44 w-full items-end rounded-lg bg-cover bg-center p-3 shadow-inner"
                  style={{ backgroundImage: `url("${safeUrl(d.mapImage, "")}")` }}
                >
                  {d.mapRoute && (
                    <span className="flex items-center gap-2 rounded bg-primary/90 px-3 py-1.5 text-label-sm text-white backdrop-blur-sm">
                      <Icon name="near_me" className="text-[16px] text-secondary" />
                      {d.mapRoute}
                    </span>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="w-full bg-surface-container-low px-margin-mobile py-space-xl md:px-margin">
          <div className="mx-auto max-w-[1360px] space-y-space-lg">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <span className={sectionLabel}>{detail.relatedEyebrow}</span>
                <h2 className={sectionTitle}>{detail.relatedTitle}</h2>
              </div>
              <Link href="/tours" className="flex items-center gap-1 text-label-md font-semibold tracking-wider text-secondary uppercase">
                {t.viewAllTours(allTours.length)} <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
              {related.map((r) => (
                <Fragment key={r.id}>
                  <MiniTourCard tour={r} />
                </Fragment>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="w-full bg-primary px-margin-mobile py-space-xl text-white md:px-margin">
        <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-space-lg lg:flex-row">
          <div className="max-w-2xl space-y-2">
            <span className="block text-label-sm font-semibold tracking-widest text-secondary-fixed uppercase">{detail.newsletterEyebrow}</span>
            <h2 className="font-display text-headline-lg text-white">{detail.newsletterTitle}</h2>
            <p className="text-body-md text-on-primary-container">{detail.newsletterText}</p>
          </div>
          <div className="w-full lg:w-[420px]">
            <NewsletterForm placeholder={t.newsletterPlaceholder} button={t.joinNewsletter} variant="band" />
          </div>
        </div>
      </section>
    </>
  );
}
