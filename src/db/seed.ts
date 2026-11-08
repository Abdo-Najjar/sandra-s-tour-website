// Fills the database with sample data. Run with: npm run db:seed
// Wipes existing rows first.
import { bookings, db, messages, pages, posts, sessions, site, subscribers, tours, users } from "./index";
import { seedWebsite } from "./seed-site";
import { hashPassword } from "../lib/password";

// Test login password for the seeded admin and editor accounts.
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? "Sandra-Admin-2026";

async function main() {
  await db.delete(bookings);
  await db.delete(messages);
  await db.delete(tours);
  await db.delete(posts);
  await db.delete(subscribers);
  await db.delete(pages);
  await db.delete(site);
  await db.delete(sessions);
  await db.delete(users);

  const passwordHash = await hashPassword(SEED_PASSWORD);
  await db.insert(users).values([
    { name: "أحمد الخطيب", email: "ahmad@example.com", role: "admin", passwordHash },
    { name: "سارة منصور", email: "sara@example.com", role: "editor", passwordHash },
    { name: "محمد العلي", email: "mohammad@example.com", role: "user" },
    { name: "ليلى حداد", email: "layla@example.com", role: "user", active: false },
    { name: "يوسف قاسم", email: "yousef@example.com", role: "editor" },
    { name: "رنا سليمان", email: "rana@example.com", role: "user" },
    { name: "خالد نصر", email: "khaled@example.com", role: "user", active: false },
    { name: "نور الهدى", email: "nour@example.com", role: "user" },
  ]);

  await seedWebsite();

  console.log(`Logins: ahmad@example.com (admin), sara@example.com (editor). Password from SEED_PASSWORD or the default in seed.ts.`);
  console.log("Seeded 8 users and the website content.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
