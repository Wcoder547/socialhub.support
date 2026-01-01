import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES = ["/dashboard", "/earn-coins", "/get-followers"];
const PUBLIC_AUTH_ROUTES = ["/", "/login", "/signup"];

const ADMIN_COOKIE_NAME = "admin_token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;


  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const loggedIn = !!token;

  if (
    !loggedIn &&
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (loggedIn && PUBLIC_AUTH_ROUTES.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }


  if (pathname.startsWith("/admin")) {
    const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

    // no admin cookie: allow only /admin/login
    if (!adminToken) {
      if (pathname === "/admin/login") {
        return NextResponse.next();
      }
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // cookie exists: treat as admin; block login page
    if (pathname === "/admin/login") {
      const dashboardUrl = new URL("/admin/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
