/**
 * Consistent Error Response Handler
 * Provides secure and user-friendly error responses
 */

/**
 * Error codes and HTTP status mappings
 */
export const ErrorCodes = {
  // Authentication (400-403)
  INVALID_CREDENTIALS: { code: "INVALID_CREDENTIALS", status: 401, message: "Invalid credentials" },
  UNAUTHORIZED: { code: "UNAUTHORIZED", status: 401, message: "Unauthorized access" },
  FORBIDDEN: { code: "FORBIDDEN", status: 403, message: "Access forbidden" },
  
  // Validation (400)
  INVALID_INPUT: { code: "INVALID_INPUT", status: 400, message: "Invalid input provided" },
  MISSING_FIELD: { code: "MISSING_FIELD", status: 400, message: "Missing required field" },
  INVALID_EMAIL: { code: "INVALID_EMAIL", status: 400, message: "Invalid email format" },
  WEAK_PASSWORD: { code: "WEAK_PASSWORD", status: 400, message: "Password does not meet requirements" },
  
  // Rate Limiting (429)
  RATE_LIMITED: { code: "RATE_LIMITED", status: 429, message: "Too many requests. Please try again later" },
  
  // Not Found (404)
  NOT_FOUND: { code: "NOT_FOUND", status: 404, message: "Resource not found" },
  USER_NOT_FOUND: { code: "USER_NOT_FOUND", status: 404, message: "User not found" },
  
  // Conflict (409)
  DUPLICATE_EMAIL: { code: "DUPLICATE_EMAIL", status: 409, message: "Email already registered" },
  DUPLICATE_RESOURCE: { code: "DUPLICATE_RESOURCE", status: 409, message: "Resource already exists" },
  
  // Server Error (500)
  INTERNAL_ERROR: { code: "INTERNAL_ERROR", status: 500, message: "Internal server error" },
  DATABASE_ERROR: { code: "DATABASE_ERROR", status: 500, message: "Database operation failed" },
};

/**
 * Create standardized error response
 */
export function createErrorResponse(errorCode, customMessage = null) {
  const errorDef = typeof errorCode === "string" ? ErrorCodes[errorCode] : errorCode;
  
  if (!errorDef) {
    return {
      success: false,
      error: { code: "UNKNOWN_ERROR", message: "An unknown error occurred" },
      status: 500,
    };
  }

  return {
    success: false,
    error: {
      code: errorDef.code,
      message: customMessage || errorDef.message,
    },
    status: errorDef.status,
  };
}

/**
 * Create standardized success response
 */
export function createSuccessResponse(data, message = "Success") {
  return {
    success: true,
    message,
    data,
    status: 200,
  };
}

/**
 * Handle API errors with proper logging
 */
export function handleApiError(error, context = "") {
  console.error(`[API Error] ${context}:`, error);

  // Database errors
  if (error.message?.includes("Prisma")) {
    return createErrorResponse("DATABASE_ERROR");
  }

  // Network errors
  if (error.message?.includes("ECONNREFUSED")) {
    return createErrorResponse("DATABASE_ERROR");
  }

  // Validation errors
  if (error.code === "P2002") {
    // Unique constraint
    return createErrorResponse("DUPLICATE_RESOURCE");
  }

  if (error.code === "P2025") {
    // Not found
    return createErrorResponse("NOT_FOUND");
  }

  // Default to internal error (don't expose details)
  return createErrorResponse("INTERNAL_ERROR");
}

/**
 * Format response with status code
 */
export function formatResponse(response) {
  const status = response.status || (response.success ? 200 : 400);
  const body = { ...response };
  delete body.status;

  return { body, status };
}

/**
 * Validate and return error or success
 */
export function validateAndRespond(validationResult, successData, successMessage = "Success") {
  if (!validationResult.valid) {
    return createErrorResponse("INVALID_INPUT", validationResult.error);
  }

  return createSuccessResponse(successData, successMessage);
}
