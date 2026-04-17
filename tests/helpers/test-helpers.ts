import { Page, expect } from '@playwright/test';

/**
 * TestHelpers - Centralized utility methods for test automation
 * Contains reusable verification and action methods to reduce code duplication
 */
export class TestHelpers {
  /**
   * Assert that no error messages are displayed on the page
   */
  static async assertNoErrors(page: Page): Promise<void> {
    const errorCount = await page.locator('[role="alert"], .error, [class*="error"]').count();
    expect(errorCount).toBe(0);
  }

  /**
   * Assert that a specific element is visible and contains text
   */
  static async assertElementWithText(page: Page, selector: string, text: string): Promise<void> {
    const element = page.locator(selector);
    await expect(element).toBeVisible();
    const content = await element.textContent();
    expect(content).toContain(text);
  }

  /**
   * Assert that the page URL contains expected value
   */
  static async assertUrlContains(page: Page, expectedUrl: string): Promise<void> {
    expect(page.url()).toContain(expectedUrl);
  }

  /**
   * Assert that the page URL does NOT contain value
   */
  static async assertUrlNotContains(page: Page, unexpectedUrl: string): Promise<void> {
    expect(page.url()).not.toContain(unexpectedUrl);
  }

  /**
   * Wait for a specific element to become visible
   */
  static async waitForElement(page: Page, selector: string, timeout: number = 10000): Promise<void> {
    const element = page.locator(selector).first();
    await expect(element).toBeVisible({ timeout });
  }

  /**
   * Fill input field with value
   */
  static async fillInput(page: Page, selector: string, value: string, timeout: number = 10000): Promise<void> {
    const input = page.locator(selector).first();
    await input.waitFor({ state: 'visible', timeout });
    await input.fill(value);
  }

  /**
   * Click a button and wait for navigation
   */
  static async clickButton(page: Page, selector: string, timeout: number = 10000): Promise<void> {
    const button = page.locator(selector).first();
    await expect(button).toBeVisible({ timeout });
    await button.click();
  }

  /**
   * Navigate to URL and wait for page to load
   */
  static async navigateTo(
    page: Page,
    url: string,
    waitUntil: 'domcontentloaded' | 'load' | 'networkidle' = 'domcontentloaded',
    timeout: number = 30000
  ): Promise<void> {
    await page.goto(url, { waitUntil, timeout });
  }

  /**
   * Wait for URL to change (useful after form submissions or navigation)
   */
  static async waitForUrlChange(page: Page, timeout: number = 60000): Promise<void> {
    await page.waitForURL('**/', { timeout }).catch(() => {
      // URL might not change in all scenarios, that's okay
    });
  }

  /**
   * Get text content from element
   */
  static async getElementText(page: Page, selector: string): Promise<string> {
    const element = page.locator(selector).first();
    const text = await element.textContent();
    return text ? text.trim() : '';
  }

  /**
   * Check if element is visible
   */
  static async isElementVisible(page: Page, selector: string, timeout: number = 5000): Promise<boolean> {
    try {
      const element = page.locator(selector).first();
      await expect(element).toBeVisible({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for loading spinners to disappear
   */
  static async waitForLoadingComplete(page: Page, timeout: number = 30000): Promise<void> {
    const spinners = page.locator('[data-testid="spinner"], [role="progressbar"], .spinner');
    try {
      await expect(spinners).not.toBeVisible({ timeout });
    } catch {
      // Spinners may not exist, that's okay
    }
  }

  /**
   * Log a test step (for debugging and readability)
   */
  static logStep(stepNumber: number, description: string): void {
    console.log(`📝 STEP ${stepNumber}: ${description}`);
  }

  /**
   * Log a success message
   */
  static logSuccess(message: string): void {
    console.log(`✅ ${message}`);
  }

  /**
   * Log a warning message
   */
  static logWarning(message: string): void {
    console.log(`⚠️  ${message}`);
  }

  /**
   * Log current page URL (useful for debugging)
   */
  static logCurrentUrl(page: Page): void {
    console.log(`Current URL: ${page.url()}`);
  }

  /**
   * Take a screenshot for debugging (optional)
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ path: `test-results/${name}.png` });
  }

  /**
   * Login with email and password
   * Navigates to login page, fills credentials, and waits for redirect
   */
  static async login(page: Page, email: string, password: string, baseUrl: string = 'https://studio.autonomyai.io'): Promise<void> {
    if (!email || !password) {
      throw new Error('Email and password are required for login');
    }

    this.logStep(1, 'Navigating to login page');
    await this.navigateTo(page, `${baseUrl}/login`);

    this.logStep(2, 'Filling email');
    await this.fillInput(page, 'input[type="email"]', email);

    this.logStep(3, 'Filling password');
    await this.fillInput(page, 'input[type="password"]', password);

    this.logStep(4, 'Clicking login button');
    await this.clickButton(page, 'button[type="submit"], button:has-text("Sign in"), button:has-text("Login")');

    this.logStep(5, 'Waiting for redirect');
    await this.waitForUrlChange(page);
    this.logSuccess('Login completed');
  }

  /**
   * Login and navigate to project in one call
   */
  static async loginAndNavigateToProject(page: Page, email: string, password: string, projectId: string, baseUrl: string = 'https://studio.autonomyai.io'): Promise<void> {
    await this.login(page, email, password, baseUrl);

    this.logStep(6, 'Navigating to project');
    const projectUrl = `${baseUrl}/projects/${projectId}`;
    await this.navigateTo(page, projectUrl);
    await this.assertUrlContains(page, projectId);
    this.logSuccess(`Project loaded: ${projectId}`);
  }
}
