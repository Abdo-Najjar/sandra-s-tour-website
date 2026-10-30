import "server-only";

// Small in-memory rate limiter (per server process). Good enough for a single
// server; use Redis or similar if you run several instances.
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  entry.count++;
  if (hits.size > 10_000) {
    for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  }
  return entry.count <= limit;
}

export function clearRateLimit(key: string) {
  hits.delete(key);
}
