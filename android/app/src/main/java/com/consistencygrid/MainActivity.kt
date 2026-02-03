package com.consistencygrid

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import androidx.browser.customtabs.CustomTabsIntent

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val WEBSITE_URL = "https://consistencygrid.netlify.app"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        setupWebView()

        // Handle initial launch intent
        handleIntent(intent)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleIntent(intent)
    }

    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            // Append app identifier to User Agent for server-side detection
            userAgentString += " ConsistencyGridApp"
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false

                // Intercept Google Auth URLs and open in Chrome Custom Tabs
                if (url.contains("accounts.google.com") || url.contains("/api/auth/signin/google")) {
                    openInCustomTab(url)
                    return true
                }
                
                // Keep other navigation inside WebView
                return false
            }
        }

        // Load initial page if no token login happened yet
        if (webView.url == null) {
             webView.loadUrl("$WEBSITE_URL/login?platform=android")
        }
    }

    private fun openInCustomTab(url: String) {
        val builder = CustomTabsIntent.Builder()
        val customTabsIntent = builder.build()
        customTabsIntent.launchUrl(this, Uri.parse(url))
    }

    private fun handleIntent(intent: Intent?) {
        val appLinkData: Uri? = intent?.data

        // ✅ HANDLE APP LINKS: https://consistencygrid.netlify.app/app-login?token=XYZ
        if (appLinkData != null && appLinkData.path?.startsWith("/app-login") == true) {
            val token = appLinkData.getQueryParameter("token")
            if (!token.isNullOrEmpty()) {
                saveToken(token)
                loginWithToken(token)
            }
        }
    }

    private fun saveToken(token: String) {
        val sharedPref = getPreferences(MODE_PRIVATE)
        with(sharedPref.edit()) {
            putString("public_token", token)
            apply()
        }
    }

    private fun loginWithToken(token: String) {
        // Load the special login URL that NextAuth (CredentialsProvider 'token-login') handles
        // We add a timestamp to force reload if needed
        val loginUrl = "$WEBSITE_URL/login?authtoken=$token&ts=${System.currentTimeMillis()}"
        webView.loadUrl(loginUrl)
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
