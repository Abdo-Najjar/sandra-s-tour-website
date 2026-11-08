// Brings the website text of an existing database up to date, without touching
// bookings, messages, subscribers, users or prices.
// Run on the server after updating the code and BEFORE `next build`
// (the build pre-renders pages from the database):
//   npm run db:push && npm run db:refresh-content && npm run build
// (db:push first converts older databases to the {"en", "ar"} format.)
//
// 1. Saves a backup of the current website text in backups/.
// 2. Resets the English and Arabic website text (dashboard → محتوى الموقع)
//    to the latest version in src/lib/site/content.ts and content-ar.ts.
// 3. Sample tours, articles and the terms page (matched by their link):
//    English fields that still contain Arabic get the English text, and
//    empty Arabic versions are filled in. Other edits are kept.
import { mkdirSync, writeFileSync } from "node:fs";
import { eq, sql } from "drizzle-orm";
import { db, pages, posts, site, tours } from "./index";
import { defaultSiteData, SITE_ROW_ID } from "../lib/site/content";
import { partialDetails, tourDetailsTr } from "../lib/site/tour";
import { trText, type Tr } from "../lib/site/translatable";
import { seedPosts, seedTours } from "./seed-site";
import { mergeArDetails, postsAr, termsAr, toursAr } from "./seed-site-ar";

const hasArabic = (v: unknown) => /[؀-ۿ]/.test(JSON.stringify(v ?? ""));
const isEmpty = (v: unknown) => !v || (typeof v === "object" && Object.keys(v as object).length === 0);

// English that still holds Arabic gets the sample English; an empty Arabic gets the sample Arabic.
function fixText(stored: unknown, en: string, ar = ""): Tr {
  const v = trText(stored);
  return { en: hasArabic(v.en) && !hasArabic(en) ? en : v.en, ar: v.ar.trim() ? v.ar : ar };
}

async function main() {
  // 1. Backup
  const before = await db.select().from(site);
  mkdirSync("backups", { recursive: true });
  const file = `backups/site-content-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  writeFileSync(file, JSON.stringify(before, null, 2));
  console.log(`Backup of the old website text: ${file}`);

  // 2. Website text, both languages, in one row
  const data = defaultSiteData();
  await db
    .insert(site)
    .values({ id: SITE_ROW_ID, data })
    .onConflictDoUpdate({ target: site.id, set: { data, updatedAt: sql`(datetime('now'))` } });
  console.log("Website text updated (English and Arabic).");

  // 3a. Sample tours
  let tourCount = 0;
  for (const seed of seedTours) {
    const row = await db.query.tours.findFirst({ where: eq(tours.slug, seed.slug) });
    if (!row) continue;
    const ar = toursAr[seed.slug];
    const details = tourDetailsTr(row.details);
    const en: Record<string, unknown> = { ...details.en };
    for (const [key, value] of Object.entries(seed.details)) {
      if (hasArabic(en[key]) && !hasArabic(value)) en[key] = value;
    }
    await db
      .update(tours)
      .set({
        title: fixText(row.title, seed.title, ar?.title),
        summary: fixText(row.summary, seed.summary, ar?.summary),
        details: {
          en: en as typeof details.en,
          ar: isEmpty(details.ar) && ar ? partialDetails(mergeArDetails(seed.details, ar.details)) : details.ar,
        },
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(tours.id, row.id));
    tourCount++;
  }

  // 3b. Sample articles: fill in missing Arabic
  let postCount = 0;
  for (const seed of seedPosts) {
    const row = await db.query.posts.findFirst({ where: eq(posts.slug, seed.slug) });
    const ar: Partial<Record<string, string>> | undefined = postsAr[seed.slug];
    if (!row || !ar) continue;
    await db
      .update(posts)
      .set({
        title: fixText(row.title, seed.title, ar.title),
        category: fixText(row.category, seed.category, ar.category),
        excerpt: fixText(row.excerpt, seed.excerpt, ar.excerpt),
        author: fixText(row.author, seed.author, ar.author),
        tags: fixText(row.tags, seed.tags, ar.tags),
        body: fixText(row.body, seed.body, ar.body),
      })
      .where(eq(posts.id, row.id));
    postCount++;
  }

  // 3c. Terms page
  const terms = await db.query.pages.findFirst({ where: eq(pages.slug, "terms") });
  if (terms) {
    const keep = (v: unknown, ar: string) => ({ ...trText(v), ar: trText(v).ar.trim() || ar });
    await db
      .update(pages)
      .set({ title: keep(terms.title, termsAr.title), subtitle: keep(terms.subtitle, termsAr.subtitle), body: keep(terms.body, termsAr.body) })
      .where(eq(pages.id, terms.id));
  }

  console.log(`Sample content checked: ${tourCount} tours, ${postCount} articles.`);
  console.log("Done. Rebuild / restart the website so it shows the new text.");
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
