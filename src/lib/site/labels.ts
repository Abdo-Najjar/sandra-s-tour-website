import type { BookingStatus } from "@/db/schema";
import type { T } from "@/lib/admin/i18n";

const bookingStatusNames: Record<BookingStatus, [en: string, ar: string]> = {
  new: ["New", "جديد"],
  contacted: ["Contacted", "تم التواصل"],
  confirmed: ["Confirmed", "مؤكد"],
  cancelled: ["Cancelled", "ملغى"],
};

export const bookingStatusLabel = (status: BookingStatus, t: T) => t(...bookingStatusNames[status]);
