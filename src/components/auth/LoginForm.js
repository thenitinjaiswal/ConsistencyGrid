"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";

export default function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email: form.email,
                password: form.password,
                redirect: false,
                callbackUrl: "/dashboard",
            });

            if (result?.error) {
                throw new Error("Invalid email or password");
            }

            // Store publicToken in localStorage for session recovery
            // This enables persistent auth even if WebView cookies are cleared
            await storeAuthToken();

            toast.success("Welcome back!");
            router.push("/dashboard");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Store authentication token for WebView session recovery
    async function storeAuthToken() {
        try {
            const res = await fetch('/api/auth/get-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data?.publicToken) {
                    localStorage.setItem('cg_auth_token', data.data.publicToken);
                }
            }
        } catch (error) {
            // Silent fail - token storage is optional enhancement
            console.error('Failed to store auth token:', error);
        }
    }

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <main className="min-h-screen bg-[#fffaf1] px-4 sm:px-6">
            <Toaster position="bottom-right" />
            <Navbar rightLinkText="Sign up" rightLinkHref="/signup" />

            <section className="mx-auto mt-8 sm:mt-10 max-w-md w-full">
                <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-100">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 font-medium animate-fade-in">
                        Your grid is saved. Your progress is waiting.
                    </p>

                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 transition-colors active:scale-95"
                    >
                        <span className="text-lg">G</span>
                        Continue with Google
                    </button>

                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs text-gray-500">or</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <label className="text-xs font-medium text-gray-700 block mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                disabled={loading}
                                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-700 block mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                disabled={loading}
                                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <Link
                            href="/forgot-password"
                            className="text-sm text-orange-500 hover:text-orange-600 hover:underline transition-colors font-medium block text-center"
                        >
                            Forgot your password?
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                "Log in →"
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
