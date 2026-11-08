import type { UserRole } from "@/db/schema";
import type { T } from "@/lib/admin/i18n";

const roleNames: Record<UserRole, [en: string, ar: string]> = {
  admin: ["Admin", "مدير"],
  editor: ["Editor", "محرر"],
  user: ["User", "مستخدم"],
};

export const roleLabel = (role: UserRole, t: T) => t(...roleNames[role]);

export function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

// SQLite stores "YYYY-MM-DD HH:MM:SS" in UTC.
export function formatDate(value: string) {
  return value.slice(0, 10);
}
