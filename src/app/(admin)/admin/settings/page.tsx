import { Suspense } from "react";
import { ContentSkeleton, PageHeader } from "@/components/ui";
import { ChangePasswordForm, SettingsForm } from "@/components/forms";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/queries";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="الإعدادات" subtitle="إدارة معلومات الحساب والمتجر" />
      <Suspense fallback={<ContentSkeleton />}>
        <SettingsContent />
      </Suspense>
    </>
  );
}

async function SettingsContent() {
  const [me, settings] = await Promise.all([requireUser(), getSettings()]);

  return (
    <div className="grid gap-4">
      {me.role === "admin" ? (
        <SettingsForm settings={settings} />
      ) : (
        <p className="max-w-3xl rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning">
          إعدادات المتجر متاحة للمدير فقط.
        </p>
      )}
      <ChangePasswordForm />
    </div>
  );
}
