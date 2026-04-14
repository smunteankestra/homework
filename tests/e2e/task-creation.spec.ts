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
    const loginPage = new LoginPage(page);

    // ACT
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);

    // ASSERT
    // Should be redirected away from login page
    expect(page.url()).not.toContain('/auth/login');

    // Dashboard or projects page should load
    await expect(page.locator('[data-testid="dashboard"], [class*="projects"], h1')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to a project from the dashboard', async ({ page }) => {
    // ARRANGE
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'password123';
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const projectPage = new ProjectPage(page);

    // ACT - Login
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);

    // Get the first available project
    await dashboardPage.goto();
    const projects = await dashboardPage.getProjects();

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
    // ARRANGE
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'password123';
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const projectPage = new ProjectPage(page);

    // ACT - Login and navigate
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await dashboardPage.goto();

    const projects = await dashboardPage.getProjects();
    await dashboardPage.openProject(projects[0]);
    await projectPage.isLoaded();

    // Create task with simple prompt
    const prompt = 'Add a header component';
    await projectPage.createTask(prompt);

    // ASSERT - Check status updates
    const status1 = await projectPage.getTaskStatus();
    expect(status1).toBeTruthy();
    console.log(`Initial status: ${status1}`);

    // Wait a bit and check again
    await page.waitForTimeout(3000);
    const status2 = await projectPage.getTaskStatus();
    expect(status2).toBeTruthy();
    console.log(`Updated status: ${status2}`);
  });
});

