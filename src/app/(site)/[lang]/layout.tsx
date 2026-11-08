import type { Metadata } from "next";
import { Amiri, Cairo, EB_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { SiteFooter, WhatsAppButton } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { LangProvider } from "@/components/site/lang";
import { getMenuPages, getSite } from "@/lib/site/data";
import { dirOf, LANGS, ui } from "@/lib/site/i18n";
import { getLang } from "@/lib/site/lang";
import "../site.css";

const garamond = EB_Garamond({ variable: "--font-garamond", subsets: ["latin"], style: ["normal", "italic"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const amiri = Amiri({ variable: "--font-amiri", subsets: ["arabic"], weight: ["400", "700"] });
const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"] });

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const { general } = await getSite(lang);
  return {
    title: { default: general.seoTitle, template: `%s | ${general.name}` },
    description: general.seoDescription,
    openGraph: { siteName: general.name, type: "website", locale: lang === "ar" ? "ar_SY" : "en_US" },
    alternates: { languages: { en: "/", ar: "/ar" } },
  };
}

// Root layout for the public website. English is left-to-right, Arabic is
// right-to-left with Arabic fonts (see site.css).
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  const t = ui[lang];
  const [site, menuPages] = await Promise.all([getSite(lang), getMenuPages(lang)]);
  const { general } = site;
  const menu = [...general.menu, ...menuPages.map((p) => ({ label: p.title, href: `/p/${p.slug}` }))];

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={`${garamond.variable} ${jakarta.variable} ${amiri.variable} ${cairo.variable} antialiased`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0&display=block"
        />
      </head>
      <body className="min-h-screen bg-surface text-body-md text-on-surface">
        <LangProvider lang={lang}>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-white">
            {t.skipToContent}
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
          <WhatsAppButton phone={site.contact.whatsapp} label={t.whatsappChat} />
        </LangProvider>
      </body>
    </html>
  );
}
