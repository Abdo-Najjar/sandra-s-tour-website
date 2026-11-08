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
      <PageHeader title={t("Settings")} subtitle={t("Your account and password")} />
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
        <h2 className="mb-4 font-bold">{t("My account")}</h2>
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">{t("Name")}</dt>
            <dd className="mt-1 font-semibold">{me.name}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted">{t("Email")}</dt>
            <dd className="mt-1 font-semibold break-all" dir="ltr">{me.email}</dd>
          </div>
          <div>
            <dt className="text-muted">{t("Role")}</dt>
            <dd className="mt-1 font-semibold">{roleLabel(me.role, t)}</dd>
          </div>
        </dl>
      </Card>
      <ChangePasswordForm />
    </div>
  );
}
