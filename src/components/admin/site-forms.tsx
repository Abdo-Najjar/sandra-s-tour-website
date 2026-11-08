"use client";

import { useActionState, useOptimistic, useRef, useState, useTransition } from "react";
import { Check, Copy, Eye, Loader2, Mail, MailOpen, RotateCcw, Save, Star } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { DeleteButton } from "@/components/row-actions";
import type { ActionState } from "@/lib/actions";
import {
  deleteBooking,
  deleteMessage,
  deletePage,
  deletePost,
  deleteSubscriber,
  deleteTour,
  resetSiteSection,
  saveSiteSection,
  savePage,
  savePost,
  saveTour,
  setBookingStatus,
  setMessageRead,
  togglePostPublished,
  toggleTour,
} from "@/lib/site/admin-actions";
import type { SiteContent, SiteSection } from "@/lib/site/content";
import { localHref, type Lang } from "@/lib/site/i18n";
import { emptyTourDetails, tourDetailsTemplate } from "@/lib/site/tour";
import type { AdminPage, AdminPost, AdminTour } from "@/lib/queries";
import type { BookingStatus } from "@/db/schema";
import { bookingStatusLabel } from "@/lib/site/labels";
import { BOOKING_STATUSES } from "@/db/schema";
import { useAdminLang, useT } from "@/components/admin/admin-lang";
import { ContentEditor, ImageInput, inputCls, uploadImage } from "./content-editor";

type Action = (state: ActionState, fd: FormData) => Promise<ActionState>;

// Submits without React's automatic form reset, so values stay after errors.
function useSave(action: Action) {
  const [state, run] = useActionState(action, undefined);
  const [pending, startTransition] = useTransition();
  const [dirty, setDirty] = useState(false);
  return {
    state,
    pending,
    dirty,
    formProps: {
      // POST so a click before the page is ready never puts data in the URL.
      method: "post",
      onChange: () => setDirty(true),
      onInput: () => setDirty(true),
      onClick: (e: React.MouseEvent) => {
        // Editor buttons (add / remove / move) change data too.
        if ((e.target as HTMLElement).closest("button[type=button]")) setDirty(true);
      },
      onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setDirty(false);
        startTransition(() => run(fd));
      },
    },
  };
}

function SaveBar({
  state,
  pending,
  dirty,
  saved,
  preview,
  extra,
}: {
  state: ActionState;
  pending: boolean;
  dirty: boolean;
  saved?: boolean;
  preview?: string;
  extra?: React.ReactNode;
}) {
  const t = useT();
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex flex-wrap items-center gap-3 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <button
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        {t("Save")}
      </button>
      {state?.error && <span className="text-sm text-danger">{state.error}</span>}
      {!state?.error && (state?.ok || saved) && !dirty && !pending && (
        <span className="inline-flex items-center gap-1 text-sm text-success">
          <Check className="size-4" /> {t("Saved. The changes are live on the website.")}
        </span>
      )}
      {dirty && !pending && <span className="text-sm text-warning">{t("Unsaved changes")}</span>}
      <div className="ms-auto flex items-center gap-2">
        {extra}
        {preview && (
          <a href={preview} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-2">
            <Eye className="size-4" /> {t("Preview")}
          </a>
        )}
      </div>
    </div>
  );
}

function Field({ label, hint, className = "", children }: { label: string; hint?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`grid content-start gap-1.5 text-sm ${className}`}>
      <span className="font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

function Check2({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-[var(--color-primary)]" />
      {label}
    </label>
  );
}

// Image input that posts as a normal form field.
function ImageField({ name, initial }: { name: string; initial: string }) {
  const [value, setValue] = useState(initial);
  return <ImageInput name={name} value={value} onChange={setValue} />;
}

const panel = "grid gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5";

// Box for the Arabic version of a tour, article or page.
function ArabicPanel({ children }: { children: React.ReactNode }) {
  const t = useT();
  return (
    <div className={panel}>
      <div>
        <h2 className="font-bold">{t("Arabic version")}</h2>
        <p className="text-sm text-muted">
          {t("Shown on the Arabic website (/ar). Any field left empty shows the English text.")}
        </p>
      </div>
      {children}
    </div>
  );
}

// ---------- Website sections ----------

export function SectionForm<S extends SiteSection>({
  section,
  template,
  initial,
  preview,
  lang,
}: {
  section: S;
  template: SiteContent[S];
  initial: SiteContent[S];
  preview: string;
  lang: Lang;
}) {
  const t = useT();
  const { state, pending, dirty, formProps } = useSave(saveSiteSection.bind(null, section, lang));
  const [resetting, startReset] = useTransition();

  return (
    <form {...formProps}>
      {/* Remount when the stored content changes (e.g. after a reset). */}
      <ContentEditor key={JSON.stringify(initial)} name="data" template={template} initial={initial} />
      <SaveBar
        state={state}
        pending={pending}
        dirty={dirty}
        preview={localHref(preview, lang)}
        extra={
          <button
            type="button"
            disabled={resetting}
            onClick={() => {
              if (!confirm(t("Reset this section to the original text? Your edits to it will be lost."))) return;
              startReset(() => resetSiteSection(section, lang));
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2"
          >
            <RotateCcw className="size-4" /> {t("Original text")}
          </button>
        }
      />
    </form>
  );
}

// ---------- Tours ----------

type Option = { key: string; label: string };

export function TourForm({
  tour,
  categories,
  regions,
  saved,
}: {
  tour: AdminTour | null;
  categories: Option[];
  regions: Option[];
  saved?: boolean;
}) {
  const { state, pending, dirty, formProps } = useSave(saveTour.bind(null, tour?.id ?? null));
  const t = useT();
  const ar = tour?.ar ?? { title: "", summary: "", details: emptyTourDetails };

  return (
    <form {...formProps} className="grid gap-4">
      <div className={panel}>
        <h2 className="font-bold">{t("Basics")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("Tour name (English)")}>
            <input name="title" required dir="auto" defaultValue={tour?.title} className={inputCls} />
          </Field>
          <Field label={t("Link (slug)")} hint={t("Leave empty to make it from the name")}>
            <input name="slug" dir="ltr" defaultValue={tour?.slug} className={inputCls} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label={t("Price ($)")}>
              <input name="price" type="number" min="0" step="1" required dir="ltr" defaultValue={tour?.price ?? 0} className={inputCls} />
            </Field>
            <Field label={t("Days")}>
              <input name="durationDays" type="number" min="1" max="365" required dir="ltr" defaultValue={tour?.durationDays ?? 1} className={inputCls} />
            </Field>
            <Field label={t("Order")}>
              <input name="sortOrder" type="number" dir="ltr" defaultValue={tour?.sortOrder ?? 0} className={inputCls} />
            </Field>
          </div>
          <Field label={t("Category")}>
            <select name="category" defaultValue={tour?.category ?? categories[0]?.key} className={inputCls}>
              {categories.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label={t("Region")}>
            <select name="region" defaultValue={tour?.region ?? regions[0]?.key} className={inputCls}>
              {regions.map((r) => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
          </Field>
          <Field label={t("Main photo")} className="sm:col-span-2">
            <ImageField name="image" initial={tour?.image ?? ""} />
          </Field>
          <Field label={t("Summary (English)")} className="sm:col-span-2">
            <textarea name="summary" rows={3} dir="auto" defaultValue={tour?.summary} className={inputCls} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6">
          <Check2 name="published" label={t("Published on the website")} defaultChecked={tour?.published ?? true} />
          <Check2 name="featured" label={t("Featured (shown on the home page)")} defaultChecked={tour?.featured ?? false} />
        </div>
      </div>

      <div className="grid gap-2">
        <h2 className="font-bold">{t("Tour page details")}</h2>
        <p className="text-sm text-muted">
          {t("Everything on the tour page: specs, photos, day-by-day plan, what's included, questions and more.")}
        </p>
        <ContentEditor name="details" template={tourDetailsTemplate} initial={tour?.details ?? emptyTourDetails} />
      </div>

      <ArabicPanel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("Tour name (Arabic)")}>
            <input name="arTitle" dir="rtl" defaultValue={ar.title} className={inputCls} />
          </Field>
          <Field label={t("Summary (Arabic)")} className="sm:col-span-2">
            <textarea name="arSummary" rows={3} dir="rtl" defaultValue={ar.summary} className={inputCls} />
          </Field>
        </div>
        <p className="text-sm text-muted">
          {t("Page details in Arabic. A list you fill in Arabic (day plan, questions…) replaces the English list completely.")}
        </p>
        <ContentEditor name="arDetails" template={tourDetailsTemplate} initial={ar.details} />
      </ArabicPanel>

      <SaveBar state={state} pending={pending} dirty={dirty} saved={saved} preview={tour ? `/tours/${tour.slug}` : undefined} />
    </form>
  );
}

export function TourRowActions({ id, featured, published }: { id: number; featured: boolean; published: boolean }) {
  const t = useT();
  const [state, setState] = useOptimistic({ featured, published });
  const [, startTransition] = useTransition();
  const flip = (field: "featured" | "published") =>
    startTransition(async () => {
      setState({ ...state, [field]: !state[field] });
      await toggleTour(id, field);
    });

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => flip("featured")}
        title={state.featured ? t("Remove from home page") : t("Feature on home page")}
        className={`rounded-lg p-2 hover:bg-surface-2 ${state.featured ? "text-warning" : "text-muted"}`}
      >
        <Star className={`size-4 ${state.featured ? "fill-current" : ""}`} />
      </button>
      <PublishedPill published={state.published} onClick={() => flip("published")} />
      <DeleteButton label={t("Delete tour")} onDelete={() => deleteTour(id)} />
    </div>
  );
}

function PublishedPill({ published, onClick }: { published: boolean; onClick: () => void }) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={onClick}
      title={t("Publish / unpublish")}
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${published ? "bg-success-soft text-success" : "bg-surface-2 text-muted"}`}
    >
      {published ? t("Published") : t("Draft")}
    </button>
  );
}

// ---------- Blog ----------

function BodyEditor({ name, initial }: { name: string; initial: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const t = useT();
  const [busy, setBusy] = useState(false);

  const insert = (text: string) => {
    const el = ref.current;
    if (!el) return;
    const at = el.selectionStart ?? el.value.length;
    el.setRangeText(text, at, el.selectionEnd ?? at, "end");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
  };

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-1 text-xs">
        {[
          [t("Heading"), t("\n## Heading\n")],
          [t("Subheading"), t("\n### Subheading\n")],
          [t("Bold"), t("**text**")],
          [t("Italic"), t("*text*")],
          [t("List"), t("\n- item\n- item\n")],
          [t("Quote"), t("\n> quote\n")],
          [t("Link"), t("[text](https://)")],
        ].map(([label, text]) => (
          <button key={label} type="button" onClick={() => insert(text)} className="rounded-md border border-border px-2 py-1 hover:bg-surface-2">
            {label}
          </button>
        ))}
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:bg-surface-2 disabled:opacity-60"
        >
          {busy && <Loader2 className="size-3 animate-spin" />}
          {t("Image")}
        </button>
        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setBusy(true);
            try {
              insert(`\n![${t("image description")}](${await uploadImage(file, t("Couldn't upload the image"))})\n`);
            } catch (err) {
              alert((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
      </div>
      <textarea ref={ref} name={name} rows={22} dir="auto" defaultValue={initial} className={`${inputCls} font-mono leading-7`} />
      <p className="text-xs text-muted">
        {t("Formatting:")} <code dir="ltr">## {t("Heading")}</code> · <code dir="ltr">- {t("list")}</code> ·{" "}
        <code dir="ltr">&gt; {t("quote")}</code> · <code dir="ltr">**{t("bold")}**</code> ·{" "}
        <code dir="ltr">[{t("link")}](https://...)</code> · <code dir="ltr">![{t("image")}](/uploads/...)</code>.{" "}
        {t("Leave an empty line between paragraphs.")}
      </p>
    </div>
  );
}

export function PostForm({ post, saved }: { post: AdminPost | null; saved?: boolean }) {
  const t = useT();
  const lang = useAdminLang();
  const { state, pending, dirty, formProps } = useSave(savePost.bind(null, post?.id ?? null));
  const p = post;
  const ar = p?.ar ?? { title: "", category: "", excerpt: "", author: "", tags: "", body: "" };

  return (
    <form {...formProps} className="grid gap-4">
      <div className={panel}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("Title (English)")} className="sm:col-span-2">
            <input name="title" required dir="auto" defaultValue={p?.title} className={inputCls} />
          </Field>
          <Field label={t("Link (slug)")} hint={t("Leave empty to make it from the title")}>
            <input name="slug" dir="ltr" defaultValue={p?.slug} className={inputCls} />
          </Field>
          <Field label={t("Category")} hint={t("For example: History or Food")}>
            <input name="category" dir="auto" defaultValue={p?.category} className={inputCls} />
          </Field>
          <Field label={t("Author")}>
            <input name="author" dir="auto" defaultValue={p?.author} className={inputCls} />
          </Field>
          <Field label={t("Publish date")} hint={t("Empty = today")}>
            <DatePicker
              name="publishedAt"
              theme="admin"
              locale={lang === "ar" ? "ar-SY-u-nu-latn" : "en-GB"}
              weekStart={lang === "ar" ? 6 : 1}
              defaultValue={p?.publishedAt ?? ""}
              labels={{
                placeholder: t("Pick a date"),
                today: t("Today"),
                clear: t("Clear"),
                prev: t("Previous month"),
                next: t("Next month"),
              }}
              className={inputCls}
            />
          </Field>
          <Field label={t("Reading minutes")}>
            <input name="readMinutes" type="number" min="1" max="120" dir="ltr" defaultValue={p?.readMinutes ?? 5} className={inputCls} />
          </Field>
          <Field label={t("Tags")} hint={t("Separate with commas")} className="sm:col-span-2">
            <input name="tags" dir="auto" defaultValue={p?.tags} className={inputCls} />
          </Field>
          <Field label={t("Cover photo")} className="sm:col-span-2">
            <ImageField name="cover" initial={p?.cover ?? ""} />
          </Field>
          <Field label={t("Excerpt")} className="sm:col-span-2">
            <textarea name="excerpt" rows={3} dir="auto" defaultValue={p?.excerpt} className={inputCls} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6">
          <Check2 name="published" label={t("Published on the website")} defaultChecked={p?.published ?? true} />
          <Check2 name="featured" label={t("Featured article (top of the blog)")} defaultChecked={p?.featured ?? false} />
        </div>
      </div>
      <div className={panel}>
        <h2 className="font-bold">{t("Article text (English)")}</h2>
        <BodyEditor name="body" initial={p?.body ?? ""} />
      </div>
      <ArabicPanel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("Title (Arabic)")} className="sm:col-span-2">
            <input name="arTitle" dir="rtl" defaultValue={ar.title} className={inputCls} />
          </Field>
          <Field label={t("Category (Arabic)")}>
            <input name="arCategory" dir="rtl" defaultValue={ar.category} className={inputCls} />
          </Field>
          <Field label={t("Author (Arabic)")}>
            <input name="arAuthor" dir="rtl" defaultValue={ar.author} className={inputCls} />
          </Field>
          <Field label={t("Tags (Arabic)")} hint={t("Separate with commas")} className="sm:col-span-2">
            <input name="arTags" dir="rtl" defaultValue={ar.tags} className={inputCls} />
          </Field>
          <Field label={t("Excerpt (Arabic)")} className="sm:col-span-2">
            <textarea name="arExcerpt" rows={3} dir="rtl" defaultValue={ar.excerpt} className={inputCls} />
          </Field>
        </div>
        <h3 className="font-semibold">{t("Article text (Arabic)")}</h3>
        <BodyEditor name="arBody" initial={ar.body} />
      </ArabicPanel>
      <SaveBar state={state} pending={pending} dirty={dirty} saved={saved} preview={p ? `/blog/${p.slug}` : undefined} />
    </form>
  );
}

export function PostRowActions({ id, published }: { id: number; published: boolean }) {
  const t = useT();
  const [value, setValue] = useOptimistic(published);
  const [, startTransition] = useTransition();
  return (
    <div className="flex items-center gap-1">
      <PublishedPill
        published={value}
        onClick={() =>
          startTransition(async () => {
            setValue(!value);
            await togglePostPublished(id);
          })
        }
      />
      <DeleteButton label={t("Delete article")} onDelete={() => deletePost(id)} />
    </div>
  );
}

// ---------- Extra pages ----------

export function PageForm({ page, saved }: { page: AdminPage | null; saved?: boolean }) {
  const t = useT();
  const { state, pending, dirty, formProps } = useSave(savePage.bind(null, page?.id ?? null));
  const p = page;
  const ar = p?.ar ?? { title: "", subtitle: "", body: "" };
  return (
    <form {...formProps} className="grid gap-4">
      <div className={panel}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("Title")}>
            <input name="title" required dir="auto" defaultValue={p?.title} className={inputCls} />
          </Field>
          <Field label={t("Link (slug)")} hint={t("The page shows at /p/link")}>
            <input name="slug" dir="ltr" defaultValue={p?.slug} className={inputCls} />
          </Field>
          <Field label={t("Subtitle")}>
            <input name="subtitle" dir="auto" defaultValue={p?.subtitle} className={inputCls} />
          </Field>
          <Field label={t("Menu order")}>
            <input name="sortOrder" type="number" dir="ltr" defaultValue={p?.sortOrder ?? 0} className={inputCls} />
          </Field>
          <Field label={t("Header photo")} className="sm:col-span-2">
            <ImageField name="image" initial={p?.image ?? ""} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6">
          <Check2 name="published" label={t("Published")} defaultChecked={p?.published ?? true} />
          <Check2 name="showInMenu" label={t("Show in the top menu")} defaultChecked={p?.showInMenu ?? false} />
        </div>
      </div>
      <div className={panel}>
        <h2 className="font-bold">{t("Content (English)")}</h2>
        <BodyEditor name="body" initial={p?.body ?? ""} />
      </div>
      <ArabicPanel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("Title (Arabic)")}>
            <input name="arTitle" dir="rtl" defaultValue={ar.title} className={inputCls} />
          </Field>
          <Field label={t("Subtitle (Arabic)")}>
            <input name="arSubtitle" dir="rtl" defaultValue={ar.subtitle} className={inputCls} />
          </Field>
        </div>
        <h3 className="font-semibold">{t("Content (Arabic)")}</h3>
        <BodyEditor name="arBody" initial={ar.body} />
      </ArabicPanel>
      <SaveBar state={state} pending={pending} dirty={dirty} saved={saved} preview={p ? `/p/${p.slug}` : undefined} />
    </form>
  );
}

export function DeletePageButton({ id }: { id: number }) {
  const t = useT();
  return <DeleteButton label={t("Delete page")} onDelete={() => deletePage(id)} />;
}

// ---------- Inbox ----------


const bookingStatusStyle: Record<BookingStatus, string> = {
  new: "bg-primary-soft text-primary",
  contacted: "bg-warning-soft text-warning",
  confirmed: "bg-success-soft text-success",
  cancelled: "bg-danger-soft text-danger",
};

export function BookingStatusSelect({ id, status }: { id: number; status: BookingStatus }) {
  const t = useT();
  const [value, setValue] = useOptimistic(status);
  const [, startTransition] = useTransition();
  return (
    <select
      aria-label={t("Booking status")}
      value={value}
      onChange={(e) => {
        const next = e.target.value as BookingStatus;
        startTransition(async () => {
          setValue(next);
          await setBookingStatus(id, next);
        });
      }}
      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${bookingStatusStyle[value]}`}
    >
      {BOOKING_STATUSES.map((k) => (
        <option key={k} value={k} className="bg-surface text-foreground">{bookingStatusLabel(k, t)}</option>
      ))}
    </select>
  );
}

export function DeleteBookingButton({ id }: { id: number }) {
  const t = useT();
  return <DeleteButton label={t("Delete booking")} onDelete={() => deleteBooking(id)} />;
}

export function MessageActions({ id, read, canDelete }: { id: number; read: boolean; canDelete: boolean }) {
  const t = useT();
  const [value, setValue] = useOptimistic(read);
  const [, startTransition] = useTransition();
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        title={value ? t("Mark as unread") : t("Mark as read")}
        onClick={() =>
          startTransition(async () => {
            setValue(!value);
            await setMessageRead(id, !value);
          })
        }
        className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-foreground"
      >
        {value ? <MailOpen className="size-4" /> : <Mail className="size-4 text-primary" />}
      </button>
      {canDelete && <DeleteButton label={t("Delete message")} onDelete={() => deleteMessage(id)} />}
    </div>
  );
}

export function DeleteSubscriberButton({ id }: { id: number }) {
  const t = useT();
  return <DeleteButton label={t("Delete subscriber")} onDelete={() => deleteSubscriber(id)} />;
}

export function CopyEmailsButton({ emails }: { emails: string[] }) {
  const t = useT();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(emails.join(", "));
        setDone(true);
        setTimeout(() => setDone(false), 2000);
      }}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface-2"
    >
      {done ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
      {done ? t("Copied") : t("Copy all emails")}
    </button>
  );
}
