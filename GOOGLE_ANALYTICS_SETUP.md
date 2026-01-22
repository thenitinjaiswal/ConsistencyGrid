# Google Analytics Setup Guide

## 📊 Configuration

Google Analytics is now integrated into ConsistencyGrid. Here's how to set it up:

### Step 1: Get Your Google Analytics ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get your **Measurement ID** (looks like `G-XXXXXXXXXX`)

### Step 2: Add Environment Variable

Create or update your `.env.local` file:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Note:** The `NEXT_PUBLIC_` prefix makes this available to the browser (required for Google Analytics).

### Step 3: Restart Dev Server

```bash
npm run dev
```

The Google Analytics script will now automatically track:
- ✅ All page views
- ✅ Custom events (see below)

---

## 📈 Tracked Events

### Automatic Events (No Code Required)
- **Page Views**: Every page visit is tracked automatically
- **User Engagement**: Time on page, scrolling, interactions

### Custom Events (Use in Your Code)

#### Track Goal Completion
```javascript
import { trackGoalCompletion } from "@/lib/analytics";

trackGoalCompletion("Learn Spanish", "Language Learning");
```

#### Track Habit Completion
```javascript
import { trackHabitCompletion } from "@/lib/analytics";

trackHabitCompletion("Morning Meditation");
```

#### Track Wallpaper Generation
```javascript
import { trackWallpaperGenerated } from "@/lib/analytics";

trackWallpaperGenerated("orange-glow", "lockscreen");
```

#### Track User Authentication
```javascript
import { trackSignup, trackLogin } from "@/lib/analytics";

// On signup
trackSignup("email");
trackSignup("google");

// On login
trackLogin("email");
trackLogin("google");
```

#### Track Custom Events
```javascript
import { event } from "@/lib/analytics";

event('streak_milestone', {
    streak_days: 30,
    habit_name: "Running",
    timestamp: new Date().toISOString(),
});
```

---

## 🎯 Where Tracking is Already Integrated

The following features already send analytics events:

- ✅ Goal completion tracking (add to GoalCard.js)
- ✅ Habit completion tracking (add to habit completion handlers)
- ✅ Wallpaper generation (add to generator)
- ✅ User authentication (add to login/signup)
- ✅ Page views (automatic)

---

## 📍 Example Implementation

### In Goal Completion Handler

```javascript
import { trackGoalCompletion } from "@/lib/analytics";

async function completeGoal(goalId, goalTitle, category) {
    // ... completion logic
    
    // Track the event
    trackGoalCompletion(goalTitle, category);
}
```

### In Login Flow

```javascript
import { trackLogin } from "@/lib/analytics";

async function handleLogin(method) {
    // ... login logic
    
    if (success) {
        trackLogin(method); // "email" or "google"
    }
}
```

---

## 🔍 View Your Analytics

1. Go to [Google Analytics Dashboard](https://analytics.google.com/)
2. Select your property
3. View:
   - **Real-Time**: Live user activity
   - **Reports**: User behavior, traffic sources
   - **Events**: Custom events you're tracking
   - **Conversions**: Goal completions (set up conversion tracking)

---

## 🛠️ Testing Analytics

### Test if Google Analytics is Working

Open browser DevTools (F12) and:

1. Go to **Console** tab
2. Type: `window.gtag`
3. Should return the gtag function (not undefined)

### Test Custom Events in Console

```javascript
// Manual event tracking for testing
window.gtag('event', 'test_event', {
    test_data: 'This is a test'
});
```

Check Google Analytics Real-Time report to see the event within seconds.

---

## 📝 Environment Variables

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_GA_ID` | Yes | `G-XXXXXXXXXX` | Google Analytics Measurement ID |

---

## 🔐 Privacy & Data

- Analytics data is sent to Google's secure servers
- No sensitive user data (passwords, personal info) is tracked
- Users can opt-out via [Google's opt-out extension](https://tools.google.com/dlpage/gaoptout)
- Comply with privacy laws (GDPR, CCPA) by:
  - Disclosing analytics in Privacy Policy
  - Getting user consent before tracking
  - Providing data deletion options

---

## 📚 Resources

- [Google Analytics Documentation](https://support.google.com/analytics)
- [Google Tag Manager Setup](https://tagmanager.google.com/)
- [Analytics Events Reference](https://developers.google.com/analytics/devguides/collection/gtagjs/events)
- [Privacy Compliance Guide](https://support.google.com/analytics/answer/12230410)

---

## ✅ Checklist for Production

- [ ] Google Analytics account created
- [ ] Measurement ID obtained
- [ ] `.env.local` updated with `NEXT_PUBLIC_GA_ID`
- [ ] Dev server restarted
- [ ] Page views showing in Google Analytics
- [ ] Test event manually tracked and verified
- [ ] Custom events integrated where needed
- [ ] Privacy policy updated
- [ ] User consent/opt-in configured (if required by law)
- [ ] Conversion goals set up in Google Analytics
