import Link from "next/link";
import { Ar, Container, Eyebrow, Icon, SectionTitle, Stars, initials } from "@/components/site/bits";
import { PostCard, TourCard } from "@/components/site/cards";
import { getPosts, getSite, getTours } from "@/lib/site/data";
import { safeUrl, whatsappLink } from "@/lib/site/shape";
import { tourDurationGroups } from "@/lib/site/tour";

export default async function HomePage() {
  const [site, tours, posts] = await Promise.all([getSite(), getTours(), getPosts()]);
  const { home, general, contact } = site;
  const featured = (tours.some((t) => t.featured) ? tours.filter((t) => t.featured) : tours).slice(0, 3);
  const select =
    "w-full cursor-pointer appearance-none rounded-lg border border-surface-container-high bg-surface-container px-space-md py-3 text-body-sm text-on-surface outline-none transition-all focus:bg-surface-container-lowest focus:ring-2 focus:ring-antique-gold/50";

  return (
    <>
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-basalt-charcoal">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={safeUrl(home.hero.image, "/site/img02.jpg")} alt="" className="size-full scale-105 object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-basalt-charcoal via-basalt-charcoal/60 to-basalt-charcoal/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-basalt-charcoal/90 via-basalt-charcoal/40 to-basalt-charcoal/70" />
        </div>
        <Container className="relative z-10 pt-space-2xl pb-space-3xl md:pt-space-3xl">
          <div className="mb-space-xl flex flex-wrap items-center justify-between gap-space-sm">
            <div className="inline-flex items-center gap-2 rounded-full border border-antique-gold/30 bg-white/10 px-3 py-1.5 text-label-md text-surface-container shadow-sm backdrop-blur-md">
              <Icon name="verified" className="text-[18px] text-antique-gold" />
              <span>{home.hero.badge}</span>
              {home.hero.badgeAr && (
                <>
                  <span className="opacity-60">|</span>
                  <Ar className="font-semibold text-antique-gold">{home.hero.badgeAr}</Ar>
                </>
              )}
            </div>
            {home.hero.status && (
              <div className="flex items-center gap-3 text-label-md text-surface-container-high/90">
                <span className="inline-block size-2 animate-pulse rounded-full bg-antique-gold" />
                {home.hero.status}
              </div>
            )}
          </div>
          <div className="mb-space-2xl max-w-3xl">
            {home.hero.kickerAr && (
              <div className="mb-space-sm flex items-center gap-3">
                <span className="h-px w-12 bg-antique-gold" />
                <Ar className="font-arabic-display text-headline-sm font-bold text-antique-gold">{home.hero.kickerAr}</Ar>
              </div>
            )}
            <h1 className="mb-space-md font-display text-display-hero-mobile leading-none font-bold tracking-tight text-white md:text-display-hero">
              {home.hero.title}
            </h1>
            <p className="max-w-2xl text-body-lead text-surface-container">{home.hero.text}</p>
          </div>

          <div className="w-full rounded-xl border border-antique-gold/20 bg-surface/95 p-space-md shadow-2xl backdrop-blur-xl md:p-space-lg">
            <form action="/tours" className="grid grid-cols-1 items-end gap-space-md sm:grid-cols-2 lg:grid-cols-12">
              <label className="flex flex-col gap-1.5 lg:col-span-4">
                <span className="flex items-center gap-1.5 text-label-lg font-semibold text-primary">
                  <Icon name="pin_drop" className="text-[18px] text-antique-gold" /> Key Regions
                </span>
                <span className="relative">
                  <select name="region" defaultValue="" className={select}>
                    <option value="">All Heritage Corridors</option>
                    {site.tours.filters.regions.map((r) => (
                      <option key={r.key} value={r.key}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <Icon name="expand_more" className="pointer-events-none absolute top-3 right-3 text-[20px] text-outline" />
                </span>
              </label>
              <label className="flex flex-col gap-1.5 lg:col-span-3">
                <span className="flex items-center gap-1.5 text-label-lg font-semibold text-primary">
                  <Icon name="account_balance" className="text-[18px] text-antique-gold" /> Expedition Style
                </span>
                <span className="relative">
                  <select name="category" defaultValue="" className={select}>
                    <option value="">All Styles</option>
                    {site.tours.filters.categories.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.en}
                      </option>
                    ))}
                  </select>
                  <Icon name="expand_more" className="pointer-events-none absolute top-3 right-3 text-[20px] text-outline" />
                </span>
              </label>
              <label className="flex flex-col gap-1.5 lg:col-span-3">
                <span className="flex items-center gap-1.5 text-label-lg font-semibold text-primary">
                  <Icon name="calendar_month" className="text-[18px] text-antique-gold" /> Duration
                </span>
                <span className="relative">
                  <select name="duration" defaultValue="" className={select}>
                    <option value="">Any Duration</option>
                    {tourDurationGroups.map((g) => (
                      <option key={g.key} value={g.key}>
                        {g.min}
                        {g.max < 999 ? `–${g.max}` : "+"} days
                      </option>
                    ))}
                  </select>
                  <Icon name="expand_more" className="pointer-events-none absolute top-3 right-3 text-[20px] text-outline" />
                </span>
              </label>
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-antique-gold/40 bg-primary px-space-md py-3 text-label-lg text-white shadow-md transition-all hover:bg-primary-light hover:shadow-xl"
                >
                  {home.hero.searchButton}
                  <Icon name="arrow_forward" className="text-[18px] text-antique-gold" />
                </button>
              </div>
            </form>
            <div className="mt-space-md flex flex-wrap items-center justify-between gap-space-sm border-t border-surface-container-high/60 pt-space-sm text-label-md text-on-surface-variant">
              <div className="flex flex-wrap items-center gap-space-md">
                {home.hero.perks.map((p, i) => (
                  <span key={p.text} className={`items-center gap-1 ${i === 0 ? "flex font-medium text-primary" : "hidden sm:inline-flex"}`}>
                    <Icon name={p.icon} className="text-[16px] text-antique-gold" /> {p.text}
                  </span>
                ))}
              </div>
              {home.hero.note && (
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-heritage-olive" />
                  {home.hero.note}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="w-full bg-surface py-space-3xl">
        <Container>
          <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
            <div className="flex flex-col gap-space-md lg:col-span-7">
              <Eyebrow icon="history_edu">{home.mission.eyebrow}</Eyebrow>
              <SectionTitle className="leading-tight">{home.mission.title}</SectionTitle>
              <div className="grid grid-cols-1 gap-space-md pt-space-xs text-body-md text-on-surface-variant md:grid-cols-2">
                <p>{home.mission.text1}</p>
                <p>{home.mission.text2}</p>
              </div>
              <div className="mt-space-md flex flex-col items-start justify-between gap-space-md rounded-xl border border-antique-gold/20 bg-surface-container p-space-lg shadow-sm md:flex-row">
                <div className="space-y-1">
                  <Ar as="div" className="font-arabic-display text-headline-md font-bold text-primary">
                    {home.mission.quoteAr}
                  </Ar>
                  <Ar as="p" className="text-arabic-body text-on-surface-variant">
                    {home.mission.quoteTextAr}
                  </Ar>
                </div>
                <div className="flex shrink-0 items-center gap-2 pt-2 md:pt-0">
                  <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-antique-gold/30 bg-surface-container-lowest shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={safeUrl(general.logo, "")} alt="" className="size-full object-contain p-0.5" />
                  </span>
                  <div>
                    <span className="block text-label-lg font-semibold text-primary">{home.mission.founderTitle}</span>
                    <span className="block text-label-md text-outline">{home.mission.founderNote}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative lg:col-span-5">
              <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-xl border border-antique-gold/25 bg-surface-container-high shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={safeUrl(home.mission.image, "/site/img04.jpg")} alt="" loading="lazy" className="size-full object-cover" />
              </div>
              {home.mission.cardTitle && (
                <div className="absolute -bottom-space-lg -left-space-md z-20 w-3/4 rounded-xl border border-antique-gold/30 bg-surface-container-lowest p-space-md shadow-xl md:-left-space-lg">
                  <div className="flex items-center gap-space-sm">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-heritage-olive-light text-heritage-olive">
                      <Icon name={home.mission.cardIcon} />
                    </span>
                    <div>
                      <h3 className="font-sans text-headline-sm leading-tight font-semibold text-primary">{home.mission.cardTitle}</h3>
                      <p className="text-body-sm text-on-surface-variant">{home.mission.cardText}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured tours */}
      <section className="w-full bg-surface-container py-space-3xl">
        <Container>
          <div className="mb-space-2xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
            <div className="max-w-2xl">
              <Eyebrow icon="explore">{home.tours.eyebrow}</Eyebrow>
              <SectionTitle>{home.tours.title}</SectionTitle>
              <p className="mt-1 text-body-lead text-on-surface-variant">{home.tours.text}</p>
            </div>
            <div className="flex shrink-0 items-center gap-space-sm">
              <span className="text-label-md text-on-surface-variant">
                Showing {featured.length} of {tours.length} routes
              </span>
              <Link
                href="/tours"
                className="inline-flex items-center gap-1.5 rounded-lg border border-surface-container-high bg-surface-container-lowest px-space-md py-2.5 text-label-lg text-primary shadow-sm transition-colors hover:bg-surface hover:text-antique-gold-dark"
              >
                {home.tours.button}
                <Icon name="arrow_forward" className="text-[18px] text-antique-gold" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
            {featured.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
          {home.custom.title && (
            <div className="mt-space-2xl flex flex-col items-center justify-between gap-space-md rounded-xl border border-antique-gold/30 bg-surface-container-lowest p-space-lg shadow-sm md:flex-row">
              <div className="flex items-center gap-space-md">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-antique-gold/15 text-antique-gold">
                  <Icon name={home.custom.icon} className="text-[28px]" />
                </span>
                <div>
                  <h3 className="font-sans text-headline-sm font-semibold text-primary">{home.custom.title}</h3>
                  <p className="text-body-sm text-on-surface-variant">{home.custom.text}</p>
                </div>
              </div>
              <Link
                href={safeUrl(home.custom.href, "/contact")}
                className="shrink-0 rounded-lg bg-antique-gold px-space-lg py-3 text-label-lg font-medium text-white shadow-md transition-all hover:bg-antique-gold-dark"
              >
                {home.custom.button}
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* Why us */}
      <section className="w-full bg-surface py-space-3xl">
        <Container>
          <div className="mx-auto mb-space-2xl max-w-2xl text-center">
            <Eyebrow icon="verified_user">{home.why.eyebrow}</Eyebrow>
            <SectionTitle>{home.why.title}</SectionTitle>
            <p className="mt-2 text-body-lead text-on-surface-variant">{home.why.text}</p>
          </div>
          <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-4">
            {home.why.items.map((item, i) => {
              const tone = [
                "bg-primary/10 text-primary",
                "bg-antique-gold/15 text-antique-gold-dark",
                "bg-heritage-olive-light text-heritage-olive",
                "bg-antique-gold/15 text-antique-gold-dark",
              ][i % 4];
              const tag = ["text-primary", "text-antique-gold-dark", "text-heritage-olive", "text-antique-gold-dark"][i % 4];
              return (
                <div key={item.title} className="flex flex-col gap-space-sm rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-lg shadow-sm transition-shadow hover:shadow-md">
                  <span className={`flex size-12 items-center justify-center rounded-lg ${tone}`}>
                    <Icon name={item.icon} className="text-[28px]" />
                  </span>
                  <h3 className="font-sans text-headline-sm font-semibold text-primary">{item.title}</h3>
                  <p className="text-body-sm text-on-surface-variant">{item.text}</p>
                  {item.tag && <div className={`mt-auto pt-space-xs text-label-md font-semibold ${tag}`}>{item.tag}</div>}
                </div>
              );
            })}
          </div>
          {home.banner.title && (
            <div className="mt-space-2xl flex flex-col items-center justify-between gap-space-lg rounded-xl border border-antique-gold/30 bg-primary p-space-lg text-white shadow-xl md:p-space-xl lg:flex-row">
              <div className="flex items-center gap-space-md">
                <span className="flex size-16 shrink-0 items-center justify-center rounded-full border border-antique-gold/30 bg-white/10">
                  <Icon name={home.banner.icon} className="text-[36px] text-antique-gold" />
                </span>
                <div>
                  <h3 className="mb-1 font-display text-headline-md font-bold text-white">{home.banner.title}</h3>
                  <p className="max-w-xl text-body-sm text-surface-container-high">{home.banner.text}</p>
                </div>
              </div>
              <Link
                href={safeUrl(home.banner.href, "/contact")}
                className="shrink-0 rounded-lg border border-antique-gold/40 bg-surface-container-lowest px-space-md py-3 text-label-lg font-semibold text-primary shadow-sm transition-colors hover:bg-surface-container"
              >
                {home.banner.button}
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* Testimonials */}
      {home.testimonials.items.length > 0 && (
        <section className="w-full bg-surface-container py-space-3xl">
          <Container>
            <div className="mb-space-2xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
              <div>
                <Eyebrow icon="format_quote">{home.testimonials.eyebrow}</Eyebrow>
                <SectionTitle>{home.testimonials.title}</SectionTitle>
              </div>
              {home.testimonials.note && (
                <div className="flex items-center gap-2 text-label-md text-on-surface-variant">
                  <Icon name="recommend" className="text-[20px] text-antique-gold" />
                  {home.testimonials.note}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
              {home.testimonials.items.map((t) => (
                <figure key={t.name} className="flex flex-col justify-between rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-lg shadow-sm">
                  <div>
                    <Stars className="mb-space-sm" />
                    <blockquote className="mb-space-md text-body-md text-on-surface italic" dir="auto">
                      “{t.quote}”
                    </blockquote>
                  </div>
                  <figcaption className="flex items-center gap-space-sm border-t border-surface-container-high pt-space-md">
                    <span className="flex size-11 items-center justify-center rounded-full border border-antique-gold/30 bg-surface-container-high font-bold text-primary">
                      {initials(t.name)}
                    </span>
                    <div>
                      <div className="font-sans text-headline-sm font-semibold text-primary">{t.name}</div>
                      <div className="text-body-sm text-outline">{t.role}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Blog */}
      {posts.length > 0 && (
        <section className="w-full bg-surface py-space-3xl">
          <Container>
            <div className="mb-space-2xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
              <div>
                <Eyebrow icon="auto_stories">{home.blog.eyebrow}</Eyebrow>
                <SectionTitle>{home.blog.title}</SectionTitle>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-label-lg font-semibold text-primary transition-colors hover:text-antique-gold-dark">
                {home.blog.button}
                <Icon name="arrow_forward" className="text-[18px] text-antique-gold" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
              {posts.slice(0, 3).map((p) => (
                <PostCard key={p.id} post={p} compact />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Call to action */}
      <section className="relative w-full overflow-hidden bg-basalt-charcoal py-space-3xl text-surface">
        <div className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-primary/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-antique-gold/20 blur-3xl" />
        <Container className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
            <div className="flex flex-col gap-space-sm lg:col-span-8">
              <div className="inline-flex items-center gap-2 text-label-lg font-semibold text-antique-gold">
                <Icon name="travel_explore" className="text-[20px]" />
                {home.cta.eyebrow}
              </div>
              <h2 className="font-display text-headline-xl-mobile font-semibold tracking-tight text-white md:text-headline-xl">{home.cta.title}</h2>
              <p className="max-w-2xl text-body-lead text-surface-container">{home.cta.text}</p>
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs text-label-md text-surface-container-high">
                {home.cta.checks.map((c) => (
                  <span key={c.text} className="flex items-center gap-1.5">
                    <Icon name="check_circle" className="text-[18px] text-antique-gold" /> {c.text}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center gap-space-sm sm:flex-row lg:col-span-4 lg:flex-col">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 rounded-lg bg-antique-gold px-space-xl py-4 text-center text-label-lg font-medium text-white shadow-xl transition-all hover:bg-antique-gold-dark"
              >
                {home.cta.button}
                <Icon name="calendar_add_on" className="text-[18px]" />
              </Link>
              <a
                href={whatsappLink(contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-space-xl py-4 text-center text-label-lg text-surface-container backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Icon name="chat" className="text-[20px] text-antique-gold" />
                {home.cta.whatsappButton}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
