"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MobileAuthCallback() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        // Only run this logic if we are authenticated and have the token
        if (status === "authenticated" && session?.user?.publicToken) {
            setRedirecting(true);
            const token = session.user.publicToken;
            // DEEP LINK SCHEME: consistencygrid://login-success
            const appDeepLink = `consistencygrid://login-success?token=${token}`;

            console.log("✅ Redirecting to app:", appDeepLink);
            console.log("📱 Token:", token);

            // Force navigation to the deep link
            window.location.href = appDeepLink;

            // Fallback: If deep link doesn't open (e.g. dev environment), 
            // providing a button is good UX.
        } else if (status === "unauthenticated") {
            // If auth failed, go back to login with error
            console.error("❌ Authentication failed");
            router.push("/login?error=MobileAuthFailed");
        } else if (status === "authenticated" && !session?.user?.publicToken) {
            console.error("❌ No publicToken found in session");
        }
    }, [session, status, router]);

    const handleManualReturn = () => {
        if (session?.user?.publicToken) {
            window.location.href = `consistencygrid://login-success?token=${session.user.publicToken}`;
        } else {
            router.push("/login");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 text-center">
            <div className="animate-pulse mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-500">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {status === "loading" ? "Verifying..." : "Authentication Successful"}
            </h1>

            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                {status === "loading" && "Please wait while we verify your session..."}
                {status === "authenticated" && redirecting && "Redirecting you back to the app..."}
                {status === "authenticated" && !redirecting && "Click the button below to return to the app."}
                {status === "unauthenticated" && "Authentication failed. Redirecting to login..."}
            </p>

            {status === "authenticated" && (
                <button
                    onClick={handleManualReturn}
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 active:scale-95 transition-transform"
                >
                    Open App
                </button>
            )}

            {status === "unauthenticated" && (
                <p className="text-red-500">Authentication failed. Please try again.</p>
            )}
        </div>
    );
}
