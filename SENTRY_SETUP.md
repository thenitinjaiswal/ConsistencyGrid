# Sentry Error Logging Setup

## Overview
Sentry is integrated into ConsistencyGrid for real-time error tracking, performance monitoring, and debugging. It automatically captures unhandled exceptions, provides breadcrumb trails, and helps identify patterns in application failures.

## Quick Setup (5 minutes)

### Step 1: Create Sentry Account
1. Visit [sentry.io](https://sentry.io)
2. Sign up for a free account
3. Create a new project for "Next.js"

### Step 2: Get Your DSN
1. After creating project, go to Settings → Projects
2. Copy your DSN (looks like: `https://xxx@xxx.ingest.sentry.io/xxx`)

### Step 3: Configure Environment
Create/update `.env.local`:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_APP_VERSION=1.0.0
SENTRY_AUTH_TOKEN=your_token_here  # Optional, for source maps in CI/CD
```

### Step 4: Install Sentry
```bash
npm install @sentry/nextjs
```

### Step 5: Initialize Sentry
The initialization happens automatically in `/src/lib/sentry.js`. It includes:
- Error tracking
- Performance monitoring (10% of requests in prod, 100% in dev)
- Session replay
- Source maps support

## Features Implemented

### ✅ Error Tracking
```javascript
import { captureException } from '@/lib/sentry';

try {
  // code
} catch (error) {
  captureException(error, { customContext: 'value' });
}
```

### ✅ Event Tracking
```javascript
import { captureMessage, addBreadcrumb } from '@/lib/sentry';

captureMessage('User completed goal', 'info', { goalId: 123 });
addBreadcrumb('User clicked button', 'user-action', 'info', { buttonId: 'submit' });
```

### ✅ User Tracking
```javascript
import { setUserContext, clearUserContext } from '@/lib/sentry';

// After login
setUserContext(userId, email, name);

// After logout
clearUserContext();
```

### ✅ Error Boundary
The `ErrorBoundary` component automatically:
- Captures React component errors
- Generates error IDs for user support
- Displays error messages to users
- Shows error details in development

### ✅ API Error Tracking
All API endpoints using `withPOST`, `withGET`, etc. automatically capture errors.

## Usage Examples

### Track User Actions
```javascript
// In API route
import { addBreadcrumb } from '@/lib/sentry';

export async function POST(req) {
  const { email, name } = req.body;
  
  addBreadcrumb('User signup started', 'auth', 'info', { email });
  
  try {
    // process signup
    addBreadcrumb('User signup completed', 'auth', 'info', { userId });
  } catch (error) {
    captureException(error, { email, stage: 'signup' });
  }
}
```

### Track Database Errors
```javascript
import { captureException } from '@/lib/sentry';

try {
  const user = await prisma.user.findUnique({ where: { id } });
} catch (error) {
  captureException(error, { 
    operation: 'prisma.user.findUnique',
    userId: id 
  });
}
```

### Track Performance Issues
```javascript
import { addBreadcrumb } from '@/lib/sentry';

const start = Date.now();
const result = await expensiveOperation();
const duration = Date.now() - start;

if (duration > 1000) {
  addBreadcrumb('Slow operation detected', 'performance', 'warning', {
    operation: 'expensiveOperation',
    duration,
  });
}
```

## Environment Variables

### Required
- `NEXT_PUBLIC_SENTRY_DSN` - Your Sentry project DSN

### Optional
- `SENTRY_AUTH_TOKEN` - For source map uploads in CI/CD
- `NEXT_PUBLIC_APP_VERSION` - Application version for release tracking
- `NODE_ENV` - Automatically detected (development/production)

## Configuration Details

### Sample Rates (Adjustable in `/src/lib/sentry.js`)
- **Transactions**: 100% in dev, 10% in production
- **Session Replay**: 10% of sessions, 100% on errors
- **Environment**: Auto-detected from NODE_ENV

### Data Captured
- ✅ Console errors and warnings
- ✅ React component errors
- ✅ Network errors
- ✅ Unhandled promise rejections
- ✅ Browser extensions (filtered out)
- ✅ Performance metrics

### Data Not Captured
- ✅ Browser extensions (auto-filtered)
- ✅ Private browsing data
- ✅ Session replays on normal sessions (only on errors unless configured)

## Best Practices

### 1. Set User Context After Login
```javascript
// In login/signup API
import { setUserContext } from '@/lib/sentry';

setUserContext(user.id, user.email, user.name);
```

### 2. Add Breadcrumbs for Important Events
```javascript
import { addBreadcrumb } from '@/lib/sentry';

// Track user actions
addBreadcrumb('Habit created', 'habit', 'info', { habitId, name });
addBreadcrumb('Goal completed', 'goal', 'info', { goalId });
addBreadcrumb('Reminder triggered', 'reminder', 'info', { reminderId });
```

### 3. Capture Errors with Context
```javascript
import { captureException } from '@/lib/sentry';

captureException(error, {
  userId: user.id,
  action: 'create_habit',
  habitData: sanitizedData,
});
```

### 4. Use Error Boundaries
The `ErrorBoundary` component is already integrated into the main layout. Wrap additional sections if needed:
```javascript
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function Page() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### 5. Filter Sensitive Data
Always sanitize user data before sending to Sentry:
```javascript
import { captureException } from '@/lib/sentry';

const sanitizedData = {
  userId: user.id,
  // Never send passwords or tokens!
};

captureException(error, { data: sanitizedData });
```

## Monitoring Dashboard

### Key Metrics to Watch
1. **Error Rate** - % of requests with errors
2. **Affected Users** - How many users hit errors
3. **Response Time** - API performance (from transaction monitoring)
4. **Session Replay** - Replay errors for debugging

### Alert Setup
Configure in Sentry dashboard:
- Alert when error rate > 5%
- Alert when new error type appears
- Alert on performance regressions

## Disable Sentry (Development)

If you want to work without Sentry:
1. Don't set `NEXT_PUBLIC_SENTRY_DSN` in `.env.local`
2. Errors will be logged to console instead
3. All Sentry functions become no-ops

## Troubleshooting

### Sentry Not Capturing Errors
- ✅ Check that `NEXT_PUBLIC_SENTRY_DSN` is set
- ✅ Check browser console for errors
- ✅ Ensure app is deployed (localhost sometimes has issues)

### Too Many Events (High Bill)
- ✅ Lower `tracesSampleRate` in `/src/lib/sentry.js`
- ✅ Lower `replaysSessionSampleRate`
- ✅ Set up alerts instead of capturing all events

### Source Maps Not Uploading
- ✅ Set `SENTRY_AUTH_TOKEN` in CI/CD environment
- ✅ Run `npm install @sentry/cli` for manual upload

## Production Checklist

- [ ] `NEXT_PUBLIC_SENTRY_DSN` set in production
- [ ] `NEXT_PUBLIC_APP_VERSION` matches your release
- [ ] User context set after authentication
- [ ] Error boundaries wrapped around critical sections
- [ ] Sensitive data filtered from error context
- [ ] Sentry alerts configured
- [ ] Performance thresholds defined

## More Resources
- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Best Practices](https://docs.sentry.io/product/best-practices/)
- [Pricing](https://sentry.io/pricing/)

## Support
For issues with Sentry integration:
1. Check Sentry Status Page
2. Review `/src/lib/sentry.js` configuration
3. Check browser console for errors
4. Contact support@consistencygrid.com
