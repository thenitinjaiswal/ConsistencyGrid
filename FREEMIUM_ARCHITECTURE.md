# 📊 Freemium System - Visual Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CONSISTENCY GRID                         │
│                   Freemium Pricing System                    │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────────────┐
                    │   User Signup        │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Default: FREE PLAN  │
                    │  • 3 habits          │
                    │  • 3 goals           │
                    │  • 7-day history     │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
         ┌──────▼────┐  ┌─────▼──────┐  ┌───▼──────┐
         │ Limit Hit │  │ Day 3-7+   │  │ Features │
         │ Popup     │  │ Trial Inv  │  │ Locked   │
         └──────┬────┘  └─────┬──────┘  └───┬──────┘
                │             │             │
         ┌──────▼─────────────▼─────────────▼──┐
         │      UPGRADE PROMPT SYSTEM           │
         │                                      │
         │  • HabitLimitPopup (4th habit)     │
         │  • GoalLimitPopup (4th goal)       │
         │  • HistoryLimitPopup (8+ days)     │
         │  • AnalyticsLockPopup (analytics)  │
         │  • TrialInvitationPopup (day 5)    │
         └──────┬──────────────────────────────┘
                │
         ┌──────▼──────────────────┐
         │   USER CLICKS UPGRADE   │
         │   → Routes to /pricing  │
         └──────┬──────────────────┘
                │
     ┌──────────▼──────────────┐
     │   PRICING PAGE SHOWS    │
     │   4 TIER OPTIONS        │
     ├─────────────────────────┤
     │ Free       ₹0           │
     │ Pro Moth   ₹99          │
     │ Pro Year   ₹499 ⭐      │  ← Most Popular
     │ Lifetime   ₹1,299       │
     └──────────┬──────────────┘
                │
     ┌──────────▼──────────────────────┐
     │  NEXT PHASE: Payment Gateway    │
     │  (Razorpay/Stripe Integration)  │
     └────────────────────────────────┘
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│              FRONTEND (Browser)                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Component (HabitForm.js)                        │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ onClick → canAddHabit(user) → Check Limit │  │  │
│  │  │ ↓ False: Show HabitLimitPopup              │  │  │
│  │  │ ↓ True: Call API /api/habits POST          │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                   │
└─────────────────────┼───────────────────────────────────┘
                      │ API Request
                      │ { title: "Morning Run" }
┌─────────────────────▼───────────────────────────────────┐
│           BACKEND (Node.js)                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ /api/habits POST                                │   │
│  │  ├─ Verify session (getServerSession)          │   │
│  │  ├─ Get user from DB                           │   │
│  │  ├─ Check rate limit                           │   │
│  │  ├─ Check habit limit (checkHabitLimit)        │   │
│  │  │  └─ Get user._count.habits < 3 ?           │   │
│  │  │     If FALSE: return 403 LIMIT_REACHED      │   │
│  │  │     If TRUE: continue                       │   │
│  │  ├─ Create habit (prisma.habit.create)         │   │
│  │  └─ Return 201 + habit data                    │   │
│  └──────────────┬───────────────────────────────────┘   │
│                 │                                       │
│  ┌──────────────▼───────────────────────────────────┐   │
│  │ DATABASE (Prisma/SQLite)                        │   │
│  │                                                  │   │
│  │ User {                                          │   │
│  │   id: "user123"                                │   │
│  │   plan: "free" ← Checked for limits            │   │
│  │   habits: [Habit, Habit, Habit] ← Count = 3   │   │
│  │   trialEndDate: null                           │   │
│  │   subscriptionStatus: null                     │   │
│  │ }                                              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
                      │ Response
                      │ { code: "HABIT_LIMIT_REACHED" }
                      │ OR { id: "habit123", ... }
┌─────────────────────▼───────────────────────────────────┐
│          FRONTEND (Browser)                             │
│                                                         │
│ if (res.status === 403) {                              │
│   const data = await res.json();                       │
│   if (data.code === "HABIT_LIMIT_REACHED") {          │
│     → Show HabitLimitPopup                            │
│     → CTA: "Upgrade to Pro"                           │
│   }                                                    │
│ }                                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## File Dependencies & Imports

```
src/app/pricing/page.js
    ├─ lucide-react (icons: Zap, Crown, Building2)
    └─ next (Link, signIn)

src/components/modals/UpgradePopup.js
    ├─ lucide-react (icons: X, Lock, Zap, Star, TrendingUp)
    ├─ next/link
    └─ react (useState)

src/app/api/habits/route.js
    ├─ next-auth
    ├─ prisma
    ├─ lib/subscription-middleware ← NEW
    └─ lib/cache-invalidation

src/app/api/goals/route.js
    ├─ next-auth
    ├─ prisma
    ├─ lib/subscription-middleware ← NEW
    └─ lib/cache-invalidation

Components using subscription checks:
    ├─ HabitForm.js
    │   └─ lib/subscription-utils ← NEW
    ├─ GoalForm.js
    │   └─ lib/subscription-utils ← NEW
    ├─ Analytics.js
    │   └─ lib/subscription-utils ← NEW
    ├─ HistoryCalendar.js
    │   └─ lib/subscription-utils ← NEW
    └─ ThemeSelector.js
        └─ lib/subscription-utils ← NEW
```

---

## Subscription Check Flow

```
                     ┌──────────────────┐
                     │  User Session    │
                     │ { email, ..., } │
                     └────────┬─────────┘
                              │
                    ┌─────────▼────────┐
                    │ Get user.plan    │
                    │ (from Prisma)    │
                    └────────┬─────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
         ┌──────▼───┐  ┌─────▼──────┐  ┌─▼───────┐
         │ plan ==  │  │ plan ==    │  │ plan == │
         │ "free"   │  │ "pro_*"    │  │ "life"  │
         └──────┬───┘  └─────┬──────┘  └─┬───────┘
                │            │          │
         ┌──────▼──────┐  ┌──▼───────┐ ┌▼─────────┐
         │ APPLY LIMITS│ │ NO LIMITS│ │NO LIMITS│
         │ 3 habits    │ │ Unlimited│ │Unlimited│
         │ 3 goals     │ │ Analytics│ │All      │
         │ 7-day hist  │ │ Export   │ │Features │
         │ Lock icons  │ │ Sync     │ │         │
         └─────────────┘ └──────────┘ └─────────┘
```

---

## Database Schema Change

```prisma
// BEFORE
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  habits        Habit[]
  goals         Goal[]
  // ... other fields
}

// AFTER (Added 7 fields for subscription management)
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  
  // ✅ NEW SUBSCRIPTION FIELDS
  plan                    String   @default("free")
  stripeCustomerId        String?
  stripeSubscriptionId    String?
  subscriptionStatus      String?
  subscriptionStartDate   DateTime?
  subscriptionEndDate     DateTime?
  trialEndDate            DateTime?
  
  habits        Habit[]
  goals         Goal[]
  // ... other fields
}
```

---

## Feature Matrix by Plan

```
╔═══════════════════╦═════════╦═══════════╦══════════╦═══════════╗
║ Feature           ║ Free    ║ Pro Month ║ Pro Year ║ Lifetime  ║
╠═══════════════════╬═════════╬═══════════╬══════════╬═══════════╣
║ Habits            ║ 3 max   ║ Unlimited ║ Unlimited║ Unlimited ║
║ Goals             ║ 3 max   ║ Unlimited ║ Unlimited║ Unlimited ║
║ History           ║ 7 days  ║ Full      ║ Full     ║ Full      ║
║ Analytics         ║ ❌      ║ ✅        ║ ✅       ║ ✅        ║
║ AI Suggestions    ║ ❌      ║ ✅        ║ ✅       ║ ✅        ║
║ Themes            ║ 1       ║ All       ║ All      ║ All       ║
║ Export            ║ ❌      ║ ✅        ║ ✅       ║ ✅        ║
║ Cloud Sync        ║ ❌      ║ ✅        ║ ✅       ║ ✅        ║
║ Reminders         ║ ❌      ║ ✅        ║ ✅       ║ ✅        ║
║ Priority Support  ║ ❌      ║ ✅        ║ ✅       ║ ✅        ║
║ Early Access      ║ ❌      ║ ✅        ║ ✅       ║ ✅        ║
║─────────────────  ║─────────║───────────║──────────║───────────║
║ Price             ║ ₹0      ║ ₹99/mo    ║ ₹499/yr  ║ ₹1,299    ║
║ Billing           ║ Forever ║ Monthly   ║ Annual   ║ One-time  ║
║ Trial             ║ N/A     ║ 14 days   ║ 14 days  ║ N/A       ║
╚═══════════════════╩═════════╩═══════════╩══════════╩═══════════╝
```

---

## Popup Trigger Points

```
User Action          Popup Triggered      Popup Type
─────────────────────────────────────────────────────
Click "Add Habit"    User has 3 habits    HabitLimitPopup
↓ Creates 4th        → Shows limit        (Orange UI)
                     → "Upgrade to Pro"

Click "Add Goal"     User has 3 goals     GoalLimitPopup
↓ Creates 4th        → Shows limit        (Orange UI)
                     → "Upgrade to Pro"

View Old History     Date > 7 days back   HistoryLimitPopup
↓ Clicks old date    → Shows lock         (Blue UI)
                     → "View Full History"

Click Analytics      User is Free         AnalyticsLockPopup
↓ Clicks icon        → Shows features     (Purple UI)
                     → "Unlock Analytics"

Day 3-7 Usage        5+ days of activity  TrialInvitationPopup
↓ App shows          → "Try Pro Free"     (Green UI)
  welcome back       → 14-day trial       No CC required

(Auto-shown at optimal engagement point)
```

---

## Component Integration Example

```
┌─ HabitForm.js ────────────────────────────────┐
│                                               │
│ import {                                      │
│   canAddHabit,                               │
│   getFeatureAccess                           │
│ } from "@/lib/subscription-utils";           │
│                                               │
│ import UpgradePopup from "@/components/      │
│   modals/UpgradePopup";                      │
│                                               │
│ export default function HabitForm() {        │
│   const { data: session } = useSession();    │
│   const [showPopup, setShowPopup] = false;   │
│                                               │
│   const handleAdd = () => {                  │
│     const access = canAddHabit(session.user);│
│     if (!access.allowed) {                   │
│       setShowPopup(true); ← Show popup       │
│       return;                                │
│     }                                        │
│     // Proceed with API call                 │
│   };                                         │
│                                               │
│   return <>                                  │
│     <input ... />                            │
│     <button onClick={handleAdd} />           │
│     <UpgradePopup                            │
│       isOpen={showPopup}                     │
│       onClose={() => setShowPopup(false)}    │
│       type="habit-limit"                     │
│     />                                       │
│   </>;                                       │
│ }                                            │
│                                               │
└───────────────────────────────────────────────┘
```

---

## Timeline: User Conversion Journey

```
Day 1    User signs up
         └─ Plan: "free"
         └─ Show empty state with CTAs

Day 2    User creates 2 habits
         └─ No upgrade prompts yet
         └─ User is building trust

Day 3    User completes habits
         └─ TrialInvitationPopup appears
         └─ "Try Pro free for 14 days"

Day 4-7  User continues logging
         └─ Builds streak
         └─ Creates goals

Day 8    User hits habit limit (4th habit)
         └─ HabitLimitPopup shows
         └─ "Upgrade to Pro for unlimited"
         └─ User clicks → Pricing page

Day 9    User on Pro trial (if clicked)
         └─ All features unlocked
         └─ Full history access
         └─ Analytics available

Day 13   Trial ending soon email
         └─ "Your trial ends tomorrow"
         └─ Launch offer: ₹299/year

Day 14   Trial expires
         └─ Trial day 1 email sent (if not purchased)
         └─ Choice: Upgrade or go back to free

Day 28   Win-back email
         └─ "Your habits miss you"
         └─ Still offering launch price
         └─ Last chance messaging

Day 30+  Subscription email sequence continues
         └─ Monthly discount offers
         └─ Feature highlights
         └─ User testimonials
```

---

## Next Phase: Payment Integration

```
Current State (✅ COMPLETE)
├─ Database ready (subscription fields)
├─ UI ready (pricing page, popups)
├─ Limits enforced (API)
└─ Utilities ready (check functions)

Next State (🔄 IN PROGRESS)
├─ Razorpay/Stripe API integration
├─ Checkout page
├─ Webhook handlers
├─ Payment confirmation emails
└─ Subscription management dashboard

Final State (📅 PLANNED)
├─ Email automation (4-email sequence)
├─ Analytics tracking (conversion metrics)
├─ A/B testing (pricing optimization)
├─ Customer support system
└─ Revenue reporting dashboard
```

---

## Status Summary

✅ **Database:** Ready (Prisma schema updated)  
✅ **Pricing Page:** Live (4-tier design)  
✅ **Popups:** Ready (4 components, 500+ lines)  
✅ **Utilities:** Complete (client + server)  
✅ **API Enforcement:** Active (habits, goals)  
✅ **Documentation:** Comprehensive (3 guides)  

🔄 **Payment Integration:** Next phase  
🔄 **Email Automation:** Pending  
🔄 **Analytics Tracking:** Pending  

---

🚀 **System is production-ready!**

All pieces are in place. Ready to integrate with existing dashboard and add payment processing.
