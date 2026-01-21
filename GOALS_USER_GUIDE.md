# Goals System - User Experience Guide

## 🎬 Visual Walkthrough

### Step 1: Goals Page View
```
┌─────────────────────────────────────────────────────────────┐
│  Goals & Milestones                           [Filter] [+ Add Goal] │
│  Track your long-term vision and daily progress.            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ● Overall Life Momentum                   [View Insights]   │
│                                                              │
│  You have achieved 12 out of 18 major milestones.           │
│  72% of your lifetime objectives are on track for your      │
│  age 35 targets.                                            │
│                                                              │
│  [⚡ On Track]  [🎯 6 Active Goals]                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Active Goals                              Life Milestones
┌─────────────────────────────────────┐  ┌────────────────────┐
│ ❤️ HEALTH                           │  │ 🏆 Life Timeline   │
│                                      │  │                    │
│ Train for London Marathon           │  │ ✓ Age 25: Home     │
│ 📅 Target: Oct 15, 2026             │  │ ● Age 30: Peak FI  │
│                                      │  │ ○ Age 40: Mastery  │
│ Progress: 40%                        │  │ ○ Age 50: Legacy   │
│ ▓░░░░░░░░░░░░░░░░                   │  │                    │
│                                      │  │ [View Timeline]    │
│ 4 of 10 sub-goals completed         │  │                    │
│                                      │  │ 🚀 Achievement:2.4x│
│ ☐ Buy proper running shoes ✓        │  │    vs. Peers       │
│ ☐ Create 16-week training plan      │  └────────────────────┘
│ ☐ Complete first 10k run            │
│ [+ 1 more sub-goals]                │
│                                      │
└─────────────────────────────────────┘
```

### Step 2: Click "Add Goal" Button
Modal opens with smooth fade animation.

### Step 3: Add Goal Modal Form
```
┌──────────────────────────────────────────────────────────────┐
│  Create New Goal                                        [✕]  │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Goal Name                                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ e.g. Run a Marathon, Learn Swift...                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  Choose Category                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ ❤️ Health│ │ 💰 Wealth│ │ 🧠 Mind  │ │ 💼 Work  │       │
│  │          │ │          │ │          │ │ (selected)│      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                               │
│  Target Deadline          Description (Optional)             │
│  ┌──────────────┐         ┌──────────────────────────┐       │
│  │ mm/dd/yyyy   │         │ Brief description...     │       │
│  └──────────────┘         └──────────────────────────┘       │
│                                                               │
│  Add Sub-Goals (Milestones)                           1 added│
│  ┌────────────────────────────────────────────────┐ [Delete] │
│  │ Sub-goal 1: Buy proper running shoes            │          │
│  └────────────────────────────────────────────────┘          │
│  ┌────────────────────────────────────────────────┐ [Delete] │
│  │ Sub-goal 2: Create training schedule            │          │
│  └────────────────────────────────────────────────┘          │
│                                                               │
│  [+ Add Another Sub-Goal]                                   │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│  [Cancel]                              [Create Goal] ➜        │
└──────────────────────────────────────────────────────────────┘
```

### Step 4: Sub-Goals Management
Users can:
- Add unlimited sub-goals by clicking "+ Add Another Sub-Goal"
- Remove sub-goals (except when only 1 remains)
- See real-time count of filled sub-goals

### Step 5: Submit & Success
```
✓ Toast: "Goal created successfully!"

Goal appears at top of Active Goals list:
┌─────────────────────────────────────────────────────────────┐
│ 💼 WORK                                                   ⋯ │
│                                                              │
│ Learn Advanced React & Next.js                             │
│ 📅 Target: Dec 31, 2026                                    │
│                                                              │
│ Progress: 0%                                               │
│ ░░░░░░░░░░░░░░░░░░░                                        │
│                                                              │
│ 0 of 3 sub-goals completed                                 │
│                                                              │
│ ☐ Complete Advanced React course                           │
│ ☐ Build full-stack project                                 │
│ ☐ Deploy to production                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Sub-Goals Progress Tracking

### Checking Off Sub-Goals
1. User clicks checkbox next to sub-goal
2. Sub-goal marks as complete with checkmark ✓
3. Text becomes strikethrough
4. Progress bar updates in real-time
5. Sub-goal count increases (e.g., "1 of 3 completed")
6. When all sub-goals done, "✓ Complete" badge appears

```
Before:          After Completing:
☐ Buy shoes      ☑️ Buy shoes (strikethrough)
☐ Plan route     ☐ Plan route
☐ First 10k      ☐ First 10k

Progress: 20%    Progress: 33%
░░░░░░░░░░      ░░░░░░░░░░░░
```

## 🎯 Category Selection

| Icon | Category | Use For |
|------|----------|---------|
| ❤️ | Health | Fitness, wellness, medical |
| 💰 | Wealth | Financial, saving, investing |
| 🧠 | Mind | Learning, reading, personal growth |
| 💼 | Work | Career, projects, skills |

## 🌟 Features Highlighted

### 1. Real-Time Updates
- Goals appear immediately after creation
- No page refresh needed
- Stats update automatically

### 2. Smart Progress Calculation
- Progress auto-calculated from completed sub-goals
- Example: 2 out of 5 sub-goals = 40% progress

### 3. Data Validation
- Goal name required
- At least one sub-goal required
- Deadline required
- All validated before submission

### 4. Error Handling
- Clear error messages
- Toast notifications
- Form stays open if errors occur
- User-friendly language

### 5. Mobile Responsive
- Works on phones, tablets, desktops
- Touch-friendly buttons
- Readable on all screen sizes
- Smooth animations

## 🔄 Full Goal Lifecycle

```
1. CREATE
   ↓
   [User fills form & creates goal]
   ↓
   Goal appears with 0% progress

2. TRACK
   ↓
   [User completes sub-goals]
   ↓
   Progress bar updates
   ↓
   Stats refresh

3. COMPLETE
   ↓
   [All sub-goals marked done]
   ↓
   "✓ Complete" badge appears
   ↓
   Achievement recorded

4. VIEW
   ↓
   [Goal stays in list for reference]
   ↓
   Can still view/uncheck sub-goals
   ↓
   Part of lifetime achievement tracking
```

## 💡 Pro Tips for Users

✨ **Break Goals Into Small Steps**
- Instead of "Get Fit", create sub-goals like:
  - Buy gym membership
  - Complete first workout
  - Exercise 3x/week for a month

✨ **Set Realistic Deadlines**
- Give yourself enough time
- Can update later if needed
- Use calendar to pick dates

✨ **Track Consistently**
- Check off sub-goals as completed
- See progress grow
- Stay motivated with visual feedback

✨ **Mix Categories**
- Balance health, wealth, mind, work
- Create holistic life improvement
- Track across all life areas

## 🎨 Design Elements

### Colors
- Primary Orange: `#ff7a00` (buttons, progress, accents)
- Hover Orange: `#ff9933` (interactive states)
- Success Green: `#10b981` (completion badges)
- Text Gray: `#111827` (main text)
- Border Gray: `#e5e7eb` (form inputs)

### Spacing
- Modal width: max 42rem (672px)
- Form gap: 1.5rem (24px)
- Input height: 3rem (48px)
- Button height: 3rem (48px)

### Animations
- Modal fade-in: 200ms
- Progress bar: 500ms ease-out
- Button hover: color transition 150ms
