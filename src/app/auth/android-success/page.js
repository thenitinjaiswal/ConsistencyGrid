"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AndroidSuccessPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [message, setMessage] = useState("Verifying session...");

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            setMessage("Login failed. redirecting...");
            setTimeout(() => router.push("/login"), 2000);
            return;
        }

        if (session) {
            setMessage("Session verified. Returning to app...");

            // Fetch a short-lived handoff token
            fetch("/api/auth/session-token")
                .then((res) => res.json())
                .then((data) => {
                    if (data.token) {
                        // Redirect to Android app via Deep Link
                        const deepLink = `consistencygrid://login-success?token=${data.token}`;
                        window.location.href = deepLink;

                        // Fallback if app doesn't open (optional)
                        setTimeout(() => {
                            setMessage("If the app didn't open, please go back manually.");
                        }, 3000);
                    } else {
                        setMessage("Failed to generate handoff token.");
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setMessage("Connection error.");
                });
        }
    }, [session, status, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffaf1] p-4 text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Logging you in...</h1>
            <p className="text-gray-600">{message}</p>
        </div>
    );
}
