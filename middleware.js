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

  // 2. If already logged in and trying to access auth routes (login/signup) -> dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 3. Handle onboarding redirection if not completed
  if (token && !token.onboarded && isProtectedRoute && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // 4. Add security headers
  const response = NextResponse.next();

  // Prevent clickjacking attacks
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS protection in older browsers
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Content Security Policy (prevent XSS, injection attacks)
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://checkout.razorpay.com https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: https://checkout.razorpay.com; frame-src 'self' https://checkout.razorpay.com https://js.stripe.com;"
  );

  // Referrer policy for privacy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy (Feature-Policy)
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  return response;
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
