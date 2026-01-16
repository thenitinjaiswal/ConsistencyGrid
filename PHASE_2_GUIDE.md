# ConsistencyGrid - Phase 2 Implementation Guide

## 🎯 Goals Page Implementation

### Database (Already Ready!)
Your Prisma schema already has goal support in `WallpaperSettings`:
- `goalEnabled`
- `goalTitle`
- `goalStartDate`
- `goalDurationDays`
- `goalUnit`

### API Routes Needed:
```
/api/goals/route.js - GET all goals, POST create goal
/api/goals/[id]/route.js - GET, PUT, DELETE specific goal
```

### Page Structure:
```
/goals/page.js
├── GoalHeader (with "Add Goal" button)
├── ActiveGoals (list of active goals with progress)
├── CompletedGoals (archived goals)
└── GoalStats (completion rate, total goals, etc.)
```

---

## 📈 Streaks Page Implementation

### API Route Needed:
```
/api/streaks/history/route.js - GET streak history by date
```

### Features to Build:
1. **Calendar View** - Visual calendar showing completed days
2. **Streak Stats** - Current, best, average streak
3. **Habit Breakdown** - Which habits contribute to streaks
4. **Streak Milestones** - Badges for 7, 30, 100 day streaks

### Components:
```
/streaks/page.js
├── StreakHeader (current streak display)
├── StreakCalendar (visual calendar)
├── StreakChart (line chart of streak over time)
└── Milestones (achievement badges)
```

---

## 📊 Analytics Page Implementation

### API Routes Needed:
```
/api/analytics/overview/route.js - Overall stats
/api/analytics/habits/route.js - Per-habit analytics
/api/analytics/trends/route.js - Completion trends
```

### Metrics to Display:
1. **Completion Rate** - % of habits completed daily
2. **Best Day of Week** - Which day you're most consistent
3. **Habit Performance** - Which habits you complete most
4. **Monthly Trends** - Month-over-month improvement
5. **Time Analysis** - Morning vs evening habits

### Visualization Ideas:
- Line charts for trends
- Bar charts for habit comparison
- Heatmap calendar for completion density
- Pie chart for habit distribution

---

## ⚙️ Settings Page Implementation

### Sections:
1. **Profile Settings**
   - Name, email (read-only)
   - Avatar upload
   - Timezone

2. **Wallpaper Preferences**
   - Default resolution presets
   - Theme preferences
   - Auto-update schedule

3. **Notification Settings**
   - Email reminders
   - Habit reminder times
   - Weekly summary emails

4. **Account Management**
   - Change password
   - Export data
   - Delete account (danger zone)

### API Routes:
```
/api/settings/profile/route.js - Update profile
/api/settings/notifications/route.js - Notification preferences
/api/settings/export/route.js - Export user data
/api/settings/delete/route.js - Delete account
```

---

## 🎨 UX Enhancements

### 1. Toast Notification System
**Library Recommendation:** `react-hot-toast` or `sonner`

```bash
npm install react-hot-toast
```

**Usage:**
```javascript
import toast from 'react-hot-toast';

// Success
toast.success('Habit completed!');

// Error
toast.error('Failed to save settings');

// Loading
const promise = fetch('/api/habits');
toast.promise(promise, {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed to save',
});
```

### 2. Loading Skeletons
Create reusable skeleton components:
```
/components/ui/Skeleton.js
/components/ui/CardSkeleton.js
/components/ui/StatCardSkeleton.js
```

### 3. Error Boundaries
```javascript
// components/ErrorBoundary.js
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

## 🚀 Quick Wins (Can Implement in 30 mins)

### 1. Add Habit Delete Functionality
```javascript
// /api/habits/[id]/route.js
export async function DELETE(req, { params }) {
  const { id } = params;
  // Soft delete: set isActive = false
  await prisma.habit.update({
    where: { id },
    data: { isActive: false }
  });
  return Response.json({ success: true });
}
```

### 2. Add Habit Edit Functionality
```javascript
// /api/habits/[id]/route.js
export async function PUT(req, { params }) {
  const { id } = params;
  const { title } = await req.json();
  
  const habit = await prisma.habit.update({
    where: { id },
    data: { title }
  });
  
  return Response.json({ habit });
}
```

### 3. Add "Today's Quote" Feature
```javascript
// /api/quote/route.js
const quotes = [
  "Make each day count.",
  "Consistency is key.",
  "Small steps, big results.",
];

export async function GET() {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  return Response.json({ quote: random });
}
```

---

## 📱 Mobile Optimization Checklist

- [ ] Test all pages on mobile viewport
- [ ] Make sidebar collapsible on mobile
- [ ] Ensure touch targets are 44x44px minimum
- [ ] Test wallpaper preview on small screens
- [ ] Add swipe gestures for habit completion
- [ ] Optimize images for mobile bandwidth

---

## 🔐 Security Improvements

1. **Rate Limiting** - Prevent API abuse
2. **Input Validation** - Sanitize all user inputs
3. **CSRF Protection** - Already handled by NextAuth
4. **SQL Injection** - Already prevented by Prisma
5. **XSS Protection** - Sanitize user-generated content

---

## 📦 Recommended Libraries

```json
{
  "react-hot-toast": "^2.4.1",    // Toast notifications
  "recharts": "^2.10.0",          // Charts for analytics
  "date-fns": "^3.0.0",           // Date manipulation
  "framer-motion": "^11.0.0",     // Animations
  "react-day-picker": "^8.10.0"   // Calendar component
}
```

---

## 🎯 Priority Order

### Week 1:
1. ✅ Toast notifications
2. ✅ Habit edit/delete
3. ✅ Settings page (basic)

### Week 2:
4. ✅ Goals page
5. ✅ Streaks page

### Week 3:
6. ✅ Analytics page
7. ✅ Mobile optimization

### Week 4:
8. ✅ Polish & bug fixes
9. ✅ Performance optimization
10. ✅ Documentation

---

## 💬 Need Help?

If you want me to implement any of these features, just let me know which one you'd like to tackle first! I can:

1. Write the complete code
2. Create the API routes
3. Build the UI components
4. Add the database migrations
5. Test everything

Just say the word! 🚀
