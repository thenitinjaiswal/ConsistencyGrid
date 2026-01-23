# 📊 Streak Heatmap - Visual Guide

## The Heatmap at a Glance

```
╔════════════════════════════════════════════════════════════════════╗
║                      YOUR STREAK HEATMAP                          ║
║                                                                    ║
║  [Last 90 days]  [Last 52 weeks]  ← Toggle between views          ║
║                                                                    ║
║                   Jan    Feb    Mar    Apr    May                 ║
║                  S M T W T F S S M T W T F S S M T W T F S...     ║
║  S (Sunday)      ■ ■ ■ ■ □ ■ ■ ■ ■ ◑ ■ ■ ■ ◑ ■ ■ ■ □ ■ ...    ║
║  M (Monday)      ■ ◑ ■ ■ ■ ◑ ■ ■ ◑ ■ ■ ■ ◑ ■ ■ □ ■ ■ ◑ ...    ║
║  T (Tuesday)     ■ ■ ◑ ■ ■ ■ □ ◑ ■ ■ ◑ ■ ■ ◑ ■ ■ ■ ◑ ■ ...    ║
║  W (Wednesday)   ■ ■ ■ ◑ ■ ■ ■ ■ ◑ ■ ■ ◑ ■ ■ ◑ ■ ■ ■ □ ...    ║
║  T (Thursday)    ■ ■ ■ ■ ◑ ■ ■ ◑ ■ ■ ■ ◑ ■ ■ ■ ◑ ■ ■ ■ ...    ║
║  F (Friday)      ■ ◑ ■ ■ ■ ◑ ■ ■ ◑ ■ ■ ■ ◑ ■ ■ ■ ◑ ■ ■ ...    ║
║  S (Saturday)    □ ◑ ■ ■ ◑ ■ □ ◑ ■ ■ ◑ ■ □ ◑ ■ ■ ◑ ■ □ ...    ║
║                                              ▲                      ║
║                                           (Today)                  ║
║                                                                    ║
║  Legend:                                                           ║
║  □ = Gray (0%)        No habits completed                          ║
║  ◑ = Light (1-33%)    Some habits completed                        ║
║  ◐ = Medium (34-66%)  Half habits completed                        ║
║  ◕ = Dark (67-99%)    Most habits completed                        ║
║  ■ = Full (100%)      All habits completed!                        ║
║  ▢ = Blue ring        Today's date                                 ║
╚════════════════════════════════════════════════════════════════════╝
```

## What You See

### 1. Header Section
```
[Last 90 days]  [Last 52 weeks]
     Selected         Not selected
     (orange bg)      (gray bg)
```
Click either to switch views.

### 2. Heatmap Grid
```
Months on top:     Jan | Feb | Mar | Apr | May
Days on left:      S M T W T F S (repeating)
Squares in grid:   One per day (7 columns × weeks)
```

### 3. Each Square Color
```
■ Full Orange (100%)     - All habits done = Perfect day!
◕ Dark Orange (67-99%)   - Most habits done = Great day
◐ Medium Orange (34-66%) - Half habits done = Good day
◑ Light Orange (1-33%)   - Some habits done = Okay day
□ Gray (0%)              - No habits done = Day off
```

### 4. Today Indicator
```
Today's square has a blue ring around it
Makes it easy to find today in the grid
Helps with orientation
```

### 5. Month Labels
```
Top of grid shows: Jan | Feb | Mar | Apr | May | ...
Helps you understand which time period each column is
```

### 6. Day Labels
```
Left side shows: S M T W T F S (repeating)
Helps you understand which day of week each row is
```

---

## Interactive Elements

### Hover Over a Square
```
When you hover (move mouse) over any day:

    ┌─────────────────────┐
    │  Mon, Jan 23, 2026  │
    │  3 of 5 completed   │
    │  60% complete       │
    └─────────────────────┘
         (tooltip appears)
```

Shows:
- Date (day, month, year)
- Count (3 out of 5 habits)
- Percentage (60%)

### Toggle Buttons
```
[Last 90 days]  [Last 52 weeks]

Click to switch between:
- Zoomed view (13 weeks = 91 days)
- Full view (52 weeks = 364 days)

Active button = orange background
Inactive = gray background
```

---

## Real-Life Examples

### Example 1: Very Consistent User
```
Week 1:  ■ ■ ■ ■ ■ ■ □  (6 full days)
Week 2:  ■ ■ ■ ■ ■ ◕ □  (5 full + 1 dark)
Week 3:  ■ ■ ■ ■ ■ ■ □  (6 full days)
Week 4:  ■ ■ ■ ■ ■ ■ □  (6 full days)

Pattern: Dark orange every weekday, lighter on weekends
Meaning: Very consistent! Takes weekends lighter.
```

### Example 2: Building Momentum
```
Week 1:  □ □ □ ◑ ◑ ◑ □  (starting)
Week 2:  ◑ ◑ ◐ ◐ ◐ ◑ □  (improving)
Week 3:  ◐ ◐ ■ ■ ◐ ◐ □  (getting there)
Week 4:  ■ ■ ■ ■ ■ ◕ □  (almost perfect!)

Pattern: Gradual improvement over 4 weeks
Meaning: You're building a habit!
```

### Example 3: Consistency with Slip
```
Week 1:  ■ ■ ■ ■ ■ ■ □  (solid)
Week 2:  ■ ■ ■ ■ ■ ■ □  (solid)
Week 3:  ■ ■ ■ ■ ■ ■ □  (solid)
Week 4:  □ □ ◑ □ ◑ □ □  (slipped!)

Pattern: Good run, then break
Meaning: Getting back on track after a slip
```

### Example 4: Weekday Focus
```
Week 1:  ■ ■ ■ ■ ■ ◑ □  (strong weekdays)
Week 2:  ■ ■ ■ ■ ■ ◑ □  (strong weekdays)
Week 3:  ■ ■ ■ ■ ■ ◑ □  (strong weekdays)
Week 4:  ■ ■ ■ ■ ■ ◑ □  (strong weekdays)

Pattern: Full week M-F, lighter F & empty Sunday
Meaning: Weekday warrior! Weekend is your rest day.
```

---

## Reading Your Heatmap

### Step 1: Look at Overall Color
```
Mostly dark?     → You're very consistent
Mostly light?    → You're getting started
Mostly gray?     → You need to focus
Mixed?           → You have good and bad days
```

### Step 2: Look for Patterns
```
Vertical lines (same day each week)?
→ You're consistent on that day of week

Horizontal blocks?
→ You had a good/bad week

Diagonal progress?
→ You're improving over time
```

### Step 3: Check Recent vs Old
```
Recent weeks darker than old weeks?
→ You're improving!

Recent weeks lighter than old weeks?
→ You might be slipping

Recent weeks same as old weeks?
→ You're maintaining consistency
```

### Step 4: Look for Breaks
```
Large gray blocks?
→ You took a break (might be intentional)

Gray scattered throughout?
→ You're inconsistent

Few gray blocks in solid dark?
→ You're very consistent
```

---

## What Each Color Tells You

### 100% (■ Full Orange)
```
You completed ALL your habits on this day
Example: 5 out of 5 habits
Result: Perfect day! Keep it up!
```

### 67-99% (◕ Dark Orange)
```
You completed MOST habits
Example: 4 out of 5 habits (80%)
Result: Great day! Almost perfect
```

### 34-66% (◐ Medium Orange)
```
You completed about HALF
Example: 2-3 out of 5 habits (50%)
Result: Good effort, room to improve
```

### 1-33% (◑ Light Orange)
```
You completed SOME habits
Example: 1 out of 5 habits (20%)
Result: Started, but didn't finish
```

### 0% (□ Gray)
```
You completed NO habits
Example: 0 out of 5 habits (0%)
Result: Day off or skipped
```

---

## Tips for Using Your Heatmap

### 🎯 Daily Use
```
1. Check your heatmap daily
2. See today's color (should aim for dark orange)
3. Hover to see exact completion
4. Track your progress
```

### 📊 Weekly Review
```
1. Every Sunday, review the week
2. Count dark orange days (ideal: 5-7)
3. Identify light/gray days
4. Plan adjustments for next week
```

### 📈 Monthly Analysis
```
1. Switch to 52-week view
2. Look at the past month's pattern
3. Compare to previous months
4. Celebrate if you're improving
```

### 🎉 Motivation
```
1. A solid block of dark orange is beautiful!
2. Share with friends ("Look at my streak!")
3. Celebrate milestones (4 weeks solid, etc.)
4. Use as motivation for tomorrow
```

---

## Common Patterns & What They Mean

| Pattern | Meaning | Action |
|---------|---------|--------|
| Solid dark block | You're crushing it! | Keep going! |
| Getting darker over time | You're improving | Momentum is building! |
| Lots of weekday dark, weekend gray | Good weekday routine | Weekends need attention |
| Scattered gray throughout | Inconsistent habits | Identify barriers |
| Recent lighter than past | You're slipping | Time to refocus |
| Weekly stripe (dark M-F) | Routine established | Great foundation |

---

## Quick Reference

**To see consistency**: Look at color darkness  
**To see patterns**: Look at the grid pattern  
**To see progress**: Compare recent vs old  
**To see weak days**: Find gray and light sections  
**To get motivated**: Count the dark orange squares  

---

## Mobile View

On mobile, the heatmap is responsive:
- Scrollable horizontally if needed
- Touch-friendly squares
- Same colors and tooltips
- Legend below the grid

---

## FAQ

**Q: Why is my square gray when I worked on habits?**  
A: Only habits marked "done" count. Check your toggle switches.

**Q: Can I click a day to see more details?**  
A: Hover to see the summary. Full details coming in future version!

**Q: Why 52 weeks instead of 365 days?**  
A: Because 52 weeks × 7 days = 364 days ≈ 1 year. Standard format.

**Q: Why is today marked with a blue ring?**  
A: So you can easily find it in the big grid of squares!

**Q: Can I change the colors?**  
A: Yes! They're configurable in the component (Tailwind CSS).

---

## Summary

Your heatmap shows:
✅ **What**: Your daily habit completion  
✅ **When**: Over 90 days or 52 weeks  
✅ **How much**: Percentage-based coloring  
✅ **Patterns**: Visual trends over time  
✅ **Progress**: Improvement indicators  

Use it to stay motivated and track your consistency! 🔥

