# PWA Setup - Consistency Grid

## Overview

Consistency Grid is now a fully-functional Progressive Web App (PWA) that provides:

✅ **Installable** - Users can install the app on their home screen  
✅ **Offline Support** - App works without internet connection  
✅ **Fast Loading** - Service worker caching strategy for speed  
✅ **Native Feel** - Standalone app mode on mobile devices  
✅ **Background Sync** - Data syncs automatically when reconnected  

---

## What's Been Implemented

### 1. **Web App Manifest** (`/public/manifest.json`)
- App metadata (name, description, icons)
- Theme colors (indigo/purple gradient)
- App shortcuts (Dashboard, Create Goal, View Habits)
- Share target capability
- Icons in multiple sizes (192px, 512px, maskable)

### 2. **Service Worker** (`/public/sw.js`)
- **Offline Support**: Caches static assets on first visit
- **Dual Caching Strategy**:
  - Cache-first for assets (JS, CSS, images)
  - Network-first for API calls and HTML
- **Background Sync**: Syncs goals/habits when reconnected
- **Offline Fallback**: Shows offline.html page when disconnected
- **Auto-updates**: Checks for new versions every 60 seconds

### 3. **Offline Fallback Page** (`/public/offline.html`)
- Beautiful offline UI explaining what user can/can't do
- Styled with Consistency Grid colors
- Quick navigation back to dashboard

### 4. **PWA Meta Tags** (Added to `layout.js`)
- Apple Web App configuration
- Manifest link
- Theme color
- iOS/Android specific meta tags

### 5. **PWA Utilities** (`/src/lib/pwa.js`)
Comprehensive PWA API wrapper with functions for:
- Service worker registration & lifecycle
- Background sync management
- Offline detection & event handling
- Storage space monitoring
- Persistent storage requests
- Cache clearing
- Update notifications

### 6. **Install Prompt Component** (`/src/components/common/PWAInstallPrompt.js`)
- Beautiful bottom-sheet install prompt
- Shows only when installable
- Respects user's choice (don't show if dismissed)
- Modern gradient UI matching Consistency Grid

### 7. **PWA Initializer** (`/src/components/common/PWAInitializer.js`)
- Automatically registers service worker on app load
- Initializes all PWA features
- Integrated into main app providers

---

## Features

### 📱 **Installation**

**Desktop (Chrome/Edge):**
1. Go to https://consistencygrid.com
2. Click the install icon in the address bar (or "Install app" in menu)
3. Click "Install"
4. App is installed on desktop

**Mobile (iOS):**
1. Open in Safari
2. Tap Share → Add to Home Screen
3. App installs to home screen

**Mobile (Android):**
1. Open in Chrome
2. Tap menu → Install app
3. OR automatic prompt appears at bottom of screen
4. App installs to home screen

### 🔌 **Offline Support**

- First load caches all static assets
- Cached pages load instantly even without internet
- API calls show offline error when disconnected
- Users can still view previously loaded content
- Offline indicator shows what they can/can't do

### ⚡ **Performance Benefits**

- Service worker caches JS/CSS files
- Instant repeat visits (no need to download assets)
- Shorter load times on slow connections
- Reduced bandwidth usage
- Better mobile performance

### 🔄 **Background Sync**

When user comes back online:
- `sync-goals`: Syncs goal updates to server
- `sync-habits`: Syncs habit completions to server
- Changes made offline are persisted automatically
- User sees "syncing..." indicator

### 💾 **Storage Management**

- Persistent storage request (survives browser cleanup)
- Storage quota monitoring
- Automatic cache updates
- Graceful cleanup of old caches

### 🔔 **Update Notifications**

- Service worker checks for updates every 60 seconds
- When new version available, shows notification
- User can refresh to get new version
- Smooth update experience without disruption

---

## API Reference

### Core Functions

```javascript
import { 
  registerServiceWorker,
  isPWAInstalled,
  isOnline,
  requestBackgroundSync,
  getStorageSpace,
  clearCache,
  initializePWA
} from '@/lib/pwa';

// Check if app is installed
if (isPWAInstalled()) {
  console.log('App is running as PWA');
}

// Check connection status
if (isOnline()) {
  console.log('App is online');
} else {
  console.log('App is offline');
}

// Request background sync
await requestBackgroundSync('sync-goals');

// Check storage
const storage = await getStorageSpace();
console.log(`${storage.percentage}% of storage used`);

// Clear all caches
await clearCache();

// Listen for connection changes
const unsubscribe = onConnectionChange(isOnline => {
  console.log(isOnline ? 'Online' : 'Offline');
});
```

### Service Worker Events

The service worker handles:
- **beforeinstallprompt**: Shows install prompt
- **appinstalled**: Triggered when app installed
- **online/offline**: Connection change events
- **sync**: Background sync events

---

## Testing PWA Features

### Test Installation

**Desktop:**
```
1. Open Chrome DevTools (F12)
2. Go to Application → Manifest
3. Verify manifest.json loads
4. Check if "Install app" button appears in address bar
```

**Mobile:**
```
1. Open DevTools on mobile (chrome://inspect)
2. Verify service worker is active
3. Check if install prompt shows
```

### Test Offline Support

```
1. Open DevTools → Application → Service Workers
2. Enable "Offline" checkbox
3. Navigate around app
4. Verify pages load from cache
5. Try API call (should show error)
6. Disable offline mode
7. Verify app syncs data
```

### Test Service Worker

```
1. DevTools → Application → Service Workers
2. Click "Skip waiting" to force update
3. Check cache storage contents
4. Verify update frequency (60 seconds)
```

### Test Background Sync

```
1. Open DevTools → Application → Service Workers
2. Look for "sync" tab
3. Manually trigger sync:
   - await navigator.serviceWorker.ready.then(
       reg => reg.sync.register('sync-goals')
     )
4. Verify sync happens in background
```

---

## Configuration

### Environment Variables

Optional Sentry configuration (if using error tracking):
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
```

### Customize Manifest

Edit `/public/manifest.json` to change:
- App name and description
- Theme colors
- App icons
- Shortcuts
- Categories

### Service Worker Strategy

Edit `/public/sw.js` to change:
- Cache expiration
- Asset types cached
- API routes cached
- Offline fallback behavior

---

## Production Checklist

Before deploying to production:

- ✅ Test installation on iOS and Android
- ✅ Test offline mode
- ✅ Verify manifest is accessible at /manifest.json
- ✅ Verify service worker is accessible at /sw.js
- ✅ Set correct theme colors in manifest
- ✅ Add high-res app icons (192px, 512px)
- ✅ Add maskable icons for adaptive icons
- ✅ Test background sync
- ✅ Monitor cache size
- ✅ Set up update notification strategy

### Icons Required

Place these in `/public/images/`:
```
icon-192.png          (192x192 square icon)
icon-512.png          (512x512 square icon)
icon-maskable-192.png (192x192 with safe area)
icon-maskable-512.png (512x512 with safe area)
screenshot-1.png      (540x720 mobile screenshot)
screenshot-2.png      (1280x720 desktop screenshot)
```

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Service Workers | ✅ | ✅ | ⚠️ (iOS 16.1+) | ✅ |
| Web App Manifest | ✅ | ✅ | ⚠️ (iOS 15.1+) | ✅ |
| Install Prompt | ✅ | ❌ | ⚠️ (via Safari) | ✅ |
| Background Sync | ✅ | ❌ | ❌ | ✅ |
| Offline Support | ✅ | ✅ | ✅ | ✅ |

---

## Troubleshooting

### Install Prompt Not Showing

**Possible causes:**
1. HTTPS required (not available on localhost for testing)
2. Manifest not found (check /public/manifest.json)
3. Service worker not registered
4. Icons not accessible

**Solution:**
```javascript
// Check in console
navigator.serviceWorker.ready.then(reg => {
  console.log('Service worker active');
});

// Check manifest
fetch('/manifest.json').then(r => r.json()).then(m => {
  console.log('Manifest:', m);
});
```

### Service Worker Not Updating

**Solution:**
1. DevTools → Application → Service Workers
2. Click "Unregister" to clear old versions
3. Refresh page multiple times
4. Check for errors in console

### Offline Mode Not Working

**Verify:**
1. DevTools → Network → check offline checkbox
2. Service worker is registered (DevTools → Application)
3. Assets are in cache (DevTools → Application → Cache Storage)

### Push Notifications Not Working

Configure in notification settings:
```javascript
if ('Notification' in window) {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      // Can now send notifications
    }
  });
}
```

---

## Next Steps

### Optional Enhancements

1. **Push Notifications** - Send server-side push notifications
2. **Background Periodic Sync** - Sync data on a schedule
3. **Credential Management** - Auto-fill passwords
4. **Share API** - Share goals/habits with others
5. **File System API** - Access device storage

### Performance Optimization

1. Implement lazy loading for images
2. Add compression for assets
3. Use CDN for manifest and icons
4. Implement service worker cleanup

### Monitoring

1. Set up Sentry for error tracking
2. Monitor cache size usage
3. Track install metrics
4. Monitor app performance in wild

---

## Files Structure

```
ConsistencyGrid/
├── public/
│   ├── manifest.json          # Web app manifest
│   ├── sw.js                  # Service worker
│   ├── offline.html           # Offline fallback
│   └── images/
│       ├── icon-192.png
│       ├── icon-512.png
│       ├── icon-maskable-192.png
│       └── icon-maskable-512.png
├── src/
│   ├── app/
│   │   ├── layout.js          # Updated with PWA meta tags
│   │   └── providers.js       # Updated with PWA components
│   ├── components/common/
│   │   ├── PWAInitializer.js  # Service worker registration
│   │   └── PWAInstallPrompt.js # Install UI
│   └── lib/
│       └── pwa.js             # PWA utilities
```

---

## Resources

- [MDN Web Docs - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Workers Specification](https://w3c.github.io/ServiceWorker/)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)

---

## Support

For issues or questions about PWA setup:
1. Check browser console for errors
2. Review DevTools → Application tab
3. Check service worker logs in DevTools
4. Verify all files are accessible (manifest, sw.js, icons)

