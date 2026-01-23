# Cypress E2E Testing - Consistency Grid

## 🎯 Overview

Comprehensive E2E test suite for Consistency Grid using Cypress. Tests cover all critical user flows:

✅ **Authentication** - Login, Signup, Logout, Password Reset  
✅ **Dashboard** - Loading, Stats, Quick Actions  
✅ **Goals** - Create, Read, Update, Delete  
✅ **Habits** - Create, Complete, Track Progress  
✅ **Streaks** - Calculate, Display, Milestones  
✅ **Settings** - Profile, Preferences, Security  

---

## 📦 Installation

Cypress is already installed. If needed:

```bash
npm install --save-dev cypress
```

---

## 🚀 Running Tests

### Open Cypress Test Runner (Interactive)
```bash
npm run cypress:open
# or
npm run test:e2e:watch
```

Opens interactive test runner where you can:
- See tests run in real-time
- Debug failures
- Watch individual test execution
- Inspect elements
- View network requests

### Run All Tests Headless (CI/CD)
```bash
npm run test:e2e
# or
npm run cypress:run
```

Runs all tests without opening browser. Good for:
- CI/CD pipelines
- Automated testing
- Batch runs
- Server environments

### Run Tests in Specific Browser
```bash
# Chrome
npm run test:e2e:chrome

# Firefox
npm run test:e2e:firefox

# Edge
npm run test:e2e:edge
```

### Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/01-auth.cy.js"
```

### Run Tests Matching Pattern
```bash
npx cypress run --spec "cypress/e2e/*-auth.cy.js"
```

### Run Single Test
```bash
npx cypress run --spec "cypress/e2e/01-auth.cy.js" --env grep="should display login page"
```

---

## 📂 Test Structure

```
cypress/
├── e2e/                          # E2E test files
│   ├── 01-auth.cy.js            # Authentication tests (18 tests)
│   ├── 02-dashboard.cy.js       # Dashboard tests (14 tests)
│   ├── 03-goals.cy.js           # Goals CRUD tests (25 tests)
│   ├── 04-habits.cy.js          # Habits tests (30 tests)
│   ├── 05-streaks.cy.js         # Streak tests (20 tests)
│   └── 06-settings.cy.js        # Settings tests (28 tests)
├── support/
│   ├── e2e.js                   # Global setup
│   ├── commands.js              # Custom commands
│   └── test-data.js             # Test data factory
├── videos/                       # Test recordings
├── screenshots/                  # Failure screenshots
└── downloads/                    # Downloaded files
```

**Total:** 135+ test cases covering all features

---

## 🧪 Test Files

### 1. Authentication (`01-auth.cy.js`)
**18 tests** covering:
- ✅ Login page display
- ✅ Invalid credentials error
- ✅ Form validation
- ✅ Email validation
- ✅ Signup page
- ✅ Password matching validation
- ✅ Password strength validation
- ✅ Session management
- ✅ Protected routes
- ✅ Password reset flow

**Key Tests:**
```javascript
✓ should display login page
✓ should show error for invalid credentials
✓ should validate password match
✓ should maintain session on page refresh
✓ should redirect to login when accessing dashboard without auth
```

### 2. Dashboard (`02-dashboard.cy.js`)
**14 tests** covering:
- ✅ Page loading
- ✅ Stats display
- ✅ Quick actions
- ✅ Navigation
- ✅ Responsive design

**Key Tests:**
```javascript
✓ should load dashboard successfully
✓ should display goals count
✓ should have button to create goal
✓ should navigate to goals when clicking create goal
✓ should display correctly on mobile
```

### 3. Goals (`03-goals.cy.js`)
**25 tests** covering:
- ✅ Goals list
- ✅ Create goal
- ✅ Edit goal
- ✅ Delete goal
- ✅ Goal details
- ✅ Form validation
- ✅ Sorting/Filtering

**Key Tests:**
```javascript
✓ should display goals page
✓ should create goal with valid data
✓ should validate goal name field
✓ should display goal information
✓ should delete goal on confirmation
```

### 4. Habits (`04-habits.cy.js`)
**30 tests** covering:
- ✅ Habit creation
- ✅ Habit completion
- ✅ Streak tracking
- ✅ Habit editing
- ✅ Habit deletion
- ✅ Progress visualization
- ✅ Daily tracking

**Key Tests:**
```javascript
✓ should display habits page
✓ should create habit with valid data
✓ should mark habit as complete
✓ should update habit status immediately
✓ should persist completion status
✓ should increment streak on completion
```

### 5. Streaks (`05-streaks.cy.js`)
**20 tests** covering:
- ✅ Streak display
- ✅ Streak calculation
- ✅ Streak badges
- ✅ Milestone tracking
- ✅ Personal records
- ✅ Streak filtering

**Key Tests:**
```javascript
✓ should display streaks page
✓ should calculate streak correctly for daily habits
✓ should maintain streak if completed today
✓ should break streak if not completed today
✓ should display long streaks prominently
```

### 6. Settings (`06-settings.cy.js`)
**28 tests** covering:
- ✅ Profile settings
- ✅ Account settings
- ✅ Privacy settings
- ✅ Preferences
- ✅ Connected accounts
- ✅ Data management
- ✅ Logout

**Key Tests:**
```javascript
✓ should display settings page
✓ should allow editing profile
✓ should validate profile fields
✓ should save profile changes
✓ should allow changing password
```

---

## 🛠️ Custom Commands

### Authentication Commands
```javascript
// Login with email and password
cy.login('user@example.com', 'password123');

// Sign up new account
cy.signup('user@example.com', 'password123', 'Name');

// Logout
cy.logout();

// Check if logged in
cy.isLoggedIn();

// Check if logged out
cy.isLoggedOut();
```

### Navigation Commands
```javascript
// Navigate to section
cy.goTo('dashboard');    // /dashboard
cy.goTo('goals');        // /goals
cy.goTo('habits');       // /habits
cy.goTo('reminders');    // /reminders
cy.goTo('streaks');      // /streaks
cy.goTo('settings');     // /settings
```

### Form Commands
```javascript
// Fill goal form
cy.fillGoalForm({
  name: 'Goal Name',
  description: 'Description',
  category: 'Health',
  duration: 30
});

// Fill habit form
cy.fillHabitForm({
  name: 'Habit Name',
  frequency: 'daily'
});
```

### Habit Commands
```javascript
// Create goal
cy.createGoal({
  name: 'Run 5K',
  category: 'Health',
  duration: 30
});

// Complete habit
cy.completeHabit('Morning Run');

// Check streak
cy.checkStreak('Running', 5);
```

### API Commands
```javascript
// Wait for API response
cy.waitForAPI('/api/goals');

// Get auth token
cy.getAuthToken();

// Mock authentication
cy.mockAuth();
```

---

## 📊 Test Data

### Test Users
```javascript
import { testUsers } from 'cypress/support/test-data';

testUsers.standard     // { email, password, name }
testUsers.premium      // Premium user
testUsers.invalid      // Invalid credentials
```

### Test Goals
```javascript
import { testGoals } from 'cypress/support/test-data';

testGoals.fitness      // Run 5K goal
testGoals.learning     // Learning goal
testGoals.work         // Work project
testGoals.financial    // Save money
```

### Test Habits
```javascript
import { testHabits } from 'cypress/support/test-data';

testHabits.morning     // Morning meditation
testHabits.exercise    // Daily exercise
testHabits.reading     // Reading
testHabits.journaling  // Journaling
```

### Generate Random Data
```javascript
import { generateTestUser, generateTestGoal } from 'cypress/support/test-data';

const user = generateTestUser();     // Random user
const goal = generateTestGoal();     // Random goal
```

---

## 🔧 Configuration

### cypress.config.js

```javascript
module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',    // App URL
    viewportWidth: 1280,                  // Desktop viewport
    viewportHeight: 720,
    defaultCommandTimeout: 4000,          // Command timeout
    requestTimeout: 10000,                // Request timeout
    retries: {
      runMode: 2,                         // Retry failed tests 2x
      openMode: 0,
    },
    video: true,                          // Record videos
    screenshotOnRunFailure: true,         // Screenshot on failure
  },
});
```

### Environment Variables

Set in `cypress.config.js` or `.env`:

```bash
CYPRESS_baseUrl=http://localhost:3000
CYPRESS_viewportWidth=1280
CYPRESS_viewportHeight=720
```

---

## 🐛 Debugging

### View Test Execution
1. Open Cypress: `npm run cypress:open`
2. Select test file
3. Watch real-time execution
4. Pause, step through, inspect elements

### Debug Single Test
```javascript
// Add .only to run single test
it.only('should do something', () => {
  // test code
});
```

### Debug Specific Suite
```javascript
// Add .only to run single suite
describe.only('Feature', () => {
  // all tests in this suite
});
```

### Log to Console
```javascript
cy.log('Debug message');
console.log('JavaScript console');
```

### Inspect Elements
```javascript
// Pause on command
cy.contains('button').click().pause();

// Then use DevTools
```

### View Network Requests
1. Open DevTools
2. Go to Network tab
3. Run tests
4. Inspect requests/responses

---

## 📈 Best Practices

### ✅ DO
- ✅ Use custom commands for repetitive actions
- ✅ Use test data factory for consistent data
- ✅ Test user workflows, not implementation
- ✅ Keep tests independent
- ✅ Use meaningful test descriptions
- ✅ Mock external APIs when possible
- ✅ Wait for elements properly
- ✅ Use data-testid attributes

### ❌ DON'T
- ❌ Use magic delays (`cy.wait(1000)`)
- ❌ Repeat selectors across tests
- ❌ Create dependencies between tests
- ❌ Test implementation details
- ❌ Use hard-coded values
- ❌ Access inaccessible selectors
- ❌ Ignore error handling
- ❌ Write tests that are too brittle

---

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm start &
      - run: npx wait-on http://localhost:3000
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: cypress-videos
          path: cypress/videos
```

---

## 📊 Test Results

### Run Tests
```bash
npm run test:e2e
```

### View Results
- **Passed tests:** Green checkmarks
- **Failed tests:** Red X marks
- **Skipped tests:** Gray dash
- **Videos:** `cypress/videos/`
- **Screenshots:** `cypress/screenshots/`

### Example Output
```
✓ Authentication                                                    (18 tests)
✓ Dashboard                                                        (14 tests)
✓ Goals Management                                                (25 tests)
✓ Habits Management                                               (30 tests)
✓ Streaks                                                          (20 tests)
✓ Settings                                                        (28 tests)

=====================================
TOTAL: 135 tests passed (2m 34s)
=====================================
```

---

## 🔍 Selectors Best Practice

### Good Selectors
```javascript
cy.get('[data-testid="submit-button"]').click();
cy.get('[aria-label="Create goal"]').click();
cy.contains('Sign In').click();
```

### Avoid
```javascript
// Too specific
cy.get('div.container > div.form > button:nth-child(2)');

// Hard to maintain
cy.get('.btn-primary');
```

---

## 📝 Writing New Tests

### Template
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.mockAuth();
    cy.visit('/path');
  });

  describe('Section', () => {
    it('should do something', () => {
      cy.get('selector').action();
      cy.get('result').should('exist');
    });
  });
});
```

### Example Test
```javascript
it('should create a goal', () => {
  // Setup
  cy.contains('Create Goal').click();
  
  // Action
  cy.fillGoalForm({
    name: 'Learn Cypress',
    duration: 30
  });
  cy.get('[data-testid="submit"]').click();
  
  // Assert
  cy.contains('Learn Cypress').should('exist');
  cy.url().should('include', '/goals');
});
```

---

## ✨ Tips & Tricks

### Wait for Elements Properly
```javascript
// Good - waits for element
cy.get('[data-testid="loader"]').should('not.exist');

// Good - with timeout
cy.get('[data-testid="data"]', { timeout: 5000 }).should('exist');

// Avoid - magic wait
cy.wait(1000);
```

### Handle Multiple Elements
```javascript
// Click first matching
cy.contains('button', 'Save').first().click();

// Click all matching
cy.get('[data-testid="item"]').each($item => {
  cy.wrap($item).click();
});
```

### Test Responsive Design
```javascript
cy.viewport('iphone-x');      // Mobile
cy.viewport('ipad-2');         // Tablet
cy.viewport(1280, 720);        // Desktop
```

### Mock API Calls
```javascript
cy.intercept('GET', '/api/goals', { statusCode: 200, body: [] });
cy.intercept('POST', '/api/goals', { statusCode: 201 });
```

---

## 📚 Resources

- [Cypress Official Docs](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)
- [Debugging Guide](https://docs.cypress.io/guides/guides/debugging)
- [CI Integration](https://docs.cypress.io/guides/ci-providers/github-actions)

---

## 🎓 Next Steps

1. **Run Tests Locally**
   ```bash
   npm run cypress:open
   ```

2. **Explore Test Files**
   - Review test structure
   - Understand assertions
   - See custom commands

3. **Write New Tests**
   - Follow template
   - Use custom commands
   - Reference test data

4. **Integrate CI/CD**
   - Add to GitHub Actions
   - Run on pull requests
   - Generate reports

---

## ✅ Complete Test Coverage

| Feature | Tests | Status |
|---------|-------|--------|
| Authentication | 18 | ✅ Complete |
| Dashboard | 14 | ✅ Complete |
| Goals | 25 | ✅ Complete |
| Habits | 30 | ✅ Complete |
| Streaks | 20 | ✅ Complete |
| Settings | 28 | ✅ Complete |
| **Total** | **135** | **✅ Complete** |

---

**Phase 3.2 Status:** 🟢 E2E Testing Setup Complete

All test files created and ready to run!

