import { Suspense } from "react";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { CopyEmailsButton, DeleteSubscriberButton } from "@/components/admin/site-forms";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getSubscribers } from "@/lib/queries";
import { getT } from "@/lib/admin/lang";

export const metadata = { title: "Subscribers" };

export default function SubscribersPage() {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <SubscribersContent />
    </Suspense>
  );
}

async function SubscribersContent() {
  const [me, list, t] = await Promise.all([requireUser(), getSubscribers(), getT()]);
  return (
    <>
      <PageHeader
        title={t("Subscribers")}
        subtitle={t("{n} newsletter subscribers", { n: list.length })}
        action={list.length > 0 && <CopyEmailsButton emails={list.map((s) => s.email)} />}
      />
      {list.length === 0 ? (
        <Card className="py-12 text-center text-muted">{t("No subscribers yet.")}</Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <table className="rtable w-full text-sm">
            <thead className="bg-surface-2 text-muted">
              <tr>
                <th className="px-5 py-3 text-start font-medium">{t("Email")}</th>
                <th className="px-5 py-3 text-start font-medium">{t("Subscribed")}</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-5 py-3">
                    <a dir="ltr" href={`mailto:${s.email}`} className="hover:text-primary">
                      {s.email}
                    </a>
                  </td>
                  <td data-label={t("Subscribed")} className="px-5 py-3 text-muted">
                    <span dir="ltr">{formatDate(s.createdAt)}</span>
                  </td>
                  <td className="rtable-end px-5 py-3 text-end">{me.role === "admin" && <DeleteSubscriberButton id={s.id} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
