import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { PostForm } from "@/components/admin/site-forms";

export const metadata = { title: "مقال جديد" };

export default function NewPage() {
  return (
    <>
      <Link href="/admin/blog" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ChevronRight className="size-4" /> المدونة
      </Link>
      <PageHeader title="مقال جديد" />
      <PostForm post={null} />
    </>
  );
}
