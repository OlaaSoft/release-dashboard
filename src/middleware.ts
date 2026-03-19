import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const AUTH_COOKIE_NAME = "dashboard_auth";
const AUTH_SECRET = "olaasoft-release-dashboard-secret-2024";

function hashToken(password: string): string {
  return crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(password)
    .digest("hex");
}

export function middleware(request: NextRequest) {
  const password = process.env.DASHBOARD_PASSWORD;

  // If no password configured, allow everything
  if (!password) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow login page and auth API
  if (pathname === "/login" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check auth cookie
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const expectedToken = hashToken(password);

  if (token !== expectedToken) {
    // Redirect to login for pages, return 401 for API routes
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
