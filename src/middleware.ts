import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES = ["/dashboard", "/earn-coins", "/get-followers"];
const PUBLIC_AUTH_ROUTES = ["/", "/login", "/signup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read NextAuth JWT from cookies
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const loggedIn = !!token;

  // 1) If user is NOT logged in and tries to access a protected route
  if (
    !loggedIn &&
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/"; // or "/login"
    return NextResponse.redirect(url);
  }

  // 2) If user IS logged in and tries to access auth pages (/, /login, etc.)
  if (loggedIn && PUBLIC_AUTH_ROUTES.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 3) Otherwise allow request
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
