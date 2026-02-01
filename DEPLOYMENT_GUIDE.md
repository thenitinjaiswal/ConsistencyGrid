# 🚀 Quick Deployment Guide - ConsistencyGrid

## Pre-Deployment Checklist (30 minutes)

### 1. **Apply Database Indexes** (CRITICAL - do this FIRST)
```sql
-- Run these on your PostgreSQL database BEFORE deploying code

CREATE INDEX IF NOT EXISTS idx_user_email ON "User"("email");
CREATE INDEX IF NOT EXISTS idx_user_publictoken ON "User"("publicToken");

CREATE INDEX IF NOT EXISTS idx_habit_userid_active ON "Habit"("userId", "isActive");
CREATE INDEX IF NOT EXISTS idx_habitlog_habitid_date ON "HabitLog"("habitId", "date");

CREATE INDEX IF NOT EXISTS idx_goal_userid_completed ON "Goal"("userId", "isCompleted");
CREATE INDEX IF NOT EXISTS idx_goal_userid_pinned ON "Goal"("userId", "isPinned");

CREATE INDEX IF NOT EXISTS idx_reminder_userid_active ON "Reminder"("userId", "isActive");

CREATE INDEX IF NOT EXISTS idx_payment_userid_status ON "PaymentTransaction"("userId", "status");
CREATE INDEX IF NOT EXISTS idx_payment_providerid ON "PaymentTransaction"("providerOrderId");

CREATE INDEX IF NOT EXISTS idx_settings_userid ON "WallpaperSettings"("userId");
```

### 2. **Verify All Environment Variables**
```bash
# Required environment variables for production:
NEXTAUTH_SECRET=<generate-new-secret>
NEXTAUTH_URL=https://consistencygrid.com

# Payment providers
RAZORPAY_KEY_ID=<your-key>
RAZORPAY_KEY_SECRET=<your-secret>
NEXT_PUBLIC_RAZORPAY_KEY_ID=<your-public-key>

STRIPE_SECRET_KEY=<your-secret>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-public-key>
STRIPE_WEBHOOK_SECRET=<your-webhook-secret>

# Database
DATABASE_URL=postgresql://user:password@host:5432/consistencygrid

# Email service
SMTP_HOST=<your-smtp>
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASSWORD=<your-password>

# Monitoring
SENTRY_DSN=<your-sentry-dsn>
SENTRY_AUTH_TOKEN=<your-token>

# Payment provider selection
NEXT_PUBLIC_PAYMENT_PROVIDER=razorpay  # or 'stripe'
```

### 3. **Run Tests Locally**
```bash
# Unit tests
npm run test

# E2E tests (requires test environment)
npm run test:e2e

# Security audit
npm audit
npm audit fix

# Type check
npm run type-check
```

### 4. **Verify Security Headers**
```bash
# After deployment, test with:
curl -I https://consistencygrid.com

# Should show:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# Content-Security-Policy: ...
```

---

## Deployment Steps (Via Vercel)

### Option 1: GitHub Push (Recommended)
```bash
# 1. Commit all changes
git add .
git commit -m "chore: production polish and hardening"
git push origin main

# 2. Vercel will automatically deploy
# 3. Monitor deployment: https://vercel.com/consistencygrid

# 4. Verify production health
curl https://consistencygrid.com/api/health
```

### Option 2: Vercel CLI
```bash
# 1. Install CLI if not already
npm i -g vercel

# 2. Deploy
vercel deploy --prod

# 3. Watch logs
vercel logs --prod
```

### Option 3: Manual Docker Deployment
```bash
# Build
docker build -t consistencygrid:latest .

# Test locally
docker run -p 3000:3000 --env-file .env.production consistencygrid:latest

# Push to registry
docker push your-registry/consistencygrid:latest

# Deploy (depends on your platform)
kubectl apply -f deployment.yaml  # Kubernetes
# or
docker pull your-registry/consistencygrid:latest  # Docker Swarm
```

---

## Post-Deployment Verification (15 minutes)

### 1. **Health Check**
```bash
curl https://consistencygrid.com/api/health

# Expected response:
# {
#   "status": "healthy",
#   "database": "connected",
#   "latencies": { "database": "45ms", "total": "102ms" },
#   "uptime": 3600
# }
```

### 2. **Test Core Features**
```bash
# 1. Login flow
# - Navigate to /login
# - Test login with valid credentials
# - Verify redirect to /dashboard

# 2. Wallpaper generation
# - Navigate to /generator
# - Create/modify settings
# - Verify wallpaper generates in < 5 seconds
# - Download wallpaper

# 3. Payment flow
# - Navigate to /pricing
# - Click "Upgrade" on any plan
# - Complete payment with test card
# - Verify subscription status updates

# 4. Public wallpaper share
# - Generate wallpaper
# - Share link
# - Open in incognito browser
# - Verify public preview works
```

### 3. **Monitor Errors**
```bash
# Check Sentry dashboard
https://sentry.io/organizations/your-org/issues/

# Expected: Zero critical errors
# Warning: < 1 error per 1000 requests

# Check server logs
vercel logs --prod --tail
```

### 4. **Performance Check**
```bash
# Google PageSpeed Insights
https://pagespeed.web.dev/?url=https%3A%2F%2Fconsistencygrid.com

# Expected Core Web Vitals:
# - LCP: < 2.5s
# - CLS: < 0.1
# - FID: < 100ms
```

---

## Rate Limiting in Production

### Payment Endpoint Limits
```
POST /api/payment/create-order
- 10 requests per minute per user
- Returns 429 if exceeded

POST /api/payment/verify
- 5 requests per minute per user
- Returns 429 if exceeded
```

### Testing Rate Limits
```bash
# This should be rejected (11th request)
for i in {1..11}; do
  curl -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"planId":"pro_monthly"}' \
    https://consistencygrid.com/api/payment/create-order
  echo "Request $i sent"
done

# Should get 429 on request 11
```

---

## Rollback Plan (If Issues Occur)

### Quick Rollback (< 5 minutes)
```bash
# Via Vercel
vercel rollback --prod

# Via Git
git revert HEAD
git push origin main
# Vercel auto-deploys new push
```

### Database Rollback (If Migrations Failed)
```bash
# Via Prisma
npx prisma migrate resolve --rolled-back 20260201000000_migration_name

# Manual rollback (if needed)
psql -U postgres -d consistencygrid < backup.sql
```

---

## Monitoring Setup (10 minutes)

### 1. **Enable Sentry Error Tracking**
```bash
# Sentry is already configured in:
# - sentry.server.config.js
# - sentry.client.config.js

# Just add SENTRY_DSN to production env variables
```

### 2. **Set Up Alerts**
```javascript
// Configure in Sentry dashboard:
- Alert on: Error rate > 5%
- Alert on: Response time > 3s
- Alert on: Database errors
- Channels: Slack, Email, PagerDuty
```

### 3. **Create Monitoring Dashboard**
```bash
# Monitor these metrics:
- API response time (p50, p95, p99)
- Database connection pool usage
- Error rate by endpoint
- Payment success rate
- Wallpaper generation time
```

---

## Scaling Plan for 100k Users

### Phase 1: Initial Launch (1k-10k users)
- ✅ Single Vercel instance (handles ~500 req/sec)
- ✅ PostgreSQL with indexes (handles queries)
- ✅ CloudFront CDN for images

### Phase 2: Growth (10k-50k users)
- ⭕ Scale Vercel (2-3 instances)
- ⭕ Add read replica for database
- ⭕ Enable Redis caching
- ⭕ Queue system for async jobs

### Phase 3: Enterprise (50k-100k+ users)
- ⭕ Multiple region deployment
- ⭕ Database sharding
- ⭕ Microservices architecture
- ⭕ Kubernetes orchestration

---

## Troubleshooting

### Wallpaper Generation Slow?
```javascript
// Check if:
1. Database has indexes ✓
2. Caching is working (5 min + 1 hour CDN)
3. Canvas library is loaded in Node.js
4. Font file exists at src/fonts/Inter-Regular.ttf
```

### Payment Errors?
```javascript
// Check:
1. Razorpay/Stripe credentials in .env
2. Webhook URLs configured
3. Database PaymentTransaction table exists
4. Rate limiting not blocking requests
```

### Database Slow?
```sql
-- Check indexes
SELECT * FROM pg_stat_user_indexes;

-- Check slow queries (> 1 second)
SELECT query, calls, mean_time FROM pg_stat_statements 
WHERE mean_time > 1000 
ORDER BY mean_time DESC;
```

---

## Success Criteria

✅ Deployment successful if:
- [ ] `/api/health` returns 200 (database connected)
- [ ] Login flow works end-to-end
- [ ] Wallpaper generation < 5 seconds
- [ ] Payment flow completes without errors
- [ ] Sentry shows < 1% error rate
- [ ] Core Web Vitals pass
- [ ] Rate limiting works (429 on excess)

---

**Estimated Deployment Time**: 30 min setup + 10 min verification = 40 minutes total

**Good luck with launch! 🚀**
