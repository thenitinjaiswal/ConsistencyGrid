"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
    const [subscription, setSubscription] = useState(null);
    const searchParams = useSearchParams();
    const source = searchParams.get('source'); // 'app' if coming from React Native

    useEffect(() => {
        // Fetch subscription details
        fetch('/api/payment/subscription')
            .then(res => res.json())
            .then(data => setSubscription(data.subscription))
            .catch(err => console.error('Failed to fetch subscription:', err));

        // If coming from app, redirect back to app via deep link
        if (source === 'app') {
            const timer = setTimeout(() => {
                try {
                    // Generate JWT token for app
                    const token = sessionStorage.getItem('subscription_token');
                    if (token) {
                        const deepLink = `consistencygrid://payment-success?token=${token}&plan=${subscription?.plan || 'pro_yearly'}&expiryDate=${subscription?.endDate || ''}`;
                        window.location.href = deepLink;
                    }
                } catch (error) {
                    console.error('Failed to redirect to app:', error);
                }
            }, 3000); // 3 second delay so user sees success message

            return () => clearTimeout(timer);
        }
    }, [source, subscription]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Payment Successful! 🎉
                    </h1>

                    <p className="text-lg text-gray-600">
                        Welcome to ConsistencyGrid Pro! Your subscription is now active.
                    </p>

                    {source === 'app' && (
                        <p className="text-sm text-orange-600 mt-3 font-semibold">
                            ⏳ Redirecting you back to the app in a few seconds...
                        </p>
                    )}
                </div>

                {/* Subscription Details */}
                {subscription && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-orange-500" />
                            Your Subscription
                        </h2>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Plan</span>
                                <span className="font-semibold text-gray-900 capitalize">
                                    {subscription.plan.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Status</span>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    {subscription.status}
                                </span>
                            </div>

                            {subscription.endDate && (
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Valid Until</span>
                                    <span className="font-semibold text-gray-900">
                                        {new Date(subscription.endDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pro Features */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        What's Unlocked:
                    </h3>

                    <ul className="space-y-3">
                        {[
                            'Unlimited habits and goals',
                            'Full history access',
                            'Advanced analytics & insights',
                            'AI-powered suggestions',
                            'All premium themes',
                            'Custom wallpaper resolutions',
                            'Reminder system',
                            'Export data (JSON, CSV)',
                            'Priority support',
                        ].map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/dashboard"
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        Go to Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <Link
                        href="/settings"
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white text-gray-800 px-6 py-4 font-bold hover:bg-gray-50 hover:border-orange-300 transition-all duration-300"
                    >
                        Manage Subscription
                    </Link>
                </div>

                {/* Support */}
                <p className="text-center text-sm text-gray-500 mt-8">
                    Need help? Contact us at{' '}
                    <a href="mailto:support@consistencygrid.com" className="text-orange-600 hover:underline">
                        support@consistencygrid.com
                    </a>
                </p>
            </div>
        </main>
    );
}
