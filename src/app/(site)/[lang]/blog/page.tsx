import type { Metadata } from "next";
import { Container, Icon, formatDay } from "@/components/site/bits";
import { NewsletterForm } from "@/components/site/forms";
import { Link } from "@/components/site/lang";
import { PostBrowser } from "@/components/site/post-browser";
import { getPosts, getSite } from "@/lib/site/data";
import { getUi } from "@/lib/site/lang";
import { safeUrl } from "@/lib/site/shape";

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getUi();
  const { blog } = await getSite(lang);
  return { title: blog.hero.title, description: blog.hero.text };
}

export default async function BlogPage() {
  const { lang, t } = await getUi();
  const [site, posts] = await Promise.all([getSite(lang), getPosts(lang)]);
  const { blog, general } = site;
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  return (
    <>
      <section className="relative overflow-hidden bg-surface-container pt-space-2xl pb-space-2xl">
        <div className="pointer-events-none absolute -top-40 end-0 size-[28rem] rounded-full bg-antique-gold/10 blur-3xl" />
        <Container className="relative">
          <div className="mb-space-md flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-antique-gold/30 bg-surface-container-lowest px-3 py-1 text-label-md font-semibold text-primary">
              {blog.hero.eyebrow}
            </span>
            <span className="flex items-center gap-1 text-label-md text-outline">
              <Icon name="history_edu" className="text-[16px] text-antique-gold" />
              {blog.hero.issue}
            </span>
          </div>
          <div className="grid items-end gap-space-xl lg:grid-cols-12">
            <div className="lg:col-span-9">
              <h1 className="font-display text-display-hero-mobile font-bold tracking-tight text-primary md:text-display-hero">{blog.hero.title}</h1>
              <p className="mt-space-md max-w-3xl text-body-lead text-on-surface-variant">{blog.hero.text}</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-antique-gold/20 bg-surface-container-lowest p-space-md shadow-sm lg:col-span-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={safeUrl(general.logo, "")} alt="" className="size-12 rounded-full object-contain" />
              <div>
                <div className="text-label-lg font-semibold text-primary">{blog.hero.badgeTitle}</div>
                <div className="text-label-md text-outline">{blog.hero.badgeText}</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {featured && (
        <section className="bg-surface-container pb-space-2xl">
          <Container>
            <article className="grid overflow-hidden rounded-2xl border border-antique-gold/20 bg-surface-container-lowest shadow-xl lg:grid-cols-2">
              <Link href={`/blog/${featured.slug}`} className="relative block min-h-[280px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={safeUrl(featured.cover, "")} alt={featured.title} className="absolute inset-0 size-full object-cover" />
                <span className="absolute top-4 start-4 inline-flex items-center gap-1.5 rounded-full bg-basalt-charcoal/85 px-3 py-1.5 text-label-md text-white backdrop-blur-sm">
                  <Icon name="auto_stories" className="text-[16px] text-antique-gold" />
                  {featured.category} · {t.minRead(featured.readMinutes)}
                </span>
              </Link>
              <div className="flex flex-col justify-center gap-space-md p-space-lg md:p-space-xl">
                <div className="flex flex-wrap items-center gap-2 text-label-md font-semibold tracking-wider text-antique-gold-dark uppercase">
                  <Icon name="stars" className="text-[18px]" />
                  {t.featuredEssay}
                </div>
                <h2 className="font-display text-headline-lg text-primary md:text-headline-xl">
                  <Link href={`/blog/${featured.slug}`} className="hover:text-antique-gold-dark">
                    {featured.title}
                  </Link>
                </h2>
                <p className="text-body-md text-on-surface-variant">{featured.excerpt}</p>
                {featured.tags && (
                  <div className="flex flex-wrap gap-2">
                    {featured.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                      .slice(0, 5)
                      .map((tag) => (
                        <span key={tag} className="rounded bg-surface-container px-2 py-1 text-label-md text-on-surface-variant">
                          #{tag.replace(/\s+/g, "")}
                        </span>
                      ))}
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-space-md border-t border-surface-container-high pt-space-md">
                  <div className="text-label-md text-outline">
                    <div className="font-semibold text-primary">{featured.author}</div>
                    {formatDay(featured.publishedAt, lang)}
                  </div>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-space-lg py-3 text-label-lg text-white shadow-md hover:bg-primary-light"
                  >
                    {t.readFull} <Icon name="arrow_forward" className="text-[18px] text-antique-gold" />
                  </Link>
                </div>
              </div>
            </article>
          </Container>
        </section>
      )}

      <PostBrowser posts={rest} categories={blog.categories} eyebrow={blog.gridEyebrow} title={blog.gridTitle} />

      <section className="bg-surface-container py-space-3xl">
        <Container>
          <div className="grid items-center gap-space-2xl lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="mb-2 flex items-center gap-2 text-label-lg font-semibold text-antique-gold-dark uppercase">
                <Icon name="verified" className="text-[18px]" />
                {blog.standards.eyebrow}
              </div>
              <h2 className="font-display text-headline-xl-mobile text-primary md:text-headline-xl">{blog.standards.title}</h2>
              <p className="mt-2 text-body-lead text-on-surface-variant">{blog.standards.text}</p>
              <div className="mt-space-lg grid gap-space-md sm:grid-cols-3">
                {blog.standards.items.map((i) => (
                  <div key={i.title} className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-md">
                    <Icon name={i.icon} className="text-antique-gold-dark" />
                    <h3 className="mt-1 font-sans text-label-lg font-semibold text-primary">{i.title}</h3>
                    <p className="text-body-sm text-on-surface-variant">{i.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-antique-gold/30 bg-primary p-space-lg text-center text-white shadow-xl lg:col-span-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={safeUrl(general.logo, "")} alt="" className="mx-auto size-20 rounded-full bg-white/10 object-contain p-1" />
              <h3 className="mt-space-sm font-display text-headline-md">{blog.standards.sealTitle}</h3>
              <p className="mt-2 text-body-sm text-surface-container-high">{blog.standards.sealText}</p>
              <Link href="/about" className="mt-space-md inline-flex items-center gap-1 text-label-lg font-semibold text-antique-gold hover:underline">
                {blog.standards.sealButton} <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-space-3xl">
        <Container>
          <div className="grid overflow-hidden rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm lg:grid-cols-5">
            <div className="relative min-h-[220px] lg:col-span-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={safeUrl(blog.newsletter.image, "")} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 text-white">
                <div className="font-display text-headline-sm">{blog.newsletter.imageTitle}</div>
                <div className="text-label-md opacity-80">{blog.newsletter.imageText}</div>
              </div>
            </div>
            <div className="p-space-lg md:p-space-xl lg:col-span-3">
              <span className="block text-label-lg font-semibold tracking-wider text-antique-gold-dark uppercase">{blog.newsletter.eyebrow}</span>
              <h2 className="mt-1 font-display text-headline-lg text-primary">{blog.newsletter.title}</h2>
              <p className="mt-2 mb-space-md text-body-md text-on-surface-variant">{blog.newsletter.text}</p>
              <NewsletterForm placeholder={t.newsletterPlaceholder} button={blog.newsletter.button} variant="light" />
              <div className="mt-space-md flex flex-wrap gap-space-md text-label-md text-on-surface-variant">
                {blog.newsletter.notes.map((n) => (
                  <span key={n.text} className="flex items-center gap-1">
                    <Icon name="check_circle" className="text-[16px] text-heritage-olive" />
                    {n.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
