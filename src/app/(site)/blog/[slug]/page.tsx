import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ar, Icon, RichText, formatDay, formatPrice, headings } from "@/components/site/bits";
import { NewsletterForm } from "@/components/site/forms";
import { getPost, getPosts, getPublishedSlugs, getSite, getTours } from "@/lib/site/data";
import { safeUrl, whatsappLink } from "@/lib/site/shape";

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs("posts");
  return (slugs.length ? slugs : ["__none__"]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", images: post.cover ? [safeUrl(post.cover, "")] : undefined },
  };
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const [post, posts, site, tours] = await Promise.all([getPost(slug), getPosts(), getSite(), getTours()]);
  if (!post) notFound();

  const toc = headings(post.body);
  const index = posts.findIndex((p) => p.id === post.id);
  const newer = index > 0 ? posts[index - 1] : null;
  const older = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;
  const related = posts.filter((p) => p.id !== post.id).slice(0, 3);
  const tour = tours.find((t) => t.featured) ?? tours[0];
  const tags = post.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const profile = site.guide.profile;

  return (
    <>
      <div className="border-b border-surface-container-high bg-surface-container-low px-margin-mobile py-3 md:px-margin">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 text-label-md text-on-surface-variant">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            /
            <Link href="/blog" className="hover:text-primary">
              Dispatches &amp; Field Journal
            </Link>
            /<span className="text-antique-gold-dark">{post.category}</span>
          </nav>
          <span className="flex items-center gap-1">
            <Icon name="schedule" className="text-[16px] text-antique-gold" />
            {post.readMinutes} min reading time · {formatDay(post.publishedAt)}
          </span>
        </div>
      </div>

      <header className="relative min-h-[420px] overflow-hidden bg-basalt-charcoal md:min-h-[520px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={safeUrl(post.cover, "")} alt="" className="absolute inset-0 size-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-basalt-charcoal via-basalt-charcoal/50 to-transparent" />
        <div className="relative mx-auto flex min-h-[420px] max-w-[1280px] flex-col justify-end px-margin-mobile pb-space-2xl md:min-h-[520px] md:px-margin">
          <span className="mb-space-sm inline-flex w-fit items-center gap-2 rounded-full border border-antique-gold/30 bg-white/10 px-3 py-1 text-label-md text-white backdrop-blur-sm">
            {post.category}
            {post.kickerAr && <Ar className="text-antique-gold">{`• ${post.kickerAr}`}</Ar>}
          </span>
          <h1 className="max-w-4xl font-display text-headline-xl-mobile font-bold text-white md:text-[52px] md:leading-[62px]">{post.title}</h1>
          <p className="mt-space-sm max-w-3xl text-body-lead text-surface-container">{post.excerpt}</p>
          <p className="mt-space-md text-label-lg text-surface-container-high">By {post.author}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-space-2xl px-margin-mobile py-space-2xl md:px-margin lg:grid-cols-12">
        <article className="lg:col-span-8">
          {toc.length > 2 && (
            <nav aria-label="Contents" className="mb-space-xl rounded-xl border border-surface-container-high bg-surface-container-low p-space-lg">
              <div className="mb-space-sm flex items-center justify-between">
                <span className="flex items-center gap-2 font-display text-headline-sm text-primary">
                  <Icon name="list_alt" className="text-antique-gold" />
                  In This Field Dispatch
                </span>
                <span className="text-label-md text-outline">Index 01—{String(toc.length).padStart(2, "0")}</span>
              </div>
              <ol className="space-y-1.5">
                {toc.map((h, i) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="flex gap-2 text-body-sm text-on-surface-variant hover:text-antique-gold-dark">
                      <span className="font-semibold text-antique-gold-dark">{String(i + 1).padStart(2, "0")}.</span>
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <RichText source={post.body} />

          {tags.length > 0 && (
            <div className="mt-space-xl border-t border-surface-container-high pt-space-lg">
              <span className="mb-2 block text-label-md font-semibold tracking-wider text-outline uppercase">Indexed Heritage Themes</span>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="rounded-full bg-surface-container px-3 py-1 text-label-md text-primary">
                    #{t.replace(/\s+/g, "")}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-space-xl rounded-xl bg-primary p-space-lg text-white">
            <div className="flex items-center gap-2 text-label-lg font-semibold text-antique-gold">
              <Icon name="mark_email_read" />
              The Syrian Cultural Digest
            </div>
            <h2 className="mt-1 font-display text-headline-md">Receive Curated Archaeological Field Dispatches</h2>
            <p className="mt-1 mb-space-md text-body-sm text-surface-container-high">
              Directly from our on-ground historians: visa facilitation updates, newly opened sites, and invitation-only expedition dates.
            </p>
            <NewsletterForm placeholder="Enter your email address" button="Subscribe to Journal" variant="band" />
          </div>

          {(newer || older) && (
            <nav aria-label="More articles" className="mt-space-xl grid gap-space-md sm:grid-cols-2">
              {older ? (
                <Link href={`/blog/${older.slug}`} className="rounded-xl border border-surface-container-high p-space-md hover:border-antique-gold/50">
                  <span className="flex items-center gap-1 text-label-md text-outline">
                    <Icon name="arrow_back" className="text-[16px]" /> Previous Dispatch
                  </span>
                  <span className="mt-1 line-clamp-2 block font-display text-headline-sm text-primary">{older.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link href={`/blog/${newer.slug}`} className="rounded-xl border border-surface-container-high p-space-md text-right hover:border-antique-gold/50">
                  <span className="flex items-center justify-end gap-1 text-label-md text-outline">
                    Next Dispatch <Icon name="arrow_forward" className="text-[16px]" />
                  </span>
                  <span className="mt-1 line-clamp-2 block font-display text-headline-sm text-primary">{newer.title}</span>
                </Link>
              )}
            </nav>
          )}
        </article>

        <aside className="space-y-space-lg lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          {tour && (
            <div className="overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest shadow-md">
              <div className="relative h-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={safeUrl(tour.image, "")} alt="" loading="lazy" className="size-full object-cover" />
                <span className="absolute top-3 left-3 rounded-full bg-primary/90 px-2.5 py-1 text-label-md text-white">Flagship Expedition</span>
              </div>
              <div className="space-y-2 p-space-md">
                {tour.details.rating && (
                  <span className="flex items-center gap-1 text-label-md text-antique-gold-dark">
                    <Icon name="star" fill className="text-[16px]" />
                    {tour.details.rating} ({tour.details.reviews} Reviews)
                  </span>
                )}
                <h3 className="font-display text-headline-sm text-primary">{tour.title}</h3>
                <p className="line-clamp-3 text-body-sm text-on-surface-variant" dir="auto">
                  {tour.summary}
                </p>
                <div className="flex items-center justify-between text-label-md">
                  <span className="text-outline">{tour.details.durationLabel}</span>
                  <span className="font-display text-headline-sm font-bold text-primary">{formatPrice(tour.price)}</span>
                </div>
                <Link
                  href={`/tours/${tour.slug}`}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-label-lg text-white hover:bg-primary-light"
                >
                  <Icon name="calendar_month" className="text-[18px] text-antique-gold" />
                  Inquire &amp; Reserve Dates
                </Link>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-surface-container-high bg-surface-container-low p-space-md text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={safeUrl(profile.image, "")} alt={profile.name} loading="lazy" className="mx-auto size-20 rounded-full object-cover" />
            <h3 className="mt-2 font-display text-headline-sm text-primary">{profile.name}</h3>
            <p className="text-label-md text-antique-gold-dark">{profile.role}</p>
            <p className="mt-1 text-body-sm text-on-surface-variant">{profile.about[0]?.text}</p>
            <a
              href={whatsappLink(site.contact.whatsapp, `Hello Sandra, I have a question about "${post.title}"`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-space-sm inline-flex items-center gap-1.5 text-label-lg font-semibold text-primary hover:text-antique-gold-dark"
            >
              <Icon name="chat" className="text-[18px] text-antique-gold" />
              Ask Sandra a Field Question
            </a>
          </div>

          {related.length > 0 && (
            <div className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-md">
              <h3 className="mb-space-sm font-display text-headline-sm text-primary">Related Dispatches</h3>
              <ul className="space-y-space-sm">
                {related.map((p) => (
                  <li key={p.id}>
                    <Link href={`/blog/${p.slug}`} className="group flex gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={safeUrl(p.cover, "")} alt="" loading="lazy" className="size-16 shrink-0 rounded-lg object-cover" />
                      <span>
                        <span className="block text-label-md text-antique-gold-dark">{p.category}</span>
                        <span className="line-clamp-2 text-body-sm font-semibold text-primary group-hover:text-antique-gold-dark">{p.title}</span>
                        <span className="text-label-md text-outline">{p.readMinutes} min read</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
