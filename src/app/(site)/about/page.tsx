import type { Metadata } from "next";
import Link from "next/link";
import { Ar, Container, Eyebrow, Icon, SectionTitle } from "@/components/site/bits";
import { getSite } from "@/lib/site/data";
import { safeUrl } from "@/lib/site/shape";

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getSite();
  return { title: about.hero.title, description: about.hero.text1 };
}

export default async function AboutPage() {
  const site = await getSite();
  const { about, general } = site;
  const { purpose } = about;

  return (
    <>
      {/* Story */}
      <section className="relative overflow-hidden bg-surface py-space-3xl">
        <div className="pointer-events-none absolute -top-40 -left-40 size-[30rem] rounded-full bg-primary/5 blur-3xl" />
        <Container className="relative grid items-center gap-space-2xl lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow icon="diversity_3">{about.hero.eyebrow}</Eyebrow>
            <h1 className="font-display text-display-hero-mobile font-bold tracking-tight text-primary md:text-display-hero">{about.hero.title}</h1>
            <Ar as="p" className="mt-2 text-headline-sm font-bold text-heritage-olive">
              {about.hero.titleAr}
            </Ar>
            <div className="mt-space-lg space-y-space-md text-body-lead text-on-surface-variant">
              <p>{about.hero.text1}</p>
              <p>{about.hero.text2}</p>
            </div>
            <div className="mt-space-xl grid grid-cols-3 gap-space-md">
              {about.hero.stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-md text-center shadow-sm">
                  <div className="font-display text-headline-lg font-bold text-primary">{s.value}</div>
                  <div className="text-label-md text-on-surface-variant">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-square max-w-md rounded-full border-2 border-dashed border-antique-gold/40 p-space-lg">
              <div className="flex size-full flex-col items-center justify-center rounded-full bg-primary text-center text-white shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={safeUrl(general.logo, "")} alt="" className="size-28 rounded-full bg-white/10 object-contain p-2 md:size-36" />
                <span className="mt-space-sm flex items-center gap-1 text-label-lg tracking-[0.3em] text-antique-gold">
                  <Icon name="explore" className="text-[18px]" />
                  {about.hero.emblemTop}
                </span>
                <span className="text-label-md text-surface-container-high">{about.hero.emblemBottom}</span>
              </div>
            </div>
            {about.hero.quote && (
              <figure className="mt-space-xl rounded-xl border-l-4 border-antique-gold bg-surface-container p-space-lg">
                <Icon name="format_quote" className="text-[32px] text-antique-gold" />
                <blockquote className="font-display text-headline-sm text-primary italic">&ldquo;{about.hero.quote}&rdquo;</blockquote>
                <figcaption className="mt-2 text-label-md text-on-surface-variant">{about.hero.quoteBy}</figcaption>
              </figure>
            )}
          </div>
        </Container>
      </section>

      {/* Vision & mission */}
      <section className="bg-surface-container py-space-3xl">
        <Container>
          <div className="mx-auto mb-space-2xl max-w-2xl text-center">
            <Eyebrow icon="flag">{purpose.eyebrow}</Eyebrow>
            <SectionTitle>{purpose.title}</SectionTitle>
            <Ar as="p" className="mt-1 text-body-lead text-heritage-olive">
              {purpose.titleAr}
            </Ar>
          </div>
          <div className="grid gap-space-lg lg:grid-cols-2">
            {[
              { ...purpose.vision, icon: "visibility", tagIcon: "handshake", dark: true },
              { ...purpose.mission, icon: "flag", tagIcon: "explore", dark: false },
            ].map((b) => (
              <div
                key={b.title}
                className={`flex flex-col rounded-2xl border p-space-lg shadow-sm md:p-space-xl ${
                  b.dark ? "border-antique-gold/30 bg-primary text-white" : "border-surface-container-high bg-surface-container-lowest"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex size-12 items-center justify-center rounded-full ${b.dark ? "bg-white/10 text-antique-gold" : "bg-heritage-olive-light text-heritage-olive"}`}>
                    <Icon name={b.icon} />
                  </span>
                  <span className={`text-label-lg font-semibold tracking-wider uppercase ${b.dark ? "text-antique-gold" : "text-heritage-olive"}`}>{b.kicker}</span>
                </div>
                <h3 className={`mt-space-md font-display text-headline-lg ${b.dark ? "text-white" : "text-primary"}`}>{b.title}</h3>
                <Ar as="p" className={`text-body-md font-semibold ${b.dark ? "text-antique-gold" : "text-antique-gold-dark"}`}>
                  {b.titleAr}
                </Ar>
                <p className={`mt-space-md text-body-md ${b.dark ? "text-surface-container-high" : "text-on-surface-variant"}`}>{b.text}</p>
                {b.tag && (
                  <span className={`mt-auto inline-flex items-center gap-2 pt-space-lg text-label-lg font-semibold ${b.dark ? "text-antique-gold" : "text-primary"}`}>
                    <Icon name={b.tagIcon} className="text-[20px]" />
                    {b.tag}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-space-lg grid gap-space-md sm:grid-cols-2 lg:grid-cols-4">
            {purpose.values.map((v) => (
              <div key={v.title} className="flex items-start gap-3 rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-md">
                <Icon name={v.icon} className="text-antique-gold-dark" />
                <div>
                  <h4 className="font-sans text-label-lg font-semibold text-primary">{v.title}</h4>
                  <p className="text-body-sm text-on-surface-variant">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Founder */}
      <section className="py-space-3xl">
        <Container className="grid items-center gap-space-2xl lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-antique-gold/25 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={safeUrl(about.founder.image, "")} alt={about.founder.title} loading="lazy" className="size-full object-cover" />
            </div>
            <span className="absolute -bottom-4 left-6 inline-flex items-center gap-1.5 rounded-full border border-antique-gold/40 bg-primary px-4 py-2 text-label-md text-white shadow-lg">
              <Icon name="verified" className="text-[18px] text-antique-gold" />
              {about.founder.badge}
            </span>
          </div>
          <div className="lg:col-span-7">
            <Eyebrow>{about.founder.eyebrow}</Eyebrow>
            <SectionTitle>{about.founder.title}</SectionTitle>
            <Ar as="p" className="mt-1 text-body-lead font-semibold text-heritage-olive">
              {about.founder.titleAr}
            </Ar>
            <div className="mt-space-md flex flex-wrap gap-2">
              {about.founder.creds.map((c) => (
                <span key={c.text} className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-label-md text-primary">
                  <Icon name={c.icon} className="text-[16px] text-antique-gold-dark" />
                  {c.text}
                </span>
              ))}
            </div>
            <blockquote className="mt-space-lg font-display text-headline-md text-primary italic">&ldquo;{about.founder.quote}&rdquo;</blockquote>
            <div className="mt-space-md space-y-space-md text-body-md text-on-surface-variant">
              {about.founder.paragraphs.map((p, i) => (
                <p key={i}>{p.text}</p>
              ))}
            </div>
            <Link
              href="/guide"
              className="mt-space-lg inline-flex items-center gap-2 rounded-lg border border-antique-gold/40 bg-primary px-space-lg py-3 text-label-lg text-white shadow-md hover:bg-primary-light"
            >
              {about.founder.button}
              <Icon name="arrow_forward" className="text-[18px] text-antique-gold" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Team */}
      {about.team.members.length > 0 && (
        <section id="team" className="bg-surface-container py-space-3xl">
          <Container>
            <div className="mb-space-2xl max-w-2xl">
              <Eyebrow icon="school">{about.team.eyebrow}</Eyebrow>
              <SectionTitle>{about.team.title}</SectionTitle>
              <p className="mt-2 text-body-lead text-on-surface-variant">{about.team.text}</p>
            </div>
            <div className="grid gap-space-lg sm:grid-cols-2 lg:grid-cols-4">
              {about.team.members.map((m) => (
                <article key={m.name} className="flex flex-col overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest shadow-sm">
                  <div className="aspect-[4/5] overflow-hidden bg-surface-container-high">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={safeUrl(m.image, "")} alt={m.name} loading="lazy" className="size-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-space-md">
                    <span className="text-label-md font-semibold tracking-wider text-antique-gold-dark uppercase">{m.field}</span>
                    <h3 className="mt-1 font-display text-headline-sm text-primary">{m.name}</h3>
                    <Ar as="p" className="text-body-sm text-heritage-olive">
                      {m.nameAr}
                    </Ar>
                    <p className="mt-2 text-body-sm text-on-surface-variant">{m.bio}</p>
                    <dl className="mt-auto grid grid-cols-2 gap-2 border-t border-surface-container-high pt-space-sm text-label-md">
                      <div>
                        <dt className="text-outline">Languages:</dt>
                        <dd className="font-semibold text-primary">{m.languages}</dd>
                      </div>
                      <div>
                        <dt className="text-outline">Field Exp:</dt>
                        <dd className="font-semibold text-primary">{m.experience}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Accreditations */}
      <section className="py-space-3xl">
        <Container>
          <div className="mx-auto mb-space-2xl max-w-2xl text-center">
            <Eyebrow icon="workspace_premium">{about.accreditations.eyebrow}</Eyebrow>
            <SectionTitle>{about.accreditations.title}</SectionTitle>
            <p className="mt-2 text-body-lead text-on-surface-variant">{about.accreditations.text}</p>
          </div>
          <div className="grid gap-space-lg sm:grid-cols-2 lg:grid-cols-4">
            {about.accreditations.items.map((a) => (
              <div key={a.title} className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-lg text-center shadow-sm">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-antique-gold/15 text-antique-gold-dark">
                  <Icon name={a.icon} className="text-[30px]" />
                </span>
                <h3 className="mt-space-sm font-sans text-headline-sm font-semibold text-primary">{a.title}</h3>
                <Ar as="p" className="text-body-sm text-heritage-olive">
                  {a.titleAr}
                </Ar>
                <p className="mt-2 text-body-sm text-on-surface-variant">{a.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Safety */}
      <section id="safety" className="bg-surface-container py-space-3xl">
        <Container className="grid items-center gap-space-2xl lg:grid-cols-2">
          <div>
            <Eyebrow icon="verified_user">{about.safety.eyebrow}</Eyebrow>
            <SectionTitle>{about.safety.title}</SectionTitle>
            <p className="mt-2 text-body-lead text-on-surface-variant">{about.safety.text}</p>
            <ul className="mt-space-lg space-y-space-md">
              {about.safety.items.map((s) => (
                <li key={s.title} className="flex items-start gap-3">
                  <Icon name="check_circle" fill className="mt-0.5 text-heritage-olive" />
                  <div>
                    <h3 className="font-sans text-label-lg font-semibold text-primary">{s.title}</h3>
                    <p className="text-body-sm text-on-surface-variant">{s.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={safeUrl(about.safety.image, "")} alt="" loading="lazy" className="aspect-[4/3] size-full object-cover" />
            <div className="absolute inset-x-4 bottom-4 rounded-xl bg-primary/90 p-space-md text-white backdrop-blur-sm">
              <div className="font-display text-headline-sm">{about.safety.imageTitle}</div>
              <p className="text-body-sm text-surface-container-high">{about.safety.imageText}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary py-space-3xl text-white">
        <div className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full bg-antique-gold/20 blur-3xl" />
        <Container className="relative text-center">
          <p className="text-label-lg font-semibold text-antique-gold">{about.cta.eyebrow}</p>
          <h2 className="mx-auto mt-2 max-w-3xl font-display text-headline-xl-mobile md:text-headline-xl">{about.cta.title}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-body-lead text-surface-container-high">{about.cta.text}</p>
          <div className="mt-space-lg flex flex-col justify-center gap-space-sm sm:flex-row">
            <Link href="/contact#booking" className="inline-flex items-center justify-center gap-2 rounded-lg bg-antique-gold px-space-xl py-3.5 text-label-lg font-semibold text-white shadow-lg hover:bg-antique-gold-dark">
              {about.cta.primary}
              <Icon name="arrow_forward" className="text-[18px]" />
            </Link>
            <Link href="/tours" className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-space-xl py-3.5 text-label-lg font-semibold text-white hover:bg-white/20">
              {about.cta.secondary}
            </Link>
          </div>
          <div className="mt-space-md flex flex-wrap justify-center gap-space-lg text-label-md text-surface-container-high">
            {about.cta.notes.map((n) => (
              <span key={n.text} className="flex items-center gap-1">
                <Icon name={n.icon} className="text-[16px] text-antique-gold" />
                {n.text}
              </span>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
