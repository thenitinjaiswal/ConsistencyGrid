# PostgreSQL Setup Guide - ConsistencyGrid

**Status:** Prisma schema updated to PostgreSQL ✅

Now you need to create a PostgreSQL database and connect it.

---

## 🚀 Choose Your Setup Option

### Option 1: Vercel Postgres (EASIEST - Recommended)

**Best for:** Quick launch, minimal DevOps

**Steps:**

1. **Go to Vercel Console**
   - URL: [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in with GitHub

2. **Create Postgres Database**
   - Click on your ConsistencyGrid project
   - Storage tab → Create Database
   - Select Postgres
   - Name: `consistencygrid-db`
   - Region: Choose closest to you
   - Click Create

3. **Get Connection String**
   - After creation, copy the `.env.local` content
   - It will show: `POSTGRES_URL_NON_POOLING=postgresql://...`
   - Copy the full connection string

4. **Add to Environment**
   - Create `.env.production` file in project root
   - Add: `DATABASE_URL=<paste_connection_string>`

**Cost:** ~$15-20/month for small database, scales with usage

**Time to setup:** 5 minutes

---

### Option 2: AWS RDS (More Control)

**Best for:** Production-grade control, larger scale

**Steps:**

1. **Create RDS Instance**
   - URL: [https://console.aws.amazon.com/rds](https://console.aws.amazon.com/rds)
   - RDS → Databases → Create database
   - Engine: PostgreSQL
   - Version: 15+
   - Instance class: db.t3.micro (free tier)
   - Storage: 20 GB
   - DB instance identifier: `consistencygrid-prod`
   - Master username: `postgres`
   - Master password: Create strong password

2. **Configure Security**
   - VPC security group: Create new or use existing
   - Allow inbound: PostgreSQL (5432) from your IP
   - Make publicly accessible: Yes (for now)

3. **Get Connection Details**
   - After creation, click database
   - Copy "Endpoint" (looks like: `xyz.rds.amazonaws.com`)
   - Port: 5432
   - Database: postgres

4. **Create Connection String**
   ```
   DATABASE_URL=postgresql://postgres:PASSWORD@ENDPOINT:5432/consistencygrid
   ```
   Replace:
   - PASSWORD: Your master password
   - ENDPOINT: Your RDS endpoint

5. **Add to Environment**
   - Create `.env.production` file
   - Add the DATABASE_URL

**Cost:** Free tier for 12 months, then ~$15-50/month

**Time to setup:** 10-15 minutes

---

### Option 3: DigitalOcean (Good Balance)

**Best for:** Mid-scale, managed database

**Steps:**

1. **Create Managed Database**
   - URL: [https://cloud.digitalocean.com](https://cloud.digitalocean.com)
   - Databases → Create → PostgreSQL
   - Version: 15+
   - Size: Basic ($15/month)
   - Region: Closest to you
   - Name: consistencygrid

2. **Get Connection String**
   - After creation, click database
   - Connection details tab
   - Copy "Connection String" or build from components

3. **Get Full Connection String**
   ```
   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
   ```

4. **Add to Environment**
   - Create `.env.production` file
   - Add the DATABASE_URL

**Cost:** $15/month minimum

**Time to setup:** 5-10 minutes

---

### Option 4: Local PostgreSQL (Development Only)

**Best for:** Testing before production deploy

**Steps:**

1. **Install PostgreSQL**
   ```bash
   # Windows: Download from https://www.postgresql.org/download/windows/
   # Or use Chocolatey:
   choco install postgresql
   ```

2. **Start Service**
   ```bash
   # Windows PowerShell (as Admin)
   Start-Service -Name PostgreSQL
   ```

3. **Create Database**
   ```bash
   psql -U postgres
   CREATE DATABASE consistencygrid;
   \q
   ```

4. **Get Connection String**
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/consistencygrid
   ```

5. **Add to Environment**
   - Create `.env.local` (for development)
   - Add the DATABASE_URL

**Cost:** Free

**Time to setup:** 10-15 minutes

---

## ✅ Next Steps (After Choosing Option)

### Step 1: Create `.env.production` File

**Location:** `d:\startup\consistencygrid\.env.production`

**Content:**
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
NEXTAUTH_SECRET=<generate_32_char_random_string>
NEXTAUTH_URL=https://yourdomain.com

# Site URL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Analytics (optional - get from Google Analytics)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Step 2: Generate NEXTAUTH_SECRET

Run in PowerShell:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste into `.env.production`

### Step 3: Run Prisma Migrations

```bash
# Set the DATABASE_URL temporarily
$env:DATABASE_URL="postgresql://user:pass@host:port/db"

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Verify database connection
npx prisma studio
```

If `prisma studio` opens in browser and loads, ✅ you're connected!

### Step 4: Test Locally

```bash
# Add DATABASE_URL to .env.local for testing
echo 'DATABASE_URL=postgresql://user:pass@host:port/db' >> .env.local

# Start dev server
npm run dev

# Test:
# 1. Go to http://localhost:3000
# 2. Try to sign up
# 3. Check database
```

---

## 🔧 Quick Troubleshooting

### Error: "connect ECONNREFUSED"
- **Cause:** Database not running or wrong connection string
- **Fix:** Verify DATABASE_URL is correct, test connection:
  ```bash
  psql $env:DATABASE_URL
  ```

### Error: "password authentication failed"
- **Cause:** Wrong password in connection string
- **Fix:** Check your password, make sure special characters are URL encoded

### Error: "Unknown database engine"
- **Cause:** Prisma not updated to PostgreSQL
- **Fix:** Verify [prisma/schema.prisma](prisma/schema.prisma) has `provider = "postgresql"`

### Error: "FATAL: remaining connection slots reserved"
- **Cause:** Too many connections on small database
- **Fix:** Increase max connections or use connection pooling

---

## 🔐 Connection String Format

PostgreSQL connection string format:
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?options
```

Example:
```
postgresql://postgres:mypassword@localhost:5432/consistencygrid
```

With connection pooling (recommended for 10K users):
```
postgresql://postgres:mypassword@localhost:5432/consistencygrid?schema=public&connection_limit=20
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Created PostgreSQL database
- [ ] Copied connection string
- [ ] Created `.env.production` file
- [ ] Added DATABASE_URL to `.env.production`
- [ ] Added NEXTAUTH_SECRET to `.env.production`
- [ ] Ran `npx prisma migrate deploy`
- [ ] Ran `npx prisma studio` (data loaded successfully)
- [ ] Started dev server with `npm run dev`
- [ ] App loads without database errors
- [ ] Can sign up (data saves to PostgreSQL)

---

## 🚀 You're Done!

Once you complete the steps above:

✅ SQLite replaced with PostgreSQL
✅ Database migrations applied
✅ App connected to production database
✅ Ready for 10K users

**Next:** Deploy to production (Vercel/Netlify/VPS)

---

## 📞 Help & Resources

- **Prisma Docs:** [https://www.prisma.io/docs](https://www.prisma.io/docs)
- **PostgreSQL Docs:** [https://www.postgresql.org/docs](https://www.postgresql.org/docs)
- **Vercel Postgres:** [https://vercel.com/docs/storage/vercel-postgres](https://vercel.com/docs/storage/vercel-postgres)
- **AWS RDS:** [https://docs.aws.amazon.com/rds](https://docs.aws.amazon.com/rds)
- **DigitalOcean:** [https://docs.digitalocean.com/products/databases/](https://docs.digitalocean.com/products/databases/)
