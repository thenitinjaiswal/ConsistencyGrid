import { NextResponse } from "next/server"

const ONBOARDING_ROUTE = "/onboarding"

const PROTECTED_ROUTES = [
  "/dashboard",
  "/generator",
  "/habits",
  "/goals",
  "/reminders",
  "/streaks",
  "/calendar",
  "/settings",
  "/analytics",
]

export function middleware(req) {
  const { pathname } = req.nextUrl

  // 🔥 READ COOKIE DIRECTLY
  // ✅ Check for NextAuth session token
  // Supporting both production and development cookie names
  const sessionToken =
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("token")?.value; // Keep legacy "token" as fallback

  // ❌ NOT LOGGED IN → block protected routes
  if (
    !sessionToken &&
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // ✅ LOGGED IN
  if (sessionToken) {
    // ⚠️ onboarding check (simple version)
    // If you store `onboarded` in JWT, decode it here later
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/generator/:path*",
    "/habits/:path*",
    "/goals/:path*",
    "/reminders/:path*",
    "/streaks/:path*",
    "/calendar/:path*",
    "/settings/:path*",
    "/analytics/:path*",
    "/login",
    "/onboarding",
  ],
}
