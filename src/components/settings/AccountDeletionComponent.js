'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { requestAccountDeletion } from '@/lib/gdpr';

export default function AccountDeletionComponent() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  async function handleRequestDeletion() {
    if (!password) {
      setError('Please enter your password to confirm');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await requestAccountDeletion(password);

      if (result.success) {
        // Clear form
        setPassword('');
        setShowConfirmation(false);
        setStep(1);

        // Show final message and logout
        alert('Your account has been scheduled for deletion. You will now be logged out.');

        // Give user time to see message
        setTimeout(() => {
          signOut({ redirect: true, callbackUrl: '/' });
        }, 2000);
      } else {
        setError(result.error || 'Failed to delete account');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setShowConfirmation(false);
    setPassword('');
    setError('');
    setStep(1);
  }

  if (!showConfirmation) {
    return (
      <Card className="p-6 border-l-4 border-l-red-500 bg-red-50">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-2">Delete Account</h3>
            <p className="text-sm text-red-700 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            <div className="bg-white p-4 rounded-lg mb-4 text-sm text-gray-700 space-y-2">
              <p className="font-semibold text-red-900">When you delete your account:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>All your personal data will be permanently deleted</li>
                <li>Your goals, habits, and reminders will be removed</li>
                <li>You will lose access to your wallpaper and all settings</li>
                <li>This action cannot be reversed</li>
              </ul>
            </div>

            <Button
              onClick={() => setShowConfirmation(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account Permanently
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-l-4 border-l-red-500">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Account Deletion</h3>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  s === step
                    ? 'bg-orange-500 text-white'
                    : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-1"></div>}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Important</p>
              <p className="text-sm text-yellow-800">
                This will permanently delete your account and all your data. Please make sure to export your data first if you want to keep a copy.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                I Understand, Continue
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900">
                You are about to delete your account permanently. Please type your email address to confirm:
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm with your password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(3)}
                disabled={!password || loading}
                className="bg-red-600 hover:bg-red-700"
              >
                Verify Password
              </Button>
              <Button
                onClick={() => setStep(1)}
                variant="outline"
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-red-900 mb-2">Final Confirmation</p>
              <p className="text-sm text-red-800">
                Your account will be permanently deleted and cannot be recovered. Are you absolutely certain?
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleRequestDeletion}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Deleting Account...' : 'Yes, Delete My Account'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
              >
                No, Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
