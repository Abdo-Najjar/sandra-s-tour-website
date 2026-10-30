"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne, sql } from "drizzle-orm";
import {
  bookings,
  db,
  messages,
  pages,
  posts,
  site,
  subscribers,
  tours,
  BOOKING_STATUSES,
  type BookingStatus,
} from "@/db";
import { authorize } from "@/lib/auth";
import type { ActionState } from "@/lib/actions";
import { defaultSiteContent, withDefaults, type SiteSection } from "./content";
import { TAGS } from "./data";
import { conform, slugify } from "./shape";
import { tourDetails } from "./tour";

// Dashboard actions for the public website. Admins and editors may use all
// of them. Each change expires the matching public cache tag so the website
// shows it right away.

const NO_PERMISSION = "ليس لديك صلاحية لهذا الإجراء";
const str = (fd: FormData, key: string, max = 500) => String(fd.get(key) ?? "").trim().slice(0, max);
const bool = (fd: FormData, key: string) => fd.get(key) === "on" || fd.get(key) === "true";
const num = (fd: FormData, key: string) => {
  const n = Number(fd.get(key));
  return Number.isFinite(n) ? n : NaN;
};

function parseJson(raw: FormDataEntryValue | null): unknown {
  try {
    return JSON.parse(String(raw ?? ""));
  } catch {
    return undefined;
  }
}

async function uniqueSlug(table: typeof tours | typeof posts | typeof pages, wanted: string, id?: number) {
  const base = slugify(wanted) || "item";
  for (let i = 0; i < 50; i++) {
    const slug = i ? `${base}-${i + 1}` : base;
    const clash = await db
      .select({ id: table.id })
      .from(table)
      .where(id ? and(eq(table.slug, slug), ne(table.id, id)) : eq(table.slug, slug))
      .limit(1);
    if (!clash.length) return slug;
  }
  return `${base}-${Date.now()}`;
}

// ---------- Site content ----------

export async function saveSiteSection(section: SiteSection, _: ActionState, fd: FormData): Promise<ActionState> {
  if (!(await authorize())) return { error: NO_PERMISSION };
  if (!(section in defaultSiteContent)) return { error: "قسم غير معروف" };

  const value = parseJson(fd.get("data"));
  if (value === undefined) return { error: "تعذر قراءة البيانات" };

  const row = await db.query.site.findFirst({ where: eq(site.id, 1) });
  const current = withDefaults(row?.data);
  const next = { ...current, [section]: conform(value, defaultSiteContent[section]) };

  await db
    .insert(site)
    .values({ id: 1, data: next })
    .onConflictDoUpdate({ target: site.id, set: { data: next, updatedAt: sql`(datetime('now'))` } });
  updateTag(TAGS.site);
  return { ok: true };
}

export async function resetSiteSection(section: SiteSection) {
  if (!(await authorize(["admin"]))) return;
  if (!(section in defaultSiteContent)) return;
  const row = await db.query.site.findFirst({ where: eq(site.id, 1) });
  const next = { ...withDefaults(row?.data), [section]: defaultSiteContent[section] };
  await db
    .insert(site)
    .values({ id: 1, data: next })
    .onConflictDoUpdate({ target: site.id, set: { data: next, updatedAt: sql`(datetime('now'))` } });
  updateTag(TAGS.site);
  refresh();
}

// ---------- Tours ----------

export async function saveTour(id: number | null, _: ActionState, fd: FormData): Promise<ActionState> {
  if (!(await authorize())) return { error: NO_PERMISSION };

  const title = str(fd, "title", 200);
  const price = num(fd, "price");
  const durationDays = num(fd, "durationDays");
  if (!title) return { error: "اكتب اسم الجولة" };
  if (!(price >= 0)) return { error: "السعر غير صحيح" };
  if (!Number.isInteger(durationDays) || durationDays < 1 || durationDays > 365) return { error: "عدد الأيام يجب أن يكون بين 1 و 365" };

  const details = parseJson(fd.get("details"));
  const values = {
    title,
    titleAr: str(fd, "titleAr", 200),
    slug: await uniqueSlug(tours, str(fd, "slug", 100) || title, id ?? undefined),
    category: str(fd, "category", 50),
    region: str(fd, "region", 50),
    image: str(fd, "image", 500),
    price,
    durationDays,
    summary: str(fd, "summary", 2000),
    details: tourDetails(details),
    featured: bool(fd, "featured"),
    published: bool(fd, "published"),
    sortOrder: Number.isInteger(num(fd, "sortOrder")) ? num(fd, "sortOrder") : 0,
  };

  if (id) {
    await db.update(tours).set({ ...values, updatedAt: sql`(datetime('now'))` }).where(eq(tours.id, id));
  } else {
    const [row] = await db.insert(tours).values(values).returning({ id: tours.id });
    id = row.id;
  }
  updateTag(TAGS.tours);
  redirect(`/admin/tours/${id}?saved=1`);
}

export async function toggleTour(id: number, field: "featured" | "published") {
  if (!(await authorize())) return;
  await db
    .update(tours)
    .set({ [field]: sql`not ${tours[field]}` })
    .where(eq(tours.id, id));
  updateTag(TAGS.tours);
  refresh();
}

export async function deleteTour(id: number) {
  if (!(await authorize())) return;
  await db.delete(tours).where(eq(tours.id, id));
  updateTag(TAGS.tours);
  refresh();
}

// ---------- Blog ----------

export async function savePost(id: number | null, _: ActionState, fd: FormData): Promise<ActionState> {
  if (!(await authorize())) return { error: NO_PERMISSION };

  const title = str(fd, "title", 300);
  if (!title) return { error: "اكتب عنوان المقال" };
  const date = str(fd, "publishedAt", 10);

  const values = {
    title,
    slug: await uniqueSlug(posts, str(fd, "slug", 100) || title, id ?? undefined),
    kickerAr: str(fd, "kickerAr", 120),
    category: str(fd, "category", 120),
    excerpt: str(fd, "excerpt", 1000),
    cover: str(fd, "cover", 500),
    author: str(fd, "author", 200),
    readMinutes: Math.max(1, Math.min(120, Math.round(num(fd, "readMinutes")) || 5)),
    tags: str(fd, "tags", 300),
    body: str(fd, "body", 100_000),
    publishedAt: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().slice(0, 10),
    featured: bool(fd, "featured"),
    published: bool(fd, "published"),
  };

  if (id) {
    await db.update(posts).set({ ...values, updatedAt: sql`(datetime('now'))` }).where(eq(posts.id, id));
  } else {
    const [row] = await db.insert(posts).values(values).returning({ id: posts.id });
    id = row.id;
  }
  // Only one featured article at a time.
  if (values.featured) await db.update(posts).set({ featured: false }).where(ne(posts.id, id));
  updateTag(TAGS.posts);
  redirect(`/admin/blog/${id}?saved=1`);
}

export async function togglePostPublished(id: number) {
  if (!(await authorize())) return;
  await db.update(posts).set({ published: sql`not ${posts.published}` }).where(eq(posts.id, id));
  updateTag(TAGS.posts);
  refresh();
}

export async function deletePost(id: number) {
  if (!(await authorize())) return;
  await db.delete(posts).where(eq(posts.id, id));
  updateTag(TAGS.posts);
  refresh();
}

// ---------- Extra pages ----------

export async function savePage(id: number | null, _: ActionState, fd: FormData): Promise<ActionState> {
  if (!(await authorize())) return { error: NO_PERMISSION };

  const title = str(fd, "title", 200);
  if (!title) return { error: "اكتب عنوان الصفحة" };
  const values = {
    title,
    slug: await uniqueSlug(pages, str(fd, "slug", 100) || title, id ?? undefined),
    subtitle: str(fd, "subtitle", 300),
    image: str(fd, "image", 500),
    body: str(fd, "body", 100_000),
    published: bool(fd, "published"),
    showInMenu: bool(fd, "showInMenu"),
    sortOrder: Number.isInteger(num(fd, "sortOrder")) ? num(fd, "sortOrder") : 0,
  };

  if (id) {
    await db.update(pages).set({ ...values, updatedAt: sql`(datetime('now'))` }).where(eq(pages.id, id));
  } else {
    const [row] = await db.insert(pages).values(values).returning({ id: pages.id });
    id = row.id;
  }
  updateTag(TAGS.pages);
  redirect(`/admin/pages/${id}?saved=1`);
}

export async function deletePage(id: number) {
  if (!(await authorize())) return;
  await db.delete(pages).where(eq(pages.id, id));
  updateTag(TAGS.pages);
  refresh();
}

// ---------- Bookings, messages, subscribers ----------

export async function setBookingStatus(id: number, status: BookingStatus) {
  if (!(await authorize())) return;
  if (!BOOKING_STATUSES.includes(status)) return;
  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
  refresh();
}

export async function deleteBooking(id: number) {
  if (!(await authorize(["admin"]))) return;
  await db.delete(bookings).where(eq(bookings.id, id));
  refresh();
}

export async function setMessageRead(id: number, read: boolean) {
  if (!(await authorize())) return;
  await db.update(messages).set({ read }).where(eq(messages.id, id));
  refresh();
}

export async function deleteMessage(id: number) {
  if (!(await authorize(["admin"]))) return;
  await db.delete(messages).where(eq(messages.id, id));
  refresh();
}

export async function deleteSubscriber(id: number) {
  if (!(await authorize(["admin"]))) return;
  await db.delete(subscribers).where(eq(subscribers.id, id));
  refresh();
}
