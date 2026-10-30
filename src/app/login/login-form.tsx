"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { login } from "@/lib/actions";

const inputCls =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-primary";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">البريد الإلكتروني</span>
        <input name="email" type="email" autoComplete="email" required dir="ltr" className={inputCls} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">كلمة المرور</span>
        <input name="password" type="password" autoComplete="current-password" required dir="ltr" className={inputCls} />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        <LogIn className="size-4" />
        {pending ? "جارٍ الدخول..." : "دخول"}
      </button>
    </form>
  );
}
