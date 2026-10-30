import { Suspense } from "react";
import Link from "next/link";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { NewOrderButton } from "@/components/forms";
import { OrderStatusSelect } from "@/components/row-actions";
import { ORDER_STATUSES, type OrderStatus } from "@/db/schema";
import { formatDate, formatMoney, formatNumber, statusLabels } from "@/lib/format";
import { getOrderCounts, getOrders, getProducts, getSettings } from "@/lib/queries";

export default function OrdersPage({ searchParams }: PageProps<"/orders">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <OrdersContent searchParams={searchParams} />
    </Suspense>
  );
}

async function OrdersContent({ searchParams }: Pick<PageProps<"/orders">, "searchParams">) {
  const { status: raw } = await searchParams;
  const status = ORDER_STATUSES.includes(raw as OrderStatus) ? (raw as OrderStatus) : undefined;

  const [list, counts, products, settings] = await Promise.all([
    getOrders({ status }),
    getOrderCounts(),
    getProducts(),
    getSettings(),
  ]);

  const tabs = [
    { key: undefined, label: "الكل", count: counts.all },
    ...ORDER_STATUSES.map((s) => ({ key: s, label: statusLabels[s], count: counts[s] })),
  ];

  return (
    <>
      <PageHeader
        title="الطلبات"
        subtitle={`${formatNumber(counts.all)} طلب في المجموع`}
        action={<NewOrderButton products={products} />}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.key ? `/orders?status=${t.key}` : "/orders"}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === t.key ? "bg-primary text-white" : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            {t.label} ({formatNumber(t.count)})
          </Link>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-muted">
              <tr>
                <th className="px-5 py-3 text-right font-medium">رقم الطلب</th>
                <th className="px-5 py-3 text-right font-medium">العميل</th>
                <th className="px-5 py-3 text-right font-medium">المنتج</th>
                <th className="px-5 py-3 text-right font-medium">الكمية</th>
                <th className="px-5 py-3 text-right font-medium">التاريخ</th>
                <th className="px-5 py-3 text-right font-medium">المبلغ</th>
                <th className="px-5 py-3 text-right font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id} className="border-t border-border hover:bg-surface-2/50">
                  <td className="px-5 py-3 font-medium" dir="ltr">#{o.id}</td>
                  <td className="px-5 py-3">{o.customer}</td>
                  <td className="px-5 py-3 text-muted">{o.product}</td>
                  <td className="px-5 py-3">{o.quantity}</td>
                  <td className="px-5 py-3 text-muted" dir="ltr">{formatDate(o.createdAt)}</td>
                  <td className="px-5 py-3 font-semibold">{formatMoney(o.amount, settings.currency)}</td>
                  <td className="px-5 py-3">
                    <OrderStatusSelect key={`${o.id}-${o.status}`} id={o.id} status={o.status} />
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted">لا توجد طلبات</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
