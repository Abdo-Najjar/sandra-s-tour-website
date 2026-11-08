import { NextResponse, type NextRequest } from "next/server";

// 1. Dashboard: no session cookie → go to the login page. The real check
//    (is the session valid? what role?) happens on the server in lib/auth.ts.
// 2. Website languages: English at the plain URLs, Arabic under /ar. Plain
//    URLs are served from the /en pages behind the scenes; /en/... redirects
//    to the plain URL so every page has one address.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (request.cookies.has("session")) return NextResponse.next();
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  if (pathname === "/ar" || pathname.startsWith("/ar/")) return NextResponse.next();

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except the dashboard login, API/upload routes, Next.js
  // internals and plain files (images, icons, robots.txt...).
  matcher: ["/((?!login|api|uploads|_next|.*\\.[\\w]+$).*)"],
};
