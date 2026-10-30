import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { PageForm } from "@/components/admin/site-forms";

export const metadata = { title: "صفحة جديدة" };

export default function NewPage() {
  return (
    <>
      <Link href="/admin/pages" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ChevronRight className="size-4" /> صفحات إضافية
      </Link>
      <PageHeader title="صفحة جديدة" />
      <PageForm page={null} />
    </>
  );
}
