/**
 * Landing Page (Homepage)
 * 
 * The main entry point of the ConsistencyGrid application. This page introduces users
 * to the concept of life calendar wallpapers and provides call-to-action buttons.
 * 
 * Features:
 * - Responsive hero section with headline and description
 * - Authentication CTAs (Google OAuth and email signup)
 * - Visual preview placeholder for wallpaper mockup
 * - Information card about auto-update functionality
 * - Mobile-first responsive design
 * 
 * @component
 */

"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  /**
   * Handles Google sign-in click
   * Redirects to dashboard after successful authentication
   */
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <main className="min-h-screen bg-[#fffaf1]">
      {/* 
        Navigation Bar
        Displays logo and login button for non-authenticated users
      */}
      <Navbar rightLinkText="Log in" rightLinkHref="/login" />

      {/* 
        Hero Section
        Main headline and value proposition with call-to-action buttons
        Responsive: stacks vertically on mobile, horizontal on larger screens
      */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-20 text-center">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
          Your life in <span className="text-orange-500">weeks</span>
          <br />
          as your wallpaper
        </h1>

        {/* Subheadline / Value Proposition */}
        <p className="mx-auto mt-4 sm:mt-6 max-w-xl text-sm sm:text-base text-gray-600 px-4">
          Generate a personalized calendar wallpaper showing your life progress.
          Auto-updates daily so every morning reminds you to make today count.
        </p>

        {/* 
          Call-to-Action Buttons
          Responsive: vertical stack on mobile, horizontal row on desktop
          Full width on mobile for easier touch targets
        */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row px-4">
          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 sm:px-5 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg">G</span>
            Continue with Google
          </button>

          {/* Email Sign-Up Button */}
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-block text-center rounded-lg bg-orange-500 px-6 py-3 sm:px-5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
          >
            Sign up free →
          </Link>
        </div>

        {/* 
          Phone Mockup Preview
          Visual representation of the wallpaper on a mobile device
          Responsive: smaller on mobile, larger on desktop
        */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <div className="h-[300px] w-[166px] sm:h-[360px] sm:w-[200px] rounded-[24px] sm:rounded-[32px] border-2 border-gray-200 bg-white shadow-xl" />
        </div>
      </section>

      {/* 
        Auto-Update Information Card
        Explains the wallpaper auto-update feature
        Responsive padding and text sizing
      */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="rounded-2xl bg-white p-6 sm:p-10 text-center shadow-sm ring-1 ring-gray-100">
          {/* Card Title */}
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Auto-Update Wallpaper
          </h2>

          {/* Card Description */}
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-gray-600">
            Get a unique URL that always shows today's progress. Use MacroDroid
            on Android to automatically update your wallpaper every morning.
          </p>

          {/* CTA Button */}
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
          >
            Create Your Calendar →
          </Link>
        </div>
      </section>

      {/* 
        Footer
        Simple branding footer with tagline
      */}
      <footer className="pb-10 text-center text-xs text-gray-500">
        ConsistencyGrid • Make every week count
      </footer>
    </main>
  );
}
