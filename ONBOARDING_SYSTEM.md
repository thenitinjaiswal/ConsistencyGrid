# Perfect Onboarding System - Complete Documentation

## 🎯 Overview

ConsistencyGrid now features a **complete 4-step onboarding experience** designed to guide first-time users through setup while collecting essential information about their life and goals.

### Key Features
- ✅ **4-Step Multi-Step Flow** - Personalization → Habits → Theme → Welcome
- ✅ **Beautiful UI/UX** - Gradient backgrounds, smooth animations, responsive design
- ✅ **Form Validation** - Real-time feedback and error handling
- ✅ **Progress Tracking** - Visual progress bar showing completion status
- ✅ **Route Protection** - Middleware ensures non-onboarded users complete flow
- ✅ **Data Persistence** - All data saved to database with transactions
- ✅ **Mobile Responsive** - Perfect experience on all device sizes
- ✅ **Exit Prevention** - Warns users before leaving during onboarding

---

## 📋 Step-by-Step Breakdown

### Step 1: Personalization
**Purpose**: Collect foundational user information

**Fields**:
- Full Name (required, min 2 characters)
- Birth Date (required, date picker)
- Life Expectancy (slider, 40-120 years)

**Features**:
- Real-time age calculation
- Weeks lived calculation
- Total weeks calculation
- Remaining weeks calculation
- Visual stats preview

**Files**:
- Component: `src/components/onboarding/OnboardingPersonalize.js`

---

### Step 2: Habit Selection
**Purpose**: Let users select habits they want to track

**Features**:
- **6 Preset Habits**: Meditate, Gym, Read, Water, Walk, Journal
  - Each with emoji, description, and color
- **Custom Habits**: Users can add unlimited custom habits
- **Habit Tags**: Display selected habits with easy removal
- **Skip Option**: Users can skip if they prefer to add habits later
- **Validation**: At least 1 habit must be selected to proceed (unless skipped)

**Preset Habits**:
| Icon | Habit | Description |
|------|-------|-------------|
| 🧘 | Meditate | Focus your mind & breathe |
| 🏋️ | Gym | Build strength & stamina |
| 📖 | Read | Expand your knowledge |
| 💧 | Water | Stay hydrated all day |
| 🚶 | Walk | 10,000 steps daily movement |
| 📝 | Journal | Reflect on your daily progress |

**Files**:
- Component: `src/components/onboarding/OnboardingHabits.js`

---

### Step 3: Theme Selection
**Purpose**: Let users choose their wallpaper appearance

**Available Themes**:
1. **Dark Minimal** - Sleek, easy on eyes (🌙)
   - Dark background, minimal aesthetic
   - Best for AMOLED screens

2. **Orange Glow** - Modern brand experience (🧡)
   - Warm, energetic feel
   - Highlights consistency scores

3. **White Clean** - Maximum clarity (⚪)
   - Bright, minimal design
   - High contrast readability

**Features**:
- Visual preview of each theme
- Clear descriptions
- Easy selection with visual feedback
- Can be changed later in settings

**Files**:
- Component: `src/components/onboarding/OnboardingTheme.js`

---

### Step 4: Welcome & Review
**Purpose**: Final review and completion

**Displays**:
- User profile summary
- Life calendar stats
- Selected habits
- Chosen theme
- Next steps guide

**Features**:
- Complete summary of all choices
- Next steps instructions
- Final confirmation button
- Loading state during submission

**Files**:
- Component: `src/components/onboarding/OnboardingWelcome.js`

---

## 🏗️ Architecture

### File Structure
```
src/
├── app/
│   ├── onboarding/
│   │   ├── page.js                 # Main onboarding page
│   │   └── layout.js               # Onboarding layout
│   ├── api/onboarding/
│   │   ├── complete/route.js       # ✅ Existing API endpoint
│   │   └── status/route.js         # ✅ Existing status check
│   └── dashboard/
│       └── page.js                 # Updated with redirect guard
│
├── components/onboarding/
│   ├── OnboardingProgress.js       # Progress bar component
│   ├── OnboardingPersonalize.js    # Step 1 component
│   ├── OnboardingHabits.js         # Step 2 component
│   ├── OnboardingTheme.js          # Step 3 component
│   └── OnboardingWelcome.js        # Step 4 component
│
└── middleware.js                    # Route protection & redirects
```

### Data Flow
```
User Signs Up
    ↓
Redirect to /onboarding
    ↓
Step 1: Personalization (name, DOB, life expectancy)
    ↓
Step 2: Habit Selection (choose/create habits)
    ↓
Step 3: Theme Selection (pick wallpaper theme)
    ↓
Step 4: Review & Confirm
    ↓
POST /api/onboarding/complete
    ↓
Database Transaction:
  - Create/update user profile
  - Save wallpaper settings
  - Create habits
  - Mark onboarded = true
    ↓
Redirect to /dashboard
```

### Middleware Protection
- **Route Guard**: `src/middleware.js`
- **Protects**: Dashboard, generator, habits, goals, etc.
- **Logic**:
  - Unauthenticated → Redirect to `/login`
  - Authenticated but not onboarded → Redirect to `/onboarding`
  - Onboarded → Allow access to protected routes
  - Already onboarded accessing `/onboarding` → Redirect to `/dashboard`

---

## 🔄 User Flows

### First-Time User Flow
```
Landing Page (/home)
    ↓
Sign Up Page (/signup)
    ↓ (Create account)
Redirect to /onboarding
    ↓
Complete 4-step onboarding
    ↓
/api/onboarding/complete (POST)
    ↓
Redirect to /dashboard
    ↓
View wallpaper & track habits
```

### Already Onboarded User
```
Try to access /onboarding
    ↓ (via middleware)
Redirect to /dashboard
```

### Not Onboarded Accessing Protected Route
```
Try to access /dashboard
    ↓ (via middleware)
Redirect to /onboarding
```

---

## 📊 Database Integration

### User Model (Updated)
```prisma
model User {
  id          String   @id @default(cuid())
  name        String?
  email       String   @unique
  password    String?
  image       String?
  publicToken String   @unique
  onboarded   Boolean  @default(false)  // ← Tracks completion
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  settings   WallpaperSettings?
  habits     Habit[]
  habitLogs  HabitLog[]
  // ... more relations
}
```

### API Endpoint: `/api/onboarding/complete` (POST)

**Request Body**:
```json
{
  "name": "Alex Johnson",
  "dob": "1990-05-15",
  "lifeExpectancyYears": 85,
  "habits": ["Meditate", "Gym", "Read"],
  "theme": "orange-glow"
}
```

**Response**:
```json
{
  "ok": true
}
```

**Operations**:
1. Update user profile (name)
2. Upsert wallpaper settings (DOB, life expectancy, theme, defaults)
3. Create habits (only if user has no active habits)
4. Mark user as onboarded
5. All wrapped in transaction for data consistency

---

## 🎨 UI/UX Details

### Design System
- **Primary Color**: Orange (#ff9500)
- **Background**: Gradient from orange-50 to white
- **Decorative**: Blur circles in background for depth

### Components
- **Progress Bar**: Top sticky bar with percentage and visual progress
- **Form Cards**: White rounded containers with gradient headers
- **Buttons**: Gradient buttons with hover/active states
- **Input Fields**: Large, easy-to-tap with focus states
- **Animations**: Smooth transitions, scale effects on buttons

### Responsive Design
- Mobile-first approach
- Adapts for tablet and desktop
- Touch-friendly on all devices
- Proper spacing and padding

---

## 🛡️ Error Handling

### Validation Rules

**Step 1 (Personalization)**:
- Name: Required, minimum 2 characters
- DOB: Required, valid date
- Life Expectancy: Required, 40-120 years

**Step 2 (Habits)**:
- Must select at least 1 habit (or skip)
- Custom habits: minimum 2 characters

**Step 3 (Theme)**:
- Must select a valid theme

### Error Messages
- Real-time validation feedback
- Clear, user-friendly messages
- Toast notifications for API errors

---

## ✅ Testing Checklist

### User Journey
- [ ] Sign up creates account and redirects to onboarding
- [ ] Can navigate forward through all 4 steps
- [ ] Can navigate backward using "Back" button
- [ ] Cannot skip Steps 1, 3, 4
- [ ] Can skip Step 2 (habits)
- [ ] Form validation works correctly
- [ ] Progress bar updates as expected
- [ ] Summary on Step 4 displays correct info
- [ ] Completion saves data to database
- [ ] Redirect to dashboard after completion

### Route Protection
- [ ] Unauthenticated user accessing /dashboard redirects to /login
- [ ] User accessing /dashboard before onboarding goes to /onboarding
- [ ] Onboarded user can freely access dashboard
- [ ] Already onboarded user accessing /onboarding redirects to /dashboard

### Data Persistence
- [ ] User data saved correctly to database
- [ ] Habits created in database
- [ ] Wallpaper settings saved with correct values
- [ ] Onboarded flag set to true

### Mobile Experience
- [ ] Responsive on mobile (< 640px)
- [ ] Touch-friendly buttons
- [ ] Form inputs work well on mobile keyboard
- [ ] Progress bar visible on all screen sizes

---

## 🚀 Future Enhancements

### Possible Improvements
1. **Habit Icons/Emojis** - Let users pick habit icons
2. **Habit Scheduling** - Set times for habit reminders
3. **Goal Setting** - Connect to goals system during onboarding
4. **Preferences** - Notification settings, language selection
5. **Mobile App Integration** - Deep linking from mobile app
6. **Social Onboarding** - Invite friends feature
7. **Onboarding Analytics** - Track completion rates, drop-off points
8. **Personalized Recommendations** - Suggest habits based on profile
9. **Celebration** - Confetti animation on completion
10. **Skip Option** - Allow skipping entire onboarding with warnings

---

## 📞 API Reference

### GET `/api/onboarding/status`
Check if user is onboarded.

**Response**:
```json
{
  "onboarded": true,
  "name": "Alex Johnson",
  "settings": {
    "dob": "1990-05-15T00:00:00Z",
    "lifeExpectancyYears": 85,
    "theme": "orange-glow"
  }
}
```

### POST `/api/onboarding/complete`
Complete onboarding with user data.

**Request**:
```json
{
  "name": "Alex Johnson",
  "dob": "1990-05-15",
  "lifeExpectancyYears": 85,
  "habits": ["Meditate", "Gym"],
  "theme": "orange-glow"
}
```

**Success Response**:
```json
{
  "ok": true
}
```

**Error Response**:
```json
{
  "message": "Error description"
}
```

---

## 🎓 Key Implementation Details

### Progress Prevention
```javascript
// Prevents users from accidentally leaving during onboarding
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (step < TOTAL_STEPS) {
      e.preventDefault();
      e.returnValue = "";
    }
  };
  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [step]);
```

### Form State Management
```javascript
const [formData, setFormData] = useState({
  name: "",
  dob: "",
  lifeExpectancyYears: 85,
  habits: [],
  theme: "dark-minimal",
});

const updateFormData = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};
```

### Database Transaction
```javascript
await prisma.$transaction(async (tx) => {
  // Multiple operations guaranteed to succeed or all fail together
  await tx.user.update(...);
  await tx.wallpaperSettings.upsert(...);
  await tx.habit.createMany(...);
  await tx.user.update({ data: { onboarded: true } });
});
```

---

## 📝 Notes

- All components are **"use client"** for client-side interactivity
- Styling uses **Tailwind CSS** for consistency
- Uses **react-hot-toast** for notifications
- Uses **next-auth** for session management
- Form data is validated on both client and server
- Database operations use **Prisma ORM**

---

**Last Updated**: January 21, 2026
**Status**: ✅ Complete and Ready for Production
