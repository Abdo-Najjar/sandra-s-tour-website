import { Suspense } from "react";
import { Package } from "lucide-react";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { NewProductButton } from "@/components/forms";
import { DeleteProductButton, StockEditor } from "@/components/row-actions";
import { formatMoney, formatNumber } from "@/lib/format";
import { getProducts, getSettings } from "@/lib/queries";
import { requireUser } from "@/lib/auth";

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="rounded-full bg-danger-soft px-2.5 py-1 text-xs font-semibold text-danger">نفد المخزون</span>;
  if (stock < 15) return <span className="rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">مخزون منخفض</span>;
  return <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">متوفر</span>;
}

export default function ProductsPage() {
  return (
    <>
      <PageHeader title="المنتجات" subtitle="المخزون والأسعار والمبيعات" action={<NewProductButton />} />
      <Suspense fallback={<ContentSkeleton />}>
        <ProductsContent />
      </Suspense>
    </>
  );
}

async function ProductsContent() {
  const [me, products, settings] = await Promise.all([requireUser(), getProducts(), getSettings()]);

  return (
    <>
      {products.length === 0 && (
        <Card className="py-12 text-center text-muted">لا توجد منتجات بعد. أضف أول منتج.</Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => (
          <Card key={p.id}>
            <div className="mb-4 grid h-32 place-items-center rounded-lg bg-surface-2 text-muted">
              <Package className="size-10" />
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-xs text-muted">{p.category}</p>
              </div>
              <div className="flex items-center gap-1">
                <StockBadge stock={p.stock} />
                {me.role === "admin" && <DeleteProductButton id={p.id} />}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center text-sm">
              <div>
                <div className="text-xs text-muted">السعر</div>
                <div className="font-bold">{formatMoney(p.price, settings.currency)}</div>
              </div>
              <div>
                <div className="text-xs text-muted">المخزون</div>
                <StockEditor key={p.stock} id={p.id} stock={p.stock} />
              </div>
              <div>
                <div className="text-xs text-muted">المبيعات</div>
                <div className="font-bold">{formatNumber(p.sold)}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
