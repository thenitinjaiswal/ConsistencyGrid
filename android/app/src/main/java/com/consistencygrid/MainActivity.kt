package com.consistencygrid

import android.content.SharedPreferences
import android.os.Build
import android.os.Bundle
import android.webkit.*
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewFeature

/**
 * ConsistencyGrid Android WebView Application
 * 
 * Strategy: Hide payment UI in WebView app to avoid PlayStore 15% commission
 * Payment flow:
 * 1. Detect Android app via User-Agent
 * 2. Hide "Upgrade" button in app
 * 3. Show "Upgrade on Website" button instead
 * 4. User redirected to website for payment (Razorpay)
 * 5. After payment, subscription data syncs back to app
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var sharedPreferences: SharedPreferences
    private val APP_IDENTIFIER = "consistencygrid_webview_app"
    private val USER_TOKEN_KEY = "user_auth_token"
    private val SUBSCRIPTION_STATUS_KEY = "subscription_status"

    // Website domain - change to your actual domain
    private val WEBSITE_URL = "https://consistencygrid.com"
    private val APP_BASE_URL = "https://app.consistencygrid.com"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Get WebView reference
        webView = findViewById(R.id.webView)

        // Initialize SharedPreferences for storing user data
        sharedPreferences = getSharedPreferences(APP_IDENTIFIER, MODE_PRIVATE)

        // Configure WebView
        setupWebView()

        // Mark this as Android app
        markAsAndroidApp()

        // Load the app
        val token = getStoredUserToken()
        if (token != null) {
            // Logged in user - load app with token
            webView.loadUrl("$APP_BASE_URL/dashboard?token=$token")
        } else {
            // Not logged in - load login page
            webView.loadUrl("$APP_BASE_URL/login")
        }
    }

    /**
     * Configure WebView settings for security and performance
     */
    private fun setupWebView() {
        val settings = webView.settings
        
        // Enable JavaScript (required for React app)
        settings.javaScriptEnabled = true
        
        // Database and storage
        settings.databaseEnabled = true
        settings.domStorageEnabled = true
        settings.setAppCacheEnabled(true)
        
        // Performance
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        
        // Security
        settings.allowFileAccess = false
        settings.allowContentAccess = false
        
        // User Agent - add custom identifier for app detection
        val originalUserAgent = settings.userAgentString
        settings.userAgentString = "$originalUserAgent AppVersion/1.0.0"
        
        // Add JavaScriptInterface for native communication
        webView.addJavascriptInterface(JavaScriptBridge(this), "AndroidBridge")
        
        // Set WebViewClient to handle redirects
        webView.webViewClient = ConsistencyGridWebViewClient(this)
        
        // Set WebChromeClient for JavaScript console and alerts
        webView.webChromeClient = WebChromeClient()
        
        // Enable Dark Mode if available (Android 10+)
        if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK)) {
            WebSettingsCompat.setForceDark(settings, WebSettingsCompat.FORCE_DARK_AUTO)
        }
    }

    /**
     * Mark this session as Android app
     * Website will check this and hide payment UI
     */
    private fun markAsAndroidApp() {
        // Inject JavaScript to mark this as app platform
        val injectionScript = """
            (function() {
                localStorage.setItem('consistencygrid_platform', 'android');
                window.isAndroidApp = true;
                window.appVersion = '1.0.0';
                console.log('ConsistencyGrid Android App Detected');
            })();
        """.trimIndent()
        
        // Inject on page load
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                view?.evaluateJavascript(injectionScript, null)
            }
        }
    }

    /**
     * Store user authentication token
     * Called after successful login via JavaScript bridge
     */
    fun saveUserToken(token: String) {
        sharedPreferences.edit().putString(USER_TOKEN_KEY, token).apply()
        Toast.makeText(this, "User saved", Toast.LENGTH_SHORT).show()
    }

    /**
     * Get stored user token
     */
    private fun getStoredUserToken(): String? {
        return sharedPreferences.getString(USER_TOKEN_KEY, null)
    }

    /**
     * Clear user authentication (logout)
     */
    fun clearUserToken() {
        sharedPreferences.edit().remove(USER_TOKEN_KEY).apply()
        webView.loadUrl("$APP_BASE_URL/login")
    }

    /**
     * Save subscription status after payment
     * Called from website after successful payment
     */
    fun saveSubscriptionStatus(status: String, plan: String, expiryDate: String) {
        val subscriptionData = mapOf(
            "status" to status,
            "plan" to plan,
            "expiryDate" to expiryDate
        )
        sharedPreferences.edit().putString(SUBSCRIPTION_STATUS_KEY, subscriptionData.toString()).apply()
        
        Toast.makeText(this, "Subscription updated: $plan", Toast.LENGTH_SHORT).show()
        
        // Reload wallpaper to show updated content
        webView.reload()
    }

    /**
     * Get current subscription status
     */
    fun getSubscriptionStatus(): String? {
        return sharedPreferences.getString(SUBSCRIPTION_STATUS_KEY, null)
    }

    /**
     * Handle back navigation
     */
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    /**
     * Cleanup on destroy
     */
    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}

/**
 * Custom WebViewClient to handle redirects and payment URLs
 */
class ConsistencyGridWebViewClient(private val activity: MainActivity) : WebViewClient() {

    // Allow payment gateway URLs to open in WebView
    private val allowedDomains = listOf(
        "app.consistencygrid.com",
        "consistencygrid.com",
        "checkout.razorpay.com",  // Razorpay payment checkout
        "api.razorpay.com",        // Razorpay API
        "stripe.com",              // Future: Stripe integration
    )

    override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
        val url = request?.url?.toString() ?: return false
        
        // Check if URL is allowed
        val host = request.url.host ?: return false
        if (allowedDomains.any { host.endsWith(it) }) {
            return false  // Load in WebView
        }

        // External URLs - might open in browser (optional)
        // return true  // Don't load in WebView

        return false
    }

    override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
        super.onReceivedError(view, request, error)
        Toast.makeText(activity, "Error loading page", Toast.LENGTH_SHORT).show()
    }

    override fun onPageFinished(view: WebView?, url: String?) {
        super.onPageFinished(view, url)
        
        // Log page load for debugging
        android.util.Log.d("WebView", "Page loaded: $url")
        
        // Inject platform detection script
        val platformScript = """
            (function() {
                localStorage.setItem('consistencygrid_platform', 'android');
                window.isAndroidApp = true;
            })();
        """.trimIndent()
        
        view?.evaluateJavascript(platformScript, null)
    }
}

/**
 * JavaScript Bridge
 * Allows JavaScript from web app to call native Android functions
 */
class JavaScriptBridge(private val activity: MainActivity) {

    /**
     * Called from website after user logs in
     * @param token JWT authentication token
     */
    @JavascriptInterface
    fun onUserLogin(token: String) {
        activity.saveUserToken(token)
    }

    /**
     * Called from website when user logs out
     */
    @JavascriptInterface
    fun onUserLogout() {
        activity.clearUserToken()
    }

    /**
     * Called from website after successful payment
     * Updates local subscription status
     * @param status Subscription status (active/inactive)
     * @param plan Plan name (pro/premium)
     * @param expiryDate Expiry date timestamp
     */
    @JavascriptInterface
    fun onPaymentSuccess(status: String, plan: String, expiryDate: String) {
        activity.saveSubscriptionStatus(status, plan, expiryDate)
    }

    /**
     * Get local subscription status
     * Called from website to check if user is premium in app
     */
    @JavascriptInterface
    fun getSubscriptionStatus(): String? {
        return activity.getSubscriptionStatus()
    }

    /**
     * Get app version
     */
    @JavascriptInterface
    fun getAppVersion(): String {
        return "1.0.0"
    }

    /**
     * Get platform identifier
     */
    @JavascriptInterface
    fun getPlatform(): String {
        return "android"
    }

    /**
     * Log message to native Android logging
     */
    @JavascriptInterface
    fun log(message: String) {
        android.util.Log.d("ConsistencyGrid", message)
    }
}
