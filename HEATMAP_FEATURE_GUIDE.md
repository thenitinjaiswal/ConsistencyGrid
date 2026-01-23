# Streak Heatmap Feature - GitHub-Style Visualization

## What's New

Your **Streaks page** now includes a GitHub-style heatmap that visualizes your habit consistency over time. This gives you a comprehensive view of your commitment patterns.

## How It Works

### The Heatmap Grid
- **Each square = 1 day** of your habit tracking
- **Color intensity = % of habits completed** that day
- Shows **52 weeks (1 year)** or **13 weeks (90 days)** of data
- **Interactive tooltips** show exact completion counts

### Color Meanings
| Color | Meaning | Example |
|-------|---------|---------|
| 🟩 Gray | No habits completed | 0/5 habits |
| 🟧 Light Orange | Some habits done | 1-2/5 habits |
| 🟧 Medium Orange | Half done | 3/5 habits |
| 🟧 Dark Orange | Mostly done | 4/5 habits |
| 🟥 Full Orange | All habits completed | 5/5 habits (100%) |

### Features
- ✅ **View Toggle**: Switch between 90-day and 52-week views
- ✅ **Hover Tooltips**: See exact dates and completion counts
- ✅ **Today Indicator**: Blue ring marks today's date
- ✅ **Month Labels**: Top row shows month boundaries
- ✅ **Day Labels**: Left side shows day of week (S M W F)
- ✅ **Interactive Legend**: Color guide at the bottom

## Reading Your Heatmap

### Perfect Pattern (Building Momentum)
```
Dark orange blocks = Consistent habit completion
Shows up as horizontal lines of dark orange
= You're maintaining your streak!
```

### Gaps (Need Attention)
```
Gray or light orange blocks = Incomplete days
Shows up as gaps in the pattern
= Days to work on next month
```

### Progression (Improvement Over Time)
```
Recent weeks darker than past weeks
= You're improving your consistency!
```

## Example Scenarios

### Scenario 1: New User
```
Most squares gray (just starting)
→ Create your first habits
→ Complete them daily
→ Watch squares turn orange!
```

### Scenario 2: Consistent User
```
Solid block of dark orange squares
→ You've been completing all habits
→ Keep this streak going!
→ Aim for 365+ days of consistency
```

### Scenario 3: Recovering User
```
Dark orange → gap → starting again
→ You had a break
→ Now building momentum again
→ Each dark square = progress!
```

## Tips for Best Results

1. **Check Daily**: Visit your heatmap to track patterns
2. **Aim for Consistency**: Darker colors = more completed habits
3. **Break the Pattern**: Gray squares highlight where you need focus
4. **Weekly Reviews**: Check the pattern every Sunday to plan ahead
5. **Share Progress**: Dark orange blocks are something to be proud of!

## Technical Details

### Data Calculation
- Based on your **Habit Logs** from the database
- Each day's color = `(completed_habits / total_habits) * 100`
- Calculates in real-time from your activity data
- Updates automatically when you complete habits

### Performance
- Uses **server-side caching** (60-second TTL)
- **Interactive UI** with instant hover tooltips
- **Responsive design** - works on mobile and desktop
- **Lightweight** - renders efficiently even with 365+ days

### Customization
The heatmap can be configured to show:
- Different timeframes (90 days, 6 months, 1 year)
- Different color schemes (already using orange theme)
- Different completion thresholds (currently 34%, 67%, 100%)

## Comparing to GitHub

| Feature | GitHub | ConsistencyGrid |
|---------|--------|-----------------|
| Grid size | 52 weeks | 52 or 13 weeks |
| Unit | Code commits | Habits completed |
| Color meaning | Contribution intensity | Habit completion % |
| Hover info | Date + commits | Date + habits + % |
| Theme | Green | Orange |

## Troubleshooting

**Question**: Why is a day gray when I completed habits?
- **Answer**: You might have habits that aren't marked as "done" in the log. Check if all habits were properly toggled.

**Question**: Why are old days not showing?
- **Answer**: Only days with logged habit activity show up. Days with no habits created won't appear.

**Question**: Can I change the color theme?
- **Answer**: Yes! Edit the `getColorClass()` function in `StreakHeatmap.js` to use different colors (e.g., green like GitHub).

**Question**: Why does today have a blue ring?
- **Answer**: The blue ring highlights today's date so you can see your current day at a glance.

## Next Features (Ideas)

Future enhancements could include:
- 📊 Click a week to see detailed stats
- 📈 Trend analysis (improving/declining)
- 🎯 Streak annotations (milestones, breaks)
- 📱 Mobile heatmap view (vertical layout)
- 🎨 Custom color themes (green, blue, etc.)
- 📊 Export as image for sharing

## Try It Now

1. Go to **Streaks** page
2. See your GitHub-style heatmap
3. **Toggle** between 90 days and 1 year views
4. **Hover** over squares to see details
5. **Plan** your next week based on your patterns

---

**Your consistency patterns are now visible!** 🔥

Use this heatmap to:
- ✅ Track long-term habit consistency
- ✅ Identify patterns and gaps
- ✅ Stay motivated with visual progress
- ✅ Share your achievement with others

