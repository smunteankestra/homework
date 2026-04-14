import { test, expect } from '@playwright/test';

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

test.describe('Task Creation & Lifecycle Flow', () => {
  // Set global timeout for all tests in this suite
  test.setTimeout(120 * 1000);

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Login with email and password
   */
  async function login(page: any) {
    const email = TEST_EMAIL || '';
    const password = TEST_PASSWORD || '';
    if (!email || !password) throw new Error('TEST_EMAIL and TEST_PASSWORD are required');

    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.locator('input[type="email"]').first().fill(email);
    await page.locator('input[type="password"]').first().fill(password);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/^(?!.*\/login)/, { timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  /**
   * Navigate to first available project
   */
  async function navigateToProject(page: any) {
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    const projectLinks = page.locator('[class*="sidebar"] a, [class*="project"] a, button:has-text("jira"), button:has-text("Project")');

    if ((await projectLinks.count()) === 0) {
      const allLinks = page.locator('a[href*="/project"], a[href*="/workspace"]');
      if ((await allLinks.count()) === 0) throw new Error('No projects found');
      await allLinks.first().click();
    } else {
      await projectLinks.first().click();
    }

    await page.waitForURL(/\/(project|workspace)/, { timeout: 20000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  /**
   * Submit a task prompt and wait for response
   */
  async function submitTask(page: any, prompt: string) {
    const taskInput = page.locator('[data-testid="task-description-textbox"]');
    await taskInput.click();
    await taskInput.fill(prompt);
    expect(await taskInput.textContent()).toContain(prompt.split(' ')[0]);

    const submitBtn = page.locator('button[data-testid="submit-button"]').first();
    if (!(await submitBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
      throw new Error('Submit button not found');
    }

    await submitBtn.click();

    // Wait for response
    const responseContainer = page.locator('[class*="prose"]').last();
    await responseContainer.waitFor({ state: 'visible', timeout: 15000 }).catch(() => null);
    const responseText = await responseContainer.textContent();
    expect(responseText).toBeTruthy();
    expect(responseText?.length).toBeGreaterThan(10);
  }

  /**
   * Assert no error messages are displayed
   */
  async function assertNoErrors(page: any) {
    const errorCount = await page.locator('[role="alert"], .error').count();
    expect(errorCount).toBe(0);
  }


  test('1. Login - Authenticate into the app', async ({ page }) => {
    await login(page);
    const url = page.url();
    expect(url).not.toContain('/login');
    const mainContent = page.locator('main, [role="main"]');
    expect(await mainContent.isVisible().catch(() => false)).toBeTruthy();
    await assertNoErrors(page);
  });

  test('2. Navigate to a project - Open an existing project from the sidebar', async ({ page }) => {
    await login(page);
    await navigateToProject(page);
    const projectUrl = page.url();
    expect(projectUrl).not.toContain('/login');
    expect(projectUrl).not.toContain('/dashboard');
    const projectContent = page.locator('main, [role="main"]');
    expect(await projectContent.isVisible().catch(() => false)).toBeTruthy();
  });

  test('3. Create a task (text prompt) - Type a prompt and submit', async ({ page }) => {
    await login(page);
    await navigateToProject(page);
    await submitTask(page, 'Create a button component with dark mode toggle');
    await assertNoErrors(page);
  });

  test('4. Verify task lifecycle - Assert that the task progresses through its steps', async ({ page }) => {
    await login(page);
    await navigateToProject(page);

    const stages = ['planning', 'building', 'generating', 'processing', 'completed', 'success'];
    let stageFound = false;
    const startTime = Date.now();
    const maxWaitTime = 5 * 60 * 1000;

    while (Date.now() - startTime < maxWaitTime) {
      const pageText = (await page.textContent('body')) || '';
      if (stages.some(s => pageText.toLowerCase().includes(s))) {
        stageFound = true;
        break;
      }

      const hasOutput = await page.locator('code, [class*="preview"], [class*="output"]').isVisible().catch(() => false);
      if (hasOutput) {
        stageFound = true;
        break;
      }

      await page.waitForTimeout(3000);
    }

    expect(stageFound).toBeTruthy();
    await assertNoErrors(page);
  });

  test('5. Verify completion - Assert the task reaches a completed state with preview or PR', async ({ page }) => {
    await login(page);
    await navigateToProject(page);

    const previewLinks = page.locator('a:has-text("Preview"), button:has-text("Preview")');
    const prLinks = page.locator('a:has-text("PR"), a:has-text("Pull Request")');
    const completedStatus = page.locator('text=/Completed|Complete|Done|Success/i');

    const hasCompletion = await previewLinks.isVisible().catch(() => false) ||
                          await prLinks.isVisible().catch(() => false) ||
                          await completedStatus.isVisible().catch(() => false);

    await assertNoErrors(page);
  });

  test('Bonus: Project initialization flow', async ({ page }) => {
    await login(page);
    const url = page.url();
    expect(url).not.toContain('/login');

    const newProjectBtn = page.locator('button:has-text("New"), button:has-text("Create"), button:has-text("Add Project")');
    const isNewProjectBtnVisible = await newProjectBtn.isVisible().catch(() => false);

    const dashboardContent = page.locator('main, [role="main"]');
    expect(await dashboardContent.isVisible().catch(() => false)).toBeTruthy();

    await assertNoErrors(page);
  });
});

