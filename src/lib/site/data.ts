import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db, pages, posts, site, tours } from "@/db";
import { SITE_ROW_ID, siteData } from "./content";
import type { Lang } from "./i18n";
import { localDetails } from "./tour";
import { pick } from "./translatable";

// Public website reads, per language. Cached until the dashboard changes
// something (admin actions call updateTag with these tags).
export const TAGS = { site: "site", tours: "tours", posts: "posts", pages: "pages" } as const;

export async function getSite(lang: Lang) {
  "use cache";
  cacheTag(TAGS.site);
  cacheLife("max");
  const row = await db.query.site.findFirst({ where: eq(site.id, SITE_ROW_ID) });
  return siteData(row?.data, lang);
}

// A tour with its text in one language.
function toPublicTour(row: typeof tours.$inferSelect, lang: Lang) {
  return {
    ...row,
    title: pick(row.title, lang),
    summary: pick(row.summary, lang),
    details: localDetails(row.details, lang),
  };
}
export type PublicTour = ReturnType<typeof toPublicTour>;

export async function getTours(lang: Lang) {
  "use cache";
  cacheTag(TAGS.tours);
  cacheLife("max");
  const rows = await db
    .select()
    .from(tours)
    .where(eq(tours.published, true))
    .orderBy(asc(tours.sortOrder), asc(tours.id));
  return rows.map((r) => toPublicTour(r, lang));
}

export async function getTour(slug: string, lang: Lang) {
  "use cache";
  cacheTag(TAGS.tours);
  cacheLife("max");
  const row = await db.query.tours.findFirst({ where: and(eq(tours.slug, slug), eq(tours.published, true)) });
  return row ? toPublicTour(row, lang) : null;
}

// An article with its text in one language. `categoryKey` stays the English
// category, so the blog filters work in both languages.
function localizePost<T extends { title: unknown; category: unknown; excerpt: unknown; author: unknown; tags: unknown; body: unknown }>(
  row: T,
  lang: Lang,
) {
  return {
    ...row,
    title: pick(row.title, lang),
    category: pick(row.category, lang),
    categoryKey: pick(row.category, "en"),
    excerpt: pick(row.excerpt, lang),
    author: pick(row.author, lang),
    tags: pick(row.tags, lang),
    body: pick(row.body, lang),
  };
}

export async function getPosts(lang: Lang) {
  "use cache";
  cacheTag(TAGS.posts);
  cacheLife("max");
  const rows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
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
  // The list doesn't need the Arabic body.
  return rows.map((r) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { body: _body, ...p } = localizePost({ ...r, body: "" }, lang);
    return p;
  });
}
export type PostSummary = Awaited<ReturnType<typeof getPosts>>[number];

export async function getPost(slug: string, lang: Lang) {
  "use cache";
  cacheTag(TAGS.posts);
  cacheLife("max");
  const row = await db.query.posts.findFirst({ where: and(eq(posts.slug, slug), eq(posts.published, true)) });
  return row ? localizePost(row, lang) : null;
}

function localizePage<T extends { title: unknown; subtitle?: unknown; body?: unknown }>(row: T, lang: Lang) {
  return {
    ...row,
    title: pick(row.title, lang),
    subtitle: pick(row.subtitle, lang),
    body: pick(row.body, lang),
  };
}

export async function getMenuPages(lang: Lang) {
  "use cache";
  cacheTag(TAGS.pages);
  cacheLife("max");
  const rows = await db
    .select({ slug: pages.slug, title: pages.title })
    .from(pages)
    .where(and(eq(pages.published, true), eq(pages.showInMenu, true)))
    .orderBy(asc(pages.sortOrder), asc(pages.id));
  return rows.map((r) => {
    const p = localizePage(r, lang);
    return { slug: p.slug, title: p.title };
  });
}

export async function getPublicPage(slug: string, lang: Lang) {
  "use cache";
  cacheTag(TAGS.pages);
  cacheLife("max");
  const row = await db.query.pages.findFirst({ where: and(eq(pages.slug, slug), eq(pages.published, true)) });
  return row ? localizePage(row, lang) : null;
}

export async function getPublishedSlugs(kind: "tours" | "posts" | "pages") {
  "use cache";
  cacheTag(TAGS[kind]);
  cacheLife("max");
  const table = kind === "tours" ? tours : kind === "posts" ? posts : pages;
  const rows = await db.select({ slug: table.slug }).from(table).where(and(eq(table.published, true), ne(table.slug, "")));
  return rows.map((r) => r.slug);
}
