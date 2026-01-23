/**
 * Rate Limiting Middleware
 * Prevents brute force attacks and DoS
 */

const requestCounts = new Map(); // Store: IP -> { count, resetTime }

/**
 * Get client IP from request
 */
function getClientIP(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Rate limiting configuration
 */
export const RateLimitConfig = {
  // Auth endpoints: 5 attempts per 15 minutes
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
  
  // API endpoints: 100 requests per minute
  api: { maxRequests: 100, windowMs: 60 * 1000 },
  
  // Search/expensive operations: 30 requests per minute
  search: { maxRequests: 30, windowMs: 60 * 1000 },
};

/**
 * Rate limit middleware
 */
export function rateLimit(config = RateLimitConfig.api) {
  return (req) => {
    const clientIP = getClientIP(req);
    const now = Date.now();
    
    // Get or create entry for this IP
    let entry = requestCounts.get(clientIP);
    
    if (!entry || now > entry.resetTime) {
      // Reset window
      requestCounts.set(clientIP, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return { allowed: true };
    }
    
    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      return {
        allowed: false,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      };
    }
    
    // Increment count
    entry.count++;
    return { allowed: true };
  };
}

/**
 * Cleanup old entries (run periodically)
 */
export function cleanupRateLimitCache() {
  const now = Date.now();
  for (const [key, entry] of requestCounts.entries()) {
    if (now > entry.resetTime) {
      requestCounts.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupRateLimitCache, 5 * 60 * 1000);
