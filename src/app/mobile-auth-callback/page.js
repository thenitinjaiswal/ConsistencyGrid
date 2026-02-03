"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

/**
 * MobileAuthCallback
 * --------------------------------------------------
 * PRODUCTION PROVEN STRATEGY:
 * 1. Attempt auto-redirect (might be blocked by browser)
 * 2. ALWAYS show a huge, clear "Return to App" button
 * 3. User tap is the only 100% reliable way to trigger Custom Scheme
 */
export default function MobileAuthCallbackPage() {
    const { data: session, status } = useSession();
    const hasAutoRedirected = useRef(false);
    const [showManualButton, setShowManualButton] = useState(true); // Default to true for better UX

    useEffect(() => {
        if (status !== "authenticated") return;
        const token = session?.user?.publicToken;
        if (!token) return;

        // 🔥 Attempt auto-redirect once
        if (!hasAutoRedirected.current) {
            hasAutoRedirected.current = true;
            const deepLink = `consistencygrid://login-success?token=${token}`;

            // Use replace logic to avoid history stack issues
            window.location.href = deepLink;
        }
    }, [status, session]);

    if (status === "loading") {
        return (
            <main style={styles.page}>
                <div style={styles.loader} />
                <p style={{ marginTop: 20, color: "#666" }}>Verifying session...</p>
            </main>
        );
    }

    if (status === "unauthenticated") {
        return (
            <main style={styles.page}>
                <h1 style={{ ...styles.title, color: "red" }}>Authentication Failed</h1>
                <p>Please try logging in again.</p>
            </main>
        );
    }

    const token = session?.user?.publicToken;
    const deepLink = token ? `consistencygrid://login-success?token=${token}` : "#";

    return (
        <main style={styles.page}>
            <div style={styles.container}>
                <div style={styles.icon}>✓</div>
                <h1 style={styles.title}>Login Successful</h1>
                <p style={styles.text}>
                    Tap the button below to return to the app.
                </p>

                {/* 
            PRIMARY ACTION: Manual Tap
            This is required because modern browsers (Chrome/Firefox) 
            often block programmatic deep-link navigation without user gesture.
        */}
                <a href={deepLink} style={styles.button}>
                    Return to App
                </a>

                <p style={styles.subtext}>
                    If nothing happens, ensure the app is installed.
                </p>
            </div>
        </main>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    container: {
        textAlign: "center",
        padding: 30,
        maxWidth: 400,
        width: "100%",
    },
    icon: {
        width: 60,
        height: 60,
        borderRadius: "50%",
        backgroundColor: "#22c55e",
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 24px",
    },
    title: {
        fontSize: 24,
        fontWeight: 800,
        color: "#111",
        marginBottom: 12,
    },
    text: {
        fontSize: 16,
        color: "#4b5563",
        marginBottom: 32,
        lineHeight: 1.5,
    },
    button: {
        display: "block",
        width: "100%",
        padding: "16px 24px",
        backgroundColor: "#f97316", // Brand Orange
        color: "#ffffff",
        borderRadius: 12,
        fontSize: 18,
        fontWeight: 600,
        textDecoration: "none",
        textAlign: "center",
        boxShadow: "0 4px 6px -1px rgba(249, 115, 22, 0.2)",
        transition: "transform 0.1s ease",
    },
    subtext: {
        marginTop: 24,
        fontSize: 13,
        color: "#9ca3af",
    },
    loader: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "4px solid #e5e7eb",
        borderTopColor: "#f97316",
        animation: "spin 1s linear infinite",
    },
};

