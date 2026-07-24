import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PAGES = ["/login", "/register"];
const PROTECTED_PREFIXES = ["/notebooks"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("pathname proxy", pathname);

  const hasSession = request.cookies.has("refreshToken");
  console.log("hasSession", hasSession);
  const isAuthPage = AUTH_PAGES.some((path) => pathname === path);
//   const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // Not logged in, trying to access a protected route → send to login
  if (!hasSession && !isAuthPage) {
    const loginUrl = new URL("/login", request.url);
    // loginUrl.searchParams.set("from", pathname); // optional: redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in, trying to visit login/register → send to app
  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL("/notebook", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};