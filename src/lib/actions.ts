"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import {
  db,
  users,
  USER_ROLES,
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
import { clearRateLimit, rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export type ActionState = { ok?: boolean; error?: string; email?: string } | undefined;

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

  if (!email || !password) return { error: "أدخل البريد الإلكتروني وكلمة المرور", email };

  // Slow down password guessing: 10 tries per 15 minutes per email and 30 per IP.
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  const windowMs = 15 * 60 * 1000;
  if (!rateLimit(`login:${email}`, 10, windowMs) || !rateLimit(`login-ip:${ip}`, 30, windowMs))
    return { error: "محاولات كثيرة. حاول مرة أخرى بعد 15 دقيقة", email };

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  const valid = await verifyPassword(password, user?.passwordHash ?? (await dummyHash));

  if (!user || !user.passwordHash || !valid) return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة", email };
  if (!user.active) return { error: "هذا الحساب موقوف", email };
  if (!DASHBOARD_ROLES.includes(user.role)) return { error: "هذا الحساب لا يملك صلاحية دخول لوحة التحكم", email };

  clearRateLimit(`login:${email}`);

  await createSession(user.id);
  // Only allow same-site relative paths to avoid open redirects.
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
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

