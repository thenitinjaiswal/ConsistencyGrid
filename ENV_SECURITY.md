# Environment Variables Security Guide

## ✅ DO's - Secure Practices

### Required Variables (Must Set Before Deployment)
```
# Never commit sensitive keys to git!
# Use .env.local for local development (ignored by git)

# NextAuth Configuration
NEXTAUTH_SECRET=your_very_long_random_secret_here_min_32_chars
NEXTAUTH_URL=https://yourdomain.com (production only, not localhost)

# Database
DATABASE_URL=file:./dev.db (development only, use hosted DB for production)

# Session Configuration
SESSION_MAX_AGE=31536000 (1 year in seconds)

# API Keys (if any external services)
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### Security Checklist
- ✅ Use strong random secrets (min 32 characters)
- ✅ Rotate secrets quarterly
- ✅ Never log sensitive values
- ✅ Use .env.local for development
- ✅ Use deployment platform's secret management (Vercel, Netlify)
- ✅ Restrict .env files in .gitignore
- ✅ Use separate values for dev/staging/production

## ❌ DON'Ts - Security Violations

### Never Do These:
```javascript
// ❌ BAD: Hardcoded secrets
const API_KEY = "sk_live_xxx";

// ❌ BAD: Committed to git
// .env file with real values

// ❌ BAD: Exposed in client-side code
console.log(process.env.DATABASE_URL);

// ❌ BAD: Weak secrets
NEXTAUTH_SECRET=abc123

// ❌ BAD: Storing in version control
git add .env
```

## 🔒 Secure Variable Usage

### In Server-Side Code (Safe)
```javascript
// ✅ OK: Server-side only
import prisma from "@/lib/prisma"; // Uses DATABASE_URL

// ✅ OK: API routes
export async function POST(req) {
  const secret = process.env.NEXTAUTH_SECRET; // Server-side only
}
```

### In Client-Side Code (Unsafe)
```javascript
// ❌ NEVER expose these in client components
// - DATABASE_URL
// - NEXTAUTH_SECRET
// - API keys
// - Private tokens

// ✅ OK: These are safe for client (prefixed with NEXT_PUBLIC_)
const publicVar = process.env.NEXT_PUBLIC_API_URL;
```

## 🚀 Deployment Configuration

### Vercel (Recommended)
1. Go to Project Settings → Environment Variables
2. Add sensitive variables
3. Select environments (Development/Preview/Production)
4. Variables auto-injected at build time

### Netlify
1. Site Settings → Build & Deploy → Environment
2. Add environment variables
3. Set per-environment values
4. Redeploy after adding vars

### Environment Variable Precedence
1. `.env.local` (development, never commit)
2. `.env.{NODE_ENV}` (development/production specific)
3. `.env` (fallback, can commit non-sensitive)
4. Deployment platform secrets (production)

## ✅ Current Security Status

### Protected Variables (Server-side only)
- ✅ DATABASE_URL - Protected by Prisma
- ✅ NEXTAUTH_SECRET - Only in server auth routes
- ✅ SESSION_MAX_AGE - Server-side only

### Verify Protection
```bash
# Check no secrets in client build
grep -r "DATABASE_URL" .next/static/ # Should be empty

# Check .env.local exists and is gitignored
cat .gitignore | grep ".env.local"
```

## 🔐 Password & Session Security

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Special characters optional but recommended

### Session Configuration
```
SESSION_MAX_AGE=31536000 (1 year)
SESSION_UPDATE_AGE=86400 (24 hours refresh)
SECURE=true (HTTPS only)
SAMESITE=None (Cross-site compatible)
HTTPONLY=true (JavaScript cannot access)
```

## 📋 Verification Checklist Before Launch

- [ ] .env.local in .gitignore
- [ ] No secrets in code comments
- [ ] NEXTAUTH_SECRET is 32+ characters random
- [ ] DATABASE_URL uses secure production DB
- [ ] SESSION_MAX_AGE set correctly
- [ ] Deployment platform has all secrets configured
- [ ] No console.log() of sensitive values
- [ ] HTTPS enabled on production
- [ ] Cookies set to Secure + HttpOnly
