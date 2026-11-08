"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

// A calendar date picker used instead of the browser's <input type="date">,
// which looks different on every phone and garbles Arabic placeholders.
// The chosen day is posted as YYYY-MM-DD under `name`, like a date input.

type Labels = { placeholder: string; today: string; clear: string; prev: string; next: string };

type Props = {
  name: string;
  locale: string; // e.g. "en-GB", "ar-SY-u-nu-latn"
  labels: Labels;
  defaultValue?: string;
  required?: boolean;
  min?: string; // YYYY-MM-DD; earlier days are disabled
  minToday?: boolean; // disable days before today (read in the browser, not at build time)
  weekStart?: number; // 0 = Sunday … 6 = Saturday
  theme?: "site" | "admin";
  className?: string; // classes for the field button, to match the other inputs
  id?: string;
};

const THEMES = {
  site: {
    panel: "border-surface-container-high bg-surface-container-lowest text-on-surface shadow-2xl",
    head: "text-primary",
    week: "text-outline",
    day: "text-on-surface hover:bg-surface-container",
    today: "ring-1 ring-antique-gold",
    selected: "bg-primary text-white hover:bg-primary-light",
    nav: "text-primary hover:bg-surface-container",
    foot: "border-surface-container-high",
    link: "text-antique-gold-dark hover:bg-surface-container",
    icon: "text-antique-gold-dark",
    placeholder: "text-outline",
  },
  admin: {
    panel: "border-border bg-surface text-foreground shadow-xl",
    head: "text-foreground",
    week: "text-muted",
    day: "text-foreground hover:bg-surface-2",
    today: "ring-1 ring-primary",
    selected: "bg-primary text-white hover:bg-primary",
    nav: "text-foreground hover:bg-surface-2",
    foot: "border-border",
    link: "text-primary hover:bg-surface-2",
    icon: "text-muted",
    placeholder: "text-muted",
  },
};

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function fromIso(v: string | undefined) {
  const m = v?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function DatePicker({
  name,
  locale,
  labels,
  defaultValue = "",
  required,
  min,
  minToday,
  weekStart = 1,
  theme = "site",
  className = "",
  id,
}: Props) {
  const c = THEMES[theme];
  const autoId = useId();
  const fieldId = id ?? autoId;
  const [value, setValue] = useState(fromIso(defaultValue) ? defaultValue : "");
  const selected = fromIso(value);
  const [open, setOpen] = useState(false);
  // "Today" is only read once the calendar is open, so pages can be pre-built.
  const [today, setToday] = useState<Date | null>(null);
  const minDate = minToday && today ? today : fromIso(min);
  const [view, setView] = useState(() => {
    const d = selected ?? fromIso(min);
    return d ? new Date(d.getFullYear(), d.getMonth(), 1) : new Date(2000, 0, 1);
  });
  const [focusDay, setFocusDay] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep keyboard focus on the active day while navigating.
  useEffect(() => {
    if (open && focusDay !== null) {
      grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focusDay}"]`)?.focus();
    }
  }, [open, focusDay, view]);

  const fmt = useMemo(
    () => ({
      field: new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "long", year: "numeric" }),
      month: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
      // Arabic "short" names are full words and don't fit a 7-column row.
      weekday: new Intl.DateTimeFormat(locale, { weekday: locale.startsWith("ar") ? "narrow" : "short" }),
      day: new Intl.DateTimeFormat(locale, { day: "numeric" }),
      full: new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
    }),
    [locale],
  );

  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lead = (new Date(year, month, 1).getDay() - weekStart + 7) % 7;
  const weekdays = Array.from({ length: 7 }, (_, i) => fmt.weekday.format(new Date(2024, 0, 7 + ((weekStart + i) % 7))));
  const disabled = (d: Date) => !!minDate && d < minDate;

  const openPicker = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setToday(now);
    const floor = minToday ? now : fromIso(min);
    const base = selected ?? (floor && floor > now ? floor : now);
    setView(new Date(base.getFullYear(), base.getMonth(), 1));
    setFocusDay(base.getDate());
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    button.current?.focus();
  };
  const pick = (d: Date) => {
    if (disabled(d)) return;
    setValue(toIso(d));
    close();
  };
  const shiftMonth = (by: number) => {
    setView(new Date(year, month + by, 1));
    setFocusDay(1);
  };
  const onGridKey = (e: React.KeyboardEvent) => {
    if (focusDay === null) return;
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const step: Record<string, number> = {
      ArrowLeft: rtl ? 1 : -1,
      ArrowRight: rtl ? -1 : 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    if (e.key in step) {
      e.preventDefault();
      const d = new Date(year, month, focusDay + step[e.key]);
      setView(new Date(d.getFullYear(), d.getMonth(), 1));
      setFocusDay(d.getDate());
    } else if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      shiftMonth(e.key === "PageUp" ? -1 : 1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  return (
    <div ref={root} className="relative" onKeyDown={(e) => e.key === "Escape" && open && close()}>
      <button
        ref={button}
        id={fieldId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openPicker())}
        className={`flex items-center justify-between gap-2 text-start ${className}`}
      >
        <span className={selected ? "" : c.placeholder}>{selected ? fmt.field.format(selected) : labels.placeholder}</span>
        <span aria-hidden className={`material-symbols-outlined text-[20px] ${c.icon}`}>
          calendar_month
        </span>
      </button>
      {/* Posts the value and lets the browser enforce `required`. */}
      <input
        tabIndex={-1}
        aria-hidden
        name={name}
        value={value}
        required={required}
        onChange={() => {}}
        onFocus={() => button.current?.focus()}
        className="pointer-events-none absolute bottom-0 start-1/2 h-px w-px opacity-0"
      />

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={labels.placeholder}
          className={`absolute start-0 top-full z-50 mt-2 w-[19rem] max-w-[calc(100vw-2.5rem)] rounded-xl border p-3 ${c.panel}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <button type="button" onClick={() => shiftMonth(-1)} aria-label={labels.prev} className={`flex size-9 items-center justify-center rounded-lg ${c.nav}`}>
              <span aria-hidden className="material-symbols-outlined rtl-flip text-[20px]">
                chevron_left
              </span>
            </button>
            <span aria-live="polite" className={`text-sm font-semibold ${c.head}`}>
              {fmt.month.format(view)}
            </span>
            <button type="button" onClick={() => shiftMonth(1)} aria-label={labels.next} className={`flex size-9 items-center justify-center rounded-lg ${c.nav}`}>
              <span aria-hidden className="material-symbols-outlined rtl-flip text-[20px]">
                chevron_right
              </span>
            </button>
          </div>
          <div className="grid grid-cols-7 text-center" aria-hidden>
            {weekdays.map((w) => (
              <span key={w} className={`py-1 text-xs font-medium ${c.week}`}>
                {w}
              </span>
            ))}
          </div>
          <div ref={grid} role="grid" className="grid grid-cols-7 gap-0.5 text-center" onKeyDown={onGridKey}>
            {Array.from({ length: lead }, (_, i) => (
              <span key={`x${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const d = new Date(year, month, day);
              const isSel = !!selected && toIso(d) === value;
              const isToday = !!today && toIso(d) === toIso(today);
              const off = disabled(d);
              return (
                <button
                  key={day}
                  type="button"
                  data-day={day}
                  tabIndex={day === focusDay ? 0 : -1}
                  disabled={off}
                  aria-pressed={isSel}
                  aria-label={fmt.full.format(d)}
                  onClick={() => pick(d)}
                  onFocus={() => setFocusDay(day)}
                  className={`flex h-9 items-center justify-center rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-current disabled:cursor-not-allowed disabled:opacity-30 ${
                    isSel ? c.selected : c.day
                  } ${isToday && !isSel ? c.today : ""}`}
                >
                  {fmt.day.format(d)}
                </button>
              );
            })}
          </div>
          <div className={`mt-2 flex items-center justify-between border-t pt-2 ${c.foot}`}>
            <button
              type="button"
              onClick={() => {
                setValue("");
                close();
              }}
              className={`rounded-lg px-3 py-1.5 text-sm ${c.link}`}
            >
              {labels.clear}
            </button>
            <button type="button" disabled={!today || disabled(today)} onClick={() => today && pick(today)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold disabled:opacity-30 ${c.link}`}>
              {labels.today}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
