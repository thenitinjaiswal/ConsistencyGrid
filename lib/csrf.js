/**
 * CSRF (Cross-Site Request Forgery) Protection
 * 
 * Implements token-based CSRF protection for form submissions
 * and state-changing API requests
 */

import crypto from "crypto";
import { cookies } from "next/headers";

/**
 * Generate CSRF token
 */
export function generateCSRFToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Set CSRF token in cookie (server-side)
 */
export async function setCSRFTokenCookie() {
  try {
    const cookieStore = await cookies();
    const token = generateCSRFToken();
    
    cookieStore.set("csrf-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return token;
  } catch (error) {
    console.error("Failed to set CSRF token:", error);
    return null;
  }
}

/**
 * Get CSRF token from cookie (server-side)
 */
export async function getCSRFToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("csrf-token")?.value;
    return token || null;
  } catch (error) {
    console.error("Failed to get CSRF token:", error);
    return null;
  }
}

/**
 * Verify CSRF token (server-side)
 * Compare header token with cookie token
 */
export function verifyCSRFToken(headerToken, cookieToken) {
  // Both must exist
  if (!headerToken || !cookieToken) {
    return false;
  }

  // Compare using constant-time comparison to prevent timing attacks
  return constantTimeCompare(headerToken, cookieToken);
}

/**
 * Constant-time string comparison
 * Prevents timing attacks
 */
function constantTimeCompare(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * CSRF protection middleware for API routes
 * Usage:
 * const valid = await validateCSRFRequest(req);
 * if (!valid) return Response.json({ error: "CSRF validation failed" }, { status: 403 });
 */
export async function validateCSRFRequest(req) {
  // Skip for GET requests (safe operations)
  if (req.method === "GET" || req.method === "HEAD") {
    return true;
  }

  try {
    const headerToken = req.headers.get("x-csrf-token");
    const cookieHeader = req.headers.get("cookie");

    // Extract CSRF token from cookies
    let cookieToken = null;
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map((c) => c.trim());
      const csrfCookie = cookies.find((c) => c.startsWith("csrf-token="));
      if (csrfCookie) {
        cookieToken = csrfCookie.split("=")[1];
      }
    }

    return verifyCSRFToken(headerToken, cookieToken);
  } catch (error) {
    console.error("CSRF validation error:", error);
    return false;
  }
}

/**
 * HTML helper to include CSRF token in forms
 * Usage: <%= csrfTokenInput() %>
 */
export function csrfTokenInput(token) {
  return `<input type="hidden" name="csrf-token" value="${token}" />`;
}

/**
 * JavaScript helper to send CSRF token with API requests
 * Usage in client-side code:
 * 
 * const response = await fetch('/api/endpoint', {
 *   method: 'POST',
 *   headers: {
 *     'X-CSRF-Token': await getCSRFToken(),
 *     'Content-Type': 'application/json',
 *   },
 *   body: JSON.stringify(data),
 * });
 */
export async function getCSRFTokenFromPage() {
  // Get from meta tag or cookie
  const meta = document.querySelector('meta[name="csrf-token"]');
  if (meta) {
    return meta.getAttribute("content");
  }

  // Fallback: extract from cookie
  const name = "csrf-token=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length);
    }
  }

  return null;
}
