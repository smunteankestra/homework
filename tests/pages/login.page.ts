import { Page } from '@playwright/test';

/**
 * LoginPage - Page Object for authentication flow
 */
export class LoginPage {
  readonly page: Page;

  // Selectors - flexible to handle different UI variations
  readonly emailInput = 'input[type="email"], input[placeholder*="email"], input[id*="email"]';
  readonly passwordInput = 'input[type="password"], input[placeholder*="password"], input[id*="password"]';
  readonly loginButton = 'button:has-text("Sign in"), button:has-text("Login"), button:has-text("Submit")';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Login with email and password
   * Automatically navigates to login page if not already there
   */
  async login(email: string, password: string) {
    // Ensure we're on login page - navigate if not
    if (!this.page.url().includes('/login')) {
      await this.page.goto('https://studio.autonomyai.io/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    }

    // Wait for and fill email input
    const emailInputElement = this.page.locator(this.emailInput).first();
    await emailInputElement.waitFor({ state: 'visible', timeout: 15000 });
    await emailInputElement.fill(email);

    // Wait for and fill password input
    const passwordInputElement = this.page.locator(this.passwordInput).first();
    await passwordInputElement.waitFor({ state: 'visible', timeout: 15000 });
    await passwordInputElement.fill(password);

    // Click login button
    const loginButtonElement = this.page.locator(this.loginButton).first();
    await loginButtonElement.waitFor({ state: 'visible', timeout: 15000 });
    await loginButtonElement.click();

    // Wait for URL to change away from /login
    await this.page.waitForURL('**/!(login)', { timeout: 60000 }).catch(() => {
      // Timeout is okay, just wait a bit more
    });

    // Wait for page to stabilize
    await this.page.waitForTimeout(2000);
  }
}




