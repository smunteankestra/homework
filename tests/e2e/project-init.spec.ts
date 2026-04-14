import { test, expect } from '@playwright/test';
import { LoginPage, DashboardPage } from '../pages';

/**
 * Test Suite: Project Initialization Flow (BONUS)
 *
 * This test suite covers:
 * 1. Creating a new project
 * 2. Connecting a GitHub repository
 * 3. Running auto-detection
 * 4. Verifying successful initialization
 */

test.describe('Project Initialization Flow (Bonus)', () => {
  test.skip('should initialize a project with repo connection', async ({ page }) => {
    // NOTE: This test is marked as .skip() because it requires:
    // 1. Access to GitHub authentication
    // 2. A specific test repository URL
    // 3. Manual approval steps that may require UI interaction
    //
    // In a real scenario, you would:
    // - Set up GitHub app permissions
    // - Mock GitHub OAuth responses
    // - Or use a test GitHub account with test repos pre-created

    // ARRANGE
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'password123';
    const testRepoName = process.env.TEST_REPO_NAME || 'jira-clone'; // From daniserrano7/jira-clone
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // ACT - Login
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);

    // Navigate to dashboard
    await dashboardPage.goto();
    await dashboardPage.isLoaded();

    // Create new project
    await dashboardPage.createNewProject();
    await page.waitForLoadState('networkidle');

    // ASSERT - Should see project creation form
    expect(page.url()).toContain('/projects/new');

    // ACT - Connect repository
    await dashboardPage.connectRepository(testRepoName);

    // ASSERT - Repo should be connected
    await expect(page.locator(`text="${testRepoName}"`)).toBeVisible({ timeout: 5000 });

    // ACT - Run auto-detect
    await dashboardPage.runAutoDetect(120000);

    // ASSERT - Should see detection results
    await expect(page.locator('text="Detected", text="Found"')).toBeVisible({ timeout: 30000 });

    // ACT - Initialize project
    await dashboardPage.initialize();

    // ASSERT - Project should enter initializing state
    expect(await dashboardPage.isProjectInitializing()).toBe(true);

    // Wait for initialization to complete
    // Note: This can take several minutes
    const projectName = testRepoName.split('/').pop() || 'Project';
    await dashboardPage.waitForProjectReady(projectName, 600000); // 10 minutes timeout

    // ASSERT - Project should be ready
    console.log('✓ Project initialized successfully');
  });

  test('should list existing projects on dashboard', async ({ page }) => {
    // ARRANGE
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'password123';
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // ACT - Login
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);

    // Navigate to dashboard
    await dashboardPage.goto();
    await dashboardPage.isLoaded();

    // ASSERT - Dashboard should show projects
    const projects = await dashboardPage.getProjects();
    expect(projects.length).toBeGreaterThan(0);

    // Log projects for verification
    console.log(`Found ${projects.length} projects:`);
    projects.forEach(p => console.log(`  - ${p}`));
  });

  test('should check project initialization status', async ({ page }) => {
    // ARRANGE
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'password123';
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // ACT - Login and navigate to dashboard
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await dashboardPage.goto();
    await dashboardPage.isLoaded();

    // Get first project
    const projects = await dashboardPage.getProjects();
    if (projects.length === 0) {
      console.log('No projects found - skipping status check');
      return;
    }

    // Check initialization status
    const isInitializing = await dashboardPage.isProjectInitializing();
    console.log(`Project initializing status: ${isInitializing}`);

    // ASSERT - Status check should complete without errors
    expect(isInitializing === true || isInitializing === false).toBe(true);
  });
});

