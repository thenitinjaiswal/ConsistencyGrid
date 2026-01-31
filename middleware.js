import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Securely get the token using the secret
  // This verifies the JWT signature and content server-side
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // 1. If trying to access protected route without token -> redirect to login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    // Store the attempted URL to redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If already logged in and trying to access auth routes (login/signup) or landing page -> dashboard
  if (token && (isAuthRoute || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 3. Handle onboarding redirection if not completed
  if (token && !token.onboarded && isProtectedRoute && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
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
