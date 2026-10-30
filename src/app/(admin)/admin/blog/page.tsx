import { Suspense } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { NewLink } from "@/components/admin/new-link";
import { PostRowActions } from "@/components/admin/site-forms";
import { getAdminPosts } from "@/lib/queries";

export const metadata = { title: "المدونة" };

export default function BlogAdminPage() {
  return (
    <>
      <PageHeader title="المدونة" subtitle="اكتب المقالات وعدّلها وانشرها" action={<NewLink href="/admin/blog/new" label="مقال جديد" />} />
      <Suspense fallback={<ContentSkeleton />}>
        <PostsList />
      </Suspense>
    </>
  );
}

async function PostsList() {
  const posts = await getAdminPosts();
  if (!posts.length) return <Card className="py-12 text-center text-muted">لا توجد مقالات بعد.</Card>;
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-muted">
            <tr>
              <th className="px-5 py-3 text-right font-medium">المقال</th>
              <th className="px-5 py-3 text-right font-medium">التصنيف</th>
              <th className="px-5 py-3 text-right font-medium">التاريخ</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-5 py-3">
                  <Link href={`/admin/blog/${p.id}`} className="flex items-center gap-3 hover:text-primary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover || "/site/logo.png"} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold" dir="auto">
                        {p.featured && <Star className="size-3.5 shrink-0 fill-current text-warning" />}
                        {p.title}
                      </div>
                      <div className="text-xs text-muted">{p.author}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-5 py-3">{p.category}</td>
                <td className="px-5 py-3 whitespace-nowrap text-muted" dir="ltr">{p.publishedAt}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end">
                    <PostRowActions id={p.id} published={p.published} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
