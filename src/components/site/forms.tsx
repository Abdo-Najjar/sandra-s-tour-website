"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useState, useTransition, type ComponentProps } from "react";
import {
  createBooking,
  sendPartnership,
  subscribe,
  type PublicFormState,
} from "@/lib/site/public-actions";
import { Icon } from "./bits";

type Action = (state: PublicFormState, fd: FormData) => Promise<PublicFormState>;

// Submit without React resetting the form, so typed values survive an error.
function useSiteForm(action: Action) {
  const [state, run] = useActionState(action, undefined);
  const [pending, start] = useTransition();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(() => run(fd));
  };
  return { state, pending, onSubmit };
}

// Hidden field only bots fill in.
function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
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
  const { state, pending, onSubmit } = useSiteForm(subscribe);

  if (state?.ok) {
    return (
      <p className={`flex items-center gap-2 text-body-sm font-semibold ${variant === "light" ? "text-heritage-olive" : "text-antique-gold"}`}>
        <Icon name="check_circle" className="text-[20px]" />
        Thank you — you are subscribed to the dispatch.
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
        <input name="email" type="email" required placeholder={placeholder} aria-label="Email address" className={input} />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-lg bg-antique-gold px-space-lg py-3 text-label-lg font-semibold text-white shadow-md transition-all hover:bg-antique-gold-dark disabled:opacity-60"
        >
          {pending ? "Subscribing…" : button}
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
  const { state, pending, onSubmit } = useSiteForm(createBooking);

  if (state?.ok) return <Success title={successTitle} text={successText} />;

  return (
    <form onSubmit={onSubmit} className="relative grid gap-space-lg">
      <Honeypot />
      <input type="hidden" name="source" value="contact" />
      <div className="grid gap-space-md sm:grid-cols-2">
        <label>
          <span className={label}>
            Full Legal Name <span className="text-antique-gold">*</span>
          </span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label>
          <span className={label}>
            Primary Email Address <span className="text-antique-gold">*</span>
          </span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label>
          <span className={label}>
            WhatsApp / Direct Telephone <span className="text-antique-gold">*</span>
          </span>
          <input name="phone" type="tel" required autoComplete="tel" className={field} />
        </label>
        <label>
          <span className={label}>
            Passport Nationality & Residence <span className="text-antique-gold">*</span>
          </span>
          <input name="nationality" required autoComplete="country-name" className={field} />
        </label>
      </div>

      <div className="grid gap-space-md sm:grid-cols-2">
        <label>
          <span className={label}>
            Preferred Tour Itinerary <span className="text-antique-gold">*</span>
          </span>
          <select name="tour" required defaultValue={defaultTour ?? ""} className={`${field} cursor-pointer`}>
            <option value="" disabled>
              Select an itinerary
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
            Expedition Class <span className="text-antique-gold">*</span>
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
            Target Arrival Date <span className="text-antique-gold">*</span>
          </span>
          <input name="arrivalDate" type="date" required className={field} />
        </label>
        <label>
          <span className={label}>Adults (18+)</span>
          <input name="adults" type="number" min={1} max={99} defaultValue={2} className={field} />
        </label>
        <label>
          <span className={label}>Children / Youth</span>
          <input name="children" type="number" min={0} max={99} defaultValue={0} className={field} />
        </label>
      </div>

      {flexibility.length > 0 && (
        <fieldset>
          <legend className={label}>Schedule Flexibility:</legend>
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
          <span>Specific Interests, Mobility, Dietary, or Visa Questions</span>
          <span className="font-normal text-outline">Optional</span>
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
          {pending ? "Sending…" : submit}
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
          <p className="mt-1 text-body-md text-on-surface-variant" dir="auto">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------- Tour page booking card ----------

export function TourBookingForm({ tourId, whatsappHref }: { tourId: number; whatsappHref: string }) {
  const { state, pending, onSubmit } = useSiteForm(createBooking);
  const [format, setFormat] = useState("Private VIP");

  if (state?.ok) {
    return (
      <Success
        title="Reservation request received"
        text="Sandra and our concierge team will reach out via WhatsApp and email within 3 hours."
      />
    );
  }

  const small = "mb-1 block text-label-sm font-semibold tracking-wider text-outline uppercase";
  const input = "w-full rounded bg-surface-container-low p-2.5 text-body-md text-on-surface shadow-inner outline-none focus:ring-2 focus:ring-antique-gold/50";

  return (
    <form onSubmit={onSubmit} className="relative space-y-space-sm">
      <Honeypot />
      <input type="hidden" name="source" value="tour" />
      <input type="hidden" name="tour" value={tourId} />
      <input type="hidden" name="tourClass" value={format} />
      <div>
        <span className={small}>Expedition Format</span>
        <div className="grid grid-cols-2 gap-2" role="radiogroup">
          {["Private VIP", "Curated Small (Max 8)"].map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={format === f}
              onClick={() => setFormat(f)}
              className={`rounded px-3 py-2.5 text-label-sm font-semibold transition-colors ${
                format === f ? "bg-primary text-white shadow-sm" : "bg-surface-container text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <label className="block">
        <span className={small}>Preferred Departure Date</span>
        <input name="arrivalDate" type="date" required className={input} />
      </label>
      <label className="block">
        <span className={small}>Number of Explorers</span>
        <input name="adults" type="number" min={1} max={99} defaultValue={2} className={input} />
      </label>
      <label className="block">
        <span className={small}>Full Name</span>
        <input name="name" required autoComplete="name" className={input} />
      </label>
      <label className="block">
        <span className={small}>Email</span>
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className="block">
        <span className={small}>WhatsApp / Phone</span>
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
          {pending ? "Sending…" : "Reserve Expedition"}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded bg-surface-container px-space-md py-3 text-label-md font-semibold tracking-wider text-primary uppercase transition-colors hover:bg-surface-container-high"
        >
          <Icon name="chat" className="text-[18px] text-antique-gold" />
          Direct WhatsApp Consultation
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
  const { state, pending, onSubmit } = useSiteForm(createBooking);
  if (state?.ok) return <Success title="Request received" text={success} />;

  return (
    <form onSubmit={onSubmit} className="relative grid gap-space-md">
      <Honeypot />
      <input type="hidden" name="source" value="guide" />
      <label>
        <span className={label}>Your Full Name / Organization</span>
        <input name="name" required className={field} />
      </label>
      <label>
        <span className={label}>Email / Diplomatic Address</span>
        <input name="email" type="email" required className={field} />
      </label>
      <div className="grid gap-space-md sm:grid-cols-2">
        <label>
          <span className={label}>Expedition Type</span>
          <select name="tour" className={`${field} cursor-pointer`}>
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          <span className={label}>Preferred Timeframe</span>
          <input name="timeframe" placeholder="e.g. April 2026" className={field} />
        </label>
      </div>
      <label>
        <span className={label}>Special Interests or Requirements</span>
        <textarea name="note" rows={3} maxLength={3000} placeholder="Archaeology, Dietary, Logistics" className={field} />
      </label>
      <ErrorText state={state} />
      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-space-lg py-3.5 text-label-lg font-semibold text-white shadow-md transition-all hover:bg-primary-light disabled:opacity-60"
      >
        <Icon name="send" className="text-[18px] text-antique-gold" />
        {pending ? "Sending…" : submit}
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
  const { state, pending, onSubmit } = useSiteForm(sendPartnership);
  if (state?.ok) return <Success title={successTitle} text={successText} />;

  return (
    <form onSubmit={onSubmit} className="relative grid gap-space-md">
      <Honeypot />
      <div className="grid gap-space-md sm:grid-cols-2">
        <label>
          <span className={label}>
            Full Name / اسم المشترك أو الجهة <span className="text-antique-gold">*</span>
          </span>
          <input name="name" required className={field} />
        </label>
        <label>
          <span className={label}>
            Phone / WhatsApp / رقم الهاتف <span className="text-antique-gold">*</span>
          </span>
          <input name="phone" type="tel" required className={field} />
        </label>
        <label>
          <span className={label}>
            Email Address / البريد الإلكتروني <span className="text-antique-gold">*</span>
          </span>
          <input name="email" type="email" required className={field} />
        </label>
        <label>
          <span className={label}>
            Country & City / البلد والمدينة <span className="text-antique-gold">*</span>
          </span>
          <input name="location" required className={field} />
        </label>
      </div>
      <label>
        <span className={label}>
          Partner Category / نوع الشراكة أو الفئة <span className="text-antique-gold">*</span>
        </span>
        <select name="category" required className={`${field} cursor-pointer`}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        <span className={label}>
          Collaboration Pitch / ماذا تريد منا؟ اشرح فكرتك أو مشروعك بالتفصيل <span className="text-antique-gold">*</span>
        </span>
        <textarea name="body" required minLength={10} maxLength={5000} rows={5} dir="auto" className={field} />
      </label>
      <ErrorText state={state} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-antique-gold px-space-xl py-3.5 text-label-lg font-semibold text-white shadow-md transition-all hover:bg-antique-gold-dark disabled:opacity-60"
      >
        {pending ? "Sending…" : submit}
        <Icon name="send" className="text-[18px]" />
      </button>
    </form>
  );
}
