"use client";
import { signIn } from "next-auth/react";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";



export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#fffaf1] px-6">
      {/* Top Navbar */}
      <Navbar rightLinkText="Log in" rightLinkHref="/login" />

      {/* Signup Card */}
      <section className="mx-auto mt-10 max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Start building your auto-updating wallpaper.
          </p>

          {/* Google Signup */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
          >
            <span className="text-lg">G</span>
            Sign up with Google
          </button>


          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Email Signup */}
          <form className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
            >
              Sign up →
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-orange-500">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
