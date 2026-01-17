"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "../../components/layout/Navbar";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.type]: e.target.value });

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

            toast.success("Welcome back!");
            router.push("/dashboard");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#fffaf1] px-6">
            {/* Top Navbar */}
            <Navbar rightLinkText="Sign up" rightLinkHref="/signup" />

            {/* Login Card */}
            <section className="mx-auto mt-10 max-w-md">
                <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Login to continue building your wallpaper.
                    </p>

                    {/* Google Login */}
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-lg">G</span>
                        Continue with Google
                    </button>


                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs text-gray-500">or</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    {/* Email Login */}
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <label className="text-xs font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? "Logging in..." : "Log in →"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <Link href="/signup" className="font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
