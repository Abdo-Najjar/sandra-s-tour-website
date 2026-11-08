import type { BookingStatus } from "@/db/schema";
import type { T } from "@/lib/admin/i18n";

const bookingStatusNames: Record<BookingStatus, string> = {
  new: "New",
  contacted: "Contacted",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

export const bookingStatusLabel = (status: BookingStatus, t: T) => t(bookingStatusNames[status]);
