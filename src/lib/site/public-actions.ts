"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { bookings, db, messages, subscribers, tours } from "@/db";
import { rateLimit } from "@/lib/rate-limit";
import { isLang, ui } from "./i18n";

// Forms on the public website. Anyone can call these, so every field is
// length-limited, a hidden "website" field catches simple bots, and each
// visitor IP is rate limited.

export type PublicFormState = { ok?: boolean; error?: string } | undefined;

const str = (fd: FormData, key: string, max = 200) => String(fd.get(key) ?? "").trim().slice(0, max);
const int = (fd: FormData, key: string, min: number, max: number, fallback: number) => {
  const n = Number(fd.get(key));
  return Number.isInteger(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
// Error messages in the language of the page the form was sent from.
const errorsFor = (fd: FormData) => {
  const lang = fd.get("lang");
  return ui[isLang(lang) ? lang : "en"].errors;
};

async function guard(fd: FormData, bucket: string, limit: number): Promise<PublicFormState | null> {
  // Bots fill every field; people never see this one. Pretend it worked.
  if (str(fd, "website")) return { ok: true };
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "local";
  if (!rateLimit(`${bucket}:${ip}`, limit, 60 * 60 * 1000)) {
    return { error: errorsFor(fd).tooMany };
  }
  return null;
}

export async function createBooking(_: PublicFormState, fd: FormData): Promise<PublicFormState> {
  const blocked = await guard(fd, "booking", 8);
  if (blocked) return blocked;

  const err = errorsFor(fd);
  const name = str(fd, "name", 120);
  const email = str(fd, "email", 160).toLowerCase();
  const phone = str(fd, "phone", 60);
  if (!name) return { error: err.name };
  if (!isEmail(email)) return { error: err.email };

  const tourValue = str(fd, "tour", 40);
  let tourId: number | null = null;
  let tourTitle = str(fd, "tourTitle", 200);
  if (/^\d+$/.test(tourValue)) {
    const tour = await db.query.tours.findFirst({ where: eq(tours.id, Number(tourValue)), columns: { id: true, title: true } });
    if (tour) {
      tourId = tour.id;
      tourTitle = tour.title;
    }
  } else if (tourValue) {
    tourTitle = tourValue.slice(0, 200);
  }

  const date = str(fd, "arrivalDate", 20);
  await db.insert(bookings).values({
    tourId,
    tourTitle,
    name,
    email,
    phone,
    nationality: str(fd, "nationality", 120),
    tourClass: str(fd, "tourClass", 200),
    arrivalDate: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : str(fd, "timeframe", 60),
    adults: int(fd, "adults", 1, 99, 1),
    children: int(fd, "children", 0, 99, 0),
    flexibility: str(fd, "flexibility", 80),
    note: str(fd, "note", 3000),
    source: str(fd, "source", 20) || "contact",
  });
  return { ok: true };
}

export async function sendPartnership(_: PublicFormState, fd: FormData): Promise<PublicFormState> {
  const blocked = await guard(fd, "message", 6);
  if (blocked) return blocked;

  const name = str(fd, "name", 120);
  const email = str(fd, "email", 160).toLowerCase();
  const body = str(fd, "body", 5000);
  const err = errorsFor(fd);
  if (!name) return { error: err.org };
  if (!isEmail(email)) return { error: err.email };
  if (body.length < 10) return { error: err.pitch };

  await db.insert(messages).values({
    kind: "partnership",
    name,
    email,
    phone: str(fd, "phone", 60),
    location: str(fd, "location", 120),
    category: str(fd, "category", 200),
    body,
  });
  return { ok: true };
}

export async function subscribe(_: PublicFormState, fd: FormData): Promise<PublicFormState> {
  const blocked = await guard(fd, "subscribe", 10);
  if (blocked) return blocked;

  const email = str(fd, "email", 160).toLowerCase();
  if (!isEmail(email)) return { error: errorsFor(fd).email };
  await db.insert(subscribers).values({ email }).onConflictDoNothing();
  return { ok: true };
}
