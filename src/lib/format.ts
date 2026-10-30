import type { OrderStatus, UserRole } from "@/db/schema";

export const statusLabels: Record<OrderStatus, string> = {
  completed: "مكتمل",
  processing: "قيد التنفيذ",
  cancelled: "ملغي",
};

export const roleLabels: Record<UserRole, string> = {
  admin: "مدير",
  editor: "محرر",
  user: "مستخدم",
};

export const currencies = [
  { code: "USD", label: "دولار أمريكي" },
  { code: "SAR", label: "ريال سعودي" },
  { code: "JOD", label: "دينار أردني" },
  { code: "AED", label: "درهم إماراتي" },
];

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
