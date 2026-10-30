import { readFile } from "node:fs/promises";
import path from "node:path";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp" };

// Serves images uploaded from the dashboard.
export async function GET(_: Request, ctx: RouteContext<"/uploads/[name]">) {
  const { name } = await ctx.params;
  const match = /^[a-f0-9]{32}\.(jpg|png|gif|webp)$/.exec(name);
  if (!match) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(path.join(process.cwd(), "uploads", name));
    return new Response(data, {
      headers: {
        "content-type": TYPES[match[1]],
        "cache-control": "public, max-age=31536000, immutable",
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
