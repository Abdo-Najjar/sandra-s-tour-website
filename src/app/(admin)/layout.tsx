import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./admin.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Dashboard" },
  description: "Syria Guide Tours dashboard",
  robots: { index: false, follow: false },
};

// Root layout for the dashboard and the login page. The language (English or
// Arabic) is chosen per user; see lib/admin/i18n.ts.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cairo.variable} h-full antialiased`}>
      <head>
        {/* Material Symbols: icon previews in the website editors */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0&display=block"
        />
      </head>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
