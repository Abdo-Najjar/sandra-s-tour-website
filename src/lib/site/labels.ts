import type { BookingStatus } from "@/db/schema";

export const bookingStatusLabels: Record<BookingStatus, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  confirmed: "مؤكد",
  cancelled: "ملغى",
};
