"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import { Check, Zap, Crown, Building2 } from "lucide-react";

export default function PricingPage() {
  const handleGetStarted = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const pricingPlans = [
    {
      name: "Free",
      icon: Zap,
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with life calendar tracking",
      popular: false,
      features: [
        "Life calendar wallpaper generation",
        "Basic habit tracking (up to 5 habits)",
        "Goal setting (1 active goal)",
        "Streak tracking",
        "Basic analytics",
        "Auto-update wallpaper URL",
        "Community support",
      ],
      limitations: [
        "Limited to 5 habits",
        "1 active goal at a time",
        "Basic themes only",
      ],
      cta: "Get Started Free",
      ctaVariant: "secondary",
    },
    {
      name: "Pro",
      icon: Crown,
      price: "$9",
      period: "per month",
      description: "For serious habit trackers and goal achievers",
      popular: true,
      features: [
        "Everything in Free",
        "Unlimited habits",
        "Unlimited goals",
        "Advanced analytics & insights",
        "All premium themes",
        "Custom wallpaper resolutions",
        "Reminder system",
        "Calendar view",
        "Export data (JSON, CSV)",
        "Priority support",
        "Early access to new features",
      ],
      limitations: [],
      cta: "Start Pro Trial",
      ctaVariant: "primary",
      savings: "Save 20% with annual billing",
    },
    {
      name: "Enterprise",
      icon: Building2,
      price: "Custom",
      period: "contact us",
      description: "For teams and organizations",
      popular: false,
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Admin dashboard",
        "Custom branding",
        "API access",
        "Dedicated support",
        "SLA guarantee",
        "Custom integrations",
        "Training & onboarding",
      ],
      limitations: [],
      cta: "Contact Sales",
      ctaVariant: "secondary",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffaf1] to-white">
      <Navbar rightLinkText="Log in" rightLinkHref="/login" />

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-16 pb-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
          Simple, transparent{" "}
          <span className="text-orange-500">pricing</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-gray-600">
          Choose the plan that works best for you. Start free and upgrade when you're ready.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 transition-all hover:shadow-xl ${
                  isPopular
                    ? "lg:scale-105 ring-2 ring-orange-500 border-2 border-orange-500"
                    : ""
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-orange-500 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                      isPopular
                        ? "bg-orange-100 text-orange-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mt-6 text-center">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-lg text-gray-600">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  {plan.savings && (
                    <p className="mt-2 text-sm text-green-600 font-semibold">
                      {plan.savings}
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <div className="mt-8">
                  <button
                    onClick={plan.name === "Enterprise" ? () => window.location.href = "mailto:sales@consistencygrid.com" : handleGetStarted}
                    className={`w-full rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                      plan.ctaVariant === "primary"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-105"
                        : "border-2 border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>

                {/* Features List */}
                <div className="mt-8 space-y-4">
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm font-semibold text-gray-900 mb-4">
                      What's included:
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                          <span className="text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="border-t border-gray-200 pt-6">
                      <p className="text-sm font-semibold text-gray-900 mb-4">
                        Limitations:
                      </p>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="h-5 w-5 flex-shrink-0 text-gray-400 mt-0.5">
                              ×
                            </span>
                            <span className="text-sm text-gray-500">
                              {limitation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-600">
            Everything you need to know about our pricing
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Can I change plans later?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Yes! You can upgrade, downgrade, or cancel your plan at any time.
              Changes take effect immediately, and we'll prorate any charges.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              What payment methods do you accept?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              We accept all major credit cards (Visa, Mastercard, American Express)
              and PayPal. Enterprise customers can also pay via invoice.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Is there a free trial for Pro?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Yes! All new Pro subscriptions come with a 14-day free trial.
              No credit card required to start. Cancel anytime during the trial.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              What happens if I exceed my plan limits?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              We'll notify you when you're approaching your limits. You can
              upgrade to Pro at any time to unlock unlimited features.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Do you offer refunds?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Yes, we offer a 30-day money-back guarantee on all paid plans.
              If you're not satisfied, contact us for a full refund.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Can I use ConsistencyGrid for my team?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Absolutely! Our Enterprise plan is perfect for teams. Contact our
              sales team to discuss custom pricing and features for your organization.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="rounded-2xl bg-gradient-to-br from-white to-orange-50/30 p-8 sm:p-12 text-center shadow-lg ring-1 ring-orange-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Ready to make every week count?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
            Join thousands of users tracking their life progress with ConsistencyGrid.
            Start free, no credit card required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-base font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Get Started Free →
            </button>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-800 shadow-sm hover:bg-gray-50 transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-orange-500" />
                <span className="text-lg font-bold text-gray-900">
                  ConsistencyGrid
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Make every week count. Track your life progress with a beautiful calendar wallpaper.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/pricing" className="hover:text-orange-500 transition-colors">Pricing</Link></li>
                <li><Link href="/generator" className="hover:text-orange-500 transition-colors">Generator</Link></li>
                <li><Link href="/habits" className="hover:text-orange-500 transition-colors">Habits</Link></li>
                <li><Link href="/goals" className="hover:text-orange-500 transition-colors">Goals</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/help" className="hover:text-orange-500 transition-colors">Help Center</Link></li>
                <li><Link href="/help" className="hover:text-orange-500 transition-colors">MacroDroid Guide</Link></li>
                <li><Link href="/settings" className="hover:text-orange-500 transition-colors">Settings</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
                <li><a href="mailto:support@consistencygrid.com" className="hover:text-orange-500 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} ConsistencyGrid. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-2 sm:mt-0">
              Make every week count
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
