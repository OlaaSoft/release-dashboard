import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "dashboard_auth";

export async function middleware(request: NextRequest) {
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
  const expectedToken = await hashToken(password);

  if (token !== expectedToken) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

async function hashToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode("olaasoft-release-dashboard-secret"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(password));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
