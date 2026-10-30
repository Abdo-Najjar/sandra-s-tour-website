import { NextResponse, type NextRequest } from "next/server";

// Fast first check for the dashboard: no session cookie → go to the login page.
// The real check (is the session valid? what role?) happens on the server in lib/auth.ts.
// The public website is not touched.
export function proxy(request: NextRequest) {
  if (request.cookies.has("session")) return NextResponse.next();

  const url = new URL("/login", request.url);
  url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
