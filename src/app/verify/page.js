'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Loader, Mail, ArrowRight, RefreshCw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(0);
    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    useEffect(() => {
        if (!email) {
            router.push('/signup');
        }
    }, [email, router]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Focus next input
        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        const data = e.clipboardData.getData('text');
        if (!/^\d{6}$/.test(data)) return;

        const digits = data.split('');
        setOtp(digits);
        inputRefs[5].current.focus();
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) {
            toast.error('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: code }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || 'Verification failed');
            }

            toast.success('Email verified! You can now log in.');
            setTimeout(() => router.push('/login'), 2000);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        setResending(true);
        try {
            const res = await fetch('/api/auth/verify/resend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) throw new Error('Failed to resend code');

            toast.success('New code sent to your email');
            setTimer(60); // 1 minute cooldown
        } catch (error) {
            toast.error(error.message);
        } finally {
            setResending(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#fffaf1] px-4 sm:px-6">
            <Toaster position="bottom-right" />
            <Navbar rightLinkText="Sign up" rightLinkHref="/signup" />

            <section className="mx-auto mt-12 sm:mt-20 max-w-md w-full">
                <div className="rounded-2xl bg-white p-6 sm:p-10 shadow-sm ring-1 ring-gray-100 text-center">
                    <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                        <Mail className="w-8 h-8 text-orange-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
                    <p className="text-sm text-gray-600 mb-8">
                        We've sent a 6-digit verification code to <br />
                        <span className="font-semibold text-gray-900">{email}</span>
                    </p>

                    <form onSubmit={handleVerify}>
                        <div className="flex justify-between gap-2 mb-8">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.some(d => !d)}
                            className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Verify Account <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Didn't receive the code?{' '}
                            <button
                                onClick={handleResend}
                                disabled={resending || timer > 0}
                                className="font-semibold text-orange-500 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {resending ? (
                                    <RefreshCw className="w-4 h-4 animate-spin inline mr-1" />
                                ) : null}
                                {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                            </button>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
