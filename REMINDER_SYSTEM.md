# 🔔 Intelligent Reminder System - Complete Guide

## 🎯 Overview

The **Intelligent Reminder System** transforms ConsistencyGrid from a passive tracker into an active **visual memory system**. Unlike traditional reminders that just send notifications, these reminders **live on your timeline** — visible on month, year, and life grids.

---

## ✨ Core Philosophy

> **"Reminders that don't just notify you — they live on your timeline."**

This system is:
- 📅 **A visual memory system** - See important moments at a glance
- ⏰ **A time-awareness layer** - Understand your commitments over time
- 🎨 **A living timeline** - Your grid becomes an active reminder interface

---

## 🚀 Key Features

### 1️⃣ Flexible Reminder Duration

Create reminders with precise control over time:

- **Full-day reminders** - Active for the entire day
- **Custom time ranges** - Specific hours or minutes (e.g., 9:00 AM - 5:00 PM)
- **Single-day reminders** - For one specific date
- **Multi-day reminders** - Span across multiple days/weeks

**Example Use Cases:**
- Birthday (full-day, single-day)
- Conference (full-day, multi-day)
- Meeting (time-range, single-day)
- Vacation (full-day, multi-day)

### 2️⃣ Grid-Level Visual Presence

Reminders appear directly on your grids:

- **Month View** - See all reminders for the current month
- **Year View** - (Future) Overview of the entire year
- **Life Grid** - (Future) Long-term timeline visualization

**Visual Indicators:**
- Colored markers on specific dates
- Important day stars (⭐)
- Custom icons/emojis
- Hover tooltips with details

### 3️⃣ "Important Day" Marker

Mark special days that need extra attention:

- ⭐ **Visual star indicator** on the grid
- **Higher priority** in lists and views
- **Stands out** from regular reminders
- Perfect for birthdays, deadlines, events

### 4️⃣ Smart Notification Behavior

Notifications adapt to reminder type:

- **Full-day reminders** - Stay active throughout the day
- **Time-range reminders** - Trigger only during selected window
- **Multi-day reminders** - Optional daily notifications
- **Start notifications** - Alert when reminder period begins

### 5️⃣ Visual Customization

Make each reminder unique and recognizable:

**Marker Types:**
- ● **Dot** - Simple, minimal
- ○ **Border** - Outlined circle
- ■ **Fill** - Solid square
- ◆ **Badge** - Diamond shape

**Colors:**
- 8 preset colors (Orange, Red, Amber, Green, Blue, Purple, Pink, Indigo)
- Custom color picker for unlimited options

**Icons:**
- 10 common emojis (🎯, 🎉, 📅, ⭐, 🔥, 💼, 🎓, ✈️, 🎂, 💡)
- Custom emoji input

**Priority Levels:**
1. **Low** (Gray) - Nice to remember
2. **Medium** (Blue) - Should remember
3. **High** (Amber) - Must remember
4. **Critical** (Red) - Cannot miss

### 6️⃣ Year & Life-View Compatibility

The system works across all time scales:

- **Monthly grids** ✅ (Implemented)
- **Yearly overview** 🔜 (Coming soon)
- **Life grids** 🔜 (Coming soon)

This allows you to:
- See important moments in big-picture timelines
- Identify patterns of commitments over time
- Plan long-term with visual awareness

---

## 📊 Database Schema

### Reminder Model

```prisma
model Reminder {
  id     String @id @default(cuid())
  userId String

  // Basic Info
  title       String
  description String?

  // Flexible Duration Support
  startDate DateTime
  endDate   DateTime
  startTime String?
  endTime   String?
  isFullDay Boolean @default(true)

  // Visual Presence on Grid
  markerType  String @default("dot")
  markerColor String @default("#ff7a00")
  markerIcon  String?

  // Priority & Importance
  priority    Int     @default(1)
  isImportant Boolean @default(false)

  // Notification Behavior
  enableNotifications Boolean @default(true)
  notifyOnStart       Boolean @default(true)
  notifyDaily         Boolean @default(false)

  // Recurrence (future feature)
  isRecurring    Boolean @default(false)
  recurrenceRule String?

  // Metadata
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, startDate])
  @@index([userId, endDate])
}
```

---

## 🛠️ API Endpoints

### GET /api/reminders
Fetch all reminders for the authenticated user.

**Query Parameters:**
- `startDate` - Filter reminders starting from this date
- `endDate` - Filter reminders ending before this date
- `active` - Filter by active status (true/false)

**Response:**
```json
{
  "reminders": [
    {
      "id": "...",
      "title": "Team Meeting",
      "startDate": "2026-01-20T00:00:00.000Z",
      "endDate": "2026-01-20T00:00:00.000Z",
      "isFullDay": false,
      "startTime": "14:00",
      "endTime": "15:00",
      "markerColor": "#3b82f6",
      "markerIcon": "💼",
      "priority": 2,
      "isImportant": false
    }
  ]
}
```

### POST /api/reminders
Create a new reminder.

**Request Body:**
```json
{
  "title": "Birthday Party",
  "description": "John's 30th birthday",
  "startDate": "2026-02-15",
  "endDate": "2026-02-15",
  "isFullDay": true,
  "markerType": "fill",
  "markerColor": "#ec4899",
  "markerIcon": "🎂",
  "priority": 3,
  "isImportant": true,
  "enableNotifications": true,
  "notifyOnStart": true
}
```

### GET /api/reminders/[id]
Fetch a specific reminder by ID.

### PATCH /api/reminders/[id]
Update a specific reminder.

### DELETE /api/reminders/[id]
Delete a specific reminder.

### GET /api/reminders/range
Fetch reminders within a date range (optimized for grid views).

**Query Parameters:**
- `start` - Start date (YYYY-MM-DD)
- `end` - End date (YYYY-MM-DD)

**Response:**
```json
{
  "reminders": [...],
  "remindersByDate": {
    "2026-01-20": [
      { "id": "...", "title": "Meeting", ... }
    ],
    "2026-01-21": [...]
  },
  "count": 5
}
```

---

## 🎨 UI Components

### 1. ReminderModal
**Location:** `src/components/reminders/ReminderModal.js`

Comprehensive modal for creating and editing reminders with:
- Title and description inputs
- Date and time pickers
- Multi-day toggle
- All-day toggle
- Visual customization (marker type, color, icon)
- Priority selection
- Important day checkbox
- Notification settings

### 2. ReminderList
**Location:** `src/components/reminders/ReminderList.js`

Beautiful list view of reminders with:
- Grouped by date
- Visual indicators (color, icon, marker)
- Priority badges
- Time information
- Edit/delete actions
- Today and past highlighting

### 3. CalendarGrid
**Location:** `src/components/reminders/CalendarGrid.js`

Monthly calendar grid showing:
- 7x5 grid layout
- Visual markers on dates with reminders
- Important day stars
- Hover tooltips with reminder details
- Today highlighting
- Past/future differentiation
- Click to create/view reminders

---

## 📱 Pages

### Reminders Page
**URL:** `/reminders`
**Location:** `src/app/reminders/page.js`

Main reminder management page with:
- Stats cards (Upcoming, Important, Past)
- Filter tabs (Upcoming, Past, All)
- Reminder list
- Create new reminder button
- Info card about grid integration

### Calendar Page
**URL:** `/calendar`
**Location:** `src/app/calendar/page.js`

Visual calendar view with:
- Month navigation
- Calendar grid with reminders
- Upcoming reminders sidebar
- Monthly stats
- Quick add button
- Click dates to create reminders

---

## 🎯 Usage Examples

### Example 1: Birthday Reminder
```javascript
{
  title: "Mom's Birthday",
  description: "Don't forget to call!",
  startDate: "2026-03-15",
  endDate: "2026-03-15",
  isFullDay: true,
  markerType: "fill",
  markerColor: "#ec4899",
  markerIcon: "🎂",
  priority: 4,
  isImportant: true,
  enableNotifications: true,
  notifyOnStart: true
}
```

### Example 2: Multi-Day Conference
```javascript
{
  title: "Tech Conference 2026",
  description: "Annual developer conference",
  startDate: "2026-04-10",
  endDate: "2026-04-12",
  isFullDay: true,
  markerType: "badge",
  markerColor: "#8b5cf6",
  markerIcon: "🎓",
  priority: 3,
  isImportant: false,
  enableNotifications: true,
  notifyOnStart: true,
  notifyDaily: true
}
```

### Example 3: Time-Specific Meeting
```javascript
{
  title: "Client Meeting",
  description: "Q1 Review with stakeholders",
  startDate: "2026-01-25",
  endDate: "2026-01-25",
  isFullDay: false,
  startTime: "14:00",
  endTime: "15:30",
  markerType: "dot",
  markerColor: "#3b82f6",
  markerIcon: "💼",
  priority: 2,
  isImportant: false,
  enableNotifications: true,
  notifyOnStart: true
}
```

---

## 🔮 Future Enhancements

### Planned Features:
1. **Recurring Reminders** - Daily, weekly, monthly patterns
2. **Year Grid Integration** - See reminders on yearly overview
3. **Life Grid Integration** - Long-term timeline visualization
4. **Browser Notifications** - Real-time alerts
5. **Reminder Categories** - Group by type (work, personal, etc.)
6. **Shared Reminders** - Collaborate with others
7. **Import/Export** - Sync with external calendars
8. **Smart Suggestions** - AI-powered reminder recommendations

---

## 🎊 Summary

The Intelligent Reminder System transforms ConsistencyGrid into a **visual memory system** where:

✅ Reminders are **visible on the grid**, not hidden in lists  
✅ Important days **stand out** at a glance  
✅ Time awareness is **continuous**, not just one-time alerts  
✅ Your timeline becomes a **living reminder interface**  

**One-Line Pitch:**
> "Reminders that don't just notify you — they live on your timeline."

---

## 📚 Related Documentation

- [FEATURE_OVERVIEW.md](./FEATURE_OVERVIEW.md) - Complete app features
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development guide
- [Database Schema](./prisma/schema.prisma) - Prisma schema

---

**Built with ❤️ for ConsistencyGrid**
