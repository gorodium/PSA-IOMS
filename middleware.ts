import { NextResponse, type NextRequest } from "next/server";

const sessionCookieName = "ioms_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(sessionCookieName)?.value);
  const protectedPaths = ["/projects/new", "/admin", "/settings", "/vehicle-requests", "/room-reservations", "/convocation/admin"];
  const isProtectedProjectEdit = /^\/projects\/[^/]+\/edit$/.test(pathname);
  const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`)) || isProtectedProjectEdit;

  if (!hasSession && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/projects/:path*", "/personnel/:path*", "/admin/:path*", "/settings/:path*", "/vehicle-requests/:path*", "/room-reservations/:path*", "/convocation/:path*", "/login"]
};
