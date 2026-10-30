import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const USER_ROLES = ["admin", "editor", "user"] as const;
export const ORDER_STATUSES = ["completed", "processing", "cancelled"] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];

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

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull(),
  stock: integer("stock").notNull().default(0),
  createdAt: createdAt(),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customer: text("customer").notNull(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  amount: real("amount").notNull(),
  status: text("status", { enum: ORDER_STATUSES }).notNull().default("processing"),
  createdAt: createdAt(),
});

// Single-row table (id = 1) for account and store settings.
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey(),
  ownerName: text("owner_name").notNull(),
  ownerEmail: text("owner_email").notNull(),
  storeName: text("store_name").notNull(),
  currency: text("currency").notNull().default("USD"),
  notifyEmail: integer("notify_email", { mode: "boolean" }).notNull().default(true),
  notifyOrders: integer("notify_orders", { mode: "boolean" }).notNull().default(true),
  notifyReports: integer("notify_reports", { mode: "boolean" }).notNull().default(false),
});

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Settings = typeof settings.$inferSelect;
