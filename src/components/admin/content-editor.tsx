"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ImageUp, Loader2, Plus, Trash2 } from "lucide-react";
import { blank } from "@/lib/site/shape";
import { useAdminLang, useT } from "@/components/admin/admin-lang";
import type { AdminLang, T } from "@/lib/admin/i18n";
import ar from "@/messages/ar.json";

// A form editor for any JSON value, driven by a template of the same shape
// (see lib/site/content.ts and lib/site/tour.ts). The current value is kept
// in a hidden input named `name` as JSON, so it posts with the form.

type Json = string | number | boolean | Json[] | { [k: string]: Json };

export const inputCls =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary";

// ---------- Labels ----------

// Arabic words for field names live in src/messages/ar.json ("fields").
const WORDS: Record<string, string> = ar.fields;

// English names that aren't just the field name with spaces.
const EN_WORDS: Record<string, string> = {
  a: "answer", q: "question", cta: "call to action", seo: "SEO", faq: "FAQ", href: "link", en: "English",
  creds: "credentials", flex: "flexibility", multi: "multiple", emblem: "emblem", kicker: "kicker",
};

// "seoTitle" -> "SEO title" / "عنوان محركات البحث"; a trailing "Ar" marks the Arabic copy.
export function labelFor(key: string, lang: AdminLang = "en") {
  const isAr = /Ar$/.test(key) && key !== "Ar";
  const base = isAr ? key.slice(0, -2) : key;
  const words = base.split(/(?=[A-Z])/).map((w) => w.toLowerCase());
  if (lang === "en") {
    const text = words.map((w) => EN_WORDS[w] ?? w).join(" ");
    const label = text.charAt(0).toUpperCase() + text.slice(1);
    return isAr ? `${label} (Arabic)` : label;
  }
  const known = words.every((w) => WORDS[w]);
  const text = known ? words.reverse().map((w) => WORDS[w]).join(" ") : base;
  return isAr ? `${text} (${WORDS.arabic})` : text;
}

function useLabel() {
  const lang = useAdminLang();
  return (key: string) => labelFor(key, lang);
}

const isImageKey = (k: string) => /^(image|logo|cover|mapImage|avatar|photo)$|Image$/.test(k);
const isIconKey = (k: string) => /^icon$|Icon$/.test(k);
const isLongKey = (k: string) =>
  /^(text|body|overview|quote|a|answer|description|seoDescription|bio|summary|note|excerpt)$|(Text|Note|textAr|quoteAr)$/.test(k);

// ---------- Image field (also used by the tour / blog / page forms) ----------

export async function uploadImage(file: File, failed = "Couldn't upload the image"): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.error || failed);
  return data.url as string;
}

export function ImageInput({
  value,
  onChange,
  name,
}: {
  value: string;
  onChange: (v: string) => void;
  name?: string;
}) {
  const t = useT();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="flex items-start gap-3">
      <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-surface-2">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <ImageUp className="size-5 text-muted" />
        )}
      </div>
      <div className="grid flex-1 gap-1.5">
        <div className="flex gap-2">
          <input name={name} dir="ltr" value={value} onChange={(e) => onChange(e.target.value)} placeholder="/site/img12.jpg" className={inputCls} />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-sm hover:bg-surface-2 disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <ImageUp className="size-4" />}
            {t("Upload")}
          </button>
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setBusy(true);
            setError("");
            try {
              onChange(await uploadImage(file, t("Couldn't upload the image")));
            } catch (err) {
              setError((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
      </div>
    </div>
  );
}

// ---------- Recursive editor ----------

function TextField({ k, value, onChange }: { k: string; value: string; onChange: (v: string) => void }) {
  const t = useT();
  if (isImageKey(k)) return <ImageInput value={value} onChange={onChange} />;
  if (isIconKey(k))
    return (
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined grid size-10 shrink-0 place-items-center rounded-lg bg-surface-2 text-primary">
          {value || "help"}
        </span>
        <input dir="ltr" value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
        <a href="https://fonts.google.com/icons" target="_blank" rel="noopener" className="shrink-0 text-xs text-primary hover:underline">
          {t("Icons")}
        </a>
      </div>
    );
  if (isLongKey(k) || value.length > 90)
    return (
      <textarea
        dir="auto"
        rows={Math.min(10, Math.max(3, Math.ceil(value.length / 90)))}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    );
  return <input dir="auto" value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
}

function itemTitle(item: Json, i: number, t: T) {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    for (const k of ["title", "label", "name", "q", "ar", "en", "key", "text", "quote"]) {
      const v = item[k];
      if (typeof v === "string" && v.trim()) return v.length > 60 ? `${v.slice(0, 60)}…` : v;
    }
  }
  return t("Item {n}", { n: i + 1 });
}

function ListEditor({ k, value, template, onChange }: { k: string; value: Json[]; template: Json[]; onChange: (v: Json[]) => void }) {
  const t = useT();
  const sample = (template[0] ?? "") as Json;
  const [open, setOpen] = useState<number | null>(null);
  const move = (i: number, d: number) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
    if (open === i) setOpen(i + d);
  };
  const remove = (i: number) => {
    if (typeof value[i] === "object" && !confirm(t("Delete this item?"))) return;
    onChange(value.filter((_, j) => j !== i));
    setOpen(null);
  };
  const simple = typeof sample !== "object";

  return (
    <div className="grid gap-2">
      {value.map((item, i) => (
        <div key={i} className={simple ? "flex min-w-0 items-start gap-1" : "min-w-0 rounded-lg border border-border bg-surface"}>
          {simple ? (
            <div className="min-w-0 flex-1">
              <Node k={k} value={item} template={sample} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center gap-2 px-3 py-2 text-start text-sm font-medium"
            >
              <ChevronDown className={`size-4 shrink-0 text-muted transition-transform ${open === i ? "rotate-180" : ""}`} />
              <span dir="auto" className="min-w-0 flex-1 truncate">{itemTitle(item, i, t)}</span>
            </button>
          )}
          {simple && <ItemButtons i={i} last={value.length - 1} move={move} remove={remove} />}
          {!simple && open === i && (
            <div className="grid gap-3 border-t border-border p-3">
              <Node k={k} value={item} template={sample} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
              <div className="flex justify-end">
                <ItemButtons i={i} last={value.length - 1} move={move} remove={remove} />
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          onChange([...value, blank(sample)]);
          setOpen(value.length);
        }}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-sm text-primary hover:bg-primary-soft"
      >
        <Plus className="size-4" />
        {t("Add")}
      </button>
    </div>
  );
}

function ItemButtons({ i, last, move, remove }: { i: number; last: number; move: (i: number, d: number) => void; remove: (i: number) => void }) {
  const t = useT();
  const btn = "rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-foreground disabled:opacity-30";
  return (
    <div className="flex items-center">
      <button type="button" aria-label={t("Move up")} disabled={i === 0} onClick={() => move(i, -1)} className={btn}>
        <ArrowUp className="size-4" />
      </button>
      <button type="button" aria-label={t("Move down")} disabled={i === last} onClick={() => move(i, 1)} className={btn}>
        <ArrowDown className="size-4" />
      </button>
      <button type="button" aria-label={t("Delete")} onClick={() => remove(i)} className="rounded-md p-1.5 text-muted hover:bg-danger-soft hover:text-danger">
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

function Node({ k, value, template, onChange }: { k: string; value: Json; template: Json; onChange: (v: Json) => void }) {
  const label = useLabel();
  if (typeof template === "string") return <TextField k={k} value={String(value ?? "")} onChange={onChange} />;
  if (typeof template === "number")
    return <input type="number" dir="ltr" value={Number(value) || 0} onChange={(e) => onChange(Number(e.target.value))} className={inputCls} />;
  if (typeof template === "boolean")
    return <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[var(--color-primary)]" />;
  if (Array.isArray(template))
    return <ListEditor k={k} value={Array.isArray(value) ? value : []} template={template} onChange={onChange} />;

  const obj = (value && typeof value === "object" && !Array.isArray(value) ? value : {}) as Record<string, Json>;
  return (
    <div className="grid gap-3">
      {Object.entries(template).map(([key, tpl]) => {
        const nested = typeof tpl === "object";
        const field = <Node k={key} value={obj[key]} template={tpl} onChange={(v) => onChange({ ...obj, [key]: v })} />;
        return nested ? (
          <fieldset key={key} className="grid gap-2 rounded-xl border border-border p-3">
            <legend className="px-1 text-sm font-bold" title={key}>{label(key)}</legend>
            {field}
          </fieldset>
        ) : (
          <label key={key} className="grid gap-1.5 text-sm">
            <span className="font-medium" title={key}>{label(key)}</span>
            {field}
          </label>
        );
      })}
    </div>
  );
}

// Top-level: one collapsible panel per key, so long sections stay readable.
export function ContentEditor<T extends object>({ name, template, initial }: { name: string; template: T; initial: T }) {
  const label = useLabel();
  const [value, setValue] = useState<Record<string, Json>>(initial as Record<string, Json>);
  const entries = Object.entries(template as Record<string, Json>);
  const flat = entries.filter(([, t]) => typeof t !== "object");
  const groups = entries.filter(([, t]) => typeof t === "object");

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={JSON.stringify(value)} />
      {flat.length > 0 && (
        <div className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2">
          {flat.map(([key, t]) => (
            <label key={key} className={`grid gap-1.5 text-sm ${isLongKey(key) || isImageKey(key) ? "sm:col-span-2" : ""}`}>
              <span className="font-medium" title={key}>{label(key)}</span>
              <Node k={key} value={value[key]} template={t} onChange={(v) => setValue({ ...value, [key]: v })} />
            </label>
          ))}
        </div>
      )}
      {groups.map(([key, t]) => (
        <details key={key} className="group rounded-xl border border-border bg-surface">
          <summary className="flex cursor-pointer list-none items-center gap-2 p-4 font-bold">
            <ChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" />
            <span title={key}>{label(key)}</span>
            {Array.isArray(t) && <span className="text-xs font-normal text-muted">({Array.isArray(value[key]) ? (value[key] as Json[]).length : 0})</span>}
          </summary>
          <div className="border-t border-border p-4">
            <Node k={key} value={value[key]} template={t} onChange={(v) => setValue({ ...value, [key]: v })} />
          </div>
        </details>
      ))}
    </div>
  );
}
