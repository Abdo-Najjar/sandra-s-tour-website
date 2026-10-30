"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui";
import {
  changePassword,
  createOrder,
  createProduct,
  createUser,
  saveSettings,
  type ActionState,
} from "@/lib/actions";
import { currencies, roleLabels } from "@/lib/format";
import type { Settings } from "@/db/schema";

export const inputCls =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary";

type Action = (state: ActionState, fd: FormData) => Promise<ActionState>;

// Runs a server action from a form without React's automatic form reset,
// so fields keep their values when validation fails.
function useFormAction(action: Action, onSuccess?: (form: HTMLFormElement) => void) {
  const [state, run] = useActionState(action, undefined);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && formRef.current) onSuccess?.(formRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => run(fd));
  };

  return { state, pending, formRef, onSubmit };
}

function FormError({ state }: { state: ActionState }) {
  if (!state?.error) return null;
  return <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{state.error}</p>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

// Button that opens a modal dialog holding a create form.
function DialogForm({
  trigger,
  title,
  action,
  children,
}: {
  trigger: string;
  title: string;
  action: Action;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { state, pending, formRef, onSubmit } = useFormAction(action, (form) => {
    form.reset();
    dialogRef.current?.close();
  });

  return (
    <>
      <Button onClick={() => dialogRef.current?.showModal()}>
        <Plus className="size-4" />
        {trigger}
      </Button>
      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-surface p-0 text-foreground backdrop:bg-black/40"
      >
        <form ref={formRef} onSubmit={onSubmit} className="grid gap-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{title}</h2>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="إغلاق" className="text-muted">
              <X className="size-5" />
            </button>
          </div>
          {children}
          <FormError state={state} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => dialogRef.current?.close()}>
              إلغاء
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "جارٍ الحفظ..." : "حفظ"}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export function NewUserButton() {
  return (
    <DialogForm trigger="مستخدم جديد" title="إضافة مستخدم" action={createUser}>
      <Field label="الاسم">
        <input name="name" required className={inputCls} />
      </Field>
      <Field label="البريد الإلكتروني">
        <input name="email" type="email" required dir="ltr" className={inputCls} />
      </Field>
      <Field label="الدور">
        <select name="role" defaultValue="user" className={inputCls}>
          {Object.entries(roleLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </Field>
      <Field label="كلمة المرور (مطلوبة للمدير والمحرر)">
        <input name="password" type="password" autoComplete="new-password" minLength={8} dir="ltr" className={inputCls} />
      </Field>
    </DialogForm>
  );
}

export function NewProductButton() {
  return (
    <DialogForm trigger="إضافة منتج" title="منتج جديد" action={createProduct}>
      <Field label="اسم المنتج">
        <input name="name" required className={inputCls} />
      </Field>
      <Field label="التصنيف">
        <input name="category" required className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="السعر">
          <input name="price" type="number" min="0.01" step="0.01" required dir="ltr" className={inputCls} />
        </Field>
        <Field label="المخزون">
          <input name="stock" type="number" min="0" step="1" defaultValue="0" dir="ltr" className={inputCls} />
        </Field>
      </div>
    </DialogForm>
  );
}

export function NewOrderButton({ products }: { products: { id: number; name: string; stock: number }[] }) {
  return (
    <DialogForm trigger="طلب جديد" title="إضافة طلب" action={createOrder}>
      <Field label="اسم العميل">
        <input name="customer" required className={inputCls} />
      </Field>
      <Field label="المنتج">
        <select name="productId" required className={inputCls} defaultValue="">
          <option value="" disabled>اختر منتجاً</option>
          {products.map((p) => (
            <option key={p.id} value={p.id} disabled={p.stock === 0}>
              {p.name} ({p.stock === 0 ? "نفد" : `متوفر ${p.stock}`})
            </option>
          ))}
        </select>
      </Field>
      <Field label="الكمية">
        <input name="quantity" type="number" min="1" step="1" defaultValue="1" dir="ltr" className={inputCls} />
      </Field>
    </DialogForm>
  );
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [savedAt, setSavedAt] = useState(0);
  const { state, pending, formRef, onSubmit } = useFormAction(saveSettings, () => setSavedAt(Date.now()));

  useEffect(() => {
    if (!savedAt) return;
    const t = setTimeout(() => setSavedAt(0), 2500);
    return () => clearTimeout(t);
  }, [savedAt]);

  const card = "rounded-xl border border-border bg-surface p-5";

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid max-w-3xl gap-4">
      <div className={card}>
        <h2 className="mb-4 font-bold">معلومات الحساب</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الاسم">
            <input name="ownerName" defaultValue={settings.ownerName} className={inputCls} />
          </Field>
          <Field label="البريد الإلكتروني">
            <input name="ownerEmail" type="email" dir="ltr" defaultValue={settings.ownerEmail} className={inputCls} />
          </Field>
        </div>
      </div>

      <div className={card}>
        <h2 className="mb-4 font-bold">إعدادات المتجر</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم المتجر">
            <input name="storeName" defaultValue={settings.storeName} className={inputCls} />
          </Field>
          <Field label="العملة">
            <select name="currency" defaultValue={settings.currency} className={inputCls}>
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div className={card}>
        <h2 className="mb-4 font-bold">الإشعارات</h2>
        <div className="space-y-3">
          {([
            ["notifyEmail", "إشعارات البريد الإلكتروني"],
            ["notifyOrders", "تنبيه عند وصول طلب جديد"],
            ["notifyReports", "تقرير أسبوعي"],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center justify-between text-sm">
              <span>{label}</span>
              <input type="checkbox" name={key} defaultChecked={settings[key]} className="size-4 accent-[var(--primary)]" />
            </label>
          ))}
        </div>
      </div>

      <FormError state={state} />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </Button>
        {savedAt > 0 && (
          <span className="flex items-center gap-1 text-sm font-medium text-success">
            <Check className="size-4" />
            تم الحفظ
          </span>
        )}
      </div>
    </form>
  );
}

export function ChangePasswordForm() {
  const [done, setDone] = useState(false);
  const { state, pending, formRef, onSubmit } = useFormAction(changePassword, (form) => {
    form.reset();
    setDone(true);
  });

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        setDone(false);
        onSubmit(e);
      }}
      className="grid max-w-3xl gap-4 rounded-xl border border-border bg-surface p-5"
    >
      <h2 className="font-bold">تغيير كلمة المرور</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="كلمة المرور الحالية">
          <input name="current" type="password" autoComplete="current-password" required dir="ltr" className={inputCls} />
        </Field>
        <Field label="كلمة المرور الجديدة">
          <input name="next" type="password" autoComplete="new-password" minLength={8} required dir="ltr" className={inputCls} />
        </Field>
        <Field label="تأكيد كلمة المرور">
          <input name="confirm" type="password" autoComplete="new-password" minLength={8} required dir="ltr" className={inputCls} />
        </Field>
      </div>
      <FormError state={state} />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "جارٍ الحفظ..." : "تغيير كلمة المرور"}
        </Button>
        {done && (
          <span className="flex items-center gap-1 text-sm font-medium text-success">
            <Check className="size-4" />
            تم تغيير كلمة المرور، وتم تسجيل خروج الأجهزة الأخرى
          </span>
        )}
      </div>
    </form>
  );
}
