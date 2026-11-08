// Helpers that make stored JSON match the shape of a template object.
// Used for the website content and the extra tour fields, so the database
// never ends up with missing or unexpected keys (shared by client and server).

const MAX_TEXT = 20_000;
const MAX_ITEMS = 150;

export function conform<T>(value: unknown, template: T): T {
  if (typeof template === "string") {
    if (typeof value === "string") return value.slice(0, MAX_TEXT) as T;
    if (typeof value === "number") return String(value) as T;
    return template;
  }
  if (typeof template === "number") {
    const n = typeof value === "string" && value.trim() === "" ? NaN : Number(value);
    return (Number.isFinite(n) ? n : template) as T;
  }
  if (typeof template === "boolean") {
    return (typeof value === "boolean" ? value : template) as T;
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return template;
    const item = template[0] ?? "";
    return value.slice(0, MAX_ITEMS).map((v) => conform(v, item)) as T;
  }
  if (template && typeof template === "object") {
    const src = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
    const out: Record<string, unknown> = {};
    for (const [k, t] of Object.entries(template)) out[k] = conform(src[k], t);
    return out as T;
  }
  return template;
}

// A copy of the template with all text emptied: the starting point for a new list item.
export function blank<T>(template: T): T {
  if (typeof template === "string") return "" as T;
  if (typeof template === "number") return 0 as T;
  if (typeof template === "boolean") return false as T;
  if (Array.isArray(template)) return [] as T;
  if (template && typeof template === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, t] of Object.entries(template)) out[k] = blank(t);
    return out as T;
  }
  return template;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// wa.me link from any phone format.
export function whatsappLink(phone: string, text?: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

// Only allow site-relative paths and http(s) links in editable hrefs/images.
export function safeUrl(url: string, fallback = "#") {
  const u = url.trim();
  if (!u) return fallback;
  if (u.startsWith("/") && !u.startsWith("//")) return u;
  if (u.startsWith("#")) return u;
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
  return fallback;
}
