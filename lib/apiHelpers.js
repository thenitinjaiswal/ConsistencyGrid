/**
 * Secure API Route Helper
 * Provides authentication, validation, and error handling
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { rateLimit, RateLimitConfig } from "@/lib/rateLimit";
import { createErrorResponse, createSuccessResponse, handleApiError } from "@/lib/errorResponse";
import { sanitizeObject, validateRequestBody } from "@/lib/validation";

/**
 * Get authenticated user from session
 */
export async function getAuthenticatedUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { error: createErrorResponse("UNAUTHORIZED"), user: null };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: createErrorResponse("USER_NOT_FOUND"), user: null };
    }

    return { error: null, user };
  } catch (error) {
    return { error: handleApiError(error, "getAuthenticatedUser"), user: null };
  }
}

/**
 * Validate request and return error or data
 */
export async function validateRequest(req, requiredFields = []) {
  try {
    const body = await req.json();
    const result = validateRequestBody(body, requiredFields);

    if (!result.valid) {
      return { valid: false, error: createErrorResponse("INVALID_INPUT", result.error), data: null };
    }

    return { valid: true, error: null, data: result.data };
  } catch (error) {
    return { valid: false, error: handleApiError(error, "validateRequest"), data: null };
  }
}

/**
 * Apply rate limiting to request
 */
export function applyRateLimit(req, config = RateLimitConfig.api) {
  const result = rateLimit(config)(req);
  
  if (!result.allowed) {
    return {
      limited: true,
      error: createErrorResponse("RATE_LIMITED"),
      retryAfter: result.retryAfter,
    };
  }

  return { limited: false, error: null };
}

/**
 * Create JSON response with proper headers
 */
export function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

/**
 * Error response
 */
export function errorResponse(error, status = 500, headers = {}) {
  return jsonResponse(error, status, headers);
}

/**
 * Success response
 */
export function successResponse(data, message = "Success", status = 200) {
  return jsonResponse(
    createSuccessResponse(data, message),
    status
  );
}

/**
 * CSRF token validation (for form submissions)
 */
export function validateCSRFToken(req, token) {
  const headerToken = req.headers.get("x-csrf-token");
  const cookieToken = req.cookies?.get("csrf-token")?.value;

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return false;
  }

  return true;
}
