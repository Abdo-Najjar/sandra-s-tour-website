import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Icon, SectionTitle } from "@/components/site/bits";
import { GuideRequestForm } from "@/components/site/forms";
import { getSite } from "@/lib/site/data";
import { safeUrl, whatsappLink } from "@/lib/site/shape";

export async function generateMetadata(): Promise<Metadata> {
  const { guide } = await getSite();
  return { title: guide.hero.title, description: guide.hero.text };
}

export default async function GuidePage() {
  const site = await getSite();
  const { guide, contact, general } = site;
  const { profile } = guide;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-container py-space-2xl md:py-space-3xl">
        <div className="pointer-events-none absolute -top-32 -right-32 size-[28rem] rounded-full bg-antique-gold/10 blur-3xl" />
        <Container className="relative">
          <div className="mb-space-md flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-antique-gold/30 bg-surface-container-lowest px-3 py-1.5 text-label-md font-semibold text-primary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={safeUrl(general.logo, "")} alt="" className="size-5 rounded-full object-contain" />
              {guide.hero.eyebrow}
            </span>
            <span className="inline-flex items-center gap-2 text-label-md text-heritage-olive">
              <span className="size-2 animate-pulse rounded-full bg-heritage-olive" />
              {guide.hero.status}
            </span>
          </div>
          <h1 className="max-w-4xl font-display text-display-hero-mobile font-bold tracking-tight text-primary md:text-display-hero">{guide.hero.title}</h1>
          <p className="mt-space-md max-w-2xl text-body-lead text-on-surface-variant">{guide.hero.text}</p>
          <div className="mt-space-lg flex flex-col gap-space-sm sm:flex-row">
            <a href="#booking" className="inline-flex items-center justify-center gap-2 rounded-lg border border-antique-gold/40 bg-primary px-space-lg py-3.5 text-label-lg text-white shadow-md hover:bg-primary-light">
              {guide.hero.primary}
              <Icon name="arrow_forward" className="text-[18px] text-antique-gold" />
            </a>
            <a href="#network" className="inline-flex items-center justify-center rounded-lg border border-surface-container-high bg-surface-container-lowest px-space-lg py-3.5 text-label-lg text-primary hover:bg-surface">
              {guide.hero.secondary}
            </a>
          </div>
          <div className="mt-space-2xl grid grid-cols-2 gap-space-md lg:grid-cols-4">
            {guide.hero.stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm">
                <Icon name={s.icon} className="text-[28px] text-antique-gold-dark" />
                <div>
                  <div className="font-display text-headline-sm font-bold text-primary">{s.value}</div>
                  <div className="text-label-md text-on-surface-variant">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Profile */}
      <section className="py-space-3xl">
        <Container>
          <Eyebrow>{profile.eyebrow}</Eyebrow>
          <div className="mt-space-md grid overflow-hidden rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-xl lg:grid-cols-12">
            <div className="relative min-h-[420px] lg:col-span-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={safeUrl(profile.image, "")} alt={profile.name} className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-basalt-charcoal/80 via-transparent to-transparent" />
              <div className="absolute inset-x-4 bottom-4 rounded-xl border border-antique-gold/30 bg-primary/90 p-space-md text-white backdrop-blur-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-label-md font-semibold">
                    <Icon name="shield" className="text-[18px] text-antique-gold" />
                    {profile.chip}
                  </span>
                  <span className="rounded bg-antique-gold px-2 py-0.5 text-label-md">{profile.chipClass}</span>
                </div>
                <p className="mt-1 text-label-md text-surface-container-high">{profile.chipNote}</p>
              </div>
            </div>
            <div className="p-space-lg md:p-space-xl lg:col-span-7">
              <span className="text-label-lg font-semibold tracking-wider text-antique-gold-dark uppercase">{profile.role}</span>
              <h2 className="mt-1 font-display text-headline-xl-mobile text-primary md:text-headline-xl">{profile.name}</h2>
              <span className="mt-1 inline-flex items-center gap-1 text-label-lg text-heritage-olive">
                <Icon name="award_star" className="text-[18px]" />
                {profile.title}
              </span>
              <div className="mt-space-md grid gap-space-sm sm:grid-cols-2">
                <div className="rounded-xl bg-surface-container p-space-md">
                  <span className="flex items-center gap-1 text-label-md text-outline">
                    <Icon name="school" className="text-[16px] text-antique-gold-dark" /> Education
                  </span>
                  <p className="mt-1 text-body-sm font-semibold text-primary">{profile.education}</p>
                </div>
                <div className="rounded-xl bg-surface-container p-space-md">
                  <span className="flex items-center gap-1 text-label-md text-outline">
                    <Icon name="translate" className="text-[16px] text-antique-gold-dark" /> Languages Spoken
                  </span>
                  <p className="mt-1 text-body-sm font-semibold text-primary">{profile.languages}</p>
                </div>
              </div>
              {profile.credentials && (
                <p className="mt-space-sm flex items-center gap-2 rounded-lg bg-heritage-olive-light px-3 py-2 text-label-md text-heritage-olive">
                  <Icon name="workspace_premium" className="text-[18px]" />
                  {profile.credentials}
                </p>
              )}
              <h3 className="mt-space-lg font-display text-headline-sm text-primary">About Me</h3>
              <div className="mt-2 space-y-space-sm text-body-md text-on-surface-variant italic">
                {profile.about.map((p, i) => (
                  <p key={i}>&ldquo;{p.text}&rdquo;</p>
                ))}
              </div>
              <div className="mt-space-lg flex flex-wrap items-center gap-space-lg border-t border-surface-container-high pt-space-md">
                {profile.stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-headline-md font-bold text-primary">{s.value}</div>
                    <div className="text-label-md text-outline">{s.label}</div>
                  </div>
                ))}
                <a href="#booking" className="ms-auto inline-flex items-center gap-2 rounded-lg bg-antique-gold px-space-lg py-3 text-label-lg font-semibold text-white shadow-md hover:bg-antique-gold-dark">
                  <Icon name="calendar_month" className="text-[18px]" />
                  {profile.button}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Offers */}
      <section className="bg-surface-container py-space-3xl">
        <Container>
          <div className="mb-space-2xl max-w-2xl">
            <Eyebrow>{guide.offers.eyebrow}</Eyebrow>
            <SectionTitle>{guide.offers.title}</SectionTitle>
            <p className="mt-2 text-body-lead text-on-surface-variant">{guide.offers.text}</p>
          </div>
          <div className="grid gap-space-lg sm:grid-cols-2 lg:grid-cols-4">
            {guide.offers.items.map((o) => (
              <div key={o.title} className="group flex flex-col rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-lg shadow-sm transition-shadow hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon name={o.icon} className="text-[28px]" />
                  </span>
                  <span className="rounded-full bg-antique-gold/15 px-2.5 py-1 text-label-md text-antique-gold-dark">{o.tag}</span>
                </div>
                <h3 className="mt-space-md font-sans text-headline-sm font-semibold text-primary">{o.title}</h3>
                <p className="mt-1 text-body-sm text-on-surface-variant">{o.text}</p>
                {o.example && <p className="mt-auto pt-space-md text-label-md text-heritage-olive italic">{o.example}</p>}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why */}
      <section className="py-space-3xl">
        <Container>
          <div className="mx-auto mb-space-2xl max-w-2xl text-center">
            <Eyebrow>{guide.why.eyebrow}</Eyebrow>
            <SectionTitle>{guide.why.title}</SectionTitle>
            <p className="mt-2 text-body-lead text-on-surface-variant">{guide.why.text}</p>
          </div>
          <div className="grid gap-space-lg md:grid-cols-3">
            {guide.why.items.map((w) => (
              <div key={w.title} className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-lg shadow-sm">
                <Icon name={w.icon} className="text-[32px] text-antique-gold-dark" />
                <h3 className="mt-space-sm font-sans text-headline-sm font-semibold text-primary">{w.title}</h3>
                <p className="mt-1 text-body-sm text-on-surface-variant">{w.text}</p>
                <span className="mt-space-md flex items-center gap-1 text-label-md font-semibold text-heritage-olive">
                  <Icon name="check_circle" className="text-[16px]" />
                  {w.tag}
                </span>
              </div>
            ))}
          </div>
          {guide.why.bannerText && (
            <div className="mt-space-lg flex flex-col items-center justify-between gap-space-md rounded-xl border border-antique-gold/30 bg-primary p-space-lg text-white md:flex-row">
              <div className="flex items-center gap-3">
                <Icon name="support_agent" className="text-[32px] text-antique-gold" />
                <div>
                  <div className="text-label-md text-antique-gold">{guide.why.bannerTitle}</div>
                  <div className="text-body-md">{guide.why.bannerText}</div>
                </div>
              </div>
              <span className="flex items-center gap-1 text-label-md text-surface-container-high">
                <Icon name="lock" className="text-[16px] text-antique-gold" />
                {guide.why.bannerTag}
              </span>
            </div>
          )}
        </Container>
      </section>

      {/* Booking */}
      <section id="booking" className="bg-surface-container py-space-3xl">
        <Container className="grid gap-space-2xl lg:grid-cols-2">
          <div>
            <Eyebrow>{guide.booking.eyebrow}</Eyebrow>
            <SectionTitle>{guide.booking.title}</SectionTitle>
            <p className="mt-2 text-body-lead text-on-surface-variant">{guide.booking.text}</p>
            <div className="mt-space-lg space-y-space-md rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-lg">
              <div className="flex items-start gap-3">
                <Icon name="all_inclusive" className="text-antique-gold-dark" />
                <div>
                  <h3 className="font-sans text-label-lg font-semibold text-primary">{guide.booking.flexTitle}</h3>
                  <p className="text-body-sm text-on-surface-variant">{guide.booking.flexText}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="event_upcoming" className="text-antique-gold-dark" />
                <div>
                  <h3 className="font-sans text-label-lg font-semibold text-primary">{guide.booking.noticeTitle}</h3>
                  <p className="text-body-sm text-on-surface-variant">{guide.booking.dayTours}</p>
                  <p className="text-body-sm text-on-surface-variant">{guide.booking.multiDay}</p>
                </div>
              </div>
            </div>
            <div className="mt-space-md flex flex-wrap gap-space-md text-label-md">
              <span className="flex items-center gap-1 rounded-full bg-heritage-olive-light px-3 py-1.5 text-heritage-olive">
                <Icon name="schedule" className="text-[16px]" />
                {guide.booking.response}
              </span>
              <span className="flex items-center gap-1 text-on-surface-variant">
                <Icon name="verified" className="text-[16px] text-antique-gold" />
                {guide.booking.visaNote}
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-lg shadow-xl">
            <div className="mb-space-md flex items-center gap-3 border-b border-surface-container-high pb-space-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={safeUrl(profile.image, "")} alt="" className="size-12 rounded-full object-cover" />
              <div className="flex-1">
                <div className="font-display text-headline-sm text-primary">{guide.booking.cardName}</div>
                <div className="text-label-md text-outline">{guide.booking.cardRole}</div>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-heritage-olive-light px-2.5 py-1 text-label-md text-heritage-olive">
                <span className="size-1.5 rounded-full bg-heritage-olive" /> Live Concierge
              </span>
            </div>
            <GuideRequestForm
              options={guide.booking.options.map((o) => o.text)}
              submit={guide.booking.submit}
              success={guide.booking.success}
              whatsappHref={whatsappLink(contact.whatsapp, "Hello Sandra, I would like to book you as my guide.")}
              whatsappLabel={`Instant WhatsApp (${contact.whatsapp})`}
            />
          </div>
        </Container>
      </section>

      {/* Network */}
      {guide.network.items.length > 0 && (
        <section id="network" className="py-space-3xl">
          <Container>
            <div className="mb-space-2xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
              <div className="max-w-2xl">
                <Eyebrow>{guide.network.eyebrow}</Eyebrow>
                <SectionTitle>{guide.network.title}</SectionTitle>
                <p className="mt-2 text-body-lead text-on-surface-variant">{guide.network.text}</p>
              </div>
              <Link href="/about#team" className="inline-flex items-center gap-1 text-label-lg font-semibold text-primary hover:text-antique-gold-dark">
                View All Roster <Icon name="arrow_forward" className="text-[18px] text-antique-gold" />
              </Link>
            </div>
            <div className="grid gap-space-lg md:grid-cols-3">
              {guide.network.items.map((n) => (
                <div key={n.name} className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary font-display text-headline-sm text-antique-gold">{n.initials}</span>
                    <span className="text-label-md font-semibold tracking-wider text-antique-gold-dark uppercase">{n.field}</span>
                  </div>
                  <h3 className="mt-space-md font-display text-headline-sm text-primary">{n.name}</h3>
                  <p className="text-label-lg text-heritage-olive">{n.role}</p>
                  <p className="mt-2 text-body-sm text-on-surface-variant">{n.bio}</p>
                  <div className="mt-space-md flex items-center justify-between border-t border-surface-container-high pt-space-sm text-label-md text-outline">
                    <span className="flex items-center gap-1">
                      <Icon name="verified" className="text-[16px] text-antique-gold" />
                      {n.license}
                    </span>
                    <span>{n.languages}</span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
