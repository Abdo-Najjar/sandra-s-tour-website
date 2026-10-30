import { NextResponse, type NextRequest } from "next/server";

// Fast first check: no session cookie → go to the login page.
// The real check (is the session valid?) happens on the server in lib/auth.ts.
export function proxy(request: NextRequest) {
  if (request.cookies.has("session")) return NextResponse.next();

  const url = new URL("/login", request.url);
  const next = request.nextUrl.pathname + request.nextUrl.search;
  if (next !== "/") url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except the login page, Next internals and static files.
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)"],
};
