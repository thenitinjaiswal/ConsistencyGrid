# 🚀 ConsistencyGrid Production Guide (100k Users)

This guide documents the critical configurations, workflows, and scaling strategies required to launch ConsistencyGrid for 100,000+ users.

## 1. 💳 Payment Gateway & Auth Flow

The application implements a strict **Auth First -> Pay Later** flow to ensure all transactions are linked to valid user accounts.

### Authentication Flow
1.  **Guest User**: Can view `/pricing`.
2.  **Click Upgrade**:
    *   **Logic**: Checks if `session` exists.
    *   **Action**: If no session, redirects to `/login` with `callbackUrl=/pricing`.
    *   **Result**: User logs in/signs up, then is auto-redirected back to pricing to complete purchase.
3.  **Authenticated User**:
    *   **Action**: Clicks "Upgrade to Pro".
    *   **Result**: Opens Payment Modal (Razorpay/Stripe).
    *   **Success**: Webhook verifies payment -> Database updates -> User gets Pro access immediately.

### Android Compliance
- **Strategy**: Bypasses 30% Google Tax by strictly avoiding in-app payment processing code.
- **Mechanism**:
    - **App**: Shows "Continue on Website" button.
    - **Deep Link**: Opens system browser to `consistencygrid.com/pricing`.
    - **Sync**: Once user upgrades on web, the app (via `useLimitCheck` hook) automatically syncs the new status.

---

## 2. 🛡️ Security Checklist

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Payment Security** | ✅ | Server-side signature verification enabled in `/api/payment/verify` |
| **Webhook Security** | ✅ | Signature validation enforced in `/api/payment/webhook` |
| **Auth** | ✅ | `next-auth` handles session management securely |
| **API Rate Limiting** | ⚠️ | Recommended for 100k users (See Scaling Section) |
| **Database** | ✅ | Prisma with PostgreSQL |

### Critical Environment Variables
Ensure these are set in your production environment (Vercel/Railway/AWS):

```bash
# Payment - Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...

# Payment - Stripe (Optional fallback)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Authentication
NEXTAUTH_URL=https://consistencygrid.com
NEXTAUTH_SECRET=... # Generate a strong hex string
```

---

## 3. 📈 Scaling to 100k Users

For handling high traffic volume, consider the following infrastructure optimizations:

### Database (PostgreSQL)
- **Connection Pooling**: Use a connection pooler like **PgBouncer** (built-in if using Supabase or Neon) to prevent max connection errors from serverless functions.
- **Indexing**: key fields like `email`, `userId` in `Habit`, `Goal` tables are already indexed via foreign keys, but verify performance on specific queries.

### Caching Strategy
- **Static Content**: Heavily cached via Next.js CDN (Vercel Edge Network).
- **User Data**:
    - Implement `SWR` or `React Query` on frontend for smart caching (Already valid in current implementation with standard `useEffect` + local state).
    - Consider **Redis** for session storage if `next-auth` JWT payload becomes too large (JWT is currently optimal for speed).

### Rate Limiting
- Implement stricter rate limiting middleware for `/api/auth/*` and `/api/payment/*` to prevent abuse.
- Use `upstash/ratelimit` for serverless-friendly limiting.

---

## 4. 📱 Mobile Deployment (Android)

### WebView Optimization
- **User Agent**: `ConsistencyGridApp/1.0` (Configured in Android wrapper).
- **Cache Mode**: Ensure WebView caches static assets (JS/CSS) aggressively to reduce load times.
- **Deep Linking**:
    - **Scheme**: `consistencygrid://`
    - **Host**: `consistencygrid.com`
    - Ensure `assetlinks.json` is deployed to `/.well-known/assetlinks.json` on the domain for App Links verification.

---

## 5. 🆘 Troubleshooting

### "Payment Failed" but Money Deducted
- Check **Webhooks**. The system relies on webhooks for reliable confirmations.
- Verify `RAZORPAY_KEY_SECRET` matches the dashboard.

### User "Still Free" After Payment
- Manually check `PaymentTransaction` table in Prisma Studio.
- If status is `success` but user is `free`, manually update `User.plan` and check webhook logs for errors.

---
**Last Updated**: 2026-02-01
