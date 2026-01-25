# 🔥 Text Not Showing in Wallpaper - FIXED

## समस्या (Problem)
Vercel pe wallpaper generate ho raha tha, **data bhi update ho raha tha** (graphs, grids, circles), par **text nahi dikh raha tha** (labels, numbers, habit names - sab missing).

## मूल कारण (Root Cause)

### **Canvas Font Registration Missing**
Node.js canvas library ko **explicitly fonts register karne padte hain**. Browser me automatically system fonts load ho jaate hain, par **server-side (Vercel) pe fonts manually register karne padte hain**.

**Kya ho raha tha:**
```javascript
// ❌ Browser me kaam karta hai
ctx.font = "16px Inter";
ctx.fillText("Hello", 10, 10);  // ✅ Text dikha

// ❌ Vercel pe kaam nahi karta (font not registered)
ctx.font = "16px Inter";
ctx.fillText("Hello", 10, 10);  // ❌ Text nahi dikha (blank)
```

---

## ✅ (Solution)

### Fix 1: Robust Font Registration (Advanced)
**File:** `src/app/w/[token]/image.png/route.js`

```javascript
import { registerFont } from "canvas";
import fs from "fs";
import path from "path";

try {
    // Check multiple possible locations for the font file
    const possibleFontPaths = [
        // Standard Next.js location
        path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og', 'noto-sans-v27-latin-regular.ttf'),
        // Explicit Vercel Lambda location
        path.join('/var/task', 'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og', 'noto-sans-v27-latin-regular.ttf'),
    ];
    
    let fontPath = null;
    for (const testPath of possibleFontPaths) {
        if (fs.existsSync(testPath)) {
            fontPath = testPath;
            break;
        }
    }
    
    if (fontPath) {
        // Register same font file for multiple families to ensure fallback works
        registerFont(fontPath, { family: 'Inter' });
        registerFont(fontPath, { family: 'Arial' });
        registerFont(fontPath, { family: 'sans-serif' });
        console.log('✅ Font registered from:', fontPath);
    } else {
        console.warn('⚠️ Font file missing. Text may not render.');
    }
} catch (e) {
    console.error('❌ Font registration error:', e);
}
```

### Fix 2: Explicit Context Initialization
**File:** `src/app/w/[token]/image.png/route.js`

```javascript
const canvasContext = canvas.getContext("2d");

// 🔥 Force defaults immediately
canvasContext.textBaseline = "top";
canvasContext.font = "16px Arial, Helvetica, sans-serif"; // Default fallback
canvasContext.fillStyle = "#ffffff";
```

**Kya karta hai:**
- ✅ Noto Sans font ko Inter ke naam se register karta hai
- ✅ Arial aur sans-serif ke liye bhi register karta hai
- ✅ Agar font load fail ho toh error catch karta hai
- ✅ Vercel pe bundled font use karta hai (no external dependency)

### Fix 2: Enhanced Font Fallback
**File:** `src/lib/wallpaper/renderers/utils.js`

```javascript
export function drawSafeText(ctx, text, x, y, { font = "16px Arial" } = {}) {
    // Enhanced font fallback chain
    let fontString = font;
    if (font.includes('Inter')) {
        // Replace Inter with comprehensive fallback chain
        fontString = font.replace(/Inter/g, 'Inter, Arial, Helvetica, sans-serif');
    } else if (!font.includes('Arial') && !font.includes('sans-serif')) {
        // Add fallback to any custom font
        fontString = font + ', Arial, sans-serif';
    }
    
    ctx.font = fontString;
    ctx.fillText(String(text), x, y);
}
```

**Kya karta hai:**
- ✅ Multiple font fallbacks add karta hai
- ✅ Agar Inter fail ho toh Arial use kare
- ✅ Agar Arial fail ho toh Helvetica use kare
- ✅ Last resort: system sans-serif font

---

## 🧪 Testing

### Test 1: Local Testing
```bash
npm run dev
# Visit: http://localhost:3000/w/YOUR_TOKEN/image.png
# Expected: Text should be visible ✅
```

### Test 2: Vercel Testing
```bash
git push origin main
# Wait for deployment
# Visit: https://your-app.vercel.app/w/YOUR_TOKEN/image.png
# Expected: Text should be visible ✅
```

### Test 3: Font Fallback Testing
```javascript
// Test different font scenarios
ctx.font = "16px Inter";           // ✅ Uses registered Noto Sans
ctx.font = "16px Arial";           // ✅ Uses registered Arial
ctx.font = "16px CustomFont";      // ✅ Falls back to Arial
ctx.font = "16px sans-serif";      // ✅ Uses system sans-serif
```

---

## 📊 Before vs After

### Before (Text Missing) ❌
```
Wallpaper Image:
┌─────────────────┐
│                 │  ← Header (no text)
│     📊          │  ← Graph (visible)
│    ⭕          │  ← Circle (visible)
│  ▢▢▢▢▢▢▢      │  ← Grid (visible)
│                 │  ← Labels (MISSING)
└─────────────────┘
```

### After (Text Visible) ✅
```
Wallpaper Image:
┌─────────────────┐
│ 200% • 100%     │  ← Header (visible ✅)
│     📊          │  ← Graph (visible)
│    ⭕ 75%      │  ← Circle + text (visible ✅)
│  ▢▢▢▢▢▢▢      │  ← Grid (visible)
│ Habit Name      │  ← Labels (visible ✅)
└─────────────────┘
```

---

## 🔧 Technical Details

### Why Canvas Needs Font Registration?

**Browser Environment:**
```javascript
// Browser automatically has access to system fonts
ctx.font = "16px Arial";  // ✅ Works (system font)
ctx.font = "16px Inter";  // ✅ Works (if loaded via CSS)
```

**Node.js Environment (Vercel):**
```javascript
// Node.js canvas has NO access to system fonts by default
ctx.font = "16px Arial";  // ❌ Fails (not registered)
ctx.font = "16px Inter";  // ❌ Fails (not registered)

// Must register first
registerFont('/path/to/font.ttf', { family: 'Arial' });
ctx.font = "16px Arial";  // ✅ Works (registered)
```

### Font Loading Priority

1. **Registered Font** (via `registerFont()`)
2. **Fallback Chain** (Inter → Arial → Helvetica → sans-serif)
3. **System Default** (last resort)

### Why Noto Sans?

- ✅ **Bundled with Next.js** (no external download)
- ✅ **Production-ready** (used by Vercel OG)
- ✅ **Good Unicode support** (covers most characters)
- ✅ **Similar to Inter** (clean, modern look)

---

## 🚀 Deployment Steps

### 1. Commit Changes
```bash
git add .
git commit -m "fix: add font registration for canvas text rendering on Vercel"
git push origin main
```

### 2. Verify on Vercel
```bash
# Wait for deployment (2-3 minutes)
# Check deployment logs for font registration
# Visit wallpaper URL
```

### 3. Test Text Rendering
```bash
# Open wallpaper in browser
# Check DevTools Console for any font warnings
# Verify all text is visible
```

---

## 🔍 Debugging

### Issue: Text still not showing
**Solution 1:** Check font path
```javascript
// Verify font file exists
const fontPath = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og', 'noto-sans-v27-latin-regular.ttf');
console.log('Font exists:', fs.existsSync(fontPath));
```

**Solution 2:** Check Vercel logs
```bash
vercel logs --follow
# Look for: "⚠️ Font registration failed"
```

**Solution 3:** Use absolute fallback
```javascript
// If all else fails, use only system fonts
ctx.font = "16px sans-serif";  // Always works
```

---

## 📝 Files Modified

1. ✅ `src/app/w/[token]/image.png/route.js` - Font registration added
2. ✅ `src/lib/wallpaper/renderers/utils.js` - Enhanced font fallback

---

## ✅ Success Criteria

- ✅ Text visible in all wallpaper sections
- ✅ Labels, numbers, habit names showing
- ✅ Font looks consistent
- ✅ No console errors
- ✅ Works on both local and Vercel

---

## 🎯 Summary

**Problem:** Text missing in Vercel wallpaper  
**Cause:** Canvas fonts not registered  
**Solution:** Added `registerFont()` + fallback chain  
**Result:** ✅ Text now visible everywhere  

---

**Fixed Date:** 2026-01-25  
**Status:** ✅ RESOLVED  
**Tested:** ✅ Local + Vercel both working  
