# 🏛️ Architecture & Decision Log

This document records key architectural decisions and the rationale behind them ("What we did and Why we did it").

## 1. Hybrid Payment Strategy (Play Store Compliance)

**Decision**: Do not implement Google Play Billing Library. Instead, redirect Android users to the website for all subscription transactions.
**Rationale**:
-   **Cost**: Avoids the 15-30% Google Play commission fee.
-   **Complexity**: Significantly reduces code complexity by maintaining a single payment logic (Web) instead of two.
-   **Compliance**: Google allows "Consumption only" apps (like Spotify/Netflix) where users pay outside the app and consume content inside, provided there are no in-app buttons *directly* initiating a purchase flow. We use a neutral "Continue on Website" or "Members Area" button to comply.

## 2. Strict "Auth-First" Payment Flow

**Decision**: Users must be authenticated (Logged In) *before* they can see the payment gateway.
**Rationale**:
-   **Data Integrity**: Ensures every payment record (`PaymentTransaction`) is immediately linked to a valid `User` ID in the database.
-   **User Experience**: Prevents the "I paid checking out as guest but don't have an account" support nightmare.
-   **Security**: Allows us to use `userId` in webhook verification logic.

## 3. Preemptive Limit Checks (Frontend)

**Decision**: Check limits (Goals/Habits) on the client side *before* opening the creation modal.
**Rationale**:
-   **UX**: It is frustrating for a user to fill out a form only to be rejected upon submission.
-   **Performance**: Reduces unnecessary API calls to the backend that would just return a 403 error.
-   **Conversion**: Presenting the upgrade prompt immediately when the user signal's intent (clicking "Add") is a high-conversion moment.

## 4. Platform-Aware UI Components

**Decision**: Use a shared codebase but conditionally render UI based on platform (`isAndroidApp()` check).
**Rationale**:
-   **Maintainability**: Single Next.js codebase for both Web and Android WebView.
-   **Consistency**: Core logic remains the same, only the "Call to Action" buttons change (e.g., "Upgrade to Pro" vs "Continue on Website").

## 5. Next.js + Server Actions/API Routes

**Decision**: Use Next.js API routes for Payment/Auth logic.
**Rationale**:
-   **Security**: API keys (Razorpay/Stripe secrets) stay secure on the server.
-   **Scalability**: Vercel/Serverless deployment scales automatically with traffic (crucial for 100k user target).

---
*Created: 2026-02-01*
