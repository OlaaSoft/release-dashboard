import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "dashboard_auth";
const AUTH_SECRET = "olaasoft-release-dashboard-secret-2024";

export async function hashToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(password));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isAuthenticated(): Promise<boolean> {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    return true;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;

  const expectedToken = await hashToken(password);
  return token === expectedToken;
}

export function getAuthCookieName(): string {
  return AUTH_COOKIE_NAME;
}
