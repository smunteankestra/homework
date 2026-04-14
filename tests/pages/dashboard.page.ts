import { Page, expect } from '@playwright/test';

/**
 * DashboardPage - Page Object for projects list and initialization
 */
export class DashboardPage {
  readonly page: Page;

  // Navigation
  readonly dashboardTitle = 'h1:has-text("Projects"), h1:has-text("Dashboard")';
  readonly projectCard = (projectName: string) => `[data-testid="project-card"]:has-text("${projectName}"), [class*="project-card"]:has-text("${projectName}")`;
  readonly newProjectButton = 'button:has-text("New Project"), button:has-text("Create Project"), a:has-text("+ New")';

  // Project initialization
  readonly repoConnectButton = 'button:has-text("Connect Repository"), button:has-text("Connect Repo")';
  readonly repoSearchInput = 'input[placeholder*="repo"], input[placeholder*="search"]';
  readonly autoDetectButton = 'button:has-text("Auto-detect"), button:has-text("Detect")';
  readonly initializeButton = 'button:has-text("Initialize"), button:has-text("Start")';

  // Status indicators
  readonly initializingStatus = 'span:has-text("Initializing"), span:has-text("Setting up")';
  readonly readyStatus = 'span:has-text("Ready"), span:has-text("Active")';
  readonly loadingSpinner = '[data-testid="spinner"], [role="progressbar"], .spinner';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to dashboard/projects page
   */
  async goto() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if dashboard is loaded
   */
  async isLoaded() {
    await expect(this.page.locator(this.dashboardTitle)).toBeVisible({ timeout: 5000 });
  }

  /**
   * Get list of all projects
   */
  async getProjects(): Promise<string[]> {
    const projectCards = await this.page.locator('[data-testid="project-card"], [class*="project-card"]').all();
    const projects: string[] = [];

    for (const card of projectCards) {
      const name = await card.locator('h3, [class*="name"], [class*="title"]').first().textContent();
      if (name) {
        projects.push(name.trim());
      }
    }

    return projects;
  }

  /**
   * Open a project
   */
  async openProject(projectName: string) {
    const projectCard = this.page.locator(this.projectCard(projectName)).first();
    await expect(projectCard).toBeVisible({ timeout: 5000 });
    await projectCard.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Create a new project
   */
  async createNewProject() {
    const newButton = this.page.locator(this.newProjectButton);
    await expect(newButton).toBeVisible();
    await newButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if project is initializing
   */
  async isProjectInitializing(timeout: number = 60000) {
    const initStatus = this.page.locator(this.initializingStatus).first();
    try {
      await expect(initStatus).toBeVisible({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for project to be ready
   */
  async waitForProjectReady(projectName: string, timeout: number = 300000) {
    const projectCard = this.page.locator(this.projectCard(projectName)).first();
    const readyStatus = projectCard.locator('span:has-text("Ready"), span:has-text("Active"), span:has-text("Initialized")');

    await expect(readyStatus).toBeVisible({ timeout });
  }

  /**
   * Connect repository (for new projects)
   */
  async connectRepository(repoName: string) {
    const connectButton = this.page.locator(this.repoConnectButton);
    if (await connectButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await connectButton.click();
    }

    // Search for repo
    const searchInput = this.page.locator(this.repoSearchInput).first();
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill(repoName);
      await this.page.waitForTimeout(500);

      // Click on the first result
      const firstResult = this.page.locator('[role="option"], [data-testid="repo-option"]').first();
      await expect(firstResult).toBeVisible({ timeout: 5000 });
      await firstResult.click();
    }

    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Trigger auto-detect
   */
  async runAutoDetect(timeout: number = 120000) {
    const autoDetectBtn = this.page.locator(this.autoDetectButton);
    if (await autoDetectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await autoDetectBtn.click();
      await this.page.waitForLoadState('networkidle');

      // Wait for detection to complete
      const spinner = this.page.locator(this.loadingSpinner);
      try {
        await expect(spinner).not.toBeVisible({ timeout });
      } catch {
        // Spinner may not appear, that's okay
      }
    }
  }

  /**
   * Click initialize button
   */
  async initialize() {
    const initBtn = this.page.locator(this.initializeButton);
    if (await initBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await initBtn.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Wait for any loading spinners to disappear
   */
  async waitForLoadingComplete(timeout: number = 60000) {
    const spinners = this.page.locator(this.loadingSpinner);
    // Wait for all spinners to disappear
    try {
      await expect(spinners).not.toBeVisible({ timeout });
    } catch {
      // Spinners may not exist, that's okay
    }
  }
}

