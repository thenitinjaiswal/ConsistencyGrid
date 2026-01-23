"use client";

import { Component } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { captureException } from "@/lib/sentry";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to Sentry
    captureException(error, {
      errorInfo,
      componentStack: errorInfo.componentStack,
    });

    // Generate error ID for user support
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.setState({ errorId });

    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fffaf1] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error. Our team has been notified.
              </p>
            </div>

            {this.state.errorId && (
              <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-6">
                <p className="text-xs text-gray-500 font-mono break-all">
                  Error ID: {this.state.errorId}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
              >
                Refresh Page
              </button>
              <Link
                href="/dashboard"
                className="block w-full rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
