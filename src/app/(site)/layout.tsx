import type { Metadata } from "next";
import { Amiri, Cairo, EB_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { SiteFooter, WhatsAppButton } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getMenuPages, getSite } from "@/lib/site/data";
import "./site.css";

const garamond = EB_Garamond({ variable: "--font-garamond", subsets: ["latin"], style: ["normal", "italic"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const amiri = Amiri({ variable: "--font-amiri", subsets: ["arabic"], weight: ["400", "700"] });
const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const { general } = await getSite();
  return {
    title: { default: general.seoTitle, template: `%s | ${general.name}` },
    description: general.seoDescription,
    icons: general.logo ? { icon: general.logo } : undefined,
    openGraph: { siteName: general.name, type: "website" },
  };
}

// Root layout for the public website (English, left-to-right, Stitch design).
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [site, menuPages] = await Promise.all([getSite(), getMenuPages()]);
  const { general } = site;
  const menu = [...general.menu, ...menuPages.map((p) => ({ label: p.title, href: `/p/${p.slug}` }))];

  return (
    <html lang="en" className={`${garamond.variable} ${jakarta.variable} ${amiri.variable} ${cairo.variable} antialiased`}>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0&display=block"
        />
      </head>
      <body className="min-h-screen bg-surface text-body-md text-on-surface">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <SiteHeader
          name={general.name}
          tagline={general.tagline}
          logo={general.logo}
          menu={menu}
          bookLabel={general.bookLabel}
          bookHref={general.bookHref}
        />
        <main id="main" className="min-h-screen w-full bg-surface pt-20">
          {children}
        </main>
        <SiteFooter site={site} extraLinks={menuPages} />
        <WhatsAppButton phone={site.contact.whatsapp} />
      </body>
    </html>
  );
}
