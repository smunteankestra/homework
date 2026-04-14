import { Page, expect } from '@playwright/test';

/**
 * LoginPage - Page Object for authentication flow
 */
export class LoginPage {
  readonly page: Page;

  // Selectors - flexible to handle different UI variations
  readonly emailInput = 'input[type="email"], input[placeholder*="email"], input[id*="email"]';
  readonly passwordInput = 'input[type="password"], input[placeholder*="password"], input[id*="password"]';
  readonly loginButton = 'button:has-text("Sign in"), button:has-text("Login"), button:has-text("Submit")';
  readonly signUpLink = 'a:has-text("Sign up"), button:has-text("Sign up")';
  readonly forgotPasswordLink = 'a:has-text("Forgot password"), a:has-text("Forgot")';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to login page
   */
  async goto() {
    // Try multiple login paths
    try {
      await this.page.goto('/auth/login', { waitUntil: 'networkidle', timeout: 30000 });
    } catch {
      // Fallback to root + auth path
      await this.page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
      // Wait for login page or redirect
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string) {
    // Wait for email input with longer timeout
    await this.page.fill(this.emailInput, email, { timeout: 30000 });
    await this.page.fill(this.passwordInput, password, { timeout: 30000 });
    await this.page.click(this.loginButton, { timeout: 10000 });

    // Wait for redirect to dashboard or projects page
    await this.page.waitForURL('**/dashboard', { timeout: 30000 }).catch(() => {
      // If no dashboard redirect, just wait for navigation
      return this.page.waitForLoadState('networkidle', { timeout: 15000 });
    });
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

