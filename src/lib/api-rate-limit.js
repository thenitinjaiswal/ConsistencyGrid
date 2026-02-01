/**
 * API Rate Limiting Utility
 * 
 * In-memory rate limiting for production APIs
 * For 100k users, consider Redis-based rate limiting on deployment
 */

const rateLimitStore = new Map();

/**
 * Clean up old entries every 5 minutes
 */
setInterval(() => {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    
    for (const [key, entries] of rateLimitStore.entries()) {
        const filtered = entries.filter(timestamp => timestamp > fiveMinutesAgo);
        if (filtered.length === 0) {
            rateLimitStore.delete(key);
        } else {
            rateLimitStore.set(key, filtered);
        }
    }
}, 5 * 60 * 1000);

/**
 * Check if request is rate limited
 * @param {string} identifier - User ID or IP address
 * @param {number} maxRequests - Max requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - true if rate limited, false if allowed
 */
export function isRateLimited(identifier, maxRequests = 10, windowMs = 60000) {
    if (!identifier) return false;
    
    const now = Date.now();
    const windowStart = now - windowMs;
    
    let entries = rateLimitStore.get(identifier) || [];
    
    // Filter out old entries
    entries = entries.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    if (entries.length >= maxRequests) {
        return true;
    }
    
    // Add current request
    entries.push(now);
    rateLimitStore.set(identifier, entries);
    
    return false;
}

/**
 * Get remaining requests for rate limited endpoint
 */
export function getRemainingRequests(identifier, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const entries = (rateLimitStore.get(identifier) || []).filter(
        timestamp => timestamp > windowStart
    );
    
    return Math.max(0, maxRequests - entries.length);
}

/**
 * Reset rate limit for a user (admin use)
 */
export function resetRateLimit(identifier) {
    rateLimitStore.delete(identifier);
}
