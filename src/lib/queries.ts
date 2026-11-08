import "server-only";
import { connection } from "next/server";
import { requireUser } from "@/lib/auth";
import { asc, count, desc, eq, sql } from "drizzle-orm";
import { bookings, db, messages, pages, posts, site, subscribers, tours, users, type BookingStatus, type MessageKind } from "@/db";
import { SITE_ROW_ID, siteData } from "@/lib/site/content";
import type { Lang } from "@/lib/site/i18n";
import { emptyTourDetails, tourDetailsTr } from "@/lib/site/tour";
import { trText } from "@/lib/site/translatable";

// Every query checks the session first (the Data Access Layer pattern).
// connection() marks them as per-request so reading the clock and the DB is allowed.
async function guard() {
  await connection();
  return requireUser();
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

// ---------- Website (dashboard side, always fresh) ----------

export async function getSiteContent(lang: Lang = "en") {
  await guard();
  const row = await db.query.site.findFirst({ where: eq(site.id, SITE_ROW_ID) });
  return siteData(row?.data, lang);
}

export async function getAdminTours() {
  await guard();
  const bookingsCount = sql<number>`(select count(*) from ${bookings} where ${bookings.tourId} = ${tours.id})`;
  return db
    .select({
      id: tours.id,
      slug: tours.slug,
      title: tours.title,
      image: tours.image,
      price: tours.price,
      durationDays: tours.durationDays,
      featured: tours.featured,
      published: tours.published,
      sortOrder: tours.sortOrder,
      bookings: bookingsCount,
    })
    .from(tours)
    .orderBy(asc(tours.sortOrder), asc(tours.id));
}

export async function getAdminTour(id: number) {
  await guard();
  const row = await db.query.tours.findFirst({ where: eq(tours.id, id) });
  if (!row) return null;
  const title = trText(row.title);
  const summary = trText(row.summary);
  const details = tourDetailsTr(row.details);
  // English in the usual fields, Arabic under `ar` (empty fields = use English).
  return {
    ...row,
    title: title.en,
    summary: summary.en,
    details: details.en,
    ar: { title: title.ar, summary: summary.ar, details: { ...emptyTourDetails, ...details.ar } },
  };
}
export type AdminTour = NonNullable<Awaited<ReturnType<typeof getAdminTour>>>;

export async function getAdminPosts() {
  await guard();
  return db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      category: posts.category,
      cover: posts.cover,
      author: posts.author,
      publishedAt: posts.publishedAt,
      featured: posts.featured,
      published: posts.published,
    })
    .from(posts)
    .orderBy(desc(posts.publishedAt), desc(posts.id));
}

export async function getAdminPost(id: number) {
  await guard();
  const row = await db.query.posts.findFirst({ where: eq(posts.id, id) });
  return row ? splitLangs(row, ["title", "category", "excerpt", "author", "tags", "body"] as const) : null;
}
export type AdminPost = NonNullable<Awaited<ReturnType<typeof getAdminPost>>>;

export async function getBookings(status?: BookingStatus) {
  await guard();
  return db
    .select()
    .from(bookings)
    .where(status ? eq(bookings.status, status) : undefined)
    .orderBy(desc(bookings.createdAt), desc(bookings.id));
}

export async function getBookingCounts() {
  await guard();
  const rows = await db.select({ status: bookings.status, n: count() }).from(bookings).groupBy(bookings.status);
  const counts = { all: 0, new: 0, contacted: 0, confirmed: 0, cancelled: 0 };
  for (const r of rows) {
    counts[r.status] = r.n;
    counts.all += r.n;
  }
  return counts;
}

export async function getMessages(kind?: MessageKind) {
  await guard();
  return db
    .select()
    .from(messages)
    .where(kind ? eq(messages.kind, kind) : undefined)
    .orderBy(desc(messages.createdAt), desc(messages.id));
}

export async function getSubscribers() {
  await guard();
  return db.select().from(subscribers).orderBy(desc(subscribers.createdAt), desc(subscribers.id));
}

// Badge numbers for the sidebar.
export async function getInboxCounts() {
  await guard();
  const [[b], [m]] = await Promise.all([
    db.select({ n: count() }).from(bookings).where(eq(bookings.status, "new")),
    db.select({ n: count() }).from(messages).where(eq(messages.read, false)),
  ]);
  return { bookings: b.n, messages: m.n };
}

export async function getWebsiteStats() {
  await guard();
  const [[t], [p], [s], counts] = await Promise.all([
    db.select({ n: count() }).from(tours).where(eq(tours.published, true)),
    db.select({ n: count() }).from(posts).where(eq(posts.published, true)),
    db.select({ n: count() }).from(subscribers),
    getInboxCounts(),
  ]);
  return { tours: t.n, posts: p.n, subscribers: s.n, newBookings: counts.bookings, unreadMessages: counts.messages };
}

export async function getAdminPages() {
  await guard();
  return db.select().from(pages).orderBy(asc(pages.sortOrder), asc(pages.id));
}

export async function getAdminPage(id: number) {
  await guard();
  const row = await db.query.pages.findFirst({ where: eq(pages.id, id) });
  return row ? splitLangs(row, ["title", "subtitle", "body"] as const) : null;
}
export type AdminPage = NonNullable<Awaited<ReturnType<typeof getAdminPage>>>;

// For the edit forms: English in the usual fields, Arabic under `ar`.
function splitLangs<T extends Record<string, unknown>, K extends keyof T & string>(row: T, keys: readonly K[]) {
  const en = {} as Record<K, string>;
  const ar = {} as Record<K, string>;
  for (const k of keys) {
    const v = trText(row[k]);
    en[k] = v.en;
    ar[k] = v.ar;
  }
  return { ...row, ...en, ar } as Omit<T, K> & Record<K, string> & { ar: Record<K, string> };
}
