import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "admin_token";

export async function requireAdmin() {
  const cookieStore = await cookies();

  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!adminToken) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  return null; // admin OK
}
