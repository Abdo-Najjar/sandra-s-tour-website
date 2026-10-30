import { Suspense } from "react";
import Link from "next/link";
import { CalendarCheck, DollarSign, Mail, Map as MapIcon, Receipt, ShoppingCart, Users, UsersRound } from "lucide-react";
import { bookingStatusLabels } from "@/lib/site/labels";
import { Card, ContentSkeleton, PageHeader, StatCard, StatusBadge } from "@/components/ui";
import { RevenueChart } from "@/components/revenue-chart";
import { formatMoney, formatNumber } from "@/lib/format";
import { requireUser } from "@/lib/auth";
import { getBookings, getDashboardStats, getMonthlyRevenue, getOrders, getSettings, getTopProducts, getWebsiteStats } from "@/lib/queries";

export default function OverviewPage() {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <OverviewContent />
    </Suspense>
  );
}

async function WebsiteOverview() {
  const [stats, latest] = await Promise.all([getWebsiteStats(), getBookings()]);
  const tiles = [
    { label: "حجوزات جديدة", value: stats.newBookings, href: "/admin/bookings?status=new", icon: CalendarCheck },
    { label: "رسائل غير مقروءة", value: stats.unreadMessages, href: "/admin/messages", icon: Mail },
    { label: "جولات منشورة", value: stats.tours, href: "/admin/tours", icon: MapIcon },
    { label: "مشتركو النشرة", value: stats.subscribers, href: "/admin/subscribers", icon: UsersRound },
  ];
  return (
    <div className="mb-8">
      <h2 className="mb-3 font-bold">الموقع</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">{t.label}</p>
                <p className="mt-2 text-2xl font-bold">{formatNumber(t.value)}</p>
              </div>
              <div className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
                <t.icon className="size-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      {latest.length > 0 && (
        <Card className="mt-4 p-0">
          <div className="flex items-center justify-between p-5 pb-3">
            <h3 className="font-bold">آخر الحجوزات</h3>
            <Link href="/admin/bookings" className="text-sm text-primary hover:underline">عرض الكل</Link>
          </div>
          <ul>
            {latest.slice(0, 5).map((b) => (
              <li key={b.id} className="flex flex-wrap items-center gap-3 border-t border-border px-5 py-3 text-sm">
                <span className="font-semibold" dir="auto">{b.name}</span>
                <span className="flex-1 truncate text-muted" dir="auto">{b.tourTitle || "رحلة مخصصة"}</span>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs">{bookingStatusLabels[b.status]}</span>
                <span className="text-xs text-muted" dir="ltr">{b.createdAt.slice(0, 10)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

async function OverviewContent() {
  const [me, stats, monthly, top, recent, settings] = await Promise.all([
    requireUser(),
    getDashboardStats(),
    getMonthlyRevenue(),
    getTopProducts(5),
    getOrders({ limit: 5 }),
    getSettings(),
  ]);
  const money = (v: number) => formatMoney(v, settings.currency);
  const maxSold = Math.max(1, ...top.map((p) => p.sold));
  const yearTotal = monthly.reduce((a, m) => a + m.value, 0);

  return (
    <>
      <PageHeader title={`مرحباً ${me.name.split(" ")[0]} 👋`} subtitle={`نظرة عامة على أداء ${settings.storeName} هذا الشهر`} />
      <WebsiteOverview />
      <h2 className="mb-3 font-bold">المتجر</h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="إيرادات هذا الشهر" value={money(stats.revenue)} change={stats.revenueChange} icon={DollarSign} />
        <StatCard label="طلبات هذا الشهر" value={formatNumber(stats.orders)} change={stats.ordersChange} icon={ShoppingCart} />
        <StatCard label="متوسط قيمة الطلب" value={money(stats.avgOrder)} change={stats.avgOrderChange} icon={Receipt} />
        <StatCard
          label="المستخدمون"
          value={formatNumber(stats.users)}
          note={`${formatNumber(stats.activeUsers)} نشط`}
          icon={Users}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold">الإيرادات الشهرية</h2>
              <p className="text-xs text-muted">آخر 12 شهراً (بدون الطلبات الملغاة)</p>
            </div>
            <span className="text-lg font-bold text-primary">{money(yearTotal)}</span>
          </div>
          <RevenueChart data={monthly} currency={settings.currency} />
        </Card>

        <Card>
          <h2 className="mb-4 font-bold">الأكثر مبيعاً</h2>
          <ul className="space-y-4">
            {top.map((p) => (
              <li key={p.id}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted">{formatNumber(p.sold)} مبيع</span>
                </div>
                <div className="h-2 rounded-full bg-surface-2">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${(p.sold / maxSold) * 100}%` }} />
                </div>
              </li>
            ))}
            {top.length === 0 && <li className="text-sm text-muted">لا توجد منتجات بعد</li>}
          </ul>
        </Card>
      </div>

      <Card className="mt-4 overflow-hidden p-0">
        <div className="flex items-center justify-between p-5">
          <h2 className="font-bold">أحدث الطلبات</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">
            عرض الكل
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-muted">
              <tr>
                <th className="px-5 py-3 text-right font-medium">رقم الطلب</th>
                <th className="px-5 py-3 text-right font-medium">العميل</th>
                <th className="px-5 py-3 text-right font-medium">المنتج</th>
                <th className="px-5 py-3 text-right font-medium">المبلغ</th>
                <th className="px-5 py-3 text-right font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium" dir="ltr">#{o.id}</td>
                  <td className="px-5 py-3">{o.customer}</td>
                  <td className="px-5 py-3 text-muted">{o.product}</td>
                  <td className="px-5 py-3 font-semibold">{money(o.amount)}</td>
                  <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
