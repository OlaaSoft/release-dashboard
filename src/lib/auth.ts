import { cookies } from "next/headers";
import crypto from "crypto";

const AUTH_COOKIE_NAME = "dashboard_auth";
const AUTH_SECRET = "olaasoft-release-dashboard-secret-2024";

export function hashToken(password: string): string {
  return crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(password)
    .digest("hex");
}

export async function isAuthenticated(): Promise<boolean> {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    // If no password is set, allow access (dev mode)
    return true;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;

  const expectedToken = hashToken(password);
  return token === expectedToken;
}

export function getAuthCookieName(): string {
  return AUTH_COOKIE_NAME;
}
