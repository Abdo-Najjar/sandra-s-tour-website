"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import {
  db,
  orders,
  products,
  settings,
  users,
  ORDER_STATUSES,
  USER_ROLES,
  type OrderStatus,
  type UserRole,
} from "@/db";
import {
  authorize,
  createSession,
  deleteSession,
  deleteUserSessions,
  DASHBOARD_ROLES,
} from "@/lib/auth";
import { hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from "@/lib/password";

export type ActionState = { ok?: boolean; error?: string } | undefined;

const NO_PERMISSION = "ليس لديك صلاحية لهذا الإجراء";
const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ---------- Auth ----------

// A real hash of a random string, so a login attempt for an unknown email
// takes the same time as one for a known email.
const dummyHash = hashPassword(crypto.randomUUID());

export async function login(_: ActionState, fd: FormData): Promise<ActionState> {
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const next = str(fd, "next");

  if (!email || !password) return { error: "أدخل البريد الإلكتروني وكلمة المرور" };

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  const valid = await verifyPassword(password, user?.passwordHash ?? (await dummyHash));

  if (!user || !user.passwordHash || !valid) return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
  if (!user.active) return { error: "هذا الحساب موقوف" };
  if (!DASHBOARD_ROLES.includes(user.role)) return { error: "هذا الحساب لا يملك صلاحية دخول لوحة التحكم" };

  await createSession(user.id);
  // Only allow same-site relative paths to avoid open redirects.
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function changePassword(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await authorize();
  if (!me) return { error: NO_PERMISSION };

  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  const confirm = String(fd.get("confirm") ?? "");

  const row = await db.query.users.findFirst({ where: eq(users.id, me.id) });
  if (!row?.passwordHash || !(await verifyPassword(current, row.passwordHash)))
    return { error: "كلمة المرور الحالية غير صحيحة" };
  if (next.length < MIN_PASSWORD_LENGTH) return { error: `كلمة المرور الجديدة يجب أن تكون ${MIN_PASSWORD_LENGTH} أحرف على الأقل` };
  if (next !== confirm) return { error: "كلمتا المرور غير متطابقتين" };

  await db.update(users).set({ passwordHash: await hashPassword(next) }).where(eq(users.id, me.id));
  // Sign out other devices, then start a fresh session here.
  await deleteUserSessions(me.id);
  await createSession(me.id);
  return { ok: true };
}

// ---------- Users (admin only) ----------

export async function createUser(_: ActionState, fd: FormData): Promise<ActionState> {
  if (!(await authorize(["admin"]))) return { error: NO_PERMISSION };

  const name = str(fd, "name");
  const email = str(fd, "email").toLowerCase();
  const role = str(fd, "role") as UserRole;
  const password = String(fd.get("password") ?? "");

  if (name.length < 2) return { error: "الاسم قصير جداً" };
  if (!isEmail(email)) return { error: "البريد الإلكتروني غير صالح" };
  if (!USER_ROLES.includes(role)) return { error: "الدور غير صالح" };
  if (password && password.length < MIN_PASSWORD_LENGTH)
    return { error: `كلمة المرور يجب أن تكون ${MIN_PASSWORD_LENGTH} أحرف على الأقل` };
  if (!password && DASHBOARD_ROLES.includes(role))
    return { error: "المدير والمحرر يحتاجان كلمة مرور للدخول" };

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) return { error: "هذا البريد مستخدم مسبقاً" };

  await db.insert(users).values({
    name,
    email,
    role,
    passwordHash: password ? await hashPassword(password) : null,
  });
  refresh();
  return { ok: true };
}

export async function toggleUserActive(id: number) {
  const me = await authorize(["admin"]);
  if (!me || me.id === id) return; // can't lock yourself out

  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!user) return;
  await db.update(users).set({ active: !user.active }).where(eq(users.id, id));
  if (user.active) await deleteUserSessions(id);
  refresh();
}

export async function deleteUser(id: number) {
  const me = await authorize(["admin"]);
  if (!me || me.id === id) return;
  await db.delete(users).where(eq(users.id, id));
  refresh();
}

// ---------- Products ----------

export async function createProduct(_: ActionState, fd: FormData): Promise<ActionState> {
  if (!(await authorize())) return { error: NO_PERMISSION };

  const name = str(fd, "name");
  const category = str(fd, "category");
  const price = Number(str(fd, "price"));
  const stock = Number(str(fd, "stock") || 0);

  if (name.length < 2) return { error: "اسم المنتج قصير جداً" };
  if (!category) return { error: "التصنيف مطلوب" };
  if (!Number.isFinite(price) || price <= 0) return { error: "السعر يجب أن يكون أكبر من صفر" };
  if (!Number.isInteger(stock) || stock < 0) return { error: "المخزون يجب أن يكون رقماً صحيحاً" };

  await db.insert(products).values({ name, category, price, stock });
  refresh();
  return { ok: true };
}

export async function updateStock(id: number, stock: number) {
  if (!(await authorize())) return;
  if (!Number.isInteger(stock) || stock < 0) return;
  await db.update(products).set({ stock }).where(eq(products.id, id));
  refresh();
}

export async function deleteProduct(id: number) {
  if (!(await authorize(["admin"]))) return;
  await db.delete(products).where(eq(products.id, id));
  refresh();
}

// ---------- Orders ----------

export async function createOrder(_: ActionState, fd: FormData): Promise<ActionState> {
  if (!(await authorize())) return { error: NO_PERMISSION };

  const customer = str(fd, "customer");
  const productId = Number(str(fd, "productId"));
  const quantity = Number(str(fd, "quantity") || 1);

  if (customer.length < 2) return { error: "اسم العميل مطلوب" };
  if (!Number.isInteger(quantity) || quantity < 1) return { error: "الكمية غير صالحة" };

  const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
  if (!product) return { error: "اختر منتجاً" };
  if (product.stock < quantity) return { error: `المخزون المتوفر ${product.stock} فقط` };

  await db.batch([
    db.insert(orders).values({ customer, productId, quantity, amount: product.price * quantity }),
    db.update(products).set({ stock: product.stock - quantity }).where(eq(products.id, productId)),
  ]);
  refresh();
  return { ok: true };
}

export async function setOrderStatus(id: number, status: OrderStatus) {
  if (!(await authorize())) return;
  if (!ORDER_STATUSES.includes(status)) return;
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  refresh();
}

// ---------- Settings (admin only) ----------

export async function saveSettings(_: ActionState, fd: FormData): Promise<ActionState> {
  if (!(await authorize(["admin"]))) return { error: NO_PERMISSION };

  const values = {
    ownerName: str(fd, "ownerName"),
    ownerEmail: str(fd, "ownerEmail").toLowerCase(),
    storeName: str(fd, "storeName"),
    currency: str(fd, "currency") || "USD",
    notifyEmail: fd.get("notifyEmail") === "on",
    notifyOrders: fd.get("notifyOrders") === "on",
    notifyReports: fd.get("notifyReports") === "on",
  };

  if (values.ownerName.length < 2) return { error: "الاسم قصير جداً" };
  if (!isEmail(values.ownerEmail)) return { error: "البريد الإلكتروني غير صالح" };
  if (!values.storeName) return { error: "اسم المتجر مطلوب" };

  await db
    .insert(settings)
    .values({ id: 1, ...values })
    .onConflictDoUpdate({ target: settings.id, set: values });
  refresh();
  return { ok: true };
}
