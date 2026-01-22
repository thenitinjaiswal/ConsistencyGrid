"use client";

import { SessionProvider } from "next-auth/react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { AnalyticsProvider } from "./analytics-provider";

export default function Providers({ children }) {
  return (
    <ErrorBoundary>
      <SessionProvider 
        refetchInterval={24 * 60 * 60}
        refetchOnWindowFocus={true}
      >
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
