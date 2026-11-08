"use client";

import { useState } from "react";
import { Icon } from "./bits";
import { useUi } from "./lang";

type Group = { group: string; items: { q: string; a: string; n: number }[] };

// FAQ list with topic tabs and a search box, so a long FAQ stays short on
// phones. Every question is still in the page HTML (hidden ones use `hidden`).
export function FaqBrowser({ groups }: { groups: Group[] }) {
  const t = useUi();
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const tabs = groups.length > 1 && groups.every((g) => g.group);
  const matches = (f: Group["items"][number]) => !q || `${f.q} ${f.a}`.toLowerCase().includes(q);
  const shownGroup = (i: number) => (q ? groups[i].items.some(matches) : !tabs || i === active);
  const nothing = q && !groups.some((g) => g.items.some(matches));

  return (
    <div className="space-y-space-lg">
      <label className="relative block">
        <span className="sr-only">{t.faqSearch}</span>
        <Icon name="search" className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[20px] text-outline" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.faqSearch}
          className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest py-3 ps-10 pe-4 text-body-md outline-none focus:ring-2 focus:ring-antique-gold/50"
        />
      </label>

      {tabs && !q && (
        <div role="tablist" className="-mx-margin-mobile flex gap-2 overflow-x-auto px-margin-mobile pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
          {groups.map((g, i) => (
            <button
              key={g.group}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-full border px-4 py-2 text-label-lg whitespace-nowrap transition-colors ${
                i === active
                  ? "border-primary bg-primary text-white"
                  : "border-surface-container-high bg-surface-container-lowest text-on-surface-variant hover:border-antique-gold/50"
              }`}
            >
              {g.group} <span className={i === active ? "text-antique-gold" : "text-outline"}>({g.items.length})</span>
            </button>
          ))}
        </div>
      )}

      {nothing && <p className="rounded-xl border border-dashed border-outline-variant p-space-lg text-center text-body-md text-on-surface-variant">{t.faqNoResults}</p>}

      {groups.map((g, i) => (
        <div key={g.group || "faq"} hidden={!shownGroup(i)} className="space-y-3">
          {g.group && (q || !tabs) && (
            <h3 className="flex items-center gap-2 border-b border-antique-gold/30 pb-2 font-display text-headline-sm text-primary">
              <Icon name="help" className="text-[20px] text-antique-gold-dark" />
              {g.group}
            </h3>
          )}
          {g.items.map((f) => (
            <details
              key={f.n}
              hidden={!matches(f)}
              open={f.n === 1 || undefined}
              className="group overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 p-space-md sm:gap-4">
                <span className="font-display text-headline-sm text-antique-gold">{String(f.n).padStart(2, "0")}</span>
                <span className="flex-1 font-sans text-body-md font-semibold text-primary">{f.q}</span>
                <Icon name="expand_more" className="shrink-0 text-antique-gold-dark transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-space-md pb-space-md text-body-md whitespace-pre-line text-on-surface-variant sm:ps-[3.75rem]">{f.a}</p>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}
