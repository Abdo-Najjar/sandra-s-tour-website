import "server-only";
import { connection } from "next/server";
import { requireUser } from "@/lib/auth";
import { and, count, desc, eq, gte, lt, ne, sql, sum } from "drizzle-orm";
import { db, orders, products, settings, users, type OrderStatus } from "@/db";

// Every query checks the session first (the Data Access Layer pattern).
// connection() marks them as per-request so reading the clock and the DB is allowed.
async function guard() {
  await connection();
  return requireUser();
}

export async function getSettings() {
  await guard();
  const row = await db.query.settings.findFirst({ where: eq(settings.id, 1) });
  return (
    row ?? {
      id: 1,
      ownerName: "المدير",
      ownerEmail: "",
      storeName: "متجري",
      currency: "USD",
      notifyEmail: true,
      notifyOrders: true,
      notifyReports: false,
    }
  );
}

function monthStart(offset = 0) {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1));
  return d.toISOString().slice(0, 19).replace("T", " ");
}

function pctChange(current: number, previous: number) {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

async function monthTotals(from: string, to?: string) {
  const [row] = await db
    .select({ revenue: sum(orders.amount), orders: count() })
    .from(orders)
    .where(and(ne(orders.status, "cancelled"), gte(orders.createdAt, from), to ? lt(orders.createdAt, to) : undefined));
  return { revenue: Number(row.revenue ?? 0), orders: row.orders };
}

export async function getDashboardStats() {
  await guard();
  const thisMonth = await monthTotals(monthStart(0));
  const lastMonth = await monthTotals(monthStart(-1), monthStart(0));
  const [userRow] = await db
    .select({ total: count(), active: sum(sql<number>`${users.active}`) })
    .from(users);

  const aov = thisMonth.orders ? thisMonth.revenue / thisMonth.orders : 0;
  const lastAov = lastMonth.orders ? lastMonth.revenue / lastMonth.orders : 0;

  return {
    revenue: thisMonth.revenue,
    revenueChange: pctChange(thisMonth.revenue, lastMonth.revenue),
    orders: thisMonth.orders,
    ordersChange: pctChange(thisMonth.orders, lastMonth.orders),
    users: userRow.total,
    activeUsers: Number(userRow.active ?? 0),
    avgOrder: aov,
    avgOrderChange: pctChange(aov, lastAov),
  };
}

export async function getMonthlyRevenue() {
  await guard();
  const month = sql<string>`strftime('%Y-%m', ${orders.createdAt})`;
  const rows = await db
    .select({ month, value: sum(orders.amount) })
    .from(orders)
    .where(and(ne(orders.status, "cancelled"), gte(orders.createdAt, monthStart(-11))))
    .groupBy(month);

  const byMonth = new Map(rows.map((r) => [r.month, Number(r.value ?? 0)]));
  const label = new Intl.DateTimeFormat("ar", { month: "long", timeZone: "UTC" });
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(monthStart(i - 11).replace(" ", "T") + "Z");
    const key = d.toISOString().slice(0, 7);
    return { month: label.format(d), value: byMonth.get(key) ?? 0 };
  });
}

export async function getTopProducts(limit = 5) {
  await guard();
  const sold = sql<number>`coalesce(sum(${orders.quantity}), 0)`;
  return db
    .select({ id: products.id, name: products.name, sold })
    .from(products)
    .leftJoin(orders, and(eq(orders.productId, products.id), ne(orders.status, "cancelled")))
    .groupBy(products.id)
    .orderBy(desc(sold))
    .limit(limit);
}

export async function getOrders({ status, limit }: { status?: OrderStatus; limit?: number } = {}) {
  await guard();
  const q = db
    .select({
      id: orders.id,
      customer: orders.customer,
      product: products.name,
      quantity: orders.quantity,
      amount: orders.amount,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .innerJoin(products, eq(orders.productId, products.id))
    .where(status ? eq(orders.status, status) : undefined)
    .orderBy(desc(orders.createdAt), desc(orders.id));
  return limit ? q.limit(limit) : q;
}

export async function getOrderCounts() {
  await guard();
  const rows = await db.select({ status: orders.status, n: count() }).from(orders).groupBy(orders.status);
  const counts = { all: 0, completed: 0, processing: 0, cancelled: 0 };
  for (const r of rows) {
    counts[r.status] = r.n;
    counts.all += r.n;
  }
  return counts;
}

export async function getUsers() {
  await guard();
  // Never select passwordHash: this list is sent to the browser.
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      active: users.active,
      createdAt: users.createdAt,
      canLogin: sql<boolean>`${users.passwordHash} is not null`.mapWith(Boolean),
    })
    .from(users)
    .orderBy(desc(users.id));
}

export type UserRow = Awaited<ReturnType<typeof getUsers>>[number];

export async function getProducts() {
  await guard();
  const sold = sql<number>`coalesce(sum(${orders.quantity}), 0)`;
  return db
    .select({
      id: products.id,
      name: products.name,
      category: products.category,
      price: products.price,
      stock: products.stock,
      sold,
    })
    .from(products)
    .leftJoin(orders, and(eq(orders.productId, products.id), ne(orders.status, "cancelled")))
    .groupBy(products.id)
    .orderBy(desc(products.id));
}
