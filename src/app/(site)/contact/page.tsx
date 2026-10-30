import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Ar, Container, Eyebrow, Icon, SectionTitle } from "@/components/site/bits";
import { BookingForm, BookingFormFromUrl, PartnershipForm } from "@/components/site/forms";
import { getSite, getTours } from "@/lib/site/data";
import { safeUrl, whatsappLink } from "@/lib/site/shape";

export async function generateMetadata(): Promise<Metadata> {
  const { contactPage } = await getSite();
  return { title: "Contact & Booking", description: contactPage.hero.text };
}

export default async function ContactPage() {
  const [site, tours] = await Promise.all([getSite(), getTours()]);
  const { contactPage: page, contact, general } = site;

  const formProps = {
    tours: tours.map((t) => ({ id: t.id, title: t.title, durationLabel: t.details.durationLabel })),
    customTour: page.form.customTour,
    classes: page.form.classes.map((c) => c.text),
    flexibility: page.form.flexibility.map((f) => f.text),
    submit: page.form.submit,
    note: page.form.note,
    successTitle: page.form.successTitle,
    successText: page.form.successText,
  };

  return (
    <>
      <div className="border-b border-surface-container-high bg-surface-container-low px-margin-mobile py-3 md:px-margin">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 text-label-md text-on-surface-variant">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            /<span className="text-antique-gold-dark">Contact &amp; Booking</span>
          </nav>
          <span className="flex items-center gap-2 text-heritage-olive">
            <span className="size-2 animate-pulse rounded-full bg-heritage-olive" />
            {page.hero.status}
          </span>
        </div>
      </div>

      {/* Intro */}
      <section className="bg-surface py-space-2xl">
        <Container className="grid items-end gap-space-xl lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Eyebrow icon="flight_takeoff">{page.hero.eyebrow}</Eyebrow>
            <h1 className="font-display text-display-hero-mobile font-bold tracking-tight text-primary md:text-display-hero">{page.hero.title}</h1>
            <Ar as="p" className="mt-1 text-headline-sm font-bold text-heritage-olive">
              {page.hero.titleAr}
            </Ar>
            <p className="mt-space-md max-w-3xl text-body-lead text-on-surface-variant">{page.hero.text}</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-antique-gold/30 bg-surface-container-lowest p-space-md shadow-sm lg:col-span-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={safeUrl(general.logo, "")} alt="" className="size-14 rounded-full object-contain" />
            <div>
              <div className="font-display text-headline-sm text-primary">{page.hero.badgeTitle}</div>
              <div className="text-label-md text-on-surface-variant">{page.hero.badgeText}</div>
              <div className="text-label-md text-heritage-olive">{page.hero.badgeNote}</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Form + assistance */}
      <section className="bg-surface-container py-space-2xl">
        <Container className="grid items-start gap-space-xl lg:grid-cols-12">
          <div id="booking" className="scroll-mt-28 rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-lg shadow-xl md:p-space-xl lg:col-span-7">
            <div className="mb-space-lg">
              <h2 className="font-display text-headline-lg text-primary">{page.form.title}</h2>
              <Ar as="p" className="text-body-md font-semibold text-heritage-olive">
                {page.form.titleAr}
              </Ar>
              <p className="mt-2 text-body-sm text-on-surface-variant">{page.form.text}</p>
            </div>
            <Suspense fallback={<BookingForm {...formProps} />}>
              <BookingFormFromUrl {...formProps} />
            </Suspense>
          </div>

          <div className="space-y-space-lg lg:sticky lg:top-24 lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl bg-primary p-space-lg text-white shadow-xl">
              <Icon name="explore" className="pointer-events-none absolute -top-6 -right-6 text-[140px] text-white/5" />
              <div className="flex items-center justify-between text-label-md">
                <span className="text-antique-gold">{page.assist.kicker}</span>
                <span className="flex items-center gap-1.5 rounded-full bg-heritage-olive px-2.5 py-1">
                  <span className="size-1.5 animate-pulse rounded-full bg-white" /> {page.assist.status}
                </span>
              </div>
              <h2 className="mt-space-sm font-display text-headline-md">{page.assist.title}</h2>
              <p className="mt-1 text-body-sm text-surface-container-high">{page.assist.text}</p>
              <a
                href={whatsappLink(contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-space-md flex items-center gap-3 rounded-xl bg-[#25d366] p-space-md text-white transition-transform hover:scale-[1.01]"
              >
                <Icon name="chat" className="text-[28px]" />
                <span className="flex-1">
                  <span className="block text-label-lg font-bold">{page.assist.whatsappTitle}</span>
                  <span className="text-body-sm" dir="ltr">
                    {contact.whatsapp}
                  </span>{" "}
                  <span className="text-body-sm opacity-90">{page.assist.whatsappNote}</span>
                </span>
                <Icon name="chevron_right" />
              </a>
              <a href={`mailto:${contact.email}`} className="mt-space-sm flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-space-md hover:bg-white/10">
                <Icon name="mail" className="text-antique-gold" />
                <span>
                  <span className="block text-label-md text-surface-container-high">{page.assist.emailTitle}</span>
                  <span className="text-body-sm font-semibold break-all">{contact.email}</span>
                </span>
              </a>
            </div>

            <div className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-lg">
              <h2 className="flex items-center gap-2 font-display text-headline-sm text-primary">
                <Icon name="verified_user" className="text-antique-gold-dark" />
                {page.steps.title}
              </h2>
              <ol className="mt-space-md space-y-space-md border-l-2 border-antique-gold/40 pl-space-md">
                {page.steps.items.map((s, i) => (
                  <li key={s.title} className="relative">
                    <span className="absolute top-0 -left-[calc(1rem+13px)] flex size-6 items-center justify-center rounded-full bg-antique-gold text-label-md font-bold text-white">
                      {i + 1}
                    </span>
                    <h3 className="font-sans text-label-lg font-semibold text-primary">{s.title}</h3>
                    <p className="text-body-sm text-on-surface-variant">{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-lg">
              <h2 className="font-display text-headline-sm text-primary">{page.offices.title}</h2>
              <div className="mt-space-md space-y-space-md">
                {contact.offices.map((o) => (
                  <div key={o.title} className="flex items-start gap-3">
                    <Icon name={o.icon || "location_on"} className="text-antique-gold-dark" />
                    <div>
                      <h3 className="font-sans text-label-lg font-semibold text-primary">{o.title}</h3>
                      <p className="text-body-sm text-on-surface-variant" dir="auto">
                        {o.address}
                      </p>
                      <p className="text-label-md text-heritage-olive">{o.hours}</p>
                    </div>
                  </div>
                ))}
              </div>
              {page.offices.image && (
                <figure className="mt-space-md overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={safeUrl(page.offices.image, "")} alt="" loading="lazy" className="h-44 w-full object-cover" />
                  <figcaption className="bg-surface-container p-2 text-label-md text-on-surface-variant italic">{page.offices.caption}</figcaption>
                </figure>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Partnerships */}
      <section id="partnership" className="scroll-mt-24 py-space-3xl">
        <Container>
          <div className="mx-auto mb-space-2xl max-w-3xl text-center">
            <Eyebrow icon="handshake">{page.partnership.eyebrow}</Eyebrow>
            <SectionTitle>{page.partnership.title}</SectionTitle>
            <Ar as="p" className="mt-2 text-body-lead font-bold text-heritage-olive">
              {page.partnership.questionAr}
            </Ar>
            <p className="mt-2 text-body-lead text-on-surface-variant">{page.partnership.text}</p>
          </div>
          <div className="grid gap-space-lg md:grid-cols-3">
            {page.partnership.groups.map((g) => (
              <div key={g.title} className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-lg shadow-sm">
                <Icon name={g.icon} className="text-[32px] text-antique-gold-dark" />
                <h3 className="mt-space-sm font-sans text-headline-sm font-semibold text-primary">{g.title}</h3>
                <Ar as="p" className="text-body-sm font-semibold text-heritage-olive">
                  {g.titleAr}
                </Ar>
                <p className="mt-2 text-body-sm text-on-surface-variant">{g.text}</p>
                <span className="mt-space-md flex items-center gap-1 text-label-md font-semibold text-primary">
                  <Icon name="check_circle" className="text-[16px] text-heritage-olive" /> {g.tag}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-space-2xl grid gap-space-xl lg:grid-cols-2">
            <div>
              <Eyebrow icon="hub">{page.partnership.benefitsEyebrow}</Eyebrow>
              <h3 className="font-display text-headline-lg text-primary">{page.partnership.benefitsTitle}</h3>
              <p className="mt-2 text-body-md text-on-surface-variant">{page.partnership.benefitsText}</p>
              <ul className="mt-space-lg space-y-space-md">
                {page.partnership.benefits.map((b) => (
                  <li key={b.title} className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon name={b.icon} />
                    </span>
                    <div>
                      <h4 className="font-sans text-label-lg font-semibold text-primary">{b.title}</h4>
                      <Ar as="p" className="text-body-sm text-heritage-olive">
                        {b.titleAr}
                      </Ar>
                      <p className="text-body-sm text-on-surface-variant">{b.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <a href={`mailto:${contact.partnershipsEmail}`} className="mt-space-lg inline-flex items-center gap-2 text-label-lg font-semibold text-primary hover:text-antique-gold-dark">
                <Icon name="mail" className="text-antique-gold" />
                {contact.partnershipsEmail}
              </a>
            </div>
            <div className="rounded-2xl border border-antique-gold/20 bg-surface-container-lowest p-space-lg shadow-xl md:p-space-xl">
              <h3 className="font-display text-headline-md text-primary">{page.partnership.formTitle}</h3>
              <Ar as="p" className="text-body-md font-semibold text-heritage-olive">
                {page.partnership.formTitleAr}
              </Ar>
              <p className="mt-2 mb-space-lg text-body-sm text-on-surface-variant">{page.partnership.formText}</p>
              <PartnershipForm
                categories={page.partnership.categories.map((c) => c.text)}
                submit={page.partnership.submit}
                successTitle={page.partnership.successTitle}
                successText={page.partnership.successText}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Routes */}
      <section className="bg-surface-container py-space-3xl">
        <Container>
          <div className="mb-space-2xl max-w-2xl">
            <Eyebrow icon="map">{page.routes.eyebrow}</Eyebrow>
            <SectionTitle>{page.routes.title}</SectionTitle>
            <p className="mt-2 text-body-lead text-on-surface-variant">{page.routes.text}</p>
          </div>
          <div className="grid gap-space-lg lg:grid-cols-5">
            <div
              className="relative min-h-[320px] overflow-hidden rounded-2xl bg-surface-container-high bg-cover bg-center shadow-md lg:col-span-3"
              style={{ backgroundImage: `url("${safeUrl(page.routes.mapImage, "")}")` }}
            >
              <div className="absolute inset-x-4 bottom-4 rounded-xl bg-primary/90 p-space-md text-white backdrop-blur-sm">
                <span className="flex items-center gap-1 text-label-md text-antique-gold">
                  <Icon name="pin_drop" className="text-[16px]" />
                  {page.routes.mapTitle}
                </span>
                <p className="text-body-sm">{page.routes.mapText}</p>
              </div>
            </div>
            <div className="space-y-space-md lg:col-span-2">
              {page.routes.items.map((r) => (
                <div key={r.title} className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-md">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-sans text-label-lg font-semibold text-primary">{r.title}</h3>
                    <span className="shrink-0 rounded-full bg-antique-gold/15 px-2 py-0.5 text-label-md text-antique-gold-dark">{r.tag}</span>
                  </div>
                  <p className="mt-1 text-body-sm text-on-surface-variant">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 py-space-3xl">
        <Container className="grid gap-space-2xl lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow icon="help_center">{page.faq.eyebrow}</Eyebrow>
            <SectionTitle>{page.faq.title}</SectionTitle>
            <p className="mt-2 text-body-md text-on-surface-variant">{page.faq.text}</p>
            <div className="mt-space-lg rounded-xl bg-primary p-space-lg text-white">
              <h3 className="font-display text-headline-sm">{page.faq.ctaTitle}</h3>
              <p className="mt-1 text-body-sm text-surface-container-high">{page.faq.ctaText}</p>
              <a
                href={whatsappLink(contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-space-md inline-flex items-center gap-2 rounded-lg bg-antique-gold px-space-md py-2.5 text-label-lg font-semibold text-white hover:bg-antique-gold-dark"
              >
                <Icon name="chat" className="text-[18px]" />
                {page.faq.ctaButton}
              </a>
            </div>
          </div>
          <div className="space-y-3 lg:col-span-8">
            {page.faq.items.map((f, i) => (
              <details key={f.q} open={i === 0} className="group overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest shadow-sm">
                <summary className="flex cursor-pointer list-none items-center gap-4 p-space-md">
                  <span className="font-display text-headline-sm text-antique-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 font-sans text-body-md font-semibold text-primary" dir="auto">
                    {f.q}
                  </span>
                  <Icon name="expand_more" className="text-antique-gold-dark transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-space-md pb-space-md pl-[3.75rem] text-body-md text-on-surface-variant" dir="auto">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {page.gallery.length > 0 && (
        <section className="pb-space-3xl">
          <Container className="grid gap-space-md md:grid-cols-3">
            {page.gallery.map((g) => (
              <figure key={g.image} className="relative overflow-hidden rounded-xl shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={safeUrl(g.image, "")} alt={g.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <figcaption className="absolute right-4 bottom-4 left-4 text-white">
                  <div className="font-display text-headline-sm">{g.title}</div>
                  <div className="text-label-md opacity-85">{g.text}</div>
                </figcaption>
              </figure>
            ))}
          </Container>
        </section>
      )}
    </>
  );
}
