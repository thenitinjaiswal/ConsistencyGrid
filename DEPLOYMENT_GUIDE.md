# 🚀 ConsistencyGrid Deployment Guide

## Quick Start - Deploy in 5 Minutes

### Option 1: Deploy to Vercel (Recommended)

**Vercel is the easiest - it's built for Next.js!**

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Go to [Vercel.com](https://vercel.com)**
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Add Environment Variables**
   - After deployment, go to Settings → Environment Variables
   - Add all variables from `ENV_VARIABLES.md`
   - Redeploy the project

4. **Done!** Your app is live at `your-project.vercel.app`

**Custom Domain:**
- Go to Settings → Domains
- Add your custom domain
- Update DNS records per Vercel's instructions

---

### Option 2: Deploy to Netlify

1. **Push code to GitHub** (same as above)

2. **Go to [Netlify.com](https://netlify.com)**
   - Click "New site from Git"
   - Connect GitHub
   - Select repository

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Add Environment Variables**
   - Site settings → Build & Deploy → Environment
   - Add all variables from `ENV_VARIABLES.md`

5. **Deploy** and add custom domain

---

### Option 3: Self-Hosted (Docker/VPS)

**Requirements:**
- VPS or server with Node.js 18+
- PostgreSQL database
- Domain with DNS access

**Steps:**

1. **Clone repository on server**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/consistencygrid.git
   cd consistencygrid
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   nano .env.production
   ```
   Add all variables from `ENV_VARIABLES.md`

4. **Run migrations**
   ```bash
   npx prisma migrate deploy
   ```

5. **Build and start**
   ```bash
   npm run build
   npm run start
   ```

6. **Setup PM2 (keep running)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "consistencygrid" -- start
   pm2 startup
   pm2 save
   ```

7. **Setup Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
       }
   }
   ```

8. **Enable HTTPS**
   ```bash
   sudo apt install certbot
   sudo certbot certonly --nginx -d yourdomain.com
   ```

---

## ✅ Pre-Deployment Checklist

### Code
- [ ] All features tested locally
- [ ] No console errors
- [ ] Build passes: `npm run build`
- [ ] No sensitive data in code
- [ ] `.env*` files in `.gitignore`

### Database
- [ ] PostgreSQL set up (not SQLite)
- [ ] Connection string verified
- [ ] Migrations ready to run
- [ ] Backups configured

### Environment Variables
- [ ] All required variables set
- [ ] `NEXTAUTH_SECRET` is random and secure
- [ ] `DATABASE_URL` is PostgreSQL
- [ ] Domain URLs are correct

### Security
- [ ] HTTPS enabled
- [ ] NEXTAUTH_SECRET is unique
- [ ] No hardcoded secrets in code
- [ ] Database credentials secured
- [ ] Rate limiting on login endpoints

### Analytics
- [ ] Google Analytics ID set
- [ ] Analytics script loading
- [ ] Events being tracked

### DNS & Domain
- [ ] Domain registered
- [ ] DNS records pointing to host
- [ ] SSL certificate valid
- [ ] Email DNS records set (if using email features)

---

## 🔧 Post-Deployment

### Monitor Application
```bash
# Check logs (Vercel)
vercel logs

# Check logs (Self-hosted with PM2)
pm2 logs consistencygrid

# Monitor performance (Self-hosted)
pm2 monit
```

### Setup Monitoring
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Database backups
- [ ] Performance monitoring

### Verify Features
- [ ] Sign up works
- [ ] Login works
- [ ] Wallpaper generation works
- [ ] Habit tracking works
- [ ] Goal management works
- [ ] Analytics showing data
- [ ] Mobile responsive

---

## 📊 Database Migration Strategy

### First Time Setup
```bash
# Run all pending migrations
npx prisma migrate deploy

# Create initial user (optional)
npx prisma db seed
```

### For Updates
```bash
# Create new migration
npx prisma migrate dev --name add_new_feature

# Deploy to production
npx prisma migrate deploy
```

---

## 🔄 Rollback Strategy

### If Something Goes Wrong

**Vercel:**
1. Go to Deployments tab
2. Click on previous successful deployment
3. Click "Redeploy"

**Self-Hosted:**
```bash
# Revert to previous commit
git revert HEAD
git push

# Or rollback database
npx prisma migrate resolve --rolled-back migration_name
```

---

## 🆘 Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` is correct
- Verify PostgreSQL is running
- Check firewall/security groups

### "Authentication not working"
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches domain
- Clear browser cookies and try again

### "Wallpaper generation fails"
- Check if Canvas/image libraries are installed
- Verify image directory permissions
- Check server disk space

### "Analytics not tracking"
- Verify `NEXT_PUBLIC_GA_ID` is set
- Check Google Analytics dashboard
- Ensure browser console has no errors
- Wait 24 hours for initial data

### "Build fails"
- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Run `npm run build` locally to debug
- Check all environment variables

---

## 📝 Deployment Logs to Monitor

### Successful Deployment Should Show:
- ✅ All dependencies installed
- ✅ Next.js build completes
- ✅ Migrations applied successfully
- ✅ Server starts listening
- ✅ No error messages

### Warning Signs:
- ❌ Dependency installation failures
- ❌ Build errors
- ❌ Migration failures
- ❌ Port conflicts
- ❌ Memory errors

---

## 🎉 You're Live!

After deployment:
1. Test your domain works
2. Share with users
3. Monitor analytics
4. Gather feedback
5. Iterate and improve

---

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [PostgreSQL Hosting](https://www.postgresql.org/support/wiki/index.php?title=Detailed_installation_guides)

---

## 💬 Need Help?

See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for development documentation.
