// Brings the website text of an existing database up to date, without touching
// bookings, messages, subscribers, users, orders or prices.
// Run on the server after updating the code and BEFORE `next build`
// (the build pre-renders pages from the database):
//   npm run db:push && npm run db:refresh-content && npm run build
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
import { defaultSiteContent } from "../lib/site/content";
import { defaultSiteContentAr } from "../lib/site/content-ar";
import { tourDetails } from "../lib/site/tour";
import { seedPosts, seedTours } from "./seed-site";
import { mergeArDetails, postsAr, termsAr, toursAr } from "./seed-site-ar";

const hasArabic = (v: unknown) => /[؀-ۿ]/.test(JSON.stringify(v ?? ""));
const isEmpty = (v: unknown) => !v || (typeof v === "object" && Object.keys(v as object).length === 0);

async function main() {
  // 1. Backup
  const before = await db.select().from(site);
  mkdirSync("backups", { recursive: true });
  const file = `backups/site-content-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  writeFileSync(file, JSON.stringify(before, null, 2));
  console.log(`Backup of the old website text: ${file}`);

  // 2. Website text, both languages
  for (const [id, data] of [
    [1, defaultSiteContent],
    [2, defaultSiteContentAr],
  ] as const) {
    await db
      .insert(site)
      .values({ id, data })
      .onConflictDoUpdate({ target: site.id, set: { data, updatedAt: sql`(datetime('now'))` } });
  }
  console.log("Website text updated (English and Arabic).");

  // 3a. Sample tours
  let tourCount = 0;
  for (const seed of seedTours) {
    const row = await db.query.tours.findFirst({ where: eq(tours.slug, seed.slug) });
    if (!row) continue;
    const details: Record<string, unknown> = { ...tourDetails(row.details) };
    for (const [key, value] of Object.entries(seed.details)) {
      if (hasArabic(details[key]) && !hasArabic(value)) details[key] = value;
    }
    const ar = toursAr[seed.slug];
    await db
      .update(tours)
      .set({
        title: hasArabic(row.title) ? seed.title : row.title,
        summary: hasArabic(row.summary) ? seed.summary : row.summary,
        details: tourDetails(details),
        ...(ar && isEmpty(row.ar)
          ? { ar: { title: ar.title, summary: ar.summary, details: mergeArDetails(seed.details, ar.details) }, titleAr: ar.title }
          : {}),
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(tours.id, row.id));
    tourCount++;
  }

  // 3b. Sample articles
  let postCount = 0;
  for (const seed of seedPosts) {
    const row = await db.query.posts.findFirst({ where: eq(posts.slug, seed.slug), columns: { id: true, ar: true } });
    if (!row || !postsAr[seed.slug] || !isEmpty(row.ar)) continue;
    await db.update(posts).set({ ar: postsAr[seed.slug], kickerAr: "" }).where(eq(posts.id, row.id));
    postCount++;
  }

  // 3c. Terms page
  const terms = await db.query.pages.findFirst({ where: eq(pages.slug, "terms"), columns: { id: true, ar: true } });
  if (terms && isEmpty(terms.ar)) await db.update(pages).set({ ar: termsAr }).where(eq(pages.id, terms.id));

  console.log(`Sample content checked: ${tourCount} tours, ${postCount} articles given Arabic versions.`);
  console.log("Done. Rebuild / restart the website so it shows the new text.");
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
