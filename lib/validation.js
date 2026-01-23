/**
 * Input Validation Utility
 * Prevents XSS, SQL Injection, and other attacks
 */

export const ValidationRules = {
  // Email validation
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Username: alphanumeric, underscore, hyphen (3-20 chars)
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  
  // Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  
  // URL safe
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

/**
 * Sanitize string input
 * Removes potentially dangerous characters
 */
export function sanitizeString(input) {
  if (typeof input !== "string") return "";
  
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/[&"']/g, (char) => {
      const escapeMap = { "&": "&amp;", '"': "&quot;", "'": "&#x27;" };
      return escapeMap[char];
    })
    .substring(0, 1000); // Max 1000 chars
}

/**
 * Validate email
 */
export function validateEmail(email) {
  if (!email || typeof email !== "string") return false;
  const sanitized = sanitizeString(email);
  return ValidationRules.email.test(sanitized) && sanitized.length <= 254;
}

/**
 * Validate username
 */
export function validateUsername(username) {
  if (!username || typeof username !== "string") return false;
  return ValidationRules.username.test(sanitizeString(username));
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  if (!password || typeof password !== "string") return false;
  return ValidationRules.password.test(password) && password.length >= 8;
}

/**
 * Validate habit name
 */
export function validateHabitName(name) {
  const sanitized = sanitizeString(name);
  return sanitized.length >= 1 && sanitized.length <= 100;
}

/**
 * Validate goal name
 */
export function validateGoalName(name) {
  const sanitized = sanitizeString(name);
  return sanitized.length >= 1 && sanitized.length <= 200;
}

/**
 * Validate reminder message
 */
export function validateReminderMessage(message) {
  const sanitized = sanitizeString(message);
  return sanitized.length >= 1 && sanitized.length <= 500;
}

/**
 * Validate number input
 */
export function validateNumber(input, min = 0, max = 999999) {
  const num = Number(input);
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * Validate date
 */
export function validateDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Validate boolean
 */
export function validateBoolean(input) {
  return typeof input === "boolean" || input === "true" || input === "false";
}

/**
 * Validate array of strings
 */
export function validateStringArray(arr, maxItems = 50, maxLength = 100) {
  if (!Array.isArray(arr)) return false;
  if (arr.length > maxItems) return false;
  return arr.every(
    (item) =>
      typeof item === "string" &&
      item.length > 0 &&
      item.length <= maxLength
  );
}

/**
 * General input sanitization for objects
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return {};

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Sanitize key
    const safeKey = sanitizeString(key);
    
    if (typeof value === "string") {
      sanitized[safeKey] = sanitizeString(value);
    } else if (typeof value === "number") {
      sanitized[safeKey] = Number(value);
    } else if (typeof value === "boolean") {
      sanitized[safeKey] = Boolean(value);
    } else if (Array.isArray(value)) {
      sanitized[safeKey] = value.map(
        (item) =>
          typeof item === "string" ? sanitizeString(item) : item
      );
    }
  }

  return sanitized;
}

/**
 * Validate API request body
 */
export function validateRequestBody(body, requiredFields = []) {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  // Check required fields
  for (const field of requiredFields) {
    if (!(field in body) || body[field] === null || body[field] === undefined) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  return { valid: true, data: sanitizeObject(body) };
}
