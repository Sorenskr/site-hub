import { createHash } from "crypto";

function secret(): string {
  return (
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "site-hub-default-secret"
  );
}

export function signToken(password: string): string {
  return createHash("sha256")
    .update(`${password}:${secret()}`)
    .digest("hex");
}

export function verifyToken(token: string | undefined): boolean {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd || !token) return false;
  return token === signToken(pwd);
}

export const ADMIN_COOKIE = "site_hub_admin";
