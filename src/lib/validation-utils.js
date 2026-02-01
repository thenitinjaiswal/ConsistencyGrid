/**
 * Input Validation & Sanitization Utilities
 * 
 * Production-grade validation for API inputs
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Validate email format
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
}

/**
 * Sanitize string input (remove XSS attempts)
 */
export function sanitizeString(input) {
    if (typeof input !== 'string') return '';
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}

/**
 * Validate plan ID format
 */
export function validatePlanId(planId) {
    const validPlans = ['free', 'pro_monthly', 'pro_yearly', 'lifetime'];
    return validPlans.includes(planId);
}

/**
 * Validate amount (in paise, minimum 0)
 */
export function validateAmount(amount) {
    return Number.isInteger(amount) && amount >= 0 && amount <= 999999999; // Up to ~10 million INR
}

/**
 * Validate date of birth
 */
export function validateDOB(dob) {
    const date = new Date(dob);
    if (isNaN(date.getTime())) return false;
    
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    
    // Must be between 8 and 150 years old
    return age >= 8 && age <= 150;
}

/**
 * Validate habit name
 */
export function validateHabitName(name) {
    const sanitized = sanitizeString(name);
    return sanitized.length >= 1 && sanitized.length <= 100;
}

/**
 * Validate goal title
 */
export function validateGoalTitle(title) {
    const sanitized = sanitizeString(title);
    return sanitized.length >= 1 && sanitized.length <= 200;
}

/**
 * Validate quote text
 */
export function validateQuoteText(quote) {
    const sanitized = sanitizeString(quote);
    return sanitized.length >= 1 && sanitized.length <= 500;
}

/**
 * Validate theme name
 */
export function validateTheme(theme) {
    const validThemes = [
        'minimal-dark',
        'sunset-orange',
        'ocean-blue',
        'forest-green',
        'purple-haze',
        'monochrome',
        'dark-minimal',
        'orange-glow'
    ];
    return validThemes.includes(theme);
}

/**
 * Validate subscription status
 */
export function validateSubscriptionStatus(status) {
    const validStatuses = ['active', 'cancelled', 'expired', 'pending'];
    return validStatuses.includes(status);
}
