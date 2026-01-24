# 🚀 Freemium System - Developer Quick Reference

## Files at a Glance

### Created
- ✅ `src/components/modals/UpgradePopup.js` - 4 popup components
- ✅ `src/lib/subscription-utils.js` - Client-side checks
- ✅ `src/lib/subscription-middleware.js` - API-level validation

### Updated
- ✅ `src/app/pricing/page.js` - 4-tier pricing page
- ✅ `src/app/api/habits/route.js` - Habit limit check
- ✅ `src/app/api/goals/route.js` - Goal limit check
- ✅ `prisma/schema.prisma` - Subscription fields

### Documentation
- ✅ `FREEMIUM_IMPLEMENTATION_COMPLETE.md` - Full guide
- ✅ `FREEMIUM_FRONTEND_INTEGRATION_GUIDE.md` - Component examples
- ✅ `FREEMIUM_SUMMARY.md` - Executive overview

---

## Import Paths (Copy-Paste Ready)

### Popups
```jsx
import UpgradePopup from "@/components/modals/UpgradePopup";
// Usage: <UpgradePopup isOpen={bool} onClose={fn} type="habit-limit" />
```

### Utilities
```jsx
import {
  canAddHabit,
  canAddGoal,
  canViewHistory,
  canAccessAnalytics,
  getFeatureAccess,
} from "@/lib/subscription-utils";
```

### API Middleware
```javascript
import {
  checkHabitLimit,
  checkGoalLimit,
  checkFeatureAccess,
  isSubscriptionActive,
} from "@/lib/subscription-middleware";
```

---

## Common Patterns

### Check Before Action
```jsx
const access = canAddHabit(session?.user);
if (access.limit !== null && access.currentCount >= access.limit) {
  setShowUpgradePopup(true);
  return; // Don't proceed
}
```

### Show Lock Icon
```jsx
{!canAccessAnalytics(user).allowed && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
    <Lock className="w-8 h-8 text-orange-500" />
  </div>
)}
```

### Handle API Error
```javascript
const res = await fetch("/api/habits", { method: "POST", ... });
if (res.status === 403) {
  const data = await res.json();
  if (data.code === "HABIT_LIMIT_REACHED") {
    // Show popup
  }
}
```

---

## Feature Limits by Plan

| Feature | Free | Pro | Enforcement |
|---------|------|-----|-------------|
| Habits | 3 | ∞ | API + Popup |
| Goals | 3 | ∞ | API + Popup |
| History | 7 days | All | Popup |
| Analytics | ❌ | ✅ | Lock icon |
| Export | ❌ | ✅ | Lock icon |
| Themes | 1 | All | Lock icon |

---

## Pricing Tiers

```
Free:          ₹0/forever
Pro Monthly:   ₹99/month
Pro Yearly:    ₹499/year ⭐ (Most Popular)
Lifetime:      ₹1,299 (one-time)

Launch Offer:  ₹299/year (first 1000 users)
```

---

## Popup Types

```jsx
type="habit-limit"      // Add 4th habit
type="goal-limit"       // Add 4th goal
type="history-limit"    // View beyond 7 days
type="analytics"        // Access advanced analytics
type="trial-invitation" // Day 3-7 users
```

---

## Database Queries

### Get User with Subscription
```javascript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    plan: true,
    subscriptionStatus: true,
    trialEndDate: true,
    _count: { select: { habits: true, goals: true } }
  }
});
```

### Count User's Habits
```javascript
const count = await prisma.habit.count({
  where: { userId: userId }
});
```

---

## Subscription Field Reference

```prisma
plan: "free" | "pro_monthly" | "pro_yearly" | "lifetime"
subscriptionStatus: "active" | "canceled" | "past_due"
subscriptionStartDate: DateTime?
subscriptionEndDate: DateTime?
trialEndDate: DateTime?
stripeCustomerId: String?
stripeSubscriptionId: String?
```

---

## Testing Users

Create these in your test database:

```javascript
// Free user
{ email: "free@test.com", plan: "free" }

// Pro user
{ email: "pro@test.com", plan: "pro_yearly", subscriptionStatus: "active" }

// Trial user (5 days remaining)
{
  email: "trial@test.com",
  plan: "free",
  trialEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
}
```

---

## Component Integration Checklist

For each component that needs limits:

- [ ] Import UpgradePopup
- [ ] Import subscription utility
- [ ] Add useState for popup visibility
- [ ] Check subscription before action
- [ ] Show popup on denied access
- [ ] Add lock icon for locked features
- [ ] Test with free & pro users
- [ ] Test on mobile
- [ ] Test error handling

---

## Performance Notes

✅ **Client-side checks:** Instant (no API call)  
✅ **API validation:** Always validates (security)  
✅ **Database queries:** Count is cached by Prisma  
✅ **Lock icons:** CSS-based (no JS overhead)  
✅ **Popups:** 500ms fade animation (smooth UX)  

---

## Security Considerations

🔒 **Never trust client-side checks alone**
- Always validate on API
- User can fake subscription status
- API routes must enforce limits

🔒 **API route pattern:**
```javascript
// Check subscription first
const limitCheck = await checkHabitLimit(user.id);
if (!limitCheck.canCreate) {
  return Response.json({ error: "Limit exceeded" }, { status: 403 });
}

// Then proceed with creation
const habit = await prisma.habit.create({ ... });
```

---

## Next Phase: Payment Integration

When ready to add Razorpay/Stripe:

1. Add `/api/subscription/create-checkout` endpoint
2. Add `/api/subscription/webhook` for webhooks
3. Update pricing page button handlers
4. Create checkout page
5. Handle subscription updates
6. Set up email notifications

See `FREEMIUM_IMPLEMENTATION_COMPLETE.md` for detailed payment integration steps.

---

## Troubleshooting

**Popup not showing?**
- Check `isOpen` state
- Verify popup type is correct
- Check z-index (should be 50+)

**Limit check returning wrong count?**
- Verify Prisma `_count` select
- Check `where` clause filters
- Clear Prisma cache if needed

**API returns 403 unexpectedly?**
- Check subscription status
- Verify trial end date
- Ensure `plan` field is set

**Style not applying?**
- Check Tailwind purge config
- Verify classNames are correct
- Use `!important` only as last resort

---

## Useful Commands

```bash
# Check DB schema
npx prisma studio

# Generate Prisma client
npx prisma generate

# Test API
curl -X POST http://localhost:3000/api/habits \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Habit"}'

# View logs
npm run dev 2>&1 | grep -E "(error|ERROR|subscription)"
```

---

## Contact & Support

**Questions?** Check these in order:
1. `FREEMIUM_IMPLEMENTATION_COMPLETE.md` - Full reference
2. `FREEMIUM_FRONTEND_INTEGRATION_GUIDE.md` - Code examples
3. Component source code - Check imports & usage
4. Subscription utilities - Check function signatures

---

## Last Updated

**Date:** [Current]  
**Status:** Production Ready  
**Version:** 1.0  

All systems go for feature integration! 🚀
