import type { UserRole } from "@/db/schema";

export const roleLabels: Record<UserRole, string> = {
  admin: "مدير",
  editor: "محرر",
  user: "مستخدم",
};

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
