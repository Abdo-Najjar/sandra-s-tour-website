import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db, pages, posts, site, tours } from "@/db";
import { withDefaults } from "./content";
import { tourDetails } from "./tour";

// Public website reads. Cached until the dashboard changes something
// (admin actions call updateTag with these tags).
export const TAGS = { site: "site", tours: "tours", posts: "posts", pages: "pages" } as const;

export async function getSite() {
  "use cache";
  cacheTag(TAGS.site);
  cacheLife("max");
  const row = await db.query.site.findFirst({ where: eq(site.id, 1) });
  return withDefaults(row?.data);
}

function toPublicTour(row: typeof tours.$inferSelect) {
  return { ...row, details: tourDetails(row.details) };
}
export type PublicTour = ReturnType<typeof toPublicTour>;

export async function getTours() {
  "use cache";
  cacheTag(TAGS.tours);
  cacheLife("max");
  const rows = await db
    .select()
    .from(tours)
    .where(eq(tours.published, true))
    .orderBy(asc(tours.sortOrder), asc(tours.id));
  return rows.map(toPublicTour);
}

export async function getTour(slug: string) {
  "use cache";
  cacheTag(TAGS.tours);
  cacheLife("max");
  const row = await db.query.tours.findFirst({ where: and(eq(tours.slug, slug), eq(tours.published, true)) });
  return row ? toPublicTour(row) : null;
}

export async function getPosts() {
  "use cache";
  cacheTag(TAGS.posts);
  cacheLife("max");
  return db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      kickerAr: posts.kickerAr,
      category: posts.category,
      excerpt: posts.excerpt,
      cover: posts.cover,
      author: posts.author,
      readMinutes: posts.readMinutes,
      tags: posts.tags,
      publishedAt: posts.publishedAt,
      featured: posts.featured,
    })
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt), desc(posts.id));
}
export type PostSummary = Awaited<ReturnType<typeof getPosts>>[number];

export async function getPost(slug: string) {
  "use cache";
  cacheTag(TAGS.posts);
  cacheLife("max");
  return (await db.query.posts.findFirst({ where: and(eq(posts.slug, slug), eq(posts.published, true)) })) ?? null;
}

export async function getMenuPages() {
  "use cache";
  cacheTag(TAGS.pages);
  cacheLife("max");
  return db
    .select({ slug: pages.slug, title: pages.title })
    .from(pages)
    .where(and(eq(pages.published, true), eq(pages.showInMenu, true)))
    .orderBy(asc(pages.sortOrder), asc(pages.id));
}

export async function getPublicPage(slug: string) {
  "use cache";
  cacheTag(TAGS.pages);
  cacheLife("max");
  return (await db.query.pages.findFirst({ where: and(eq(pages.slug, slug), eq(pages.published, true)) })) ?? null;
}

export async function getPublishedSlugs(kind: "tours" | "posts" | "pages") {
  "use cache";
  cacheTag(TAGS[kind]);
  cacheLife("max");
  const table = kind === "tours" ? tours : kind === "posts" ? posts : pages;
  const rows = await db.select({ slug: table.slug }).from(table).where(and(eq(table.published, true), ne(table.slug, "")));
  return rows.map((r) => r.slug);
}
