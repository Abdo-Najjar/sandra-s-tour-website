"use client";

import { Icon } from "@/components/site/bits";
import { Link, useUi } from "@/components/site/lang";

export default function NotFound() {
  const t = useUi();
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-margin-mobile py-space-3xl text-center">
      <div>
        <Icon name="explore_off" className="text-[56px] text-antique-gold" />
        <h1 className="mt-space-sm font-display text-headline-xl text-primary">{t.notFoundTitle}</h1>
        <p className="mt-2 text-body-lead text-on-surface-variant">{t.notFoundText}</p>
        <div className="mt-space-lg flex flex-wrap justify-center gap-space-sm">
          <Link href="/" className="rounded-lg bg-primary px-space-lg py-3 text-label-lg text-white hover:bg-primary-light">
            {t.backHome}
          </Link>
          <Link href="/tours" className="rounded-lg border border-surface-container-high px-space-lg py-3 text-label-lg text-primary hover:bg-surface-container">
            {t.browseTours}
          </Link>
        </div>
      </div>
    </section>
  );
}
