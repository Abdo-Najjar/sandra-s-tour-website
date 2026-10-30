"use client";

import { useState } from "react";
import type { PostSummary } from "@/lib/site/data";
import { Icon } from "./bits";
import { PostCard } from "./cards";

const PAGE = 6;

// Category tabs, search and "load more" for the blog grid.
export function PostBrowser({
  posts,
  categories,
  eyebrow,
  title,
}: {
  posts: PostSummary[];
  categories: { en: string; ar: string }[];
  eyebrow: string;
  title: string;
}) {
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);

  const q = query.trim().toLowerCase();
  const list = posts.filter(
    (p) =>
      (!category || p.category === category) &&
      (!q || `${p.title} ${p.excerpt} ${p.tags} ${p.author}`.toLowerCase().includes(q)),
  );
  const tabs = [{ en: "All Articles", ar: "الكل", value: "" }, ...categories.map((c) => ({ ...c, value: c.en }))];

  return (
    <>
      <div className="sticky top-20 z-30 border-y border-surface-container-high bg-surface/95 py-space-md backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-space-md px-margin-mobile md:px-margin lg:flex-row lg:items-center">
          <label className="relative block lg:w-72">
            <Icon name="search" className="pointer-events-none absolute top-2.5 left-3 text-[20px] text-outline" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShown(PAGE);
              }}
              placeholder="Search dispatches…"
              aria-label="Search articles"
              className="w-full rounded-lg border border-surface-container-high bg-surface-container-lowest py-2.5 pr-3 pl-10 text-body-sm outline-none focus:ring-2 focus:ring-antique-gold/50"
            />
          </label>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Categories">
            {tabs.map((t) => {
              const active = category === t.value;
              return (
                <button
                  key={t.value || "all"}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setCategory(t.value);
                    setShown(PAGE);
                  }}
                  className={`shrink-0 rounded-full border px-4 py-2 text-label-md whitespace-nowrap transition-colors ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-surface-container-high bg-surface-container-lowest text-on-surface-variant hover:border-antique-gold/50"
                  }`}
                >
                  {t.en} <span lang="ar" className="font-arabic opacity-75">({t.ar})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="py-space-3xl">
        <div className="mx-auto w-full max-w-[1280px] px-margin-mobile md:px-margin">
          <div className="mb-space-xl flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <span className="block text-label-lg font-semibold tracking-wider text-antique-gold-dark uppercase">{eyebrow}</span>
              <h2 className="font-display text-headline-xl-mobile text-primary md:text-headline-xl">{title}</h2>
            </div>
            <span className="text-label-md text-outline">
              Showing {Math.min(shown, list.length)} of {list.length} dispatches
            </span>
          </div>
          {list.length ? (
            <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
              {list.slice(0, shown).map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-outline-variant p-space-2xl text-center text-body-md text-on-surface-variant">
              No articles match your search.
            </p>
          )}
          {shown < list.length && (
            <div className="mt-space-xl text-center">
              <button
                type="button"
                onClick={() => setShown((n) => n + PAGE)}
                className="rounded-lg border border-surface-container-high bg-surface-container-lowest px-space-xl py-3 text-label-lg font-semibold text-primary shadow-sm hover:bg-surface-container"
              >
                Load more articles
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
