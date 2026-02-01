/**
 * Onboarding Page
 * 
 * Multi-step onboarding flow for first-time users.
 * Guides users through:
 * 1. Personalization (name, birth date, life expectancy)
 * 2. Habit Selection (choose initial habits to track)
 * 3. Theme Selection (choose wallpaper appearance)
 * 4. Welcome & Completion
 * 
 * Features:
 * - Progress indicator showing current step
 * - Form validation with helpful error messages
 * - Smooth transitions between steps
 * - Keyboard navigation support
 * - Mobile-responsive design
 * - Auto-saves progress
 * - Exit confirmation to prevent accidental data loss
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import OnboardingPersonalize from "@/components/onboarding/OnboardingPersonalize";
import OnboardingHabits from "@/components/onboarding/OnboardingHabits";
import OnboardingTheme from "@/components/onboarding/OnboardingTheme";
import OnboardingWelcome from "@/components/onboarding/OnboardingWelcome";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    lifeExpectancyYears: 85,
    habits: [],
    theme: "dark-minimal",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signup");
    }
  }, [status, router]);

  // Check if already onboarded
  useEffect(() => {
    if (session?.user?.onboarded) {
      router.push("/dashboard");
    }
  }, [session?.user?.onboarded, router]);

  // Prevent navigation away during onboarding
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (step < TOTAL_STEPS) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step]);

  /**
   * Handle next step - validates current step data
   */
  const handleNext = async () => {
    if (step === 1) {
      // Validate personalization
      if (!formData.name?.trim() || formData.name.trim().length < 2) {
        toast.error("Please enter your full name");
        return;
      }
      if (!formData.dob) {
        toast.error("Please enter your birth date");
        return;
      }
      if (!formData.lifeExpectancyYears || formData.lifeExpectancyYears < 40 || formData.lifeExpectancyYears > 120) {
        toast.error("Life expectancy must be between 40 and 120 years");
        return;
      }
    }

    if (step === 2) {
      // Validate at least one habit is selected
      if (formData.habits.length === 0) {
        toast.error("Please select at least one habit");
        return;
      }
    }

    if (step === 3) {
      // Validate theme selection
      if (!formData.theme) {
        toast.error("Please select a theme");
        return;
      }
    }

    if (step === 4) {
      // Final submission
      await handleComplete();
      return;
    }

    setStep(step + 1);
  };

  /**
   * Handle previous step
   */
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  /**
   * Complete onboarding and save all data
   */
  const handleComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to complete onboarding");
      }

      toast.success("Welcome! Redirecting to your dashboard...");

      // Update session to reflect the new onboarded status (fetches from DB via jwt callback)
      await update();

      toast.success("Welcome! Redirecting to your dashboard...");

      // Use router.push for smoother transition, session is now fresh
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  /**
   * Handle form field changes
   */
  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSkipHabits = () => {
    setFormData((prev) => ({
      ...prev,
      habits: [], // Skip habits selection
    }));
    setStep(3);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading your onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Toaster position="top-center" />

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Progress bar */}
        <OnboardingProgress currentStep={step} totalSteps={TOTAL_STEPS} />

        {/* Container */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl">
            {/* Step 1: Personalization */}
            {step === 1 && (
              <OnboardingPersonalize
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
              />
            )}

            {/* Step 2: Habits */}
            {step === 2 && (
              <OnboardingHabits
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
                onSkip={handleSkipHabits}
              />
            )}

            {/* Step 3: Theme */}
            {step === 3 && (
              <OnboardingTheme
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {/* Step 4: Welcome */}
            {step === 4 && (
              <OnboardingWelcome
                formData={formData}
                onBack={handleBack}
                onComplete={handleComplete}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
