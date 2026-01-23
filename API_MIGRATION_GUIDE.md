# 🔧 API ROUTE INTEGRATION GUIDE

## Converting Existing Routes to Use Security Wrapper

### BEFORE: Old Pattern (Unsecured)
```javascript
// ❌ Not protected
export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  
  const body = await req.json();
  
  // Create data...
  
  return Response.json(data);
}
```

### AFTER: New Pattern (Secured) ✅
```javascript
import { withPOST } from "@/lib/apiSecurity";
import { validateHabitData } from "@/lib/validation";
import { createSuccessResponse } from "@/lib/apiResponse";
import prisma from "@/lib/prisma";

// ✅ Automatically handles:
// - Authentication
// - Rate limiting  
// - Error handling
// - Input validation
export const POST = withPOST(
  async (req, { user, body }) => {
    // user is already authenticated
    // rate limit already checked
    // body is JSON parsed
    
    const data = await prisma.habit.create({
      data: {
        ...body,
        userId: user.id,
      },
    });
    
    return createSuccessResponse(data, 201);
  },
  validateHabitData // Optional validator
);

// GET endpoint - also protected
export const GET = withGET(async (req, { user, session }) => {
  const data = await prisma.habit.findMany({
    where: { userId: user.id },
  });
  return createSuccessResponse(data);
});
```

---

## Routes to Update (Priority Order)

### HIGH PRIORITY
1. `src/app/api/habits/route.js` - Create/Read habits
2. `src/app/api/goals/route.js` - Create/Read goals  
3. `src/app/api/reminders/route.js` - Create/Read reminders

### MEDIUM PRIORITY
4. `src/app/api/streaks/route.js`
5. `src/app/api/subgoals/route.js`
6. `src/app/api/milestones/route.js`
7. `src/app/api/analytics/route.js`

### ALSO UPDATE
8. All DELETE endpoints (add withDELETE)
9. All PUT/PATCH endpoints (add withPUT)

---

## Step-by-Step Integration

### Step 1: Add Imports at Top
```javascript
import { withGET, withPOST, withPUT, withDELETE } from "@/lib/apiSecurity";
import { createSuccessResponse, createErrorResponse } from "@/lib/apiResponse";
import { validateHabitData } from "@/lib/validation"; // If needed
```

### Step 2: Remove Manual Auth Check
```javascript
// ❌ REMOVE THIS ENTIRE BLOCK:
const session = await getServerSession(authOptions);
if (!session?.user?.email) {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
const user = await prisma.user.findUnique({
  where: { email: session.user.email },
});
if (!user) {
  return Response.json({ error: "User not found" }, { status: 404 });
}
```

### Step 3: Replace Export and Simplify Function
```javascript
// ❌ OLD:
export async function POST(req) {
  // ... 30 lines of auth code ...
}

// ✅ NEW:
export const POST = withPOST(
  async (req, { user, body }) => {
    // ... just your business logic ...
  },
  validateHabitData // Optional
);
```

### Step 4: Replace Response Format
```javascript
// ❌ OLD:
return Response.json({ habit }, { status: 201 });

// ✅ NEW:
return createSuccessResponse(habit, 201);
```

### Step 5: Use Proper Error Responses
```javascript
// ❌ OLD:
return Response.json({ error: "Bad input" }, { status: 400 });

// ✅ NEW:
return createErrorResponse("Bad input", 400);

// ✅ Validation errors:
return createValidationErrorResponse(["Field X is required"]);
```

---

## Common Patterns

### GET with Query Params
```javascript
import { withGET } from "@/lib/apiSecurity";
import { createSuccessResponse, createErrorResponse } from "@/lib/apiResponse";

export const GET = withGET(async (req, { user }) => {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  
  if (startDate && !isValidDate(startDate)) {
    return createErrorResponse("Invalid startDate", 400);
  }
  
  const data = await prisma.habit.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
  });
  
  return createSuccessResponse(data);
});
```

### POST with Validation
```javascript
import { withPOST } from "@/lib/apiSecurity";
import { validateHabitData } from "@/lib/validation";
import { createSuccessResponse, createValidationErrorResponse } from "@/lib/apiResponse";

export const POST = withPOST(
  async (req, { user, body }) => {
    const habit = await prisma.habit.create({
      data: {
        name: body.name,
        description: body.description,
        frequency: body.frequency,
        userId: user.id,
      },
    });
    
    return createSuccessResponse(habit, 201);
  },
  validateHabitData // Validates automatically
);
```

### DELETE Endpoint
```javascript
import { withDELETE } from "@/lib/apiSecurity";
import { createSuccessResponse, createErrorResponse } from "@/lib/apiResponse";

export const DELETE = withDELETE(async (req, { user }) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return createErrorResponse("ID required", 400);
  }
  
  // Verify ownership
  const habit = await prisma.habit.findFirst({
    where: { id, userId: user.id },
  });
  
  if (!habit) {
    return createErrorResponse("Not found", 404);
  }
  
  await prisma.habit.delete({ where: { id } });
  
  return createSuccessResponse({ success: true });
});
```

### PUT/PATCH Endpoint
```javascript
import { withPUT } from "@/lib/apiSecurity";
import { validateHabitData } from "@/lib/validation";
import { createSuccessResponse, createErrorResponse } from "@/lib/apiResponse";

export const PUT = withPUT(
  async (req, { user, body }) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return createErrorResponse("ID required", 400);
    }
    
    // Verify ownership
    const habit = await prisma.habit.findFirst({
      where: { id, userId: user.id },
    });
    
    if (!habit) {
      return createErrorResponse("Not found", 404);
    }
    
    // Update
    const updated = await prisma.habit.update({
      where: { id },
      data: body,
    });
    
    return createSuccessResponse(updated);
  },
  validateHabitData // Optional - validates updated data
);
```

### Handling Nested Routes
```javascript
// For: /api/habits/[id]/route.js

import { withGET, withPUT, withDELETE } from "@/lib/apiSecurity";

export const GET = withGET(async (req, { user }, { params }) => {
  const { id } = params;
  // ...
});

export const PUT = withPUT(async (req, { user, body }, { params }) => {
  const { id } = params;
  // ...
});

export const DELETE = withDELETE(async (req, { user }, { params }) => {
  const { id } = params;
  // ...
});
```

---

## Testing the Integration

### Test Rate Limiting
```bash
# Run this script to test rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/habits \
    -H "Content-Type: application/json" \
    -d '{"title":"Test"}'
  echo "Request $i"
  sleep 0.1
done

# Should see: "Too many requests" after limit exceeded
```

### Test Validation
```bash
# Missing required fields
curl -X POST http://localhost:3000/api/habits \
  -H "Content-Type: application/json" \
  -d '{"invalid":"field"}'

# Should return: Validation errors
```

### Test Authentication
```bash
# No session
curl -X GET http://localhost:3000/api/habits

# Should return: Unauthorized (401)
```

---

## Checklist for Each Route

- [ ] Remove manual auth/session code
- [ ] Add imports from @/lib/apiSecurity
- [ ] Wrap handler with with{METHOD}()
- [ ] Use createSuccessResponse() instead of Response.json()
- [ ] Use createErrorResponse() instead of Response.json()
- [ ] Use createValidationErrorResponse() for validation
- [ ] Add optional validator function
- [ ] Test with invalid data
- [ ] Test rate limiting
- [ ] Test as unauthorized user
- [ ] Verify error messages are user-friendly
- [ ] Check no sensitive data in error responses

---

## Migration Velocity

Average time per route: **10-15 minutes**

- Simple GET: 5 min
- GET with filtering: 10 min
- POST with validation: 15 min
- DELETE/PATCH: 10 min

**Total for all routes: 2-3 hours**

---

## Need Help?

If a route is complex and doesn't fit these patterns:

1. Check `SECURITY_IMPLEMENTATION.md`
2. Reference working examples in `src/app/api/auth/signup/route.js`
3. Look at `src/lib/apiSecurity.js` for advanced options
4. Test in dev environment first

Let's make this secure! 🔒
