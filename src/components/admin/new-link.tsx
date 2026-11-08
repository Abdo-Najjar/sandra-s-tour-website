import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";

export function NewLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
      <Plus className="size-4" />
      {label}
    </Link>
  );
}

// "‹ Tours" above an editor; the arrow flips in Arabic.
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
      <ChevronLeft className="size-4 rtl:-scale-x-100" /> {label}
    </Link>
  );
}
