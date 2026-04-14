import { Page, expect } from '@playwright/test';

/**
 * ProjectPage - Page Object for project dashboard and task creation
 */
export class ProjectPage {
  readonly page: Page;

  // Navigation
  readonly projectSidebar = 'aside:has-text("Projects")';
  readonly projectLink = (projectName: string) => `a:has-text("${projectName}")`;

  // Task creation
  readonly createTaskButton = 'button:has-text("Create Task")';
  readonly taskPromptInput = 'textarea[placeholder*="prompt"], textarea[placeholder*="task"], input[placeholder*="prompt"]';
  readonly taskSubmitButton = 'button:has-text("Submit"), button:has-text("Create"), button:has-text("Run")';

  // Task list and status
  readonly taskItem = (taskName: string) => `[data-testid="task-item"]:has-text("${taskName}"), div:has-text("${taskName}")`;
  readonly taskStatus = (status: string) => `[data-testid="task-status"]:has-text("${status}"), span:has-text("${status}")`;

  // Task lifecycle stages
  readonly planningStage = 'span:has-text("Planning")';
  readonly buildingStage = 'span:has-text("Building")';
  readonly completedStage = 'span:has-text("Completed")';
  readonly previewButton = 'button:has-text("Preview")';
  readonly prButton = 'button:has-text("PR"), a:has-text("Pull Request")';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific project
   */
  async navigateToProject(projectName: string) {
    const projectLink = this.page.locator(this.projectLink(projectName));
    await expect(projectLink).toBeVisible({ timeout: 5000 });
    await projectLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if project page is loaded
   */
  async isLoaded() {
    // Should see either task list or create task button
    await expect(
      this.page.locator(this.createTaskButton).or(this.page.locator('[data-testid="tasks-list"]'))
    ).toBeVisible({ timeout: 5000 });
  }

  /**
   * Create a new task with a prompt
   */
  async createTask(prompt: string) {
    const createButton = this.page.locator(this.createTaskButton);
    await expect(createButton).toBeVisible();
    await createButton.click();

    // Wait for prompt input to appear
    const promptInput = this.page.locator(this.taskPromptInput).first();
    await expect(promptInput).toBeVisible();
    await promptInput.fill(prompt);

    // Submit the task
    const submitButton = this.page.locator(this.taskSubmitButton);
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Wait for task to be created (usually redirects to task detail or shows in list)
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for task to reach a specific stage
   */
  async waitForTaskStage(stageName: string, timeout: number = 120000) {
    let stageLocator;

    switch (stageName.toLowerCase()) {
      case 'planning':
        stageLocator = this.page.locator(this.planningStage).first();
        break;
      case 'building':
        stageLocator = this.page.locator(this.buildingStage).first();
        break;
      case 'completed':
        stageLocator = this.page.locator(this.completedStage).first();
        break;
      default:
        stageLocator = this.page.locator(this.taskStatus(stageName)).first();
    }

    await expect(stageLocator).toBeVisible({ timeout });
  }

  /**
   * Check if task reached completed state
   */
  async isTaskCompleted(timeout: number = 300000) {
    // Wait for completed badge or state
    const completedIndicator = this.page.locator(this.completedStage).or(
      this.page.locator('span:has-text("Done")')
    );
    await expect(completedIndicator).toBeVisible({ timeout });
  }

  /**
   * Verify preview button is available
   */
  async canPreview() {
    const preview = this.page.locator(this.previewButton);
    return await preview.isVisible();
  }

  /**
   * Verify PR button/link is available
   */
  async canViewPR() {
    const pr = this.page.locator(this.prButton);
    return await pr.isVisible();
  }

  /**
   * Get task status
   */
  async getTaskStatus(): Promise<string | null> {
    const status = this.page.locator('[data-testid="task-status"], [class*="status"]').first();
    return await status.textContent();
  }

  /**
   * Navigate back to projects list
   */
  async backToProjects() {
    const backButton = this.page.locator('button:has-text("Back"), a[href*="projects"]').first();
    if (await backButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await backButton.click();
    } else {
      await this.page.goto('/projects');
    }
    await this.page.waitForLoadState('networkidle');
  }
}

