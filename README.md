# Autonomy AI Studio - E2E Test Suite

A comprehensive Playwright test suite for testing the Autonomy AI Studio application (studio.autonomyai.io).

## 📋 Overview

This test suite covers the complete task creation workflow in Autonomy AI Studio:

- **Login Flow** - Authenticating into the application
- **Project Navigation** - Opening existing projects from the dashboard
- **Task Creation** - Submitting text prompts to create tasks
- **Lifecycle Verification** - Monitoring task progression (planning → building → completed)
- **Deliverables Verification** - Confirming preview or PR availability

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Active Autonomy AI Studio account
- GitHub repository to connect (can fork the provided Jira clone)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   git clone <your-repo-url>
   cd homework
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

### Environment Setup

Create a `.env` file in the project root with your test credentials:

```env
# ============================================
# REQUIRED: Test account credentials
# ============================================
TEST_EMAIL=your-test-email@example.com
TEST_PASSWORD=your-test-password

# ============================================
# REQUIRED: Base URL
# ============================================
BASE_URL=https://studio.autonomyai.io

# ============================================
# OPTIONAL: GitHub repo for project initialization tests
# ============================================
TEST_REPO_NAME=smunteankestra/jira-clone

# ============================================
# OPTIONAL: Playwright Configuration
# ============================================
HEADLESS=false
DEBUG=false
TIMEOUT=120000
```

**See `.env.example` for a template with all available options.**

**⚠️ IMPORTANT - Security Notes:**
- Never commit `.env` to version control
- Use a dedicated test account (not your personal account)
- Create a test project specifically for running these tests
- Store sensitive credentials in CI/CD secret management
- The `.env` file is listed in `.gitignore` for protection

### Important: Security Note

**All test credentials are loaded from environment variables only.** There are NO hardcoded credentials in any test files. This is a security best practice:

- `.env` file with credentials is in `.gitignore` 
- Never commit `.env` to version control
- Credentials are only read from environment at runtime
- Tests will fail with clear error message if credentials are missing

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode (recommended for development)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests with debug mode
```bash
npm run test:debug
```

### Run tests for specific browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Run specific test file
```bash
npx playwright test tests/e2e/task-creation.spec.ts
```

### Run tests matching a pattern
```bash
npx playwright test --grep "task lifecycle"
```

## 📁 Project Structure

```
.
├── README.md                          # This file
├── BUGS.md                            # Bug report from product exploration
├── ROADMAP.md                         # Test automation strategy
├── package.json                       # Project dependencies
├── playwright.config.ts               # Playwright configuration
├── .env.local                         # Environment variables (not committed)
└── tests/
    ├── pages/                         # Page Object Models
    │   ├── login.page.ts             # Login page object
    │   ├── dashboard.page.ts         # Dashboard/projects page object
    │   ├── project.page.ts           # Project details page object
    │   └── index.ts                  # Page object exports
    └── e2e/                          # End-to-end test specs
        ├── task-creation.spec.ts     # Task creation flow tests
        └── project-init.spec.ts      # Project initialization tests (bonus)
```

## 🏗️ Architecture & Design Patterns

### Page Object Model (POM)

Each page in the application has a corresponding Page Object that encapsulates:
- Element selectors
- Common user interactions
- Waits and assertions
- Error handling

**Example:**
```typescript
const projectPage = new ProjectPage(page);
await projectPage.createTask('My task prompt');
await projectPage.waitForTaskStage('building', 120000);
```

### Benefits of POM:
- ✅ Maintainability - Selectors centralized, easy to update
- ✅ Readability - Tests read like user stories
- ✅ Reusability - Common interactions defined once
- ✅ Reliability - Proper waits and error handling

### Test Organization

Tests are organized by user journey:
1. **task-creation.spec.ts** - Main workflow tests
2. **project-init.spec.ts** - Project setup and initialization

### Waits and Timeouts

The test suite uses intelligent waits:
- `waitForLoadState('networkidle')` - After navigation
- `waitForTaskStage()` - For long-running AI operations
- `toBeVisible({ timeout: X })` - For specific elements
- Configurable timeouts for different operations

**Timeout Recommendations:**
- Page navigation: 5-10 seconds
- Task planning phase: 30 seconds
- Task building phase: 120 seconds
- Full task completion: 5 minutes

## 🧩 Key Test Scenarios

### 1. Login Flow
```typescript
await loginPage.goto();
await loginPage.login(email, password);
// Verifies redirect and dashboard loads
```

### 2. Project Navigation
```typescript
const projects = await dashboardPage.getProjects();
await dashboardPage.openProject(projects[0]);
await projectPage.isLoaded();
```

### 3. Task Creation
```typescript
await projectPage.createTask('Add a header component');
// Verifies task appears in the UI
```

### 4. Lifecycle Verification
```typescript
await projectPage.waitForTaskStage('planning', 30000);
await projectPage.waitForTaskStage('building', 120000);
await projectPage.isTaskCompleted(300000);
```

## 🐛 Known Limitations & Workarounds

### 1. Non-Deterministic AI Output
**Issue:** Task completion times vary significantly (2-10 minutes)

**Workaround:** 
- Use generous timeouts (5 minutes max)
- Consider running smoke tests with simple prompts
- For CI/CD, either skip completion tests or run on schedule

### 2. Dynamic Selectors
**Issue:** AI Studio uses dynamic class names and HTML structure

**Workaround:**
- Using flexible locators (text content, data-testid attributes)
- Fallback selector chains in Page Objects
- Regular maintenance of selectors

### 3. GitHub OAuth Flow
**Issue:** Project initialization requires GitHub authentication

**Workaround:**
- Project init tests marked as `.skip()` for general runs
- Requires manual setup or test GitHub account
- Consider pre-creating test projects via UI

### 4. Long-Running Tasks
**Issue:** Full task completion can take 5-10 minutes

**Workaround:**
- Run completion tests separately on schedule
- Use shorter timeouts for smoke tests
- Monitor CI runner time limits

## 📊 Test Results & Reporting

After running tests, view the HTML report:
```bash
npx playwright show-report
```

This opens an interactive report showing:
- ✅ Passed tests
- ❌ Failed tests with full traces
- 📸 Screenshots of failures
- 🎥 Video recordings (on-failure)
- Execution timeline

## 🔧 Troubleshooting

### Test fails with "Timeout waiting for element"
- ✅ Increase timeout in test or config
- ✅ Check if element selectors are correct
- ✅ Verify the app is responsive

### Tests pass locally but fail in CI
- ✅ Check environment variables in CI are set correctly
- ✅ Verify network connectivity to studio.autonomyai.io
- ✅ Review browser compatibility (headless vs headed)
- ✅ Check for rate limiting or session limits

### "Login failed" error
- ✅ Verify TEST_EMAIL and TEST_PASSWORD are correct
- ✅ Check if test account is not locked
- ✅ Verify internet connection
- ✅ Check for MFA requirements

### Page selectors not finding elements
- ✅ Run `npm run test:ui` to debug interactively
- ✅ Use Playwright Inspector to inspect elements
- ✅ Check if page is fully loaded (`waitForLoadState('networkidle')`)

## 🚀 CI/CD Integration

See `ROADMAP.md` for GitHub Actions configuration and best practices.

Example workflow for running tests in CI:
```yaml
- name: Run E2E Tests
  run: npm test
  env:
    TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
    TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

## 📈 Performance Baseline

Expected test execution times:
- Login + Dashboard load: ~5-10 seconds
- Project navigation: ~3-5 seconds
- Task creation (form submission): ~5 seconds
- Planning stage: ~30 seconds
- Building stage: ~2-3 minutes
- Full completion (if waited): ~5-10 minutes

**Total suite runtime (without completion tests): ~5-10 minutes**

## 🛠️ Maintenance

### Regular Tasks
- ⚙️ Review selectors monthly (app updates)
- ⚙️ Update timeouts based on performance trends
- ⚙️ Monitor flaky tests and stabilize

### When Tests Break
1. Run locally with `--debug` flag
2. Update selectors in affected Page Objects
3. Increase timeouts if needed (with reason)
4. Add new test case if behavior changed

## 📚 Best Practices Implemented

- ✅ **Page Object Model** - Maintainable selector management
- ✅ **Explicit Waits** - No sleep(), proper wait conditions
- ✅ **Descriptive Names** - Tests read like user stories
- ✅ **Proper Error Handling** - Graceful timeout handling
- ✅ **Environment Isolation** - Credentials via env vars
- ✅ **Incremental Commits** - Small, logical change sets
- ✅ **Clear Documentation** - This README + inline comments

## 🔍 Next Steps / Enhancements

- [ ] Add visual regression testing for UI changes
- [ ] Implement custom reporters with metrics
- [ ] Add cross-browser testing in CI
- [ ] Create load testing suite
- [ ] Add API-level tests for backend endpoints
- [ ] Implement test data factory for setup/teardown
- [ ] Add accessibility (a11y) testing

## ❓ FAQ

**Q: Why are timeouts so high?**
A: AI task execution is non-deterministic. 2 min for building, 5 min for full completion provides safety margin.

**Q: Can I run tests in parallel?**
A: Yes, but use separate test accounts to avoid conflicts. See `playwright.config.ts`.

**Q: What if the app changes significantly?**
A: Update Page Objects first (selectors), then tests. This keeps changes minimal.

**Q: How do I debug a failing test?**
A: Run with `npm run test:debug` or `npm run test:ui` for interactive mode.

## 📝 License

Part of Autonomy AI Studio interview evaluation.

---

**Last Updated:** April 14, 2026  
**Test Framework:** Playwright 1.40+  
**Language:** TypeScript 5.3+  
**Node Version:** 18+
