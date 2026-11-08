import { Suspense } from "react";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { ChangePasswordForm } from "@/components/forms";
import { requireUser } from "@/lib/auth";
import { roleLabels } from "@/lib/format";

export const metadata = { title: "الإعدادات" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="الإعدادات" subtitle="معلومات حسابك وكلمة المرور" />
      <Suspense fallback={<ContentSkeleton />}>
        <SettingsContent />
      </Suspense>
    </>
  );
}

async function SettingsContent() {
  const me = await requireUser();
  return (
    <div className="grid max-w-3xl gap-4">
      <Card>
        <h2 className="mb-4 font-bold">حسابي</h2>
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">الاسم</dt>
            <dd className="mt-1 font-semibold">{me.name}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted">البريد الإلكتروني</dt>
            <dd className="mt-1 font-semibold break-all" dir="ltr">{me.email}</dd>
          </div>
          <div>
            <dt className="text-muted">الصلاحية</dt>
            <dd className="mt-1 font-semibold">{roleLabels[me.role]}</dd>
          </div>
        </dl>
      </Card>
      <ChangePasswordForm />
    </div>
  );
}
