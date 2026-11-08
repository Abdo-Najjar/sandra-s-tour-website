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
import { conform } from "@/lib/site/shape";
import { emptyTourDetails, pageArTemplate, postArTemplate, tourDetailsTemplate, type TourDetails } from "@/lib/site/tour";
import type { BookingStatus, Page, Post, Tour } from "@/db/schema";
import { bookingStatusLabels } from "@/lib/site/labels";
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
      onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
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
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex flex-wrap items-center gap-3 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <button
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        حفظ
      </button>
      {state?.error && <span className="text-sm text-danger">{state.error}</span>}
      {!state?.error && (state?.ok || saved) && !dirty && !pending && (
        <span className="inline-flex items-center gap-1 text-sm text-success">
          <Check className="size-4" /> تم الحفظ، والتغييرات ظاهرة على الموقع
        </span>
      )}
      {dirty && !pending && <span className="text-sm text-warning">تغييرات غير محفوظة</span>}
      <div className="mr-auto flex items-center gap-2">
        {extra}
        {preview && (
          <a href={preview} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-2">
            <Eye className="size-4" /> معاينة
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
  return (
    <div className={panel}>
      <div>
        <h2 className="font-bold">النسخة العربية</h2>
        <p className="text-sm text-muted">تظهر على الموقع العربي (/ar). أي حقل تتركه فارغاً يظهر بالإنجليزي.</p>
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
              if (!confirm("إرجاع هذا القسم إلى المحتوى الأصلي؟ ستفقد تعديلاتك عليه.")) return;
              startReset(() => resetSiteSection(section, lang));
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2"
          >
            <RotateCcw className="size-4" /> المحتوى الأصلي
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
  ar,
  saved,
}: {
  tour: (Omit<Tour, "details"> & { details: TourDetails }) | null;
  categories: Option[];
  regions: Option[];
  ar: { title: string; summary: string; details: TourDetails };
  saved?: boolean;
}) {
  const { state, pending, dirty, formProps } = useSave(saveTour.bind(null, tour?.id ?? null));
  const t = tour;

  return (
    <form {...formProps} className="grid gap-4">
      <div className={panel}>
        <h2 className="font-bold">الأساسيات</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم الجولة (إنجليزي)">
            <input name="title" required dir="auto" defaultValue={t?.title} className={inputCls} />
          </Field>
          <Field label="الرابط (slug)" hint="يُترك فارغاً ليُنشأ من الاسم">
            <input name="slug" dir="ltr" defaultValue={t?.slug} className={inputCls} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="السعر ($)">
              <input name="price" type="number" min="0" step="1" required dir="ltr" defaultValue={t?.price ?? 0} className={inputCls} />
            </Field>
            <Field label="الأيام">
              <input name="durationDays" type="number" min="1" max="365" required dir="ltr" defaultValue={t?.durationDays ?? 1} className={inputCls} />
            </Field>
            <Field label="الترتيب">
              <input name="sortOrder" type="number" dir="ltr" defaultValue={t?.sortOrder ?? 0} className={inputCls} />
            </Field>
          </div>
          <Field label="التصنيف">
            <select name="category" defaultValue={t?.category ?? categories[0]?.key} className={inputCls}>
              {categories.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label="المنطقة">
            <select name="region" defaultValue={t?.region ?? regions[0]?.key} className={inputCls}>
              {regions.map((r) => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
          </Field>
          <Field label="الصورة الرئيسية" className="sm:col-span-2">
            <ImageField name="image" initial={t?.image ?? ""} />
          </Field>
          <Field label="الملخص (إنجليزي)" className="sm:col-span-2">
            <textarea name="summary" rows={3} dir="auto" defaultValue={t?.summary} className={inputCls} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6">
          <Check2 name="published" label="منشورة على الموقع" defaultChecked={t?.published ?? true} />
          <Check2 name="featured" label="مميزة (تظهر في الصفحة الرئيسية)" defaultChecked={t?.featured ?? false} />
        </div>
      </div>

      <div className="grid gap-2">
        <h2 className="font-bold">تفاصيل صفحة الجولة</h2>
        <p className="text-sm text-muted">كل ما يظهر في صفحة الجولة: المواصفات، الصور، البرنامج اليومي، ما يشمله السعر، الأسئلة وغيرها.</p>
        <ContentEditor name="details" template={tourDetailsTemplate} initial={t?.details ?? emptyTourDetails} />
      </div>

      <ArabicPanel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم الجولة (عربي)">
            <input name="arTitle" dir="rtl" defaultValue={ar.title} className={inputCls} />
          </Field>
          <Field label="الملخص (عربي)" className="sm:col-span-2">
            <textarea name="arSummary" rows={3} dir="rtl" defaultValue={ar.summary} className={inputCls} />
          </Field>
        </div>
        <p className="text-sm text-muted">تفاصيل الصفحة بالعربي. القوائم (البرنامج اليومي، الأسئلة...) إن أضفتها بالعربي تحل محل الإنجليزية بالكامل.</p>
        <ContentEditor name="arDetails" template={tourDetailsTemplate} initial={ar.details} />
      </ArabicPanel>

      <SaveBar state={state} pending={pending} dirty={dirty} saved={saved} preview={t ? `/tours/${t.slug}` : undefined} />
    </form>
  );
}

export function TourRowActions({ id, featured, published }: { id: number; featured: boolean; published: boolean }) {
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
        title={state.featured ? "إلغاء التمييز" : "تمييز في الرئيسية"}
        className={`rounded-lg p-2 hover:bg-surface-2 ${state.featured ? "text-warning" : "text-muted"}`}
      >
        <Star className={`size-4 ${state.featured ? "fill-current" : ""}`} />
      </button>
      <PublishedPill published={state.published} onClick={() => flip("published")} />
      <DeleteButton label="حذف الجولة" onDelete={() => deleteTour(id)} />
    </div>
  );
}

function PublishedPill({ published, onClick }: { published: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="تبديل النشر"
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${published ? "bg-success-soft text-success" : "bg-surface-2 text-muted"}`}
    >
      {published ? "منشور" : "مسودة"}
    </button>
  );
}

// ---------- Blog ----------

function BodyEditor({ name, initial }: { name: string; initial: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
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
          ["عنوان", "\n## عنوان\n"],
          ["عنوان فرعي", "\n### عنوان فرعي\n"],
          ["عريض", "**نص**"],
          ["مائل", "*نص*"],
          ["قائمة", "\n- عنصر\n- عنصر\n"],
          ["اقتباس", "\n> اقتباس\n"],
          ["رابط", "[النص](https://)"],
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
          صورة
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
              insert(`\n![وصف الصورة](${await uploadImage(file)})\n`);
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
        التنسيق: <code dir="ltr">## عنوان</code>، <code dir="ltr">- قائمة</code>، <code dir="ltr">&gt; اقتباس</code>، <code dir="ltr">**عريض**</code>،{" "}
        <code dir="ltr">[رابط](https://...)</code>، <code dir="ltr">![صورة](/uploads/...)</code>. اترك سطراً فارغاً بين الفقرات.
      </p>
    </div>
  );
}

export function PostForm({ post, saved }: { post: Post | null; saved?: boolean }) {
  const { state, pending, dirty, formProps } = useSave(savePost.bind(null, post?.id ?? null));
  const p = post;
  const ar = conform(p?.ar, postArTemplate);

  return (
    <form {...formProps} className="grid gap-4">
      <div className={panel}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="العنوان (إنجليزي)" className="sm:col-span-2">
            <input name="title" required dir="auto" defaultValue={p?.title} className={inputCls} />
          </Field>
          <Field label="الرابط (slug)" hint="يُترك فارغاً ليُنشأ من العنوان">
            <input name="slug" dir="ltr" defaultValue={p?.slug} className={inputCls} />
          </Field>
          <Field label="التصنيف" hint="مثل: History أو Food">
            <input name="category" dir="auto" defaultValue={p?.category} className={inputCls} />
          </Field>
          <Field label="الكاتب">
            <input name="author" dir="auto" defaultValue={p?.author} className={inputCls} />
          </Field>
          <Field label="تاريخ النشر" hint="فارغ = اليوم">
            <DatePicker
              name="publishedAt"
              theme="admin"
              locale="ar-SY-u-nu-latn"
              weekStart={6}
              defaultValue={p?.publishedAt ?? ""}
              labels={{ placeholder: "اختر التاريخ", today: "اليوم", clear: "مسح", prev: "الشهر السابق", next: "الشهر التالي" }}
              className={inputCls}
            />
          </Field>
          <Field label="دقائق القراءة">
            <input name="readMinutes" type="number" min="1" max="120" dir="ltr" defaultValue={p?.readMinutes ?? 5} className={inputCls} />
          </Field>
          <Field label="الوسوم" hint="افصل بينها بفاصلة" className="sm:col-span-2">
            <input name="tags" dir="auto" defaultValue={p?.tags} className={inputCls} />
          </Field>
          <Field label="صورة الغلاف" className="sm:col-span-2">
            <ImageField name="cover" initial={p?.cover ?? ""} />
          </Field>
          <Field label="المقتطف" className="sm:col-span-2">
            <textarea name="excerpt" rows={3} dir="auto" defaultValue={p?.excerpt} className={inputCls} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6">
          <Check2 name="published" label="منشور على الموقع" defaultChecked={p?.published ?? true} />
          <Check2 name="featured" label="المقال المميز (أعلى المدونة)" defaultChecked={p?.featured ?? false} />
        </div>
      </div>
      <div className={panel}>
        <h2 className="font-bold">نص المقال (إنجليزي)</h2>
        <BodyEditor name="body" initial={p?.body ?? ""} />
      </div>
      <ArabicPanel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="العنوان (عربي)" className="sm:col-span-2">
            <input name="arTitle" dir="rtl" defaultValue={ar.title} className={inputCls} />
          </Field>
          <Field label="التصنيف (عربي)">
            <input name="arCategory" dir="rtl" defaultValue={ar.category} className={inputCls} />
          </Field>
          <Field label="الكاتب (عربي)">
            <input name="arAuthor" dir="rtl" defaultValue={ar.author} className={inputCls} />
          </Field>
          <Field label="الوسوم (عربي)" hint="افصل بينها بفاصلة" className="sm:col-span-2">
            <input name="arTags" dir="rtl" defaultValue={ar.tags} className={inputCls} />
          </Field>
          <Field label="المقتطف (عربي)" className="sm:col-span-2">
            <textarea name="arExcerpt" rows={3} dir="rtl" defaultValue={ar.excerpt} className={inputCls} />
          </Field>
        </div>
        <h3 className="font-semibold">نص المقال (عربي)</h3>
        <BodyEditor name="arBody" initial={ar.body} />
      </ArabicPanel>
      <SaveBar state={state} pending={pending} dirty={dirty} saved={saved} preview={p ? `/blog/${p.slug}` : undefined} />
    </form>
  );
}

export function PostRowActions({ id, published }: { id: number; published: boolean }) {
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
      <DeleteButton label="حذف المقال" onDelete={() => deletePost(id)} />
    </div>
  );
}

// ---------- Extra pages ----------

export function PageForm({ page, saved }: { page: Page | null; saved?: boolean }) {
  const { state, pending, dirty, formProps } = useSave(savePage.bind(null, page?.id ?? null));
  const p = page;
  const ar = conform(p?.ar, pageArTemplate);
  return (
    <form {...formProps} className="grid gap-4">
      <div className={panel}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="العنوان">
            <input name="title" required dir="auto" defaultValue={p?.title} className={inputCls} />
          </Field>
          <Field label="الرابط (slug)" hint="تظهر الصفحة على /p/الرابط">
            <input name="slug" dir="ltr" defaultValue={p?.slug} className={inputCls} />
          </Field>
          <Field label="العنوان الفرعي">
            <input name="subtitle" dir="auto" defaultValue={p?.subtitle} className={inputCls} />
          </Field>
          <Field label="الترتيب في القائمة">
            <input name="sortOrder" type="number" dir="ltr" defaultValue={p?.sortOrder ?? 0} className={inputCls} />
          </Field>
          <Field label="صورة الرأس" className="sm:col-span-2">
            <ImageField name="image" initial={p?.image ?? ""} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6">
          <Check2 name="published" label="منشورة" defaultChecked={p?.published ?? true} />
          <Check2 name="showInMenu" label="تظهر في القائمة العلوية" defaultChecked={p?.showInMenu ?? false} />
        </div>
      </div>
      <div className={panel}>
        <h2 className="font-bold">المحتوى (إنجليزي)</h2>
        <BodyEditor name="body" initial={p?.body ?? ""} />
      </div>
      <ArabicPanel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="العنوان (عربي)">
            <input name="arTitle" dir="rtl" defaultValue={ar.title} className={inputCls} />
          </Field>
          <Field label="العنوان الفرعي (عربي)">
            <input name="arSubtitle" dir="rtl" defaultValue={ar.subtitle} className={inputCls} />
          </Field>
        </div>
        <h3 className="font-semibold">المحتوى (عربي)</h3>
        <BodyEditor name="arBody" initial={ar.body} />
      </ArabicPanel>
      <SaveBar state={state} pending={pending} dirty={dirty} saved={saved} preview={p ? `/p/${p.slug}` : undefined} />
    </form>
  );
}

export function DeletePageButton({ id }: { id: number }) {
  return <DeleteButton label="حذف الصفحة" onDelete={() => deletePage(id)} />;
}

// ---------- Inbox ----------


const bookingStatusStyle: Record<BookingStatus, string> = {
  new: "bg-primary-soft text-primary",
  contacted: "bg-warning-soft text-warning",
  confirmed: "bg-success-soft text-success",
  cancelled: "bg-danger-soft text-danger",
};

export function BookingStatusSelect({ id, status }: { id: number; status: BookingStatus }) {
  const [value, setValue] = useOptimistic(status);
  const [, startTransition] = useTransition();
  return (
    <select
      aria-label="حالة الحجز"
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
      {Object.entries(bookingStatusLabels).map(([k, label]) => (
        <option key={k} value={k} className="bg-surface text-foreground">{label}</option>
      ))}
    </select>
  );
}

export function DeleteBookingButton({ id }: { id: number }) {
  return <DeleteButton label="حذف الحجز" onDelete={() => deleteBooking(id)} />;
}

export function MessageActions({ id, read, canDelete }: { id: number; read: boolean; canDelete: boolean }) {
  const [value, setValue] = useOptimistic(read);
  const [, startTransition] = useTransition();
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        title={value ? "تعليم كغير مقروءة" : "تعليم كمقروءة"}
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
      {canDelete && <DeleteButton label="حذف الرسالة" onDelete={() => deleteMessage(id)} />}
    </div>
  );
}

export function DeleteSubscriberButton({ id }: { id: number }) {
  return <DeleteButton label="حذف المشترك" onDelete={() => deleteSubscriber(id)} />;
}

export function CopyEmailsButton({ emails }: { emails: string[] }) {
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
      {done ? "تم النسخ" : "نسخ كل العناوين"}
    </button>
  );
}
