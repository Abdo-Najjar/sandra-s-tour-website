import Link from "next/link";
import { Plus } from "lucide-react";

export function NewLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
      <Plus className="size-4" />
      {label}
    </Link>
  );
}
