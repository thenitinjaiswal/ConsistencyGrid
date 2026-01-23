"use client";

import { SessionProvider } from "next-auth/react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { AnalyticsProvider } from "./analytics-provider";
import PWAInitializer from "@/components/common/PWAInitializer";
import PWAInstallPrompt from "@/components/common/PWAInstallPrompt";

export default function Providers({ children }) {
  return (
    <ErrorBoundary>
      <SessionProvider 
        refetchInterval={24 * 60 * 60}
        refetchOnWindowFocus={true}
      >
        <AnalyticsProvider>
          <PWAInitializer />
          <PWAInstallPrompt />
          {children}
        </AnalyticsProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
