# Test Automation Roadmap - Autonomy AI Studio

## Executive Summary

This document outlines a comprehensive test automation strategy for Autonomy AI Studio, an AI-powered application that generates code based on user prompts. The strategy addresses the unique challenges of testing AI-powered products while maintaining practical prioritization and budget consciousness.

---

## 1. Test Pyramid Strategy

### Recommended Distribution

```
         /\
        /  \
       / E2E \           5-10 tests
      /  (5%) \         - Critical user flows
     /_________ \
    /\          /\
   /  \        /  \
  / Int\      / Int\   30-40 tests
 / egra\     / egra \  - API contracts
/tion  /\_  / tion  \  - Service integration
\(35%)/   \/         \
 \__/       \________/
  /\        /\
 /  \      /  \
/ Unit\    /Unit\     50-65 tests
/Tests\   /Tests\     - Business logic
\(60%)\   \(60%)/     - Utilities
 \___/     \___/      - Transformations
```

### Breakdown by Layer

#### 🔴 Unit Tests (60% - 50-65 tests)
**What to test:**
- Theme context and state management
- Task status transformers
- Prompt validation logic
- Utility functions for formatting, parsing
- Component logic (pure functions)

**Tools:** Jest, Vitest with React Testing Library

**Examples:**
```typescript
// Theme context reducer
describe('ThemeReducer', () => {
  it('should toggle from light to dark', () => {
    const newState = themeReducer(lightState, { type: 'TOGGLE' });
    expect(newState.theme).toBe('dark');
  });
});

// Prompt validator
describe('validatePrompt', () => {
  it('should reject empty prompts', () => {
    expect(validatePrompt('')).toBe(false);
  });
});
```

#### 🟡 Integration Tests (35% - 30-40 tests)
**What to test:**
- Theme provider with useTheme hook
- Task API endpoints (mock backend)
- Server actions (setTheme, createTask)
- Form submission with validation
- State updates across components

**Tools:** Playwright for critical flows, Jest with MSW (Mock Service Worker)

**Examples:**
```typescript
// Integration: Theme persistence
test('theme selection triggers server action and updates context', async ({
  page,
}) => {
  await page.goto('/dashboard');
  await page.click('[data-testid="theme-toggle"]');
  
  // Verify context updated
  const theme = await page.evaluate(() => 
    globalThis.__THEME_CONTEXT__.theme
  );
  expect(theme).toBe('dark');
  
  // Verify server action called
  expect(mockSetTheme).toHaveBeenCalledWith('dark');
});
```

#### 🟢 E2E Tests (5% - 5-10 tests)
**What to test:**
- Login → Dashboard → Project → Task Creation flow
- Project initialization with GitHub connection
- Complete task lifecycle (when critical)
- User navigation between major sections

**Tools:** Playwright

**What NOT to test at E2E level:**
- All theme combinations (too slow)
- All validation error messages
- Minor UI interactions

---

## 2. What to Automate First (Prioritization Matrix)

### High Priority (Start Here)

#### ✅ 1. Task Creation Flow (Criticality: 🔴 CRITICAL)
**Why first?** This is the core product value.

**Scope:**
- Create task with text prompt
- Verify task appears in list
- Monitor status through planning/building phases
- Check for preview/PR availability

**Effort:** Medium (3-4 days)  
**ROI:** Very High - Catches major regressions  
**Frequency:** Every PR

**Test Plan:**
```typescript
- Test valid task creation
- Test task appears in list within 5 seconds
- Test status updates from "pending" → "planning" → "building"
- Test PR link becomes available after completion
```

---

#### ✅ 2. Authentication Flow (Criticality: 🔴 CRITICAL)
**Why second?** No tests can run without login.

**Scope:**
- Login with valid/invalid credentials
- Session persistence
- Logout flow
- Password reset (optional for MVP)

**Effort:** Low (1-2 days)  
**ROI:** Very High - Foundation for all other tests  
**Frequency:** Every PR

**Test Plan:**
```typescript
- Test login with correct credentials succeeds
- Test login with wrong password fails gracefully
- Test session persists across page reloads
- Test logout clears session
```

---

#### ✅ 3. Project Navigation (Criticality: 🟡 MAJOR)
**Why third?** Required to reach test areas.

**Scope:**
- List projects on dashboard
- Open project from sidebar
- Navigate between projects
- Project ready state detection

**Effort:** Low (1-2 days)  
**ROI:** High - Enables all downstream tests  
**Frequency:** Every PR

**Test Plan:**
```typescript
- Test dashboard lists all projects
- Test clicking project opens project detail
- Test sidebar shows active project
- Test back button returns to dashboard
```

---

### Medium Priority (Weeks 2-3)

#### ⏳ 4. Theme System (Criticality: 🟡 MAJOR)
**Why medium?** Important for UX but not core feature.

**Scope:**
- Light/dark theme switching
- Theme persistence across sessions
- Theme sync between toggle and dropdown
- CSS variable application

**Effort:** Medium (2-3 days)  
**ROI:** High - Frequently used feature  
**Frequency:** Every PR (integration tests), Weekly (E2E)

**Test Plan:**
```typescript
Integration tests:
- Test ThemeProvider sets CSS variables on DOM
- Test setTheme() updates context and triggers server action
- Test cookie persistence

E2E tests:
- Test clicking toggle switches theme
- Test theme persists after reload
```

**Note:** The bug you found (toggle not working) is HIGH priority!

---

#### ⏳ 5. Project Initialization (Criticality: 🟡 MAJOR)
**Why medium?** One-time setup, but critical when needed.

**Scope:**
- Connect GitHub repo (e.g., smunteankestra/jira-clone)
- Run auto-detect
- Select stack/framework
- Initialization status tracking

**Effort:** Medium (3-4 days)  
**ROI:** Medium - One-time per project, complex flow  
**Frequency:** Weekly or on-demand

**Test Plan:**
```typescript
- Test repo selection flow (smunteankestra/jira-clone)
- Test auto-detect completes successfully
- Test initialization status updates
- Test project becomes ready after init
```

---

### Low Priority (Weeks 4+)

#### 🟢 6. Error Handling & Edge Cases
- Network error recovery
- Invalid prompt handling
- Rate limiting
- Concurrent task creation
- Session timeouts

#### 🟢 7. Performance Tests
- Page load time benchmarks
- Task creation latency
- API response times
- Bundle size

#### 🟢 8. Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- ARIA labels

---

## 3. CI/CD Integration

### GitHub Actions Workflow

**File: `.github/workflows/e2e-tests.yml`**

```yaml
name: E2E Tests

on:
  pull_request:
    branches: [main, develop]
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm install
      - run: npx playwright install --with-deps
      
      - name: Run E2E Tests
        run: npm test
        env:
          TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
      
      - name: Upload Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
      
      - name: Comment PR with Results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const summary = fs.readFileSync('test-summary.txt', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## E2E Test Results\n\n${summary}`
            });
```

### Test Execution Strategy

#### 🔵 PR Checks (Smoke Tests - 5-10 min)
**When:** Every PR  
**What:** Critical paths only
```bash
npm test -- --grep "login|dashboard|task-creation"
```

**Pass Criteria:** All tests pass or flakiness < 5%

#### 🟠 Nightly Runs (Full Suite - 20-30 min)
**When:** Daily at 2 AM UTC  
**What:** All tests including slow ones
```bash
npm test
```

**Reports:** Slack notification with pass rate

#### 🟢 Release Gate Tests (30-60 min)
**When:** Before production deploy  
**What:** Full suite + stress tests
```bash
npm test
npm run test:stress  # If implemented
```

**Pass Criteria:** 100% pass rate

### Parallelization Strategy

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 1 : 4,
  // Note: Set to 1 in CI to avoid flakiness
  // Use separate test accounts per worker if parallelized
});
```

---

## 4. Unique Challenges of Testing AI-Powered Products

### Challenge 1: Non-Deterministic Behavior

**Problem:**
- AI generation times vary (30s - 10 min)
- Output quality varies
- Same prompt may produce different code
- Task failure rate is non-zero

**Solutions:**

```typescript
// ✅ Use generous timeouts
await projectPage.waitForTaskStage('building', 120000); // 2 min

// ✅ Focus on lifecycle, not output
// Don't assert "Generated code includes X function"
// DO assert "Task reached 'completed' state with PR link"

// ✅ Separate smoke tests from full-completion tests
test('task enters planning stage', async () => {
  // Fast - can run on every PR
  await projectPage.createTask(prompt);
  await projectPage.waitForTaskStage('planning', 30000);
});

test.only('task completes end-to-end', async () => {
  // Slow - run nightly only
  await projectPage.createTask(prompt);
  await projectPage.isTaskCompleted(300000);
});

// ✅ Use simple prompts for test stability
// "Add a button" - usually 2 min
// "Build enterprise app" - highly variable
```

---

### Challenge 2: Output Validation

**Problem:**
- Can't assert on code correctness (AI is non-deterministic)
- Can't parse and validate generated code (complex)
- Can't run generated code (may be incomplete/broken)

**Solutions:**

```typescript
// ✅ Test the workflow, not the output
test('should generate code and create PR', async () => {
  await projectPage.createTask('Add a button');
  
  // Verify process completed
  await expect(prLink).toBeVisible();
  
  // DON'T do this:
  // const generatedCode = await prLink.textContent();
  // expect(generatedCode).toContain('export default');
});

// ✅ Use meta-testing for code quality
// - Count lines of code generated
// - Check for syntax errors (basic regex)
// - Verify file structure exists

// ✅ Add manual code review to deployment process
// Have human review generated code before merge
```

---

### Challenge 3: External Dependency Reliability

**Problem:**
- Depends on GitHub API availability
- Depends on LLM service (may rate limit)
- Network timeouts
- Auth token expiration

**Solutions:**

```typescript
// ✅ Mock external services in integration tests
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/tasks', (req, res) => {
    return res(json({ id: 'task-123', status: 'planning' }));
  })
);

// ✅ Add retry logic with exponential backoff
const MAX_RETRIES = 3;
for (let i = 0; i < MAX_RETRIES; i++) {
  try {
    await projectPage.createTask(prompt);
    break;
  } catch (error) {
    if (i === MAX_RETRIES - 1) throw error;
    await page.waitForTimeout(1000 * Math.pow(2, i));
  }
}

// ✅ Skip tests if service unavailable
test.skip(
  isLLMDown,
  'task completion (LLM service down)'
);

// ✅ Monitor and alert on high failure rates
// If task completion fails > 20%, pause tests and alert
```

---

### Challenge 4: Flaky Tests

**Problem:**
- Long timeouts mean higher flake rate
- Multiple moving parts (UI + AI + GitHub + Backend)
- Race conditions between UI and server updates

**Solutions:**

```typescript
// ✅ Use explicit waits, not fixed delays
// ❌ BAD
await page.waitForTimeout(3000);
expect(await taskStatus()).toBe('planning');

// ✅ GOOD
await expect(page.locator('[data-testid="status"]'))
  .toContainText('Planning', { timeout: 30000 });

// ✅ Add test retries for known flaky tests
test.retries = 2; // Retry up to 2 times if fails

// ✅ Tag and isolate flaky tests
test('task completes @flaky @slow', async () => {
  // Run separately, don't fail the build
});

// ✅ Monitor and analyze flakiness
// Track which tests fail inconsistently
// Fix root causes (not just add waits)
```

---

## 5. Implementation Timeline

### Week 1: Foundation
- [ ] Set up Playwright + TypeScript
- [ ] Create Page Objects for login, dashboard, project
- [ ] Write authentication tests
- [ ] Set up CI/CD skeleton

**Deliverable:** Basic test suite passing locally

### Week 2: Core Flows
- [ ] Add task creation tests
- [ ] Add project navigation tests
- [ ] Improve test reliability
- [ ] Document selectors and patterns

**Deliverable:** PR validation workflow in CI

### Week 3: Enhancements
- [ ] Add theme testing
- [ ] Add project initialization tests
- [ ] Set up nightly runs
- [ ] Add reporting

**Deliverable:** Full CI/CD pipeline operational

### Week 4+: Maintenance & Scale
- [ ] Monitor test flakiness
- [ ] Add performance baselines
- [ ] Expand coverage
- [ ] Document learnings

---

## 6. Success Metrics

### Test Coverage Goals
- Critical paths: 100%
- Integration points: 80%
- Edge cases: 50%

### Quality Metrics
- Test flake rate: < 5%
- Average test duration: < 2 min (for PR checks)
- CI build pass rate: > 95%

### Performance Metrics
- Regression detection time: < 30 min
- CI build time: < 15 min for smoke tests
- Recovery time after failure: < 1 hour

---

## 7. Maintenance & Evolution

### Monthly Reviews
- [ ] Analyze test failures and flakiness
- [ ] Update selectors if UI changed
- [ ] Review timeout settings based on actual execution
- [ ] Update documentation

### Quarterly Planning
- [ ] Reassess priorities based on product changes
- [ ] Evaluate new testing frameworks/tools
- [ ] Plan new test scenarios
- [ ] Budget for technical debt

---

## Conclusion

By focusing on **automated critical paths** while acknowledging **AI-specific challenges**, this strategy provides:

✅ **Fast feedback** on core functionality  
✅ **Reduced manual QA effort** for repetitive testing  
✅ **Better product quality** through regression detection  
✅ **Cost efficiency** by automating high-value, high-repetition tests  
✅ **Scalability** for future enhancements  

The key is **pragmatism**: automate what's stable and valuable, keep manual testing for what's complex and non-deterministic.

---

**Document Version:** 1.0  
**Last Updated:** April 14, 2026  
**Applicable to:** Autonomy AI Studio v1.0+

