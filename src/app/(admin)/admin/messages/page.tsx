import { Suspense } from "react";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { MessageActions } from "@/components/admin/site-forms";
import { MESSAGE_KINDS, type MessageKind } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getMessages } from "@/lib/queries";
import { getT } from "@/lib/admin/lang";
import type { T } from "@/lib/admin/i18n";
import { whatsappLink } from "@/lib/site/shape";

export const metadata = { title: "Messages & partners" };

const kindLabel = (k: MessageKind, t: T) => (k === "partnership" ? t("Partnership request") : t("Message"));

export default async function MessagesPage(props: PageProps<"/admin/messages">) {
  const t = await getT();
  return (
    <>
      <PageHeader
        title={t("Messages & partners")}
        subtitle={t("Visitor messages and partnership requests from guides and hotels")}
      />
      <Suspense fallback={<ContentSkeleton />}>
        <MessagesContent {...props} />
      </Suspense>
    </>
  );
}

async function MessagesContent({ searchParams }: PageProps<"/admin/messages">) {
  const raw = (await searchParams).kind;
  const kind = MESSAGE_KINDS.includes(raw as MessageKind) ? (raw as MessageKind) : undefined;
  const [me, list, t] = await Promise.all([requireUser(), getMessages(kind), getT()]);
  const tabs: [string, string][] = [["", t("All")], ...MESSAGE_KINDS.map((k): [string, string] => [k, kindLabel(k, t)])];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <Link
            key={key}
            href={key ? `/admin/messages?kind=${key}` : "/admin/messages"}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              (kind ?? "") === key ? "bg-primary text-white" : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {list.length === 0 && <Card className="py-12 text-center text-muted">{t("No messages.")}</Card>}

      <div className="grid gap-3">
        {list.map((m) => (
          <Card key={m.id} className={m.read ? "" : "border-primary"}>
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {!m.read && <span className="size-2 rounded-full bg-primary" aria-label={t("Unread")} />}
                  <h2 className="font-bold" dir="auto">{m.name}</h2>
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">{kindLabel(m.kind, t)}</span>
                </div>
                <div className="mt-1 text-sm text-muted" dir="auto">
                  {[m.category, m.location].filter(Boolean).join(" · ")}
                </div>
              </div>
              <span className="text-xs text-muted" dir="ltr">{formatDate(m.createdAt)}</span>
              <MessageActions key={String(m.read)} id={m.id} read={m.read} canDelete={me.role === "admin"} />
            </div>
            <p className="mt-3 rounded-lg bg-surface-2 p-3 text-sm whitespace-pre-line" dir="auto">
              {m.body}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {m.phone && (
                <a
                  href={whatsappLink(m.phone)}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-success-soft px-3 py-1.5 font-medium text-success"
                  dir="ltr"
                >
                  <MessageCircle className="size-4" /> {m.phone}
                </a>
              )}
              {m.email && (
                <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5" dir="ltr">
                  <Mail className="size-4" /> {m.email}
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
