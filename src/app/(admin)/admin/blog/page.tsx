import { Suspense } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { NewLink } from "@/components/admin/new-link";
import { PostRowActions } from "@/components/admin/site-forms";
import { getAdminPosts } from "@/lib/queries";
import { pick } from "@/lib/site/translatable";
import { getAdminLang, getT } from "@/lib/admin/lang";

export const metadata = { title: "Blog" };

export default async function BlogAdminPage() {
  const t = await getT();
  return (
    <>
      <PageHeader
        title={t("Blog")}
        subtitle={t("Write, edit and publish articles")}
        action={<NewLink href="/admin/blog/new" label={t("New article")} />}
      />
      <Suspense fallback={<ContentSkeleton />}>
        <PostsList />
      </Suspense>
    </>
  );
}

async function PostsList() {
  const [posts, lang, t] = await Promise.all([getAdminPosts(), getAdminLang(), getT()]);
  if (!posts.length) return <Card className="py-12 text-center text-muted">{t("No articles yet.")}</Card>;
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="rtable w-full text-sm">
          <thead className="bg-surface-2 text-muted">
            <tr>
              <th className="px-5 py-3 text-start font-medium">{t("Article")}</th>
              <th className="px-5 py-3 text-start font-medium">{t("Category")}</th>
              <th className="px-5 py-3 text-start font-medium">{t("Date")}</th>
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
                        {pick(p.title, lang)}
                      </div>
                      <div className="text-xs text-muted" dir="auto">{pick(p.author, lang)}</div>
                    </div>
                  </Link>
                </td>
                <td data-label={t("Category")} className="px-5 py-3" dir="auto">{pick(p.category, lang)}</td>
                <td data-label={t("Date")} className="px-5 py-3 whitespace-nowrap text-muted"><span dir="ltr">{p.publishedAt}</span></td>
                <td className="rtable-end px-5 py-3">
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
