import Link from "next/link";
import type { PostSummary, PublicTour } from "@/lib/site/data";
import { safeUrl } from "@/lib/site/shape";
import { formatDay, formatPrice, Icon, initials } from "./bits";

const cardImage = (src: string) => safeUrl(src, "/site/img12.jpg");

// Home page style tour card.
export function TourCard({ tour }: { tour: PublicTour }) {
  const d = tour.details;
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest shadow-sm transition-all duration-300 hover:shadow-xl">
      <Link href={`/tours/${tour.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-surface-container-high">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cardImage(tour.image)} alt={tour.title} loading="lazy" className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {d.badge && (
            <span className="rounded-full border border-antique-gold/30 bg-primary/90 px-2.5 py-1 text-label-md text-white backdrop-blur-sm">{d.badge}</span>
          )}
        </div>
        {d.rating && (
          <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded border border-antique-gold/30 bg-basalt-charcoal/85 px-2.5 py-1 text-label-md text-white backdrop-blur-sm">
            <Icon name="star" fill className="text-[16px] text-antique-gold" />
            {d.rating}
            {d.reviews && ` (${d.reviews} reviews)`}
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col justify-between p-space-lg">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-space-sm text-label-md text-outline">
            {d.durationLabel && (
              <span className="flex items-center gap-1">
                <Icon name="schedule" className="text-[16px] text-antique-gold" />
                {d.durationLabel}
              </span>
            )}
            {d.durationLabel && d.groupLabel && <span>•</span>}
            {d.groupLabel && (
              <span className="flex items-center gap-1" dir="auto">
                <Icon name={d.groupIcon || "group"} className="text-[16px] text-antique-gold" />
                {d.groupLabel}
              </span>
            )}
          </div>
          <h3 className="mb-2 line-clamp-2 font-display text-headline-md text-primary transition-colors group-hover:text-antique-gold-dark">
            <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
          </h3>
          <p className="mb-4 line-clamp-3 text-body-sm text-on-surface-variant" dir="auto">
            {tour.summary}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-surface-container-high pt-space-md">
          <div>
            <span className="block text-label-md text-outline">From</span>
            <span className="font-display text-headline-md font-bold text-primary">{formatPrice(tour.price)}</span>
            <span className="text-label-md text-outline"> / person</span>
          </div>
          <Link
            href={`/tours/${tour.slug}`}
            className="rounded-lg border border-antique-gold/30 bg-primary px-space-md py-2.5 text-label-lg text-white shadow-sm transition-all hover:bg-primary-light"
          >
            View Itinerary
          </Link>
        </div>
      </div>
    </article>
  );
}

// Smaller card used for "related tours".
export function MiniTourCard({ tour }: { tour: PublicTour }) {
  return (
    <Link href={`/tours/${tour.slug}`} className="group flex flex-col overflow-hidden rounded-xl bg-surface shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cardImage(tour.image)} alt={tour.title} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {tour.details.durationLabel && (
          <span className="absolute top-3 left-3 rounded bg-primary px-2 py-0.5 text-label-sm text-white uppercase">{tour.details.durationLabel}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between space-y-3 p-space-md">
        <div>
          {tour.details.badge && <span className="block text-label-sm font-semibold text-secondary uppercase">{tour.details.badge}</span>}
          <h3 className="font-display text-headline-md text-primary">{tour.title}</h3>
          <p className="mt-1 line-clamp-2 text-body-sm text-on-surface-variant" dir="auto">
            {tour.summary}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="font-display text-body-lg font-bold text-primary">From {formatPrice(tour.price)}/pp</span>
          <span className="text-label-sm font-semibold text-secondary">Explore Route →</span>
        </div>
      </div>
    </Link>
  );
}

export function PostCard({ post, compact = false }: { post: PostSummary; compact?: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden bg-surface-container-high">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cardImage(post.cover)} alt={post.title} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col justify-between p-space-lg">
        <div>
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <span className="text-label-md font-semibold tracking-wider text-antique-gold-dark uppercase">{post.category}</span>
            {!compact && (
              <span className="flex items-center gap-1 text-label-md text-outline">
                <Icon name="schedule" className="text-[14px]" />
                {post.readMinutes} min · {formatDay(post.publishedAt)}
              </span>
            )}
          </div>
          {!compact && post.kickerAr && (
            <p lang="ar" dir="rtl" className="mb-1 font-arabic text-body-sm font-semibold text-heritage-olive">
              {post.kickerAr}
            </p>
          )}
          <h3 className="mb-2 line-clamp-3 font-display text-headline-md text-primary transition-colors group-hover:text-antique-gold-dark">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="mb-4 line-clamp-3 text-body-sm text-on-surface-variant">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-surface-container-high pt-space-sm text-label-md text-outline">
          <span className="flex min-w-0 items-center gap-2">
            {!compact && (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-[10px] font-bold text-primary">
                {initials(post.author)}
              </span>
            )}
            <span className="truncate">By {post.author}</span>
          </span>
          {compact ? (
            <span className="shrink-0">{post.readMinutes} min read</span>
          ) : (
            <Link href={`/blog/${post.slug}`} className="flex shrink-0 items-center gap-1 font-semibold text-primary hover:text-antique-gold-dark">
              Read <Icon name="arrow_forward" className="text-[16px]" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
