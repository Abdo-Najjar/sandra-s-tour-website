import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { SiteContent } from "../lib/site/content";
import type { TourDetails } from "../lib/site/tour";
import type { Tr } from "../lib/site/translatable";

export const USER_ROLES = ["admin", "editor", "user"] as const;

export type UserRole = (typeof USER_ROLES)[number];

const createdAt = () =>
  text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`);

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: USER_ROLES }).notNull().default("user"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  // scrypt hash; null means the user cannot log in.
  passwordHash: text("password_hash"),
  createdAt: createdAt(),
});

// Login sessions. `id` is a SHA-256 hash of the cookie token, so a leaked
// database doesn't expose usable session cookies.
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
  createdAt: createdAt(),
});

export type User = typeof users.$inferSelect;

// ---------- Public website ----------

export const BOOKING_STATUSES = ["new", "contacted", "confirmed", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const MESSAGE_KINDS = ["partnership", "contact"] as const;
export type MessageKind = (typeof MESSAGE_KINDS)[number];

const updatedAt = () =>
  text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`);

// Bilingual text columns hold JSON with both languages, e.g.
//   {"en": "Old Damascus", "ar": "دمشق القديمة"}
// An empty "ar" falls back to "en" on the Arabic website. Helpers: src/lib/site/translatable.ts

// One row (id 1): {"en": {...all website text...}, "ar": {...}}.
// Shape + defaults: src/lib/site/content.ts and content-ar.ts
export const site = sqliteTable("site", {
  id: integer("id").primaryKey(),
  data: text("data", { mode: "json" }).$type<Tr<SiteContent>>().notNull(),
  updatedAt: updatedAt(),
});

// Extra tour fields kept as JSON (lists, gallery, itinerary...).
// Shape + defaults: src/lib/site/tour.ts
export const tours = sqliteTable("tours", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title", { mode: "json" }).$type<Tr>().notNull(),
  category: text("category").notNull().default(""),
  region: text("region").notNull().default(""),
  image: text("image").notNull().default(""),
  price: real("price").notNull().default(0),
  durationDays: integer("duration_days").notNull().default(1),
  summary: text("summary", { mode: "json" }).$type<Tr>().notNull().default(sql`'{"en":"","ar":""}'`),
  // {"en": all fields, "ar": only the Arabic fields that were filled in}
  details: text("details", { mode: "json" }).$type<Tr<TourDetails, Partial<TourDetails>>>().notNull().default(sql`'{"en":{},"ar":{}}'`),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title", { mode: "json" }).$type<Tr>().notNull(),
  category: text("category", { mode: "json" }).$type<Tr>().notNull().default(sql`'{"en":"","ar":""}'`), // "en" is also the blog filter key
  excerpt: text("excerpt", { mode: "json" }).$type<Tr>().notNull().default(sql`'{"en":"","ar":""}'`),
  cover: text("cover").notNull().default(""),
  author: text("author", { mode: "json" }).$type<Tr>().notNull().default(sql`'{"en":"","ar":""}'`),
  readMinutes: integer("read_minutes").notNull().default(5),
  tags: text("tags", { mode: "json" }).$type<Tr>().notNull().default(sql`'{"en":"","ar":""}'`), // comma separated
  body: text("body", { mode: "json" }).$type<Tr>().notNull().default(sql`'{"en":"","ar":""}'`), // simple markdown: ## heading, - list, > quote
  publishedAt: text("published_at").notNull().default(sql`(date('now'))`),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tourId: integer("tour_id").references(() => tours.id, { onDelete: "set null" }),
  tourTitle: text("tour_title").notNull().default(""), // kept if the tour is deleted
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  nationality: text("nationality").notNull().default(""),
  tourClass: text("tour_class").notNull().default(""),
  arrivalDate: text("arrival_date").notNull().default(""),
  adults: integer("adults").notNull().default(1),
  children: integer("children").notNull().default(0),
  flexibility: text("flexibility").notNull().default(""),
  note: text("note").notNull().default(""),
  source: text("source").notNull().default(""), // contact | tour | guide
  status: text("status", { enum: BOOKING_STATUSES }).notNull().default("new"),
  createdAt: createdAt(),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  kind: text("kind", { enum: MESSAGE_KINDS }).notNull().default("contact"),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  location: text("location").notNull().default(""),
  category: text("category").notNull().default(""),
  body: text("body").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
});

export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  createdAt: createdAt(),
});

export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title", { mode: "json" }).$type<Tr>().notNull(),
  subtitle: text("subtitle", { mode: "json" }).$type<Tr>().notNull().default(sql`'{"en":"","ar":""}'`),
  image: text("image").notNull().default(""),
  body: text("body", { mode: "json" }).$type<Tr>().notNull().default(sql`'{"en":"","ar":""}'`),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  showInMenu: integer("show_in_menu", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export type Tour = typeof tours.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Page = typeof pages.$inferSelect;
