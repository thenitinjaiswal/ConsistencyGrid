'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

/**
 * PWA Install Prompt Component
 * Shows install prompt for supported browsers
 * Integrates with Web App Manifest
 */
export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      // This causes a "Banner not shown" warning in console, which is expected
      // because we are using a custom install UI instead of the browser's default.
      e.preventDefault();
      // Stash the event for later use
      setDeferredPrompt(e);
      // Show the install prompt
      setShowPrompt(true);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      console.log('PWA installed successfully');
      setDeferredPrompt(null);
      setShowPrompt(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Don't show anything if app is already installed or no prompt available
  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in fade-in slide-in-from-bottom">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <Download size={18} />
            Install Consistency Grid
          </h3>
          <button
            onClick={handleDismiss}
            className="text-white hover:bg-white/20 rounded p-1 transition"
            aria-label="Dismiss install prompt"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <p className="text-gray-700 text-sm mb-3">
            Get instant access to Consistency Grid. Install it as an app on your device for faster access and offline support.
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleDismiss}
              className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded font-medium transition"
            >
              Not Now
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 px-3 py-2 text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded font-medium transition"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
