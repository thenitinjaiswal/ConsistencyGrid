'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided. Please check your email link.');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Email verification failed. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification. Please try again.');
        console.error('Verification error:', error);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <Loader className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h2>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => router.push('/login')}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
