package com.consistencygrid

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.CookieManager
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import androidx.browser.customtabs.CustomTabsIntent

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val WEBSITE_URL = "https://consistencygrid.netlify.app" // Replace with env var if needed

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // simple programmatic layout
        webView = WebView(this)
        setContentView(webView)

        setupWebView()

        // Check for deep link on startup
        handleIntent(intent)
        
        if (savedInstanceState == null && intent.data == null) {
            loadInitialUrl()
        }
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            userAgentString += " ConsistencyGridApp" // Marker for website detection
        }

        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                
                // 1. Intercept Google Auth & NextAuth Google Signin
                if (url.contains("accounts.google.com") || 
                    url.contains("/api/auth/signin/google")) {
                    openInCustomTab(url)
                    return true
                }

                // 2. Allow normal navigation inside WebView
                return false
            }
        }
    }

    private fun openInCustomTab(url: String) {
        val builder = CustomTabsIntent.Builder()
        val customTabsIntent = builder.build()
        customTabsIntent.launchUrl(this, Uri.parse(url))
    }

    private fun handleIntent(intent: Intent?) {
        val data = intent?.data
        // consistencygrid://login-success?token=XYZ
        if (data != null && data.scheme == "consistencygrid" && data.host == "login-success") {
            val token = data.getQueryParameter("token")
            if (token != null) {
                saveToken(token)
                loginWithToken(token)
            }
        }
    }

    private fun saveToken(token: String) {
        val prefs = getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        prefs.edit().putString("auth_token", token).apply()
    }

    private fun loadInitialUrl() {
        // Check if we have a stored token to auto-login
        val prefs = getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val token = prefs.getString("auth_token", null)
        
        if (token != null) {
            loginWithToken(token) // Auto-login on restart
        } else {
            webView.loadUrl("$WEBSITE_URL/login")
        }
    }

    private fun loginWithToken(token: String) {
        // Pass token to login page so it can execute signIn("token-login")
        webView.loadUrl("$WEBSITE_URL/login?authtoken=$token")
    }
    
    // Handle back button
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
