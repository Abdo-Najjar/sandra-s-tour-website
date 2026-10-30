import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentUser } from "@/lib/auth";

const MAX_BYTES = 5 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Detect the image type from the first bytes, never from the file name.
function sniff(b: Uint8Array): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return "gif";
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  )
    return "webp";
  return null;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "سجّل الدخول أولاً" }, { status: 401 });

  const fd = await request.formData().catch(() => null);
  const file = fd?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "لم يتم اختيار ملف" }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "حجم الصورة أكبر من 5 ميغابايت" }, { status: 413 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = sniff(bytes);
  if (!ext) return Response.json({ error: "الملف ليس صورة (JPG / PNG / WEBP / GIF)" }, { status: 415 });

  const name = `${randomBytes(16).toString("hex")}.${ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), bytes);
  return Response.json({ url: `/uploads/${name}` });
}
