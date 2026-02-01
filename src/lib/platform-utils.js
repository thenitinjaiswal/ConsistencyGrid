/**
 * Platform Detection Utilities
 * 
 * This module provides utilities to detect the platform (Web vs Android App)
 * and control payment UI visibility to comply with Play Store policies.
 * 
 * Strategy: Hide payment UI in Android app to avoid 15-30% Play Store commission.
 * Users subscribe via website, and subscription syncs automatically to the app.
 * 
 * @module platform-utils
 */

/**
 * Detect if the application is running in Android WebView
 * 
 * Detection methods:
 * 1. User Agent string analysis
 * 2. Custom Android interface injection (if configured)
 * 
 * @returns {boolean} True if running in Android WebView, false otherwise
 * 
 * @example
 * if (isAndroidApp()) {
 *   console.log('Running in Android app');
 * }
 */
export function isAndroidApp() {
    // Server-side rendering check
    if (typeof window === 'undefined') return false;

    try {
        const userAgent = navigator.userAgent.toLowerCase();

        // Check for WebView patterns in user agent
        const isWebView = /webview|wv|android.*applewebkit(?!.*chrome)/i.test(userAgent);

        // Check for custom Android interface (if you inject one from Kotlin/Java)
        // Example: window.Android = { platform: 'android' }
        const hasAndroidInterface = typeof window.Android !== 'undefined';

        // Check for custom app identifier in localStorage (set by Android app on first load)
        const hasAppFlag = typeof window !== 'undefined' &&
            localStorage.getItem('consistencygrid_platform') === 'android';

        return isWebView || hasAndroidInterface || hasAppFlag;
    } catch (error) {
        console.error('Error detecting Android platform:', error);
        return false;
    }
}

/**
 * Get the current platform name
 * 
 * @returns {'web' | 'android'} Platform identifier
 * 
 * @example
 * const platform = getPlatform();
 * console.log(`Running on: ${platform}`);
 */
export function getPlatform() {
    return isAndroidApp() ? 'android' : 'web';
}

/**
 * Determine if payment UI should be displayed
 * 
 * Payment UI is hidden in Android app to comply with Play Store policies.
 * Users are directed to the website for subscriptions.
 * 
 * @returns {boolean} True if payment UI should be shown, false otherwise
 * 
 * @example
 * {shouldShowPaymentUI() && (
 *   <PaymentButton />
 * )}
 */
export function shouldShowPaymentUI() {
    return !isAndroidApp();
}

/**
 * Get the appropriate upgrade URL based on platform
 * 
 * - Web: Internal route (/pricing)
 * - Android: External website URL (https://consistencygrid.com/pricing)
 * 
 * @returns {string} Upgrade URL
 * 
 * @example
 * const upgradeUrl = getUpgradeUrl();
 * router.push(upgradeUrl);
 */
export function getUpgradeUrl() {
    if (isAndroidApp()) {
        // External website for Android app users
        return process.env.NEXT_PUBLIC_SITE_URL
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`
            : 'https://consistencygrid.com/pricing';
    }

    // Internal route for web users
    return '/pricing';
}

/**
 * Navigate to upgrade page with platform-appropriate method
 * 
 * - Web: Internal navigation
 * - Android: Opens external browser
 * 
 * @example
 * <button onClick={openUpgradePage}>
 *   Upgrade to Pro
 * </button>
 */
export function openUpgradePage() {
    const url = getUpgradeUrl();

    if (isAndroidApp()) {
        // Open in external browser (Play Store compliant)
        window.open(url, '_blank', 'noopener,noreferrer');
    } else {
        // Internal navigation for web
        window.location.href = url;
    }
}

/**
 * Get platform-specific messaging for upgrade prompts
 * 
 * @returns {Object} Platform-specific messages
 * 
 * @example
 * const messages = getPlatformMessages();
 * console.log(messages.upgradeButton); // "Upgrade to Pro" or "Upgrade via Website"
 */
export function getPlatformMessages() {
    if (isAndroidApp()) {
        return {
            upgradeButton: 'Continue on Website',
            upgradeDescription: 'Access additional features through our website using your browser.',
            pricingHidden: 'Additional services available on our website',
            alreadySubscribed: 'Already a member? Your account will sync automatically when you sign in.',
        };
    }

    return {
        upgradeButton: 'Upgrade to Pro',
        upgradeDescription: 'Unlock all premium features',
        pricingHidden: null,
        alreadySubscribed: 'Manage your subscription in Settings',
    };
}

/**
 * Mark the app as Android platform (called from Android WebView on initialization)
 * This provides an additional detection method beyond user agent
 * 
 * @example
 * // In Android WebView initialization:
 * webView.evaluateJavascript("window.markAsAndroidApp()", null);
 */
export function markAsAndroidApp() {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('consistencygrid_platform', 'android');
            console.log('[Platform] Marked as Android app');
        } catch (error) {
            console.error('[Platform] Failed to mark as Android app:', error);
        }
    }
}

/**
 * Clear platform marker (for testing purposes)
 * 
 * @example
 * clearPlatformMarker(); // Reset to web platform
 */
export function clearPlatformMarker() {
    if (typeof window !== 'undefined') {
        try {
            localStorage.removeItem('consistencygrid_platform');
            console.log('[Platform] Platform marker cleared');
        } catch (error) {
            console.error('[Platform] Failed to clear platform marker:', error);
        }
    }
}

/**
 * Log platform detection info (for debugging)
 * 
 * @example
 * logPlatformInfo(); // Logs platform details to console
 */
export function logPlatformInfo() {
    if (typeof window === 'undefined') {
        console.log('[Platform] Server-side rendering');
        return;
    }

    console.group('[Platform Detection]');
    console.log('Platform:', getPlatform());
    console.log('User Agent:', navigator.userAgent);
    console.log('Is Android App:', isAndroidApp());
    console.log('Show Payment UI:', shouldShowPaymentUI());
    console.log('Upgrade URL:', getUpgradeUrl());
    console.log('Has Android Interface:', typeof window.Android !== 'undefined');
    console.log('Platform Flag:', localStorage.getItem('consistencygrid_platform'));
    console.groupEnd();
}

// Default export
export default {
    isAndroidApp,
    getPlatform,
    shouldShowPaymentUI,
    getUpgradeUrl,
    openUpgradePage,
    getPlatformMessages,
    markAsAndroidApp,
    clearPlatformMarker,
    logPlatformInfo,
};
