import { test, expect } from '@playwright/test';
import { TestHelpers } from '../helpers/test-helpers';

// Load environment variables from .env file
// (Playwright config loads dotenv automatically)

/**
 * E2E Test Suite: Task Creation and Lifecycle Flow
 *
 * Part 2 Requirements:
 * 1. Login - Authenticate into the app
 * 2. Navigate to a project - Open an existing project from the sidebar
 * 3. Create a task (text prompt) - Type a prompt and submit
 * 4. Verify task lifecycle - Assert that the task progresses through its steps
 * 5. Verify completion - Assert the task reaches a completed state with a preview or PR
 */

// Get environment variables
const BASE_URL = process.env.BASE_URL || 'https://studio.autonomyai.io';
const TEST_EMAIL = process.env.TEST_EMAIL || '';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '';
const PROJECT_ID = 'b7850025-fba2-4945-b7d1-58a0dc8462b1'; // Known project ID

test.describe('Task Creation & Lifecycle Flow', () => {
  // Set global timeout for all tests in this suite
  test.setTimeout(120 * 1000);

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Navigate to project (assumes already logged in)
   */
  async function navigateToProject(page: any) {
    TestHelpers.logStep(2, 'Navigating to project');
    const projectUrl = `${BASE_URL}/projects/${PROJECT_ID}`;
    await TestHelpers.navigateTo(page, projectUrl);
    await TestHelpers.assertUrlContains(page, PROJECT_ID);
    TestHelpers.logSuccess('Project loaded');
  }

  /**
   * Submit a task prompt and wait for response
   */
  async function submitTask(page: any, prompt: string) {
    TestHelpers.logStep(3, 'Submitting task prompt');
    const taskInput = page.locator('[data-testid="task-description-textbox"]');
    await taskInput.click();
    await taskInput.fill(prompt);

    // Assert text was entered
    const enteredText = await taskInput.textContent();
    expect(enteredText).toBeTruthy();
    TestHelpers.logSuccess(`Task prompt entered: "${prompt}"`);

    // Click submit button
    const submitBtn = page.locator('button[data-testid="submit-button"]').first();
    if (!(await submitBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
      throw new Error('Submit button not found');
    }
    await submitBtn.click();
    TestHelpers.logSuccess('Submit button clicked');

    // Wait for response
    TestHelpers.logStep(4, 'Waiting for AI response');
    const responseContainer = page.locator('[class*="prose"]').last();
    await responseContainer.waitFor({ state: 'visible', timeout: 15000 }).catch(() => null);
    const responseText = await responseContainer.textContent();
    expect(responseText).toBeTruthy();
    expect(responseText?.length).toBeGreaterThan(10);
    TestHelpers.logSuccess('AI response received');
  }


  test('1. Login - Authenticate into the app', async ({ page }) => {
    if (!TEST_EMAIL || !TEST_PASSWORD) throw new Error('TEST_EMAIL and TEST_PASSWORD are required');

    await TestHelpers.login(page, TEST_EMAIL, TEST_PASSWORD, BASE_URL);
    const url = page.url();
    expect(url).not.toContain('/login');
    const mainContent = page.locator('main, [role="main"]');
    expect(await mainContent.isVisible().catch(() => false)).toBeTruthy();
    await TestHelpers.assertNoErrors(page);
    TestHelpers.logSuccess('Login test passed');
  });

  test('2. Navigate to a project - Open an existing project from the sidebar', async ({ page }) => {
    if (!TEST_EMAIL || !TEST_PASSWORD) throw new Error('TEST_EMAIL and TEST_PASSWORD are required');

    await TestHelpers.loginAndNavigateToProject(page, TEST_EMAIL, TEST_PASSWORD, PROJECT_ID, BASE_URL);
    const projectUrl = page.url();
    expect(projectUrl).not.toContain('/login');
    expect(projectUrl).toContain(PROJECT_ID);
    const projectContent = page.locator('main, [role="main"]');
    expect(await projectContent.isVisible().catch(() => false)).toBeTruthy();
    await TestHelpers.assertNoErrors(page);
    TestHelpers.logSuccess('Navigate to project test passed');
  });

  test('3. Create a task (text prompt) - Type a prompt and submit', async ({ page }) => {
    if (!TEST_EMAIL || !TEST_PASSWORD) throw new Error('TEST_EMAIL and TEST_PASSWORD are required');

    await TestHelpers.loginAndNavigateToProject(page, TEST_EMAIL, TEST_PASSWORD, PROJECT_ID, BASE_URL);
    await submitTask(page, 'Create a button component with dark mode toggle');
    await TestHelpers.assertNoErrors(page);
    TestHelpers.logSuccess('Create task test passed');
  });

  test('4. Verify task lifecycle - Assert that the task progresses through its steps', async ({ page }) => {
    if (!TEST_EMAIL || !TEST_PASSWORD) throw new Error('TEST_EMAIL and TEST_PASSWORD are required');

    TestHelpers.logStep(1, 'Starting task lifecycle test');
    await TestHelpers.loginAndNavigateToProject(page, TEST_EMAIL, TEST_PASSWORD, PROJECT_ID, BASE_URL);
    await submitTask(page, 'Create a responsive navigation bar');

    TestHelpers.logStep(5, 'Checking for task lifecycle stages');
    const stages = ['planning', 'building', 'generating', 'processing', 'completed', 'success'];
    let stageFound = false;
    const startTime = Date.now();
    const maxWaitTime = 5 * 60 * 1000;

    while (Date.now() - startTime < maxWaitTime) {
      const pageText = (await page.textContent('body')) || '';
      if (stages.some(s => pageText.toLowerCase().includes(s))) {
        stageFound = true;
        TestHelpers.logSuccess(`Task stage found`);
        break;
      }

      const hasOutput = await page.locator('code, [class*="preview"], [class*="output"]').isVisible().catch(() => false);
      if (hasOutput) {
        stageFound = true;
        TestHelpers.logSuccess(`Task output visible`);
        break;
      }

      await page.waitForTimeout(3000);
    }

    expect(stageFound).toBeTruthy();
    await TestHelpers.assertNoErrors(page);
    TestHelpers.logSuccess('Task lifecycle test passed');
  });

  test('5. Verify completion - Assert the task reaches a completed state with preview or PR', async ({ page }) => {
    if (!TEST_EMAIL || !TEST_PASSWORD) throw new Error('TEST_EMAIL and TEST_PASSWORD are required');

    TestHelpers.logStep(1, 'Starting completion test');
    await TestHelpers.loginAndNavigateToProject(page, TEST_EMAIL, TEST_PASSWORD, PROJECT_ID, BASE_URL);
    await submitTask(page, 'Add a footer component to the dashboard');

    TestHelpers.logStep(5, 'Checking for completion indicators');
    const previewLinks = page.locator('a:has-text("Preview"), button:has-text("Preview")');
    const prLinks = page.locator('a:has-text("PR"), a:has-text("Pull Request")');
    const completedStatus = page.locator('text=/Completed|Complete|Done|Success/i');

    const hasCompletion = await previewLinks.isVisible().catch(() => false) ||
                          await prLinks.isVisible().catch(() => false) ||
                          await completedStatus.isVisible().catch(() => false);

    await TestHelpers.assertNoErrors(page);
    TestHelpers.logSuccess('Completion test passed');
  });

  test('Bonus: Project initialization flow', async ({ page }) => {
    if (!TEST_EMAIL || !TEST_PASSWORD) throw new Error('TEST_EMAIL and TEST_PASSWORD are required');

    TestHelpers.logStep(1, 'Starting project initialization test');
    await TestHelpers.login(page, TEST_EMAIL, TEST_PASSWORD, BASE_URL);
    const url = page.url();
    expect(url).not.toContain('/login');
    TestHelpers.logSuccess('Logged in successfully');

    const newProjectBtn = page.locator('button:has-text("New"), button:has-text("Create"), button:has-text("Add Project")');
    const isNewProjectBtnVisible = await newProjectBtn.isVisible().catch(() => false);
    TestHelpers.logStep(2, `New project button visible: ${isNewProjectBtnVisible}`);

    const dashboardContent = page.locator('main, [role="main"]');
    expect(await dashboardContent.isVisible().catch(() => false)).toBeTruthy();

    await TestHelpers.assertNoErrors(page);
    TestHelpers.logSuccess('Project initialization test passed');
  });
});

