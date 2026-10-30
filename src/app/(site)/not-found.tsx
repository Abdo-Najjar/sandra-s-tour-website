import Link from "next/link";
import { Icon } from "@/components/site/bits";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-margin-mobile py-space-3xl text-center">
      <div>
        <Icon name="explore_off" className="text-[56px] text-antique-gold" />
        <h1 className="mt-space-sm font-display text-headline-xl text-primary">This path is not on our map</h1>
        <p className="mt-2 text-body-lead text-on-surface-variant">The page you are looking for has moved or no longer exists.</p>
        <div className="mt-space-lg flex flex-wrap justify-center gap-space-sm">
          <Link href="/" className="rounded-lg bg-primary px-space-lg py-3 text-label-lg text-white hover:bg-primary-light">
            Back to Home
          </Link>
          <Link href="/tours" className="rounded-lg border border-surface-container-high px-space-lg py-3 text-label-lg text-primary hover:bg-surface-container">
            Browse Tours
          </Link>
        </div>
      </div>
    </section>
  );
}
