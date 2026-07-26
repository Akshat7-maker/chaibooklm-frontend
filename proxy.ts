import { NextRequest, NextResponse } from "next/server";

const AUTH_PAGES = ["/login", "/register"];
const PROTECTED_PREFIXES = ["/notebook"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession = request.cookies.has("refreshToken");

  const isAuthPage = AUTH_PAGES.includes(pathname);

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Only protect notebook routes
  if (!hasSession && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Prevent logged-in users from visiting login/register
  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL("/notebook", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};