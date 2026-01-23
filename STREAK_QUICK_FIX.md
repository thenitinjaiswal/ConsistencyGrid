# 🚀 Get Streak Heatmap Working - Quick Start

## 3-Minute Quick Fix

### Step 1: Verify Habits Exist
```
1. Go to http://localhost:3000/habits
2. If no habits shown → Click "Create New Habit"
3. Add at least one habit (e.g., "Exercise", "Reading")
4. Mark the habit as done for at least one day
```

### Step 2: Check the Heatmap
```
1. Go to http://localhost:3000/streaks
2. Scroll to "Your Streak Heatmap" section
3. You should see:
   - Toggle buttons: [Last 90 days] [Last 52 weeks]
   - A grid of colored squares
   - Month labels on top
   - Day labels on side
   - Today marked with blue ring
```

### Step 3: Test the Interactive Features
```
1. Hover over any square → Tooltip should appear
2. Click [Last 90 days] → Grid should change to 13-week view
3. Click [Last 52 weeks] → Grid should change to 52-week view
4. Colors should go from gray → orange based on completion
```

---

## If Heatmap Still Not Working

### Issue A: No Heatmap Visible (Blank)

**Quick Fix:**
```
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Do you see error messages in RED?

IF YES:
   → Copy the error and debug based on:
     - "Cannot read property..." 
     - "Failed to fetch..."
     - "Unauthorized"

IF NO:
   → Check Network tab
   → Look for /api/streaks request
   → Does it return 200?
   
   IF NO:
      → You're not logged in
      → Go to /login first
   
   IF YES:
      → Check response shows habits and logs
      → If empty, create habits first
```

**Manual Test:**
```powershell
# In terminal, test API directly
curl http://localhost:3000/api/streaks \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

---

### Issue B: All Squares are Gray (No Orange)

**Probable Cause:** No habits marked as "done"

**Quick Fix:**
```
1. Go to /habits page
2. Click on any habit
3. You should see a log entry
4. Make sure it shows "Done" or has a checkmark
5. If not marked, click to mark it done
6. Return to /streaks
7. Squares should turn orange
```

**Expected:**
```
If 3 habits exist and:
- 3 marked done → Full orange (100%)
- 2 marked done → Medium orange (67%)
- 1 marked done → Light orange (33%)
- 0 marked done → Gray (0%)
```

---

### Issue C: Streak Numbers Wrong (0 current, 0 best)

**Probable Cause:** Habit consistency broken OR incorrect calculation

**Quick Fix:**
```
1. For current streak:
   - ALL habits must be marked "done" on same day
   - If you have 3 habits but only did 2, streak = 0
   - Streak counts backward from yesterday

2. For best streak:
   - Find longest consecutive days with 100% done
   - Example:
     - Jan 1-5: All done → bestStreak = 5
     - Jan 6: Skip → streak breaks
     - Jan 7-9: All done → streak = 3
     - Result: bestStreak = 5 (from Jan 1-5)

3. Test:
   a) Go to /habits and check you have habits
   b) Mark ALL habits as done for today
   c) Mark ALL habits as done for yesterday
   d) Go to /streaks
   e) currentStreak should be 2 or 1 (depending on now vs yesterday)
   f) If still 0, streak calculation has an issue
```

---

### Issue D: Colors Wrong (Wrong Shade of Orange)

**Probable Cause:** Color calculation wrong or CSS not loaded

**Quick Fix:**
```
1. Right-click a square
2. Select "Inspect Element"
3. Look at the class name
4. Should see something like: "bg-orange-300"

IF YOU SEE:
- "bg-gray-100" → 0% done (correct)
- "bg-orange-100" → 1-33% done (correct)
- "bg-orange-300" → 34-66% done (correct)
- "bg-orange-400" → 67-99% done (correct)
- "bg-orange-500" → 100% done (correct)

IF YOU DON'T SEE CSS CLASSES:
→ Tailwind CSS might not be compiled
→ Run: npm run dev
→ Wait for it to say "Ready in..."
→ Refresh browser
```

---

### Issue E: Dates Wrong (Wrong Month or Day)

**Probable Cause:** Timezone or date parsing issue

**Quick Fix:**
```
1. Check today's date:
   - Should have blue ring around it
   - Check if date matches your actual date
   - If off by several days → timezone issue

2. Check month labels:
   - Top row should show: Jan, Feb, Mar, etc.
   - Should match actual calendar

3. Test date parsing:
   - F12 → Console
   - Type: new Date("2026-01-23T00:00:00.000Z").toLocaleDateString()
   - Should print: 1/23/2026 (or similar based on locale)
   - If "Invalid Date" → date parsing broken

4. Fix timezone:
   - Dates should be stored in UTC
   - Client displays in local timezone
   - If consistently off, check server timezone settings
```

---

## Complete Data Verification

### 1. Check Database Has Data
```
Open your database file (SQLite):
1. Tables to check:
   - Habit (should have rows)
   - HabitLog (should have many rows)

2. For each Habit, check:
   - id (exists)
   - title (exists)
   - userId (matches your user)
   - isActive (true)

3. For each HabitLog, check:
   - id (exists)
   - habitId (matches a Habit.id)
   - userId (matches your user)
   - date (is valid date string)
   - done (true or false)
```

### 2. Check API Response
```
1. Open: http://localhost:3000/api/streaks
2. You should see JSON like:
{
  "currentStreak": 5,
  "bestStreak": 12,
  "totalCompletedDays": 47,
  "habits": [
    {
      "id": "habit_123",
      "title": "Exercise",
      "isActive": true
    }
  ],
  "logs": [
    {
      "habitId": "habit_123",
      "date": "2026-01-23T00:00:00.000Z",
      "done": true
    }
  ],
  "milestones": [...]
}

3. Verify:
   - habits array has items (not empty [])
   - logs array has items (not empty [])
   - dates are in ISO format (with Z at end)
   - done is boolean (true or false)
```

### 3. Check Component Receives Data
```
F12 → Console, look for log message:
"Streaks data loaded: {...}"

If you see it, component got the data.
If you don't see it, data loading failed.
```

---

## Step-by-Step Setup for Testing

### Option 1: Start Fresh (5 minutes)

```
1. Delete all habits:
   - Go to /habits
   - Delete each habit (click delete button)

2. Create new habits:
   - Click "Create New Habit"
   - Add: "Morning Exercise"
   - Click "Create New Habit"
   - Add: "Read Book"
   - Click "Create New Habit"
   - Add: "Meditate"

3. Mark habits done:
   - On /habits page, click each habit
   - For today: toggle all to "Done"
   - For yesterday: toggle all to "Done"
   - For the day before: toggle all to "Done"

4. Check /streaks:
   - Should show currentStreak = 3
   - Should show bestStreak = 3
   - Heatmap should have 3 orange squares (most recent)

5. Break the streak:
   - Go back to /habits
   - For today, toggle one habit to "Not Done"
   - Go to /streaks
   - currentStreak should drop to 0
   - bestStreak should stay 3
```

### Option 2: Use Existing Data

```
1. Go to /habits
2. Check what habits you have
3. Count total active habits
4. Go to /streaks
5. Mark them all as done for today and yesterday
6. Check streak increases
```

---

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "401 Unauthorized" | Not logged in | Go to /login, create account, login |
| "404 Not Found" | API route broken | Check `/api/streaks/route.js` exists |
| "Cannot read property 'length' of undefined" | habits or logs is null | Check API returns arrays, not null |
| "Invalid Date" | Date format wrong | Check logs have ISO date format |
| "TypeError: habits is not iterable" | habits is not an array | Verify API returns habits array |
| Blank heatmap | No habits or logs | Create habits and mark them done |

---

## Chrome DevTools Tips

### Check What Data Component Has
```javascript
// In Console, right-click a heatmap square
// Then in Console type:
$0  // Shows the HTML element
$0.title  // Shows the title attribute (has the data!)
```

### Inspect Network Request
```
1. F12 → Network tab
2. Refresh page
3. Look for: /api/streaks (blue text)
4. Click on it
5. Check:
   - Status: 200 (green is good)
   - Response: Shows JSON data
   - Size: > 1KB (should have data)
   - Time: < 100ms (should be fast)
```

### Monitor Console Logs
```
1. F12 → Console tab
2. Filter by "Streaks" or "StreakHeatmap"
3. Should see:
   - "Streaks data loaded: {...}"
   - Any error messages in RED
```

---

## Production Checklist

Before deploying to production:

- [ ] Heatmap displays on /streaks page
- [ ] Colors change based on habit completion
- [ ] Current streak calculates correctly
- [ ] Best streak calculates correctly
- [ ] Tooltips work on hover
- [ ] View toggle works (90 days / 52 weeks)
- [ ] Today is marked with blue ring
- [ ] Works on mobile (responsive)
- [ ] No console errors
- [ ] API returns data in < 100ms
- [ ] Component renders in < 50ms

---

## Need More Help?

1. **Check logs**: F12 → Console tab
2. **Check API**: Visit `/api/streaks` directly
3. **Check database**: Look at tables with your DB tool
4. **Check files**: Verify no typos in:
   - `src/components/streaks/StreakHeatmap.js`
   - `src/app/api/streaks/route.js`
   - `src/app/streaks/page.js`

---

## Quick Commands

```powershell
# Start dev server
npm run dev

# Build for production
npm run build

# Check syntax
node -c src/components/streaks/StreakHeatmap.js

# Test API endpoint (if you have curl)
curl http://localhost:3000/api/streaks
```

---

## You're Ready! 🎉

Once you see:
1. ✅ Heatmap grid displaying
2. ✅ Colors changing (gray to orange)
3. ✅ Streak numbers showing correctly
4. ✅ Tooltips working on hover

**Your streak heatmap is working perfectly!**

