import { Suspense } from "react";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { ChangePasswordForm } from "@/components/forms";
import { requireUser } from "@/lib/auth";
import { roleLabel } from "@/lib/format";
import { getT } from "@/lib/admin/lang";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const t = await getT();
  return (
    <>
      <PageHeader title={t("Settings", "الإعدادات")} subtitle={t("Your account and password", "معلومات حسابك وكلمة المرور")} />
      <Suspense fallback={<ContentSkeleton />}>
        <SettingsContent />
      </Suspense>
    </>
  );
}

async function SettingsContent() {
  const [me, t] = await Promise.all([requireUser(), getT()]);
  return (
    <div className="grid max-w-3xl gap-4">
      <Card>
        <h2 className="mb-4 font-bold">{t("My account", "حسابي")}</h2>
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">{t("Name", "الاسم")}</dt>
            <dd className="mt-1 font-semibold">{me.name}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted">{t("Email", "البريد الإلكتروني")}</dt>
            <dd className="mt-1 font-semibold break-all" dir="ltr">{me.email}</dd>
          </div>
          <div>
            <dt className="text-muted">{t("Role", "الصلاحية")}</dt>
            <dd className="mt-1 font-semibold">{roleLabel(me.role, t)}</dd>
          </div>
        </dl>
      </Card>
      <ChangePasswordForm />
    </div>
  );
}
