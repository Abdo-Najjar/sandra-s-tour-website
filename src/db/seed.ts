// Fills the database with sample data. Run with: npm run db:seed
// Wipes existing rows first.
import { db, orders, products, sessions, settings, users, type OrderStatus } from "./index";
import { hashPassword } from "../lib/password";

// Test login password for the seeded admin and editor accounts.
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? "Sandra-Admin-2026";

const customers = [
  "أحمد الخطيب", "سارة منصور", "محمد العلي", "ليلى حداد", "يوسف قاسم",
  "رنا سليمان", "خالد نصر", "نور الهدى", "عمر الزين", "هبة عيسى",
];

// Deterministic pseudo-random so every seed gives the same data.
let s = 42;
const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];

function sqliteDate(d: Date) {
  return d.toISOString().slice(0, 19).replace("T", " ");
}

async function main() {
  await db.delete(sessions);
  await db.delete(orders);
  await db.delete(products);
  await db.delete(users);
  await db.delete(settings);

  await db.insert(settings).values({
    id: 1,
    ownerName: "أحمد الخطيب",
    ownerEmail: "ahmad@example.com",
    storeName: "متجري",
    currency: "USD",
  });

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

  const inserted = await db
    .insert(products)
    .values([
      { name: "سماعات لاسلكية", category: "صوتيات", price: 120, stock: 48 },
      { name: "ساعة ذكية", category: "أجهزة قابلة للارتداء", price: 340, stock: 12 },
      { name: "لوحة مفاتيح ميكانيكية", category: "ملحقات", price: 85, stock: 64 },
      { name: "شاشة 27 إنش", category: "شاشات", price: 520, stock: 7 },
      { name: "ماوس احترافي", category: "ملحقات", price: 60, stock: 0 },
      { name: "كاميرا ويب HD", category: "ملحقات", price: 95, stock: 23 },
    ])
    .returning();

  // ~12 months of orders, growing over time.
  const now = new Date();
  const rows: (typeof orders.$inferInsert)[] = [];
  for (let monthsAgo = 11; monthsAgo >= 0; monthsAgo--) {
    const count = 14 + (11 - monthsAgo) * 2 + Math.floor(rand() * 6);
    for (let i = 0; i < count; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1 + Math.floor(rand() * 27), 9 + Math.floor(rand() * 10));
      if (date > now) date.setTime(now.getTime() - Math.floor(rand() * 86_400_000 * 3));
      const product = pick(inserted);
      const quantity = 1 + Math.floor(rand() * 2);
      const r = rand();
      const status: OrderStatus = monthsAgo === 0 && r < 0.35 ? "processing" : r < 0.9 ? "completed" : "cancelled";
      rows.push({
        customer: pick(customers),
        productId: product.id,
        quantity,
        amount: product.price * quantity,
        status,
        createdAt: sqliteDate(date),
      });
    }
  }
  rows.sort((a, b) => a.createdAt!.localeCompare(b.createdAt!));
  for (let i = 0; i < rows.length; i += 100) await db.insert(orders).values(rows.slice(i, i + 100));

  console.log(`Logins: ahmad@example.com (admin), sara@example.com (editor). Password from SEED_PASSWORD or the default in seed.ts.`);
  console.log(`Seeded ${inserted.length} products, 8 users, ${rows.length} orders.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
