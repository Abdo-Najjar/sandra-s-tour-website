import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, sql } from "drizzle-orm";
import { db, sessions, users, type UserRole } from "@/db";

export const SESSION_COOKIE = "session";
const SESSION_DAYS = 7;

// Roles allowed into the dashboard at all.
export const DASHBOARD_ROLES: UserRole[] = ["admin", "editor"];

export type CurrentUser = { id: number; name: string; email: string; role: UserRole };

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
const sqliteDate = (d: Date) => d.toISOString().slice(0, 19).replace("T", " ");

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);

  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt: sqliteDate(expires) });
  // Clean up expired sessions while we're here.
  await db.delete(sessions).where(sql`${sessions.expiresAt} <= datetime('now')`);

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  store.delete(SESSION_COOKIE);
}

export async function deleteUserSessions(userId: number) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

// Reads the session cookie and looks up the user. Memoized per request.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [row] = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, active: users.active })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, sql`datetime('now')`)))
    .limit(1);

  if (!row || !row.active || !DASHBOARD_ROLES.includes(row.role)) return null;
  return { id: row.id, name: row.name, email: row.email, role: row.role };
});

// For pages and queries: sends signed-out visitors to the login page.
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// For server actions: returns the user only if they have one of the roles.
export async function authorize(roles: UserRole[] = DASHBOARD_ROLES) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return roles.includes(user.role) ? user : null;
}
