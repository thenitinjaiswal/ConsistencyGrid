# Environment Variables for Production

Copy and fill in these environment variables for your production deployment:

```bash
# Authentication
NEXTAUTH_SECRET=your_32_character_random_secret_here
NEXTAUTH_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Search Console Verification (Optional)
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_verification_code

# Email Service (Optional, for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🔑 Generating NEXTAUTH_SECRET

Run this in terminal to generate a secure secret:

### On Linux/Mac:
```bash
openssl rand -base64 32
```

### On Windows PowerShell:
```powershell
[Convert]::ToBase64String((Get-Random -InputObject (0..255) -Count 32))
```

Or use an online tool: https://generate-secret.vercel.app/

## 📋 Steps to Configure Each Variable

### 1. NEXTAUTH_SECRET
- Generate a random 32+ character string (see above)
- Keep it secret, never commit to git

### 2. NEXTAUTH_URL
- Set to your production domain
- Example: `https://consistencygrid.com`

### 3. DATABASE_URL
- Use PostgreSQL for production (not SQLite)
- Format: `postgresql://user:password@host:port/database`
- Never use SQLite in production

### 4. NEXT_PUBLIC_SITE_URL
- Same as NEXTAUTH_URL
- Used for URLs in emails and social sharing

### 5. Google OAuth (Optional)
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create OAuth 2.0 credentials
- Add authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

### 6. Google Analytics (Optional)
- Create property in [Google Analytics](https://analytics.google.com/)
- Get Measurement ID (G-XXXXXXXXXX)

### 7. Google Search Console (Optional)
- Verify domain at [Search Console](https://search.google.com/search-console)
- Get verification token

## 🚀 For Vercel Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable above
5. Choose which environments: Production, Preview, Development
6. Redeploy after adding variables

## 🚀 For Netlify Deployment

1. Go to Netlify Dashboard
2. Select your site
3. Go to Site Settings → Build & Deploy → Environment
4. Add each variable
5. Redeploy

## 🚀 For Self-Hosted (Docker/VPS)

1. Create `.env.production` file with all variables
2. Make sure it's in `.gitignore` (never commit secrets)
3. Run: `npm run build && npm run start`

## ✅ Pre-Launch Verification

- [ ] NEXTAUTH_SECRET is set and unique
- [ ] NEXTAUTH_URL matches your domain
- [ ] DATABASE_URL is PostgreSQL (not SQLite)
- [ ] NEXT_PUBLIC_SITE_URL is set correctly
- [ ] All secrets are added to deployment platform
- [ ] Build succeeds: `npm run build`
- [ ] No errors in deployment
- [ ] Login/signup works in production
- [ ] Wallpaper generation works
- [ ] Analytics showing data

## ⚠️ Security Checklist

- [ ] Never commit `.env.local` or `.env.production` to git
- [ ] `.env*` files are in `.gitignore`
- [ ] NEXTAUTH_SECRET is unique per environment
- [ ] No secrets visible in public code
- [ ] HTTPS is enabled on production domain
- [ ] Database credentials are secure
- [ ] API endpoints are properly authenticated

---

For more details, see [DEPLOYMENT.md](./DEPLOYMENT.md)
