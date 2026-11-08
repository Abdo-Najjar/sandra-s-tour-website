import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { AdminLangProvider, AdminLangSwitch } from "@/components/admin/admin-lang";
import { getAdminLang } from "@/lib/admin/lang";
import { makeT } from "@/lib/admin/i18n";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <LoginScreen searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginScreen({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const lang = await getAdminLang();
  const t = makeT(lang);
  return (
    <AdminLangProvider lang={lang}>
      <main className="relative grid min-h-screen place-items-center p-4">
        <AdminLangSwitch className="absolute end-4 top-4" />
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/site/logo.png" alt="" className="size-16 rounded-full border border-accent/40 bg-white object-contain p-1" />
            <div>
              <h1 className="text-2xl font-bold">{t("Sign in", "تسجيل الدخول")}</h1>
              <p className="mt-1 text-sm text-muted">{t("Syria Guide Tours dashboard", "لوحة تحكم Syria Guide Tours")}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <LoginFormWithNext searchParams={searchParams} />
          </div>
        </div>
      </main>
    </AdminLangProvider>
  );
}

async function LoginFormWithNext({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { next } = await searchParams;
  return <LoginForm next={typeof next === "string" ? next : ""} />;
}
