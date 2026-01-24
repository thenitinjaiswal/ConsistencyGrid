import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Routes
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

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // ✅ If user is authenticated
    if (token) {
      const isOnboarded = token.onboarded

      // If onboarded user tries onboarding → redirect
      if (isOnboarded && pathname === ONBOARDING_ROUTE) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }

      // If NOT onboarded → force onboarding
      if (
        !isOnboarded &&
        PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
      ) {
        return NextResponse.redirect(new URL(ONBOARDING_ROUTE, req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // 🔥 IMPORTANT: Always return true
      // Let matcher control access, not this
      authorized: () => true,
    },
  }
)

// 🔥 PUBLIC ROUTES EXCLUDED HERE (MOST IMPORTANT PART)
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
    "/onboarding",
  ],
}
