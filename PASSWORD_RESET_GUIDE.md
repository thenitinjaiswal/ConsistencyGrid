# Password Reset Feature - Implementation Guide

## 🎯 Overview

Production-ready "Forgot Password" feature with:
- **Email-based token reset** via Resend API
- **256-bit secure tokens** (32-byte random)
- **15-minute expiry** (configurable)
- **Single-use enforcement** (unique constraint)
- **No user enumeration** (generic responses)
- **Database-backed** (not in-memory)

---

## 📋 Implementation Checklist

✅ **Completed:**
- [ ] Prisma schema updated with `resetToken` & `resetTokenExpiry` fields
- [ ] Migration applied (`add_password_reset`)
- [ ] Forgot password API route created
- [ ] Reset password page component ready
- [ ] Reset password API endpoint created
- [ ] Environment variables documented

---

## 🔧 Setup Instructions

### 1. **Install Resend**
```bash
npm install resend
```

### 2. **Set Environment Variables**

Add to `.env.local`:
```env
# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Get your Resend API key from: https://resend.com/api-keys

### 3. **Run Prisma Migration**
```bash
npx prisma migrate dev
```

This creates the `resetToken` and `resetTokenExpiry` columns on the User table.

### 4. **Verify Database**
```bash
npx prisma db push
```

---

## 🏗️ Architecture

### **File Structure**
```
src/
├── app/
│   ├── api/auth/
│   │   ├── forgot-password-new/
│   │   │   └── route.js          ← User requests password reset
│   │   └── reset-password-new/
│   │       └── route.js          ← User submits new password
│   ├── forgot-password/
│   │   └── page.js               ← Form to enter email
│   └── reset-password/
│       └── page.js               ← Form to enter new password
├── components/
│   └── (existing components)
└── middleware.js                 ← Optional: Rate limiting
```

### **Data Flow**

```
1. User enters email
   ↓
2. POST /api/auth/forgot-password-new
   → Generates 256-bit token
   → Stores in DB with 15min expiry
   → Sends email via Resend
   ↓
3. User clicks email link
   ↓
4. /reset-password?token=xxxxx page
   → Validates token exists & not expired
   ↓
5. User enters new password
   ↓
6. POST /api/auth/reset-password-new
   → Validates token & expiry
   → Hashes password
   → Clears token from DB
   ↓
7. Redirect to /login
```

---

## 📁 API Endpoints

### **POST /api/auth/forgot-password-new**

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200):**
```json
{
  "message": "Password reset email sent"
}
```

**Response (Error - Always same for security):**
```json
{
  "message": "If your email exists, you will receive a reset link"
}
```

**Key Features:**
- No user enumeration (same response regardless of email existence)
- 32-byte token: `crypto.randomBytes(32).toString('hex')`
- 15-minute expiry: `new Date(Date.now() + 15 * 60 * 1000)`
- Token stored with `@unique` constraint (single-use)
- Email sent via Resend with reset link

---

### **POST /api/auth/reset-password-new**

**Request:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "password": "NewPassword123!"
}
```

**Response (Success - 200):**
```json
{
  "message": "Password reset successfully"
}
```

**Response (Error - 400):**
```json
{
  "message": "Invalid or expired reset token"
}
```

**Key Features:**
- Token validation: Must exist and not be expired
- Password validation: Minimum 8 characters
- Password hashing: bcryptjs with salt 10
- Token cleanup: Sets both fields to null after use
- No sensitive info in responses

---

## 🔐 Security Features

### **1. Token Security**
- **256-bit random generation:** `crypto.randomBytes(32).toString('hex')`
- **Unique constraint:** Prevents duplicate tokens
- **Time-based expiry:** Tokens expire after 15 minutes
- **Single-use enforcement:** Cleared after first successful use

### **2. No User Enumeration**
```javascript
// Always returns same response, regardless of email existence
{
  "message": "If your email exists, you will receive a reset link"
}
```

### **3. Password Security**
- **8-character minimum:** Enforced on both frontend & backend
- **bcryptjs hashing:** Salt factor 10
- **No plain text storage:** Always hashed before DB save

### **4. Email Security**
- **Resend API** (not SMTP): Prevents credentials in environment
- **Secure reset link:** Includes token in URL
- **Expiry warning:** Email shows 15-minute limit

---

## 🧪 Testing

### **Test Case 1: Valid Reset Flow**
```bash
# 1. Request reset
curl -X POST http://localhost:3000/api/auth/forgot-password-new \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Expected: { "message": "If your email exists..." }

# 2. Check database for token
npx prisma db query "SELECT email, resetToken, resetTokenExpiry FROM User WHERE email='user@example.com'"

# 3. Copy token from DB
# 4. Visit: http://localhost:3000/reset-password?token=<TOKEN>
# 5. Enter new password and submit
# 6. Should redirect to /login
```

### **Test Case 2: Expired Token**
```bash
# Wait 16+ minutes, then try to reset with same token
# Expected: "Invalid or expired reset token"
```

### **Test Case 3: Invalid Token**
```bash
# Visit: http://localhost:3000/reset-password?token=invalid
# Expected: "Reset Link Expired" message
```

### **Test Case 4: No User Enumeration**
```bash
# Request with non-existent email
curl -X POST http://localhost:3000/api/auth/forgot-password-new \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@example.com"}'

# Expected: Same response as valid email
# { "message": "If your email exists..." }
```

---

## 🚀 Configuration

### **Change Token Expiry**
File: `src/app/api/auth/forgot-password-new/route.js`
```javascript
// Default: 15 minutes
const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

// Change to 1 hour
const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
```

### **Change Resend Sender**
File: `.env.local`
```env
RESEND_FROM_EMAIL=support@yourdomain.com
```

### **Customize Email Template**
File: `src/app/api/auth/forgot-password-new/route.js`

The email HTML template is in the route file. Modify the `html` property to customize styling and messaging.

---

## 🐛 Debugging

### **Email Not Sending?**
1. Check `RESEND_API_KEY` is valid
2. Check `RESEND_FROM_EMAIL` uses verified domain
3. Check `/api/auth/forgot-password-new` response in browser console
4. Check server logs for errors

### **Token Not in Database?**
1. Check migration ran: `npx prisma migrate status`
2. Run again if needed: `npx prisma migrate deploy`
3. Verify fields exist: `npx prisma studio`

### **Reset Link Not Working?**
1. Check token exists in DB
2. Check token hasn't expired (compare with current time)
3. Check URL has `?token=` query parameter
4. Check token matches exactly (copy from DB directly)

---

## 📊 Database Schema

```prisma
model User {
  // ... existing fields ...
  
  // Password reset fields
  resetToken        String?   @unique  // 64-char hex string
  resetTokenExpiry  DateTime?          // Expiry timestamp
}
```

**Migration File:**
```sql
-- prisma/migrations/XXXXXXXXX_add_password_reset/migration.sql
ALTER TABLE "User" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "User" ADD COLUMN "resetTokenExpiry" DATETIME;
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");
```

---

## 🌐 Deployment

### **Environment Variables Required**
```env
# Production .env
RESEND_API_KEY=re_xxxxxxxxxxxxx           # Resend API key
RESEND_FROM_EMAIL=noreply@yourdomain.com  # Verified sender email
NEXT_PUBLIC_APP_URL=https://yourdomain.com # Your production URL
```

### **Pre-Deployment Checklist**
- [ ] Resend account created & domain verified
- [ ] API key stored in production secrets
- [ ] Reset link in email points to production URL
- [ ] Database migration applied
- [ ] Test forgot-password flow end-to-end

---

## 📝 Monitoring & Logging

Add logging to track resets:
```javascript
// In route handlers
console.log(`[Password Reset] Email: ${email}, Status: success/error`);
console.log(`[Token Validation] Token: ${token.slice(0,10)}..., Expired: ${isExpired}`);
```

Monitor for:
- Failed reset attempts (brute force)
- Expired token usage
- Email delivery failures

---

## 🔗 Related Documentation

- [NextAuth.js Setup](../NEXTAUTH_SETUP.md)
- [Security Best Practices](../SECURITY_IMPLEMENTATION.md)
- [Environment Variables](../ENV_VARIABLES.md)
- [Resend Documentation](https://resend.com/docs)

