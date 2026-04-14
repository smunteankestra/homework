import { Page, expect } from '@playwright/test';

/**
 * LoginPage - Page Object for authentication flow
 */
export class LoginPage {
  readonly page: Page;

  // Selectors
  readonly emailInput = 'input[type="email"]';
  readonly passwordInput = 'input[type="password"]';
  readonly loginButton = 'button:has-text("Sign in")';
  readonly signUpLink = 'a:has-text("Sign up")';
  readonly forgotPasswordLink = 'a:has-text("Forgot password")';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/auth/login');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);

    // Wait for redirect to dashboard or projects page
    await this.page.waitForURL('**/dashboard', { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if login page is visible
   */
  async isVisible() {
    await expect(this.page.locator(this.emailInput)).toBeVisible();
    await expect(this.page.locator(this.passwordInput)).toBeVisible();
    await expect(this.page.locator(this.loginButton)).toBeVisible();
  }

  /**
   * Get login error message
   */
  async getErrorMessage() {
    const errorMessage = this.page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    return await errorMessage.textContent();
  }
}

