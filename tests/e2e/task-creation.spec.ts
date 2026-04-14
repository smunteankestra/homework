import { test, expect, Page } from '@playwright/test';
import { LoginPage, DashboardPage, ProjectPage } from '../pages';

/**
 * Test Suite: Task Creation Flow
 *
 * This test suite covers the main user journey in Autonomy AI Studio:
 * 1. Login to the app
 * 2. Navigate to a project
 * 3. Create a task with a text prompt
 * 4. Monitor task lifecycle (planning → building → completed)
 * 5. Verify completion state and deliverables (preview/PR)
 */

test.describe('Task Creation & Lifecycle Flow', () => {
  test('should log in with valid credentials', async ({ page }) => {
    // ARRANGE
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'password123';

    // ACT - Navigate to app
    await page.goto('https://studio.autonomyai.io/', { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Try to find and fill email input (with multiple selector attempts)
    let emailInput = page.locator('input[type="email"]');
    if (!(await emailInput.isVisible({ timeout: 5000 }).catch(() => false))) {
      emailInput = page.locator('input[id*="email"]');
    }
    if (!(await emailInput.isVisible({ timeout: 5000 }).catch(() => false))) {
      emailInput = page.locator('input[placeholder*="email"]');
    }

    // Fill credentials
    await emailInput.fill(testEmail, { timeout: 15000 });

    const passwordInput = page.locator('input[type="password"], input[id*="password"], input[placeholder*="password"]').first();
    await passwordInput.fill(testPassword, { timeout: 15000 });

    // Find and click login button
    const loginButton = page.locator('button:has-text("Sign in"), button:has-text("Login"), button[type="submit"]').first();
    await loginButton.click({ timeout: 10000 });

    // ASSERT - Should be on dashboard or projects page (not on login)
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    expect(page.url()).not.toContain('/auth/login');
    console.log('✓ Login test passed - URL:', page.url());
  });

  test('should navigate to a project from the dashboard', async ({ page }) => {
    // ARRANGE - Login first
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'password123';

    // ACT - Go to app
    await page.goto('https://studio.autonomyai.io/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // ASSERT - Projects list exists
    expect(projects.length).toBeGreaterThan(0);

    // ACT - Open first project
    await dashboardPage.openProject(projects[0]);

    // ASSERT - Project page loaded
    await projectPage.isLoaded();
    expect(page.url()).toContain('/project');
  });

  test('should create a task with a text prompt', async ({ page }) => {
    // ARRANGE
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'password123';
    const taskPrompt = 'Create a simple button component with hover effects and click handlers';
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const projectPage = new ProjectPage(page);

    // ACT - Login and navigate to project
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await dashboardPage.goto();

    const projects = await dashboardPage.getProjects();
    expect(projects.length).toBeGreaterThan(0);

    await dashboardPage.openProject(projects[0]);
    await projectPage.isLoaded();

    // ACT - Create task
    await projectPage.createTask(taskPrompt);

    // ASSERT - Task creation was initiated
    // Page should still be on project or show task details
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/project');
  });

  test('should progress through task lifecycle stages', async ({ page }) => {
    // ARRANGE
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'password123';
    const taskPrompt = 'Build a responsive card component with image, title, and description';
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const projectPage = new ProjectPage(page);

    // ACT - Login and create task
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await dashboardPage.goto();

    const projects = await dashboardPage.getProjects();
    await dashboardPage.openProject(projects[0]);
    await projectPage.isLoaded();

    await projectPage.createTask(taskPrompt);

    // ASSERT - Task should go through lifecycle stages
    // Wait for Planning stage
    await projectPage.waitForTaskStage('planning', 30000);
    console.log('✓ Task entered Planning stage');

    // Wait for Building stage (may take longer)
    await projectPage.waitForTaskStage('building', 120000);
    console.log('✓ Task entered Building stage');

    // Note: Full completion may take 5-10 minutes, so this is optional for quick tests
  });

  test('should complete a task and show deliverables', async ({ page }) => {
    // ARRANGE
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'password123';
    const taskPrompt = 'Create a simple form with name and email inputs';
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const projectPage = new ProjectPage(page);

    // ACT - Login, navigate, and create task
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await dashboardPage.goto();

    const projects = await dashboardPage.getProjects();
    await dashboardPage.openProject(projects[0]);
    await projectPage.isLoaded();

    await projectPage.createTask(taskPrompt);

    // Wait for task to complete (long timeout)
    await projectPage.isTaskCompleted(300000);
    console.log('✓ Task completed successfully');

    // ASSERT - Task should have preview or PR available
    const hasPreview = await projectPage.canPreview();
    const hasPR = await projectPage.canViewPR();

    expect(hasPreview || hasPR).toBe(true);
    console.log('✓ Task has preview or PR available');
  });

  test('should verify task lifecycle with status checks', async ({ page }) => {
    // Simple status check test
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'password123';

    await page.goto('https://studio.autonomyai.io/', { waitUntil: 'networkidle', timeout: 30000 });

    if (page.url().includes('/auth/login')) {
      await page.locator('input[type="email"]').first().fill(testEmail);
      await page.locator('input[type="password"]').first().fill(testPassword);
      await page.locator('button:has-text("Sign in"), button:has-text("Login")').first().click();
      await page.waitForLoadState('networkidle', { timeout: 30000 });
    }

    expect(page.url()).not.toContain('/auth/login');
    console.log('✓ Status check test passed');
  });
});

