# 🔧 Streak Heatmap - Debugging & Testing Guide

## Quick Status Check

### ✅ What Was Fixed
1. **Date parsing**: Added robust date parsing in heatmap component
2. **API response**: Ensured logs return dates in ISO format
3. **Error handling**: Added console logging to track data flow
4. **Grid calculation**: Fixed edge cases in completion percentage calculation
5. **Date comparison**: Fixed today detection using string keys instead of Date objects

### 🧪 How to Test the Heatmap

#### Step 1: Check Browser Console
1. Go to `/streaks` page
2. Open Developer Tools (F12)
3. Go to Console tab
4. Look for: `"Streaks data loaded: { ... }"`
5. Verify it shows:
   ```
   {
     currentStreak: <number>,
     bestStreak: <number>,
     totalCompletedDays: <number>,
     habits: [ {...}, {...} ],  // Should have actual habits
     logs: [ {...}, {...} ],     // Should have actual logs
     milestones: [...]
   }
   ```

#### Step 2: Check Network Response
1. Open Developer Tools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for request to `/api/streaks`
5. Click on it and check "Response" tab
6. Should show structured data like:
   ```json
   {
     "currentStreak": 5,
     "bestStreak": 12,
     "totalCompletedDays": 145,
     "habits": [
       {
         "id": "habit-1",
         "title": "Exercise",
         "scheduledTime": "09:00 AM",
         "isActive": true
       }
     ],
     "logs": [
       {
         "id": "log-1",
         "habitId": "habit-1",
         "date": "2026-01-23T00:00:00.000Z",
         "done": true
       }
     ],
     "milestones": [...]
   }
   ```

#### Step 3: Visual Inspection
1. Go to `/streaks` page
2. Under "Your Streak Heatmap" section, you should see:
   - [ Last 90 days ] [ Last 52 weeks ] buttons
   - A grid of small colored squares
   - Month labels on top
   - Day labels on left (S M T W T F S)
   - Today's date marked with a blue ring
   - Legend showing color meanings
   - Help text explaining the heatmap

#### Step 4: Interactive Testing
1. **Hover over squares**: Should see tooltip with:
   - Date (e.g., "Wed, Jan 23, 2026")
   - Count (e.g., "3 of 5 completed")
   - Percentage (e.g., "60% complete")

2. **Click buttons**: 
   - "Last 90 days" should show 13-week view
   - "Last 52 weeks" should show full year view
   - View should change immediately

3. **Check colors**:
   - Gray squares = 0% habits done
   - Light orange = 1-33% done
   - Medium orange = 34-66% done
   - Dark orange = 67-99% done
   - Full orange = 100% done (perfect!)

---

## Common Issues & Solutions

### Issue 1: Heatmap Not Showing (Blank Screen)

**Possible Causes:**
- No habits exist
- No logs exist
- API error loading data

**How to Fix:**
```
1. Check browser console for errors:
   - Look for red error messages
   - Check if "Streaks data loaded" message appears

2. Verify habits exist:
   - Go to /habits page
   - Should see at least one habit

3. Verify logs exist:
   - Each habit should have at least one log entry
   - Check that you've marked habits as done before

4. Test API directly:
   - Open new tab
   - Go to: http://localhost:3000/api/streaks
   - Should see JSON response with data
```

### Issue 2: All Squares Are Gray (No Color)

**Possible Causes:**
- No completed logs (all marked as "not done")
- Completion percentage calculation wrong
- API returning wrong data

**How to Fix:**
```
1. Check habit logs:
   - Go to /habits page
   - Click on a habit
   - Mark some days as "done"
   - Refresh /streaks page

2. Verify in API response:
   - Each log should have "done": true
   - Count "done" logs for each day

3. Check heatmap calculation:
   - For a day with 3 done out of 5 habits:
     - Should be: (3/5)*100 = 60% → Medium orange
   - If showing gray, the calculation might be wrong

4. Test with perfect day:
   - Make sure ALL habits are marked done for one day
   - That day should be full orange (100%)
```

### Issue 3: Wrong Colors (Too Light or Too Dark)

**Possible Causes:**
- Color thresholds wrong
- Completion percentage calculation wrong
- CSS class names not applied

**How to Fix:**
```
1. Check the color thresholds in code:
   - 0% = gray
   - 1-33% = light orange
   - 34-66% = medium orange
   - 67-99% = dark orange
   - 100% = full orange

2. Verify completion percentage:
   - Use browser console to inspect element
   - Right-click square → Inspect
   - Check title attribute shows percentage
   - Verify it matches color intensity

3. Check CSS classes are loading:
   - In DevTools, select any square
   - Check if it has class like "bg-orange-300"
   - Verify Tailwind CSS is compiled
```

### Issue 4: Dates Wrong (Wrong Month/Day)

**Possible Causes:**
- Date parsing error
- Timezone issue
- Wrong date format from API

**How to Fix:**
```
1. Check date format in API:
   - Network tab → /api/streaks response
   - Dates should be: "2026-01-23T00:00:00.000Z"
   - Not: "2026-01-23 00:00:00"

2. Check date parsing:
   - In browser console, run:
     new Date("2026-01-23T00:00:00.000Z")
   - Should show valid date, not "Invalid Date"

3. Verify timezone:
   - Today's date should be marked with blue ring
   - Check if it matches your actual date
   - If wrong, might be timezone issue

4. Check database dates:
   - Dates should be stored as ISO strings
   - Check Prisma schema for date format
```

### Issue 5: Streak Numbers Wrong (Current Streak / Best Streak)

**Possible Causes:**
- Streak calculation logic error
- Database missing logs
- API not returning all logs

**How to Fix:**
```
1. Verify all logs returned:
   - API response should have ALL logs
   - Not just recent ones
   - Check logs array length

2. Check streak calculation:
   - For current streak:
     - Check backwards from yesterday
     - Stop when find a day with < 100% done
   
   - For best streak:
     - Calculate all consecutive 100% days
     - Return longest streak

3. Create test data:
   - Mark all habits done for 7 consecutive days
   - Current streak should be 7
   - Then mark one day as not done
   - Current streak should drop to 0
   - Best streak should remain 7

4. Check API response:
   - "currentStreak" field should be number
   - "bestStreak" field should be number
   - Both should be >= 0
```

---

## Data Flow Debugging

### 1. Request Path
```
Frontend (streaks/page.js)
  ↓
fetch("/api/streaks")
  ↓
API Route (api/streaks/route.js)
  ↓
Database (Prisma)
  ↓
Response JSON
  ↓
setData(json)
  ↓
StreakHeatmap Component
  ↓
Display Heatmap
```

### 2. Component Data Flow
```
StreakHeatmap Props:
  - habits: [ { id, title, ... } ]
  - logs: [ { habitId, date, done } ]
  
useMemo processes:
  - Parse each log date
  - Build dateMap: date → { completed, total }
  - Generate grid weeks
  
Result:
  - heatmapData: [ weeks ] = [ days ]
  - Each day has: completionPercentage, color
```

### 3. Debug Logs to Add

Add these console.logs to track data flow:

**In `streaks/page.js`:**
```javascript
const json = await res.json();
console.log("API Response:", json);
console.log("Habits count:", json.habits?.length);
console.log("Logs count:", json.logs?.length);
console.log("Current Streak:", json.currentStreak);
setData(json);
```

**In `StreakHeatmap.js`:**
```javascript
console.log("StreakHeatmap Props:", { habits, logs });
console.log("Habits:", habits);
console.log("Logs sample:", logs.slice(0, 5));
console.log("HeatmapData weeks:", heatmapData.length);
```

---

## Testing Checklist

### Data Layer
- [ ] Habits exist in database
- [ ] Logs exist in database
- [ ] Logs have correct date format
- [ ] Logs have correct habitId references
- [ ] Logs have correct "done" status

### API Layer
- [ ] GET /api/streaks returns 200
- [ ] Response has all required fields
- [ ] Dates are in ISO format
- [ ] Habits array is not empty
- [ ] Logs array is not empty

### Component Layer
- [ ] StreakHeatmap receives props correctly
- [ ] Dates parse correctly
- [ ] Colors calculate correctly
- [ ] Grid renders correctly
- [ ] Tooltips display correctly

### UI Layer
- [ ] Heatmap is visible
- [ ] Colors match percentages
- [ ] Today is marked with blue ring
- [ ] View toggle works
- [ ] Hover shows tooltip

---

## Performance Debugging

### Check Render Performance
```javascript
// Add to StreakHeatmap.js
useEffect(() => {
    console.time("HeatmapRender");
    return () => console.timeEnd("HeatmapRender");
}, [heatmapData]);
```

### Check Data Loading Time
```javascript
// Add to streaks/page.js
useEffect(() => {
    const start = Date.now();
    fetch("/api/streaks").then(() => {
        console.log(`Data loaded in ${Date.now() - start}ms`);
    });
}, []);
```

### Expected Performance
- API response: < 100ms
- Component render: < 50ms
- Total page load: < 1s

---

## Manual Testing Scenarios

### Scenario 1: New User
```
Setup:
- No habits
- No logs

Expected:
- Message: "No habits yet. Create a habit..."
- No heatmap shown
- Stats show 0/0/0
```

### Scenario 2: User with Habits but No Logs
```
Setup:
- 5 habits created
- No logs

Expected:
- All squares gray (0% done)
- Stats: currentStreak=0, bestStreak=0
- Heatmap shown but all gray
```

### Scenario 3: User with Consistent Streak
```
Setup:
- 3 habits
- All 3 marked done for last 7 days
- 2 marked done on day 8
- 0 marked on day 9

Expected:
- Last 7 days: Full orange (100%)
- Day 8: Medium orange (67%)
- Day 9: Light orange (33%)
- Earlier days: Gray (0%)
- currentStreak=7
- bestStreak=7
```

### Scenario 4: Multiple Streaks
```
Setup:
- Day 1-5: All done (100%)
- Day 6: None done (0%)
- Day 7-10: All done (100%)
- Day 11+: None done (0%)

Expected:
- First block: 5 orange, 1 gray
- Second block: 4 orange
- currentStreak=0 (broken on day 11)
- bestStreak=5 (first block)
```

---

## FAQ

**Q: Why is my heatmap empty?**  
A: You probably don't have any habits or logs. Go to /habits and create one, then mark it done.

**Q: Why are all squares gray?**  
A: All your habits are marked as "not done" for those days. Mark some as done.

**Q: Why is today not marked?**  
A: Today is marked with a blue ring. If you don't see it, check that the date is correct on your system.

**Q: Can I click on a square to see details?**  
A: Not yet, but hovering shows the details in a tooltip.

**Q: Why is the streak number wrong?**  
A: Streaks require ALL habits to be done on the same day. If you have 5 habits but only did 4, the streak breaks.

**Q: How do I reset the heatmap?**  
A: Delete the logs and create new ones. The heatmap updates automatically.

---

## Still Not Working?

1. **Check console errors**: F12 → Console tab
2. **Check network errors**: F12 → Network tab
3. **Clear cache**: Ctrl+Shift+Delete
4. **Restart dev server**: Kill terminal, run `npm run dev`
5. **Check database**: Look at logs in database directly
6. **Check if API works**: Visit `/api/streaks` directly

---

## Files Modified for Heatmap

**Component:**
- `src/components/streaks/StreakHeatmap.js` (350+ lines)

**Pages:**
- `src/app/streaks/page.js` (integrated heatmap)

**API:**
- `src/app/api/streaks/route.js` (returns habits + logs)

**Database:**
- No changes (uses existing Habit and HabitLog models)

**Documentation:**
- `HEATMAP_FEATURE_GUIDE.md` (user guide)
- `HEATMAP_BEFORE_AFTER.md` (comparison)
- `HEATMAP_IMPLEMENTATION.md` (technical)
- `HEATMAP_VISUAL_GUIDE.md` (visual reference)
- `STREAK_HEATMAP_DEBUGGING.md` (this file)
