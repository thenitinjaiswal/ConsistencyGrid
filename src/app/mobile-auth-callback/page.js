"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MobileAuthCallbackPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [message, setMessage] = useState("Verifying session...");

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            setMessage("Login failed. Redirecting to login...");
            setTimeout(() => router.push("/login"), 2000);
            return;
        }

        if (session) {
            setMessage("Session verified. returning to app...");

            // Fetch a short-lived handoff token
            fetch("/api/auth/session-token")
                .then((res) => res.json())
                .then((data) => {
                    if (data.token) {
                        // Redirect to Android app via Deep Link
                        // Scheme: consistencygrid://login-success?token=XYZ
                        const deepLink = `consistencygrid://login-success?token=${data.token}`;

                        console.log("Redirecting to deep link:", deepLink);
                        window.location.href = deepLink;

                        // Fallback UI
                        setTimeout(() => {
                            setMessage("If the app didn't open automatically, please go back to the app.");
                        }, 3000);
                    } else {
                        setMessage("Failed to generate handoff token.");
                        console.error("Token generation failed");
                    }
                })
                .catch((err) => {
                    console.error("Error fetching session token:", err);
                    setMessage("Connection error. Please try again.");
                });
        }
    }, [session, status, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffaf1] p-4 text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Finalizing Login...</h1>
            <p className="text-gray-600 animate-pulse">{message}</p>

            {/* Manual button in case auto-redirect fails */}
            {status === 'authenticated' && (
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 text-sm text-orange-500 underline"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
