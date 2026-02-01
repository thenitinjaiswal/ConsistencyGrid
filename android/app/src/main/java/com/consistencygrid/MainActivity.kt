package com.consistencygrid

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.*
import android.view.View
import android.widget.ProgressBar
import androidx.appcompat.app.AppCompatActivity
// R is auto-imported in same package

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)
        
        setupWebView()
        loadConsistencyGrid()
    }

    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            CookieManager.getInstance().setAcceptCookie(true)
            CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)
            userAgentString = "$userAgentString ConsistencyGridApp/1.0"
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url.toString()
                // External links for payment
                if (url.contains("/pricing") || url.contains("/payment") || url.contains("upgrade")) {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    return true
                }
                return false
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Inject platform flag
                webView.evaluateJavascript("try { localStorage.setItem('consistencygrid_platform', 'android'); } catch(e) {}", null)
                progressBar.visibility = View.GONE
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                progressBar.visibility = View.VISIBLE
                super.onPageStarted(view, url, favicon)
            }
        }
        
        // JS Interface
        webView.addJavascriptInterface(object {
            @JavascriptInterface
            fun getPlatform(): String = "android"
        }, "Android")
    }

    private fun loadConsistencyGrid() {
        webView.loadUrl("https://consistencygrid.com")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }
}
