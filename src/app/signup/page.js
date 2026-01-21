/**
 * Signup Page
 * 
 * New user registration page with email/password and Google OAuth support.
 * Creates accounts and automatically logs users in upon successful registration.
 * 
 * Features:
 * - Email/password signup with name collection
 * - Google OAuth one-click registration
 * - Form validation and error handling
 * - Auto-login after successful signup
 * - Toast notifications for user feedback
 * - Responsive mobile-first design
 * - Link to login page for existing users
 * 
 * @page
 */

"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  /**
   * Handles email/password signup submission
   * Creates user account and automatically logs them in
   */
  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user account via API
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // Check for signup errors (email already exists, etc.)
      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Success feedback
      toast.success("Account created! Starting onboarding...");

      // Auto-login with the new credentials
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      // Check for login errors
      if (result?.error) {
        throw new Error(result.error);
      }

      // Redirect to onboarding
      router.push("/onboarding");
    } catch (error) {
      // Display error message to user
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handles Google OAuth sign-up
   * Redirects to Google consent screen and then to onboarding
   */
  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/onboarding" });
  };

  return (
    <main className="min-h-screen bg-[#fffaf1] px-4 sm:px-6">
      {/* Toast Notifications */}
      <Toaster position="bottom-right" />

      {/* 
                Navigation Bar
                Shows login link for users with existing accounts
            */}
      <Navbar rightLinkText="Log in" rightLinkHref="/login" />

      {/* 
                Signup Form Card
                Centered card with responsive width
            */}
      <section className="mx-auto mt-8 sm:mt-10 max-w-md w-full">
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-100">
          {/* Card Header */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Create account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Start building your auto-updating wallpaper.
          </p>

          {/* 
                        Google Sign-Up Button
                        One-click registration via OAuth
                    */}
          <button
            onClick={handleGoogleSignUp}
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 transition-colors active:scale-95"
          >
            <span className="text-lg">G</span>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* 
                        Email/Password Signup Form
                        Collects name, email, and password
                    */}
          <form className="space-y-4" onSubmit={handleSignup}>
            {/* Name Input */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                required
                minLength={2}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={loading}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email Input */}
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

            {/* Password Input */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters
              </p>
            </div>

            {/* Submit Button */}
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
                  Creating account...
                </span>
              ) : (
                "Sign up →"
              )}
            </button>
          </form>

          {/* 
                        Login Link
                        Directs existing users to login page
                    */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
