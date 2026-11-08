"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useState, useTransition, type ComponentProps } from "react";
import {
  createBooking,
  sendPartnership,
  subscribe,
  type PublicFormState,
} from "@/lib/site/public-actions";
import { DatePicker } from "@/components/date-picker";
import type { UI } from "@/lib/site/i18n";
import { Icon } from "./bits";
import { useLang, useUi } from "./lang";

type Action = (state: PublicFormState, fd: FormData) => Promise<PublicFormState>;

// Submit without React resetting the form, so typed values survive an error.
function useSiteForm(action: Action) {
  const [state, run] = useActionState(action, undefined);
  const [pending, start] = useTransition();
  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(() => run(fd));
  };
  return { state, pending, onSubmit };
}

// Hidden field only bots fill in, plus the page language for the replies.
function Honeypot() {
  const lang = useLang();
  return (
    <>
      <input type="hidden" name="lang" value={lang} />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
    </>
  );
}

// Calendar field with the site's look and language.
function DateField({ t, className, required = true }: { t: UI; className: string; required?: boolean }) {
  const lang = useLang();
  return (
    <DatePicker
      name="arrivalDate"
      required={required}
      minToday
      locale={t.dateLocale}
      weekStart={lang === "ar" ? 6 : 1}
      labels={{ placeholder: t.pickDate, today: t.today, clear: t.clear, prev: t.prevMonth, next: t.nextMonth }}
      className={className}
    />
  );
}

function ErrorText({ state, dark }: { state: PublicFormState; dark?: boolean }) {
  if (!state?.error) return null;
  return (
    <p role="alert" className={`text-body-sm font-medium ${dark ? "text-[#ffb4a8]" : "text-[#b3261e]"}`}>
      {state.error}
    </p>
  );
}

const field =
  "w-full rounded-lg border border-surface-container-high bg-surface-container px-space-md py-3 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-antique-gold/50";
const label = "mb-1.5 block text-label-lg font-semibold text-primary";

// ---------- Newsletter ----------

export function NewsletterForm({
  placeholder,
  button,
  variant = "footer",
}: {
  placeholder: string;
  button: string;
  variant?: "footer" | "band" | "light";
}) {
  const t = useUi();
  const { state, pending, onSubmit } = useSiteForm(subscribe);

  if (state?.ok) {
    return (
      <p className={`flex items-center gap-2 text-body-sm font-semibold ${variant === "light" ? "text-heritage-olive" : "text-antique-gold"}`}>
        <Icon name="check_circle" className="text-[20px]" />
        {t.subscribed}
      </p>
    );
  }

  const input =
    variant === "light"
      ? "min-w-0 flex-1 rounded-lg border border-surface-container-high bg-surface-container-lowest px-space-md py-3 text-body-sm outline-none focus:ring-2 focus:ring-antique-gold/50"
      : "min-w-0 flex-1 rounded-lg border border-antique-gold/30 bg-primary-container px-space-md py-3 text-body-sm text-white outline-none placeholder:text-outline focus:ring-2 focus:ring-antique-gold";

  return (
    <form onSubmit={onSubmit} className="relative flex flex-col gap-space-xs">
      <Honeypot />
      <div className={variant === "footer" ? "flex flex-col gap-space-xs" : "flex flex-col gap-2 sm:flex-row"}>
        <input name="email" type="email" required placeholder={placeholder} aria-label={t.emailAddress} className={input} />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-lg bg-antique-gold px-space-lg py-3 text-label-lg font-semibold text-white shadow-md transition-all hover:bg-antique-gold-dark disabled:opacity-60"
        >
          {pending ? t.subscribing : button}
        </button>
      </div>
      <ErrorText state={state} dark={variant !== "light"} />
    </form>
  );
}

// ---------- Contact page booking form ----------

export function BookingForm({
  tours,
  customTour,
  classes,
  flexibility,
  submit,
  note,
  successTitle,
  successText,
  defaultTour,
}: {
  tours: { id: number; title: string; durationLabel: string }[];
  customTour: string;
  classes: string[];
  flexibility: string[];
  submit: string;
  note: string;
  successTitle: string;
  successText: string;
  defaultTour?: string;
}) {
  const t = useUi();
  const { state, pending, onSubmit } = useSiteForm(createBooking);

  if (state?.ok) return <Success title={successTitle} text={successText} />;

  return (
    <form onSubmit={onSubmit} className="relative grid gap-space-lg">
      <Honeypot />
      <input type="hidden" name="source" value="contact" />
      <div className="grid gap-space-md sm:grid-cols-2">
        <label>
          <span className={label}>
            {t.fullName} <span className="text-antique-gold">*</span>
          </span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label>
          <span className={label}>
            {t.email} <span className="text-antique-gold">*</span>
          </span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label>
          <span className={label}>
            {t.phone} <span className="text-antique-gold">*</span>
          </span>
          <input name="phone" type="tel" required autoComplete="tel" className={field} />
        </label>
        <label>
          <span className={label}>
            {t.nationality} <span className="text-antique-gold">*</span>
          </span>
          <input name="nationality" required autoComplete="country-name" className={field} />
        </label>
      </div>

      <div className="grid gap-space-md sm:grid-cols-2">
        <label>
          <span className={label}>
            {t.preferredTour} <span className="text-antique-gold">*</span>
          </span>
          <select name="tour" required defaultValue={defaultTour ?? ""} className={`${field} cursor-pointer`}>
            <option value="" disabled>
              {t.selectTour}
            </option>
            {tours.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
                {t.durationLabel ? ` (${t.durationLabel})` : ""}
              </option>
            ))}
            <option value={customTour}>{customTour}</option>
          </select>
        </label>
        <label>
          <span className={label}>
            {t.tourClass} <span className="text-antique-gold">*</span>
          </span>
          <select name="tourClass" required className={`${field} cursor-pointer`}>
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-space-md sm:grid-cols-3">
        <label>
          <span className={label}>
            {t.arrivalDate} <span className="text-antique-gold">*</span>
          </span>
          <DateField t={t} className={field} />
        </label>
        <label>
          <span className={label}>{t.adults}</span>
          <input name="adults" type="number" min={1} max={99} defaultValue={2} className={field} />
        </label>
        <label>
          <span className={label}>{t.children}</span>
          <input name="children" type="number" min={0} max={99} defaultValue={0} className={field} />
        </label>
      </div>

      {flexibility.length > 0 && (
        <fieldset>
          <legend className={label}>{t.flexibility}</legend>
          <div className="flex flex-wrap gap-2">
            {flexibility.map((f, i) => (
              <label key={f} className="cursor-pointer">
                <input type="radio" name="flexibility" value={f} defaultChecked={i === 1} className="peer sr-only" />
                <span className="inline-block rounded-full border border-surface-container-high bg-surface-container px-4 py-2 text-label-md text-on-surface-variant transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-antique-gold">
                  {f}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <label>
        <span className={`${label} flex justify-between`}>
          <span>{t.notes}</span>
          <span className="font-normal text-outline">{t.optional}</span>
        </span>
        <textarea name="note" rows={4} maxLength={3000} className={field} />
      </label>

      <ErrorText state={state} />
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg border border-antique-gold/40 bg-primary px-space-xl py-3.5 text-label-lg font-semibold text-white shadow-md transition-all hover:bg-primary-light hover:shadow-xl disabled:opacity-60"
        >
          {pending ? t.sending : submit}
          <Icon name="arrow_forward" className="text-[18px] text-antique-gold" />
        </button>
        <span className="flex items-center gap-1.5 text-label-md text-on-surface-variant">
          <Icon name="lock" className="text-[16px] text-antique-gold" />
          {note}
        </span>
      </div>
    </form>
  );
}

// Preselects the tour from ?tour=<id> (links from the tour cards).
export function BookingFormFromUrl(props: ComponentProps<typeof BookingForm>) {
  const tour = useSearchParams().get("tour") ?? undefined;
  const valid = props.tours.some((t) => String(t.id) === tour);
  return <BookingForm key={tour} {...props} defaultTour={valid ? tour : undefined} />;
}

function Success({ title, text }: { title: string; text: string }) {
  return (
    <div role="status" className="rounded-xl border border-heritage-olive/30 bg-heritage-olive-light p-space-lg">
      <div className="flex items-start gap-3">
        <Icon name="check_circle" fill className="text-[28px] text-heritage-olive" />
        <div>
          <h3 className="font-display text-headline-md text-primary">{title}</h3>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------- Tour page booking card ----------

export function TourBookingForm({ tourId, whatsappHref }: { tourId: number; whatsappHref: string }) {
  const t = useUi();
  const { state, pending, onSubmit } = useSiteForm(createBooking);
  const [format, setFormat] = useState(t.formats[0].value);

  if (state?.ok) return <Success title={t.tourSuccessTitle} text={t.tourSuccessText} />;

  const small = "mb-1 block text-label-sm font-semibold tracking-wider text-outline uppercase";
  const input = "w-full rounded bg-surface-container-low p-2.5 text-body-md text-on-surface shadow-inner outline-none focus:ring-2 focus:ring-antique-gold/50";

  return (
    <form onSubmit={onSubmit} className="relative space-y-space-sm">
      <Honeypot />
      <input type="hidden" name="source" value="tour" />
      <input type="hidden" name="tour" value={tourId} />
      <input type="hidden" name="tourClass" value={format} />
      <div>
        <span className={small}>{t.format}</span>
        <div className="grid grid-cols-2 gap-2" role="radiogroup">
          {t.formats.map((f) => (
            <button
              key={f.value}
              type="button"
              role="radio"
              aria-checked={format === f.value}
              onClick={() => setFormat(f.value)}
              className={`rounded px-3 py-2.5 text-label-sm font-semibold transition-colors ${
                format === f.value ? "bg-primary text-white shadow-sm" : "bg-surface-container text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <label className="block">
        <span className={small}>{t.departureDate}</span>
      </label>
      <DateField t={t} className={input} />
      <label className="block">
        <span className={small}>{t.travelers}</span>
        <input name="adults" type="number" min={1} max={99} defaultValue={2} className={input} />
      </label>
      <label className="block">
        <span className={small}>{t.fullName}</span>
        <input name="name" required autoComplete="name" className={input} />
      </label>
      <label className="block">
        <span className={small}>{t.email}</span>
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className="block">
        <span className={small}>{t.phone}</span>
        <input name="phone" type="tel" autoComplete="tel" className={input} />
      </label>
      <ErrorText state={state} />
      <div className="space-y-2 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded bg-primary px-space-md py-3.5 text-label-md font-semibold tracking-wider text-white uppercase shadow-md transition-colors hover:bg-primary-light disabled:opacity-60"
        >
          <Icon name="event_available" className="text-[18px]" />
          {pending ? t.sending : t.reserve}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded bg-surface-container px-space-md py-3 text-label-md font-semibold tracking-wider text-primary uppercase transition-colors hover:bg-surface-container-high"
        >
          <Icon name="chat" className="text-[18px] text-antique-gold" />
          {t.whatsappConsult}
        </a>
      </div>
    </form>
  );
}

// ---------- Guide page request form ----------

export function GuideRequestForm({
  options,
  submit,
  success,
  whatsappHref,
  whatsappLabel,
}: {
  options: string[];
  submit: string;
  success: string;
  whatsappHref: string;
  whatsappLabel: string;
}) {
  const t = useUi();
  const { state, pending, onSubmit } = useSiteForm(createBooking);
  if (state?.ok) return <Success title={t.requestReceived} text={success} />;

  return (
    <form onSubmit={onSubmit} className="relative grid gap-space-md">
      <Honeypot />
      <input type="hidden" name="source" value="guide" />
      <label>
        <span className={label}>{t.nameOrOrg}</span>
        <input name="name" required className={field} />
      </label>
      <label>
        <span className={label}>{t.emailShort}</span>
        <input name="email" type="email" required className={field} />
      </label>
      <div className="grid gap-space-md sm:grid-cols-2">
        <label>
          <span className={label}>{t.tourType}</span>
          <select name="tour" className={`${field} cursor-pointer`}>
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          <span className={label}>{t.timeframe}</span>
        </label>
        <DateField t={t} className={field} required={false} />
      </div>
      <label>
        <span className={label}>{t.interests}</span>
        <textarea name="note" rows={3} maxLength={3000} placeholder={t.interestsPlaceholder} className={field} />
      </label>
      <ErrorText state={state} />
      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-space-lg py-3.5 text-label-lg font-semibold text-white shadow-md transition-all hover:bg-primary-light disabled:opacity-60"
      >
        <Icon name="send" className="text-[18px] text-antique-gold" />
        {pending ? t.sending : submit}
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg border border-heritage-olive/30 bg-heritage-olive-light px-space-lg py-3 text-label-lg font-semibold text-heritage-olive transition-colors hover:bg-heritage-olive hover:text-white"
      >
        <Icon name="chat" className="text-[18px]" />
        {whatsappLabel}
      </a>
    </form>
  );
}

// ---------- Partnership form ----------

export function PartnershipForm({
  categories,
  submit,
  successTitle,
  successText,
}: {
  categories: string[];
  submit: string;
  successTitle: string;
  successText: string;
}) {
  const t = useUi();
  const { state, pending, onSubmit } = useSiteForm(sendPartnership);
  if (state?.ok) return <Success title={successTitle} text={successText} />;

  return (
    <form onSubmit={onSubmit} className="relative grid gap-space-md">
      <Honeypot />
      <div className="grid gap-space-md sm:grid-cols-2">
        <label>
          <span className={label}>
            {t.partnerName} <span className="text-antique-gold">*</span>
          </span>
          <input name="name" required className={field} />
        </label>
        <label>
          <span className={label}>
            {t.partnerPhone} <span className="text-antique-gold">*</span>
          </span>
          <input name="phone" type="tel" required className={field} />
        </label>
        <label>
          <span className={label}>
            {t.partnerEmail} <span className="text-antique-gold">*</span>
          </span>
          <input name="email" type="email" required className={field} />
        </label>
        <label>
          <span className={label}>
            {t.partnerLocation} <span className="text-antique-gold">*</span>
          </span>
          <input name="location" required className={field} />
        </label>
      </div>
      <label>
        <span className={label}>
          {t.partnerCategory} <span className="text-antique-gold">*</span>
        </span>
        <select name="category" required className={`${field} cursor-pointer`}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        <span className={label}>
          {t.partnerPitch} <span className="text-antique-gold">*</span>
        </span>
        <textarea name="body" required minLength={10} maxLength={5000} rows={5} className={field} />
      </label>
      <ErrorText state={state} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-antique-gold px-space-xl py-3.5 text-label-lg font-semibold text-white shadow-md transition-all hover:bg-antique-gold-dark disabled:opacity-60"
      >
        {pending ? t.sending : submit}
        <Icon name="send" className="text-[18px]" />
      </button>
    </form>
  );
}
