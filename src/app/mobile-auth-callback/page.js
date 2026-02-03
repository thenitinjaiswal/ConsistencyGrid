"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

/**
 * MobileAuthCallback
 * --------------------------------------------------
 * PURPOSE:
 * - HTTPS → Android App Link bridge
 * - Supports both Auto-Redirect and Manual Tap
 * - Target: https://consistencygrid.netlify.app/app-login (Intercepted by App)
 */
export default function MobileAuthCallbackPage() {
    const { data: session, status } = useSession();
    const hasRedirected = useRef(false);
    const [showFallback, setShowFallback] = useState(false);

    useEffect(() => {
        // Wait for NextAuth to resolve session
        if (status !== "authenticated") return;
        if (hasRedirected.current) return;

        const token = session?.user?.publicToken;

        if (!token) {
            console.error("[mobile-auth-callback] publicToken missing");
            setShowFallback(true);
            return;
        }

        hasRedirected.current = true;

        // ✅ APP LINK (Interpreted by Android OS to open the app)
        const appLink = `https://consistencygrid.netlify.app/app-login?token=${token}`;

        // Attempt auto-redirect
        window.location.href = appLink;

        // Fallback in case App Link isn't intercepted immediately
        const timer = setTimeout(() => {
            setShowFallback(true);
        }, 1000); // Shorter timeout for better UX

        return () => clearTimeout(timer);
    }, [status, session]);

    return (
        <main style={styles.page}>
            <div style={styles.container}>
                <div style={styles.icon}>✓</div>

                <h1 style={styles.title}>Login Successful</h1>
                <p style={styles.text}>
                    Redirecting you back to the app…
                </p>

                {/* Fallback button */}
                {session?.user?.publicToken && (
                    <a
                        href={`https://consistencygrid.netlify.app/app-login?token=${session.user.publicToken}`}
                        style={styles.button}
                    >
                        Return to App
                    </a>
                )}

                {!showFallback && (
                    <div style={styles.loader} />
                )}
            </div>
        </main>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fffaf1 0%, #ffffff 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
    },
    container: {
        textAlign: "center",
        padding: 40,
        maxWidth: 360,
    },
    icon: {
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#10b981",
        color: "white",
        fontSize: 32,
        lineHeight: "64px",
        margin: "0 auto 20px",
    },
    title: {
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 10,
        color: "#111",
    },
    text: {
        color: "#666",
        marginBottom: 24,
    },
    loader: {
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "4px solid #f97316",
        borderTopColor: "transparent",
        animation: "spin 1s linear infinite",
        margin: "0 auto",
    },
    button: {
        display: "inline-block",
        padding: "14px 28px",
        background: "#f97316",
        color: "#fff",
        borderRadius: 12,
        fontWeight: 600,
        textDecoration: "none",
        marginTop: 10,
        boxShadow: "0 4px 6px -1px rgba(249, 115, 22, 0.2)",
    },
};
