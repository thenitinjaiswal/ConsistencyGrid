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
import { useEffect } from "react";

export default function Home() {
  // Add structured data for SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ConsistencyGrid",
      "description": "Generate a personalized calendar wallpaper showing your life progress. Auto-updates daily so every morning reminds you to make today count.",
      "url": typeof window !== "undefined" ? window.location.origin : "",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };
    
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  /**
   * Handles Google sign-in click
   * Redirects to dashboard after successful authentication
   */
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffaf1] to-white">
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
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-24 text-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
          Your life in <span className="text-orange-500">weeks</span>
          <br />
          <span className="text-gray-700">as your wallpaper</span>
        </h1>

        {/* Subheadline / Value Proposition */}
        <p className="mx-auto mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg text-gray-600 px-4 leading-relaxed">
          Generate a personalized calendar wallpaper showing your life progress.
          Auto-updates daily so every morning reminds you to make today count.
        </p>

        {/* 
          Call-to-Action Buttons
          Responsive: vertical stack on mobile, horizontal row on desktop
          Full width on mobile for easier touch targets
        */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row px-4">
          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-800 shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Email Sign-Up Button */}
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-block text-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-base font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Sign up free →
          </Link>
        </div>

        {/* 
          Phone Mockup Preview
          Visual representation of the wallpaper on a mobile device
          Responsive: smaller on mobile, larger on desktop
        */}
        <div className="mt-12 sm:mt-16 flex justify-center animate-fade-in">
          <div className="relative">
            <div className="h-[320px] w-[180px] sm:h-[400px] sm:w-[225px] rounded-[32px] sm:rounded-[40px] border-4 border-gray-300 bg-gradient-to-br from-gray-50 to-white shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-transparent" />
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full" />
              <div className="mt-12 mx-4 space-y-2">
                <div className="h-2 bg-gray-200 rounded w-3/4" />
                <div className="h-2 bg-gray-200 rounded w-1/2" />
                <div className="grid grid-cols-7 gap-1 mt-4">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 rounded ${
                        i < 10 ? "bg-orange-500" : i < 20 ? "bg-orange-300" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
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
