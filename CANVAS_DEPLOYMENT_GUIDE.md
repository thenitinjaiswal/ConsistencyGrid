# Canvas Wallpaper Engine - Deployment Guide

## Pre-Deployment Verification

### 1. Build Status ✓

```bash
npm run build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Finished TypeScript
✓ Generating static pages using 11 workers (51/51)
✓ (No errors)
```

**Your Current Status:** ✅ BUILD SUCCESSFUL

### 2. Code Quality Checks

```bash
npm run lint
```

Should have no errors related to wallpaper components.

### 3. File Structure Verification

Required files exist and are correctly placed:

```
✅ src/components/CanvasWallpaperEngine.js
✅ src/components/generator/GeneratorPreviewCanvas.js
✅ src/app/w/[token]/PublicWallpaperClientCanvas.js
✅ src/app/generator/page.js (updated)
✅ src/app/w/[token]/page.js (updated)
```

Old files (safe to delete after testing):

```
❌ src/components/CanvasWallpaperRenderer.js (old)
❌ src/components/generator/GeneratorPreviewWithCanvas.js (old)
❌ src/app/w/[token]/PublicWallpaperClient.js (old)
```

## Local Testing (Before Deployment)

### Step 1: Start Development Server

```bash
npm run dev
```

Access at `http://localhost:3000`

### Step 2: Test Generator Page

1. Navigate to `/generator`
2. **Expected**: Canvas wallpaper preview renders
3. **Verify**: 
   - No HTML overlays visible
   - Canvas fills preview area
   - Download/Copy buttons present
4. **Action**: Fill in form and save

### Step 3: Test Public Wallpaper Page

1. Get your public token from generator page
2. Navigate to `/w/{token}`
3. **Expected**: 
   - Canvas wallpaper renders
   - Time and date visible at top
   - Life grid visible
   - Stats display below
4. **Action**: Watch for 1 minute to verify time updates

### Step 4: Test Real-Time Updates

1. Leave generator page open for 2 minutes
2. **Verify**: Time updates exactly on minute boundary
3. **Not every second**: Should see time change once per minute

### Step 5: Test Export

1. In generator preview, click "Download"
2. **Verify**: PNG file downloads
3. **Open file**: Verify wallpaper content matches what's shown

### Step 6: Test Copy to Clipboard

1. In generator preview, click "Copy"
2. **Verify**: Success message appears
3. **Paste**: Into image editor to verify content

### Step 7: Test Mobile Responsiveness

1. Open generator on mobile device
2. **Verify**: Canvas scales correctly (aspect ratio maintained)
3. **Verify**: Buttons are clickable
4. **Verify**: No horizontal scrolling

## Production Deployment (Vercel)

### Option 1: Git Push (Automatic)

```bash
git add .
git commit -m "feat: Deploy Canvas-only wallpaper engine"
git push origin main
```

Vercel will automatically:
1. Build project (next build)
2. Run tests
3. Deploy to production

**Expected time**: 2-3 minutes

### Option 2: Manual Vercel Deploy

```bash
vercel deploy --prod
```

### Option 3: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select ConsistencyGrid project
3. Click "Deploy"
4. Wait for deployment to complete

## Post-Deployment Testing

### 1. Verify Production URL

```bash
curl https://consistencygrid.app/generator
```

**Expected**: 200 OK response

### 2. Test Production Canvas

1. Navigate to https://consistencygrid.app/generator
2. Create new wallpaper
3. **Verify**: 
   - Canvas renders (not img+overlay)
   - Download works
   - Copy works

### 3. Test Public Wallpaper

1. Navigate to https://consistencygrid.app/w/{token}
2. **Verify**: 
   - Canvas renders correctly
   - Time updates every minute
   - Page is fast (< 2s load time)

### 4. Monitor Error Logs

Check Sentry for any errors:

1. Go to Sentry dashboard
2. Filter for last 24 hours
3. **Expected**: No critical errors
4. **Expected**: No SSR errors

### 5. Performance Check

Check Vercel Analytics:

1. Go to Vercel project dashboard
2. Click "Analytics"
3. Check metrics:
   - **LCP** (Largest Contentful Paint): < 2.5s
   - **FID** (First Input Delay): < 100ms
   - **CLS** (Cumulative Layout Shift): < 0.1

## Rollback Plan (If Issues)

### If Canvas Doesn't Render

**Symptoms**: Blank canvas or "not a function" errors

**Rollback**:

```bash
git revert HEAD
git push origin main
```

This reverts to previous working version.

### If Fonts Don't Load

**Symptoms**: Text shows as boxes or wrong characters

**Quick Fix**: Check browser console for font loading errors

```javascript
// In browser console
document.fonts.forEach(font => {
  console.log(font.family, font.loaded)
})
```

If needed, manually load fonts in `CanvasWallpaperEngine.js`:

```javascript
// Before waitForFonts()
const link = document.createElement('link')
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700'
link.rel = 'stylesheet'
document.head.appendChild(link)
```

### If Images Don't Load

**Verify**: Images exist in `/public` with correct case

```bash
ls /public/wallpapers/
```

Must be lowercase on production (Linux file system).

## Environment Variables

No new environment variables needed for Canvas engine.

Existing variables continue to work:
- `DATABASE_URL` - Prisma
- `NEXTAUTH_SECRET` - Auth
- `SENTRY_AUTH_TOKEN` - Error tracking

## Performance Optimization

Already implemented:

- ✅ Canvas rendering (faster than DOM)
- ✅ Scheduled updates (not every frame)
- ✅ Font preloading (no rendering delay)
- ✅ Image lazy loading
- ✅ CSS scaling (hardware accelerated)

### If You Need More Optimization

1. **Reduce update frequency**: Change 60000 to 120000ms (2 minutes)
2. **Cache base image**: Store in browser cache
3. **Use smaller grid**: Reduce rows/cols if needed

## Monitoring (Post-Deployment)

### Key Metrics to Watch

1. **Canvas Render Time**: Monitor performance in Sentry
2. **Time Update Accuracy**: Verify updates happen on minute boundary
3. **Error Rate**: Check Sentry for new errors
4. **User Feedback**: Monitor for complaints about wallpaper

### Alerts to Set

In Sentry or Vercel:

- Alert on any client-side errors
- Alert on build failures
- Alert on deployment errors

## Documentation Updates

After deployment, update:

- [ ] README.md - Add Canvas wallpaper info
- [ ] DEPLOYMENT_GUIDE.md - Reference Canvas engine
- [ ] API documentation - No API changes

## Rollout Strategy

### Option 1: Immediate Full Rollout

Push to production now. Canvas is production-ready.

**Pros**: 
- Immediate real-time updates in production
- Fixes all HTML/CSS overlay issues
- Ready for Android app integration

**Cons**: 
- No gradual rollout period

### Option 2: Gradual Rollout (Recommended)

1. Deploy to production (this happens automatically)
2. Monitor for 24 hours
3. If all good, announce to users
4. Continue monitoring

**Timeline**:
- Day 1: Deployed to production, monitoring
- Day 2: Confident it's stable
- Day 3: Announce new Canvas wallpaper to users

## Common Issues & Solutions

### Issue: Canvas renders but time doesn't update

**Root Cause**: Interval not starting or being cleared

**Solution**: Check browser console for errors

```javascript
// In browser console
console.log(new Date().toLocaleTimeString())
// Should show updating time
```

### Issue: Image loads in preview but not production

**Root Cause**: Path case sensitivity on Linux

**Solution**: Ensure paths use lowercase

```javascript
// ✅ Correct (lowercase)
await loadImage('/wallpapers/default.png')

// ❌ Incorrect (mixed case)
await loadImage('/Wallpapers/Default.png')
```

### Issue: Mobile preview doesn't scale correctly

**Root Cause**: CSS aspect-ratio not supported

**Solution**: Add fallback

```css
canvas {
  width: 100%;
  max-width: 360px;
  height: auto;
  aspect-ratio: 1080 / 2340;
  
  /* Fallback for older browsers */
  @supports not (aspect-ratio: auto) {
    height: auto;
  }
}
```

## Verification Checklist

- [ ] Build passes locally (0 errors)
- [ ] All Canvas components created
- [ ] Generator page imports updated
- [ ] Public page imports updated
- [ ] Old components still exist (for safety)
- [ ] Local testing passed (time updates work)
- [ ] Production deployed
- [ ] Public URL loads correctly
- [ ] Canvas renders (not img+overlay)
- [ ] Download/Copy buttons work
- [ ] No console errors
- [ ] Sentry shows no new errors
- [ ] Performance metrics acceptable

## Success Criteria

Canvas wallpaper is successfully deployed when:

✅ Wallpaper renders ONLY using Canvas API
✅ Time updates every minute in production
✅ Download exports exact canvas content
✅ No HTML/CSS overlays in DOM
✅ No SSR errors in console
✅ Zero production errors in Sentry
✅ Ready for Android app auto-apply

## Next Steps

After deployment:

1. **Android Integration**: App can now load `/w/{token}/image.png`
2. **User Announcement**: Celebrate the new real-time wallpaper
3. **Monitoring**: Watch for issues over next week
4. **Android Release**: Auto-apply feature ready

## Support

For issues during deployment:

1. Check browser console for errors
2. Check Sentry dashboard
3. Check Vercel build logs
4. Check GitHub Actions (if using CI/CD)

Questions? See [CANVAS_WALLPAPER_ENGINE.md](./CANVAS_WALLPAPER_ENGINE.md) for technical details.
