"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { SiteContent } from "@/lib/site/content";
import type { PublicTour } from "@/lib/site/data";
import { safeUrl } from "@/lib/site/shape";
import { tourDurationGroups } from "@/lib/site/tour";
import { formatPrice, Icon } from "./bits";
import { Link, useUi } from "./lang";

type Filters = SiteContent["tours"]["filters"];
type Labels = SiteContent["tours"]["scheduled"];
type State = { category: string; region: string; duration: string };

function matches(t: PublicTour, f: State) {
  if (f.category && t.category !== f.category) return false;
  if (f.region && t.region !== f.region) return false;
  if (f.duration) {
    const g = tourDurationGroups.find((x) => x.key === f.duration);
    if (g && (t.durationDays < g.min || t.durationDays > g.max)) return false;
  }
  return true;
}

export function TourCatalogFromUrl(props: { tours: PublicTour[]; filters: Filters; labels: Labels }) {
  const params = useSearchParams();
  const initial = {
    category: params.get("category") ?? "",
    region: params.get("region") ?? "",
    duration: params.get("duration") ?? "",
  };
  return <TourCatalog {...props} initial={initial} />;
}

export function TourCatalog({
  tours,
  filters,
  labels,
  initial = { category: "", region: "", duration: "" },
}: {
  tours: PublicTour[];
  filters: Filters;
  labels: Labels;
  initial?: State;
}) {
  const t = useUi();
  const [f, setF] = useState<State>(initial);

  const update = (patch: Partial<State>) => {
    const next = { ...f, ...patch };
    setF(next);
    // Keep the filter in the address so it can be shared.
    const q = new URLSearchParams(Object.entries(next).filter(([, v]) => v));
    window.history.replaceState(null, "", q.size ? `?${q}` : window.location.pathname);
  };

  const list = tours.filter((t) => matches(t, f));
  const countFor = (key: string) => tours.filter((t) => t.category === key).length;
  const select =
    "cursor-pointer appearance-none rounded-lg border border-surface-container-high bg-surface-container-lowest py-2.5 ps-4 pe-9 text-body-sm outline-none focus:ring-2 focus:ring-antique-gold/50";

  return (
    <>
      {/* Category tiles */}
      <section className="relative z-10 -mt-space-xl">
        <div className="mx-auto w-full max-w-[1280px] px-margin-mobile md:px-margin">
          <div className="rounded-xl border border-antique-gold/20 bg-surface-container-lowest p-space-lg shadow-xl">
            <div className="mb-space-md">
              <h2 className="flex items-center gap-2 font-sans text-headline-sm font-bold text-primary">
                <Icon name="category" className="text-antique-gold" />
                {filters.title}
              </h2>
              <p className="text-body-sm text-on-surface-variant">{filters.text}</p>
            </div>
            <div className="grid grid-cols-2 gap-space-sm sm:grid-cols-3 lg:grid-cols-6">
              {[{ key: "", icon: "explore", label: filters.all, note: "" }, ...filters.categories].map((c) => {
                const active = f.category === c.key;
                return (
                  <button
                    key={c.key || "all"}
                    type="button"
                    aria-pressed={active}
                    onClick={() => update({ category: c.key })}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-space-md text-center transition-all ${
                      active
                        ? "border-primary bg-primary text-white shadow-lg"
                        : "border-surface-container-high bg-surface hover:border-antique-gold/50 hover:shadow-md"
                    }`}
                  >
                    <Icon name={c.icon} className={`text-[28px] ${active ? "text-antique-gold" : "text-antique-gold-dark"}`} />
                    <span className="font-sans text-body-sm font-bold">{c.label}</span>
                    <span className={`text-label-md ${active ? "text-antique-gold" : "text-heritage-olive"}`}>
                      {c.key ? [t.tourCount(countFor(c.key)), c.note].filter(Boolean).join(" • ") : t.toursAvailable(tours.length)}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-space-md flex flex-wrap items-center gap-space-sm border-t border-surface-container-high pt-space-md">
              <span className="text-label-lg text-primary">{t.moreFilters}</span>
              <span className="relative">
                <select aria-label={t.duration} value={f.duration} onChange={(e) => update({ duration: e.target.value })} className={select}>
                  <option value="">{t.anyDuration}</option>
                  {tourDurationGroups.map((g) => (
                    <option key={g.key} value={g.key}>
                      {t.durationGroups[g.key]}
                    </option>
                  ))}
                </select>
                <Icon name="expand_more" className="pointer-events-none absolute top-2.5 end-2 text-[20px] text-outline" />
              </span>
              <span className="relative">
                <select aria-label={t.region} value={f.region} onChange={(e) => update({ region: e.target.value })} className={select}>
                  <option value="">{t.allRegions}</option>
                  {filters.regions.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <Icon name="expand_more" className="pointer-events-none absolute top-2.5 end-2 text-[20px] text-outline" />
              </span>
              {(f.category || f.region || f.duration) && (
                <button
                  type="button"
                  onClick={() => update({ category: "", region: "", duration: "" })}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-label-lg text-antique-gold-dark hover:bg-surface-container"
                >
                  <Icon name="restart_alt" className="text-[18px]" />
                  {t.reset}
                </button>
              )}
              <span className="ms-auto text-label-md text-outline" dir="ltr">
                {list.length} / {tours.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Scheduled tours */}
      <section className="w-full py-space-3xl">
        <div className="mx-auto w-full max-w-[1280px] px-margin-mobile md:px-margin">
          <div className="mb-space-2xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
            <div className="max-w-3xl">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-label-lg font-semibold text-antique-gold-dark">
                <Icon name="event_available" className="text-[18px]" />
                {labels.eyebrow}
                <span className="text-outline">|</span>
                <span className="text-heritage-olive">{labels.eyebrowNote}</span>
              </div>
              <h2 className="font-display text-headline-lg font-bold text-primary md:text-headline-xl">{labels.title}</h2>
              <p className="mt-2 text-body-md text-on-surface-variant">{labels.text}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-heritage-olive/20 bg-heritage-olive-light px-space-md py-3">
              <Icon name="calendar_month" className="text-[28px] text-heritage-olive" />
              <div>
                <div className="text-label-lg font-bold text-primary">{labels.badgeTitle}</div>
                <div className="text-label-md text-on-surface-variant">{labels.badgeText}</div>
              </div>
            </div>
          </div>

          {list.length > 0 ? (
            <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
              {list.map((t) => (
                <CatalogCard key={t.id} tour={t} labels={labels} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-space-2xl text-center">
              <Icon name="search_off" className="text-[48px] text-outline" />
              <h3 className="mt-2 font-sans text-headline-sm font-bold text-primary">{filters.emptyTitle}</h3>
              <p className="mt-1 text-body-sm text-on-surface-variant">{filters.emptyText}</p>
              <button
                type="button"
                onClick={() => update({ category: "", region: "", duration: "" })}
                className="mt-space-md rounded-lg bg-primary px-space-lg py-2.5 text-label-lg text-white"
              >
                {t.clearFilters}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function CatalogCard({ tour, labels }: { tour: PublicTour; labels: Labels }) {
  const t = useUi();
  const d = tour.details;
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest shadow-sm transition-all duration-300 hover:shadow-xl">
      <Link href={`/tours/${tour.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-surface-container-high">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={safeUrl(tour.image, "/site/img12.jpg")} alt={tour.title} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-basalt-charcoal/80 via-transparent to-transparent" />
        <div className="absolute inset-x-3 top-3 flex flex-wrap justify-end gap-1.5">
          {d.badge && (
            <span className="rounded-full border border-antique-gold/30 bg-primary/90 px-2.5 py-1 text-label-md text-white backdrop-blur-sm">{d.badge}</span>
          )}
        </div>
        <div className="absolute start-3 bottom-3 text-white">
          <span className="block text-label-md opacity-80">{t.from}</span>
          <span className="font-display text-headline-md font-bold">{formatPrice(tour.price)}</span>
          <span className="text-label-md opacity-80"> {t.perGuest}</span>
        </div>
      </Link>
      {d.departure && (
        <div className="flex items-center justify-between gap-2 border-b border-antique-gold/20 bg-antique-gold-soft px-space-md py-2.5">
          <span className="flex items-center gap-1.5 text-label-lg font-semibold text-primary">
            <Icon name={d.departureIcon || "verified"} className="text-[18px] text-antique-gold-dark" />
            {d.departure}
          </span>
          {d.departureTag && <span className="shrink-0 rounded-full bg-heritage-olive-light px-2 py-0.5 text-label-md text-heritage-olive">{d.departureTag}</span>}
        </div>
      )}
      <div className="flex flex-1 flex-col p-space-lg">
        <div className="mb-2 flex flex-wrap items-center gap-space-sm text-label-md text-outline">
          {d.durationLabel && (
            <span className="flex items-center gap-1">
              <Icon name="schedule" className="text-[16px] text-antique-gold" />
              {d.durationLabel}
            </span>
          )}
          {d.groupLabel && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Icon name={d.groupIcon || "group"} className="text-[16px] text-antique-gold" />
                {d.groupLabel}
              </span>
            </>
          )}
          {d.pace && (
            <>
              <span>•</span>
              <span>{d.pace}</span>
            </>
          )}
        </div>
        <h3 className="font-display text-headline-md text-primary transition-colors group-hover:text-antique-gold-dark">
          <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-body-sm text-on-surface-variant">
          {tour.summary}
        </p>
        {d.checklist.length > 0 && (
          <ul className="mt-space-md space-y-1.5">
            {d.checklist.slice(0, 3).map((c) => (
              <li key={c} className="flex items-start gap-1.5 text-body-sm text-on-surface">
                <Icon name="check_circle" fill className="mt-0.5 shrink-0 text-[16px] text-heritage-olive" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-space-lg">
          <Link
            href={`/tours/${tour.slug}`}
            className="flex items-center justify-center rounded-lg border border-surface-container-high bg-surface-container px-2 py-2.5 text-center text-label-lg text-primary transition-colors hover:bg-surface-container-high"
          >
            {labels.detailsButton}
          </Link>
          <Link
            href={`/contact?tour=${tour.id}#booking`}
            className="flex items-center justify-center rounded-lg border border-antique-gold/40 bg-primary px-2 py-2.5 text-center text-label-lg text-white transition-colors hover:bg-primary-light"
          >
            {labels.bookButton}
          </Link>
        </div>
      </div>
    </article>
  );
}
