import type { Metadata } from "next";
import Link from "next/link";
import { EB_Garamond } from "next/font/google";

const garamond = EB_Garamond({ subsets: ["latin"] });

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

// 404 for URLs that match no route at all (the app has two root layouts).
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#fbfaf7", color: "#15243d", textAlign: "center", padding: 24 }}
        className={garamond.className}
      >
        <main>
          <p style={{ color: "#c39a58", fontSize: 18, margin: 0, letterSpacing: "0.2em" }}>404</p>
          <h1 style={{ fontSize: 40, margin: "8px 0" }}>This path is not on our map</h1>
          <p style={{ fontFamily: "system-ui, sans-serif", color: "#495260" }}>The page you are looking for has moved or no longer exists.</p>
          <Link href="/" style={{ display: "inline-block", marginTop: 16, background: "#15243d", color: "#fff", padding: "12px 24px", borderRadius: 8, fontFamily: "system-ui, sans-serif", textDecoration: "none" }}>
            Back to Home
          </Link>
        </main>
      </body>
    </html>
  );
}
