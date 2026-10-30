import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "تسجيل الدخول" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="grid size-12 place-items-center rounded-xl bg-primary text-2xl font-bold text-white">س</div>
          <div>
            <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
            <p className="mt-1 text-sm text-muted">ادخل إلى لوحة التحكم</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <Suspense fallback={<LoginForm next="" />}>
            <LoginFormWithNext searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

async function LoginFormWithNext({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { next } = await searchParams;
  return <LoginForm next={typeof next === "string" ? next : ""} />;
}
