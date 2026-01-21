# Goals System - Technical Implementation

## 📁 File Structure

```
src/
├── app/
│   ├── goals/
│   │   ├── page.js              [Main goals page with goal display]
│   │   └── layout.js            [Goals layout wrapper]
│   └── api/
│       ├── goals/
│       │   └── route.js         [GET/POST goals API]
│       └── subgoals/
│           └── [id]/
│               └── route.js     [PATCH subgoal completion]
└── components/
    └── goals/
        └── AddGoalModal.js      [Goal creation modal]

prisma/
└── schema.prisma               [Database schema with Goal & SubGoal models]
```

## 🗄️ Database Schema

### Goal Model
```prisma
model Goal {
  id              String    @id @default(cuid())
  userId          String
  title           String              # Goal name
  category        String    @default("General")  # Health, Wealth, Mind, Work
  description     String?             # Optional description
  progress        Int       @default(0)  # 0-100, calculated from subgoals
  targetDeadline  DateTime?           # When the goal should be completed
  isCompleted     Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  subGoals        SubGoal[]
}

model SubGoal {
  id          String   @id @default(cuid())
  goalId      String
  title       String              # Sub-goal/milestone name
  isCompleted Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  goal        Goal     @relation(fields: [goalId], references: [id], onDelete: Cascade)
}
```

## 🔌 API Endpoints

### GET /api/goals
**Purpose:** Fetch all user's goals with their sub-goals
**Auth:** Required (NextAuth session)
**Response:**
```json
[
  {
    "id": "goal_123",
    "title": "Train for Marathon",
    "category": "Health",
    "description": "Complete London Marathon",
    "progress": 40,
    "targetDeadline": "2026-10-15",
    "isCompleted": false,
    "subGoals": [
      {
        "id": "sg_1",
        "title": "Buy running shoes",
        "isCompleted": true
      }
    ]
  }
]
```

### POST /api/goals
**Purpose:** Create a new goal with sub-goals
**Auth:** Required
**Request Body:**
```json
{
  "title": "Learn React",
  "category": "Mind",
  "description": "Master React and Next.js",
  "targetDeadline": "2026-12-31",
  "subGoals": [
    { "title": "Complete React course", "isCompleted": false },
    { "title": "Build project", "isCompleted": false }
  ]
}
```
**Response:** Full goal object with created sub-goals

### PATCH /api/subgoals/[id]
**Purpose:** Toggle sub-goal completion status
**Auth:** Required
**Request Body:**
```json
{
  "isCompleted": true
}
```

## 🎯 Key Components

### AddGoalModal Component
**Location:** `src/components/goals/AddGoalModal.js`
**Props:**
- `isOpen` (boolean) - Control modal visibility
- `onClose` (function) - Called when modal closes
- `onAdd` (function) - Called when goal is created

**State Management:**
```javascript
{
  title: "",                    // Goal name
  category: "health",           // Selected category
  targetDeadline: "",          // Date string (YYYY-MM-DD)
  description: "",             // Optional
  subGoals: [                  // Array of sub-goals
    { id: 1, title: "" }
  ]
}
```

**Validation:**
- Title: Required, min 2 chars
- Category: Must be selected
- Deadline: Required date
- Sub-goals: Min 1, all filled ones submitted

### GoalCard Component
**Location:** `src/app/goals/page.js`
**Props:**
- `goal` (object) - Goal data
- `onToggleSubGoal` (function) - Sub-goal completion handler
- `onDelete` (function) - Delete handler

**Features:**
- Category badge with color coding
- Progress bar with percentage
- Expandable sub-goals list (shows 2, "+n more" option)
- Sub-goal toggle with optimistic updates

## 🔄 Data Flow

### Creating a Goal
```
1. User fills form in AddGoalModal
   ↓
2. Form validation (client-side)
   ↓
3. POST /api/goals with goal + subGoals data
   ↓
4. Server validates and creates in DB
   ↓
5. Response: Full goal object
   ↓
6. Component updates state
   ↓
7. Goals list re-renders with new goal at top
   ↓
8. Toast success message
   ↓
9. Modal closes, form resets
```

### Toggling Sub-Goal
```
1. User clicks checkbox on sub-goal
   ↓
2. Optimistic UI update (immediately shows checked)
   ↓
3. PATCH /api/subgoals/[id] with isCompleted status
   ↓
4. Server updates database
   ↓
5. Progress % recalculated
   ↓
6. If server fails, revert UI
   ↓
7. Sub-goal count & progress bar update
```

## 🛡️ Security & Validation

### Server-Side
✓ NextAuth session validation
✓ User ID verification for data isolation
✓ Input sanitization
✓ Required field validation
✓ Error handling with proper status codes

### Client-Side
✓ Form validation before submission
✓ Toast error messages
✓ Disabled state during submission
✓ Prevent double-submit with loading flag

## 📊 Progress Calculation

```javascript
const completed = subGoals.filter(sg => sg.isCompleted).length;
const progress = Math.round((completed / subGoals.length) * 100);
```

Example:
- 0 of 5 completed = 0%
- 1 of 5 completed = 20%
- 2 of 5 completed = 40%
- 5 of 5 completed = 100%

## 🎨 Styling Approach

Uses **Tailwind CSS** classes:
- `bg-orange-500` - Primary button
- `border-gray-200` - Input borders
- `text-gray-900` - Main text
- `rounded-lg` - Border radius
- `shadow-sm` - Subtle shadows

### Responsive Breakpoints
- `sm:` - 640px (small screens)
- `md:` - 768px (tablets)
- `lg:` - 1024px (desktops)

## 🔗 Navigation

- **From Dashboard:** "Goals" link in sidebar
- **From Goals Page:** "Add Goal" button (top-right)
- **From Modal:** "Create Goal" or "Cancel" buttons

## 📦 Dependencies

```json
{
  "next": "16.1.1",
  "react": "^18+",
  "next-auth": "^4+",
  "@prisma/client": "latest",
  "lucide-react": "latest",
  "react-hot-toast": "latest"
}
```

## 🚀 Performance Optimizations

✓ **Database Queries:**
- Single query includes sub-goals
- `orderBy` ensures consistent ordering
- Indexed by userId for fast lookups

✓ **Component Rendering:**
- Sub-goals list: Shows 2, "show more" collapses rest
- Memoization candidates: GoalCard, MilestoneItem

✓ **API Calls:**
- Optimistic UI updates
- Batch goal + sub-goals creation in single transaction

## 🧪 Testing Considerations

### Test Cases
1. Create goal with 1 sub-goal
2. Create goal with 5+ sub-goals
3. Toggle sub-goal completion
4. Form validation (missing fields)
5. API error handling
6. Delete goal
7. Duplicate goal names (should be allowed)
8. Mobile responsive layout

### Demo Data
File: `src/app/goals/page.js` (lines ~200-220)
- 2 demo goals pre-loaded
- Each has 3 sample sub-goals
- Used when no real data exists

## 🐛 Common Issues & Solutions

### Issue: Modal doesn't open
**Solution:** Check `isModalOpen` state in parent component

### Issue: Sub-goals don't save
**Solution:** Ensure all sub-goals have `title` filled

### Issue: Progress doesn't update
**Solution:** Check `PATCH /api/subgoals/[id]` endpoint

### Issue: Mobile layout broken
**Solution:** Verify Tailwind responsive classes (sm:, md:, lg:)

## 📝 Future Enhancements

- [ ] Edit existing goals
- [ ] Delete goals with confirmation
- [ ] Archive completed goals
- [ ] Goal sharing with other users
- [ ] Goal recurring/templates
- [ ] Goal reminders
- [ ] Goal analytics & insights
- [ ] Goal categories with custom colors
- [ ] Goal tags/filtering
- [ ] Goal history/activity log
