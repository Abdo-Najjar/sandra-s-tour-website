"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui";
import {
  changePassword,
  createUser,
  type ActionState,
} from "@/lib/actions";
import { roleLabel } from "@/lib/format";
import { USER_ROLES } from "@/db/schema";
import { useT } from "@/components/admin/admin-lang";

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

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
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
  const t = useT();
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
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label={t("Close", "إغلاق")} className="text-muted">
              <X className="size-5" />
            </button>
          </div>
          {children}
          <FormError state={state} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => dialogRef.current?.close()}>
              {t("Cancel", "إلغاء")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("Saving…", "جارٍ الحفظ...") : t("Save", "حفظ")}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export function NewUserButton() {
  const t = useT();
  return (
    <DialogForm trigger={t("New user", "مستخدم جديد")} title={t("Add a user", "إضافة مستخدم")} action={createUser}>
      <Field label={t("Name", "الاسم")}>
        <input name="name" required className={inputCls} />
      </Field>
      <Field label={t("Email", "البريد الإلكتروني")}>
        <input name="email" type="email" required dir="ltr" className={inputCls} />
      </Field>
      <Field label={t("Role", "الدور")}>
        <select name="role" defaultValue="user" className={inputCls}>
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>{roleLabel(role, t)}</option>
          ))}
        </select>
      </Field>
      <Field label={t("Password (needed for admins and editors)", "كلمة المرور (مطلوبة للمدير والمحرر)")}>
        <input name="password" type="password" autoComplete="new-password" minLength={8} dir="ltr" className={inputCls} />
      </Field>
    </DialogForm>
  );
}

export function ChangePasswordForm() {
  const t = useT();
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
      <h2 className="font-bold">{t("Change password", "تغيير كلمة المرور")}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={t("Current password", "كلمة المرور الحالية")}>
          <input name="current" type="password" autoComplete="current-password" required dir="ltr" className={inputCls} />
        </Field>
        <Field label={t("New password", "كلمة المرور الجديدة")}>
          <input name="next" type="password" autoComplete="new-password" minLength={8} required dir="ltr" className={inputCls} />
        </Field>
        <Field label={t("Confirm password", "تأكيد كلمة المرور")}>
          <input name="confirm" type="password" autoComplete="new-password" minLength={8} required dir="ltr" className={inputCls} />
        </Field>
      </div>
      <FormError state={state} />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? t("Saving…", "جارٍ الحفظ...") : t("Change password", "تغيير كلمة المرور")}
        </Button>
        {done && (
          <span className="flex items-center gap-1 text-sm font-medium text-success">
            <Check className="size-4" />
            {t("Password changed. Other devices were signed out.", "تم تغيير كلمة المرور، وتم تسجيل خروج الأجهزة الأخرى")}
          </span>
        )}
      </div>
    </form>
  );
}
