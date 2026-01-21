/**
 * Middleware for Route Protection
 * 
 * Handles:
 * - Redirecting unauthenticated users to login
 * - Redirecting authenticated but not-onboarded users to onboarding
 * - Allowing already-onboarded users to access their routes
 */

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/login", "/signup", "/pricing", "/help"];

// Onboarding route - only for authenticated users who haven't completed onboarding
const ONBOARDING_ROUTE = "/onboarding";

// Protected routes that require onboarding
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
];

export const middleware = withAuth(
  function onSuccess(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Allow public routes for everyone
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    // Check if user is onboarded
    const isOnboarded = token?.onboarded;

    // If user is already onboarded
    if (isOnboarded) {
      // Redirect from onboarding to dashboard
      if (pathname === ONBOARDING_ROUTE) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      // Allow access to protected routes
      return NextResponse.next();
    }

    // If user is NOT onboarded
    if (!isOnboarded) {
      // Allow onboarding route
      if (pathname === ONBOARDING_ROUTE) {
        return NextResponse.next();
      }
      // Redirect protected routes to onboarding
      if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access if authenticated
        return !!token;
      },
    },
  }
);

// Specify which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
