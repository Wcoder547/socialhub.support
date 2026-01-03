// src/lib/admin-auth.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "admin_token";

export function requireAdmin() {
  // Force unwrap to the correct runtime type
  const cookieStore =
    cookies() as any as import("next/dist/server/web/spec-extension/adapters/request-cookies").ReadonlyRequestCookies;

  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!adminToken) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  return null;
}
