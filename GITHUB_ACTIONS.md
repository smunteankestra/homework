# GitHub Actions CI/CD Documentation

This repository includes two GitHub Actions workflows for automated test execution:

## 1. **e2e-tests.yml** - Scheduled/PR Workflow

### Triggers
- ✅ **On Pull Requests** - To `main` or `develop` branches (PR checks)
- ✅ **On Push** - To `main` branch (after merge)
- ✅ **On Schedule** - Nightly at 2 AM UTC (continuous monitoring)

### Configuration
```yaml
on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
```

### What It Does
1. Checks out code
2. Sets up Node.js 18 with npm caching
3. Installs dependencies
4. Installs Playwright browsers
5. Runs full test suite in headless mode
6. Uploads HTML test report (30 days retention)
7. Uploads test videos if tests fail (7 days retention)
8. Comments on PR with results

### Secrets Required
Set these in GitHub Settings → Secrets and Variables → Actions:
```
TEST_EMAIL     = your-test-account@example.com
TEST_PASSWORD  = your-secure-password
```

### Environment Variables Used
```
BASE_URL=https://studio.autonomyai.io
HEADLESS=true  # Important: Run headless in CI
```

### Example PR Comment
When tests complete on a PR, it posts:
```
🤖 E2E Test Results
Status: ✅ Passed
Details: Branch: feature/new-component
Report: Download artifact "playwright-report"
```

---

## 2. **e2e-tests-manual.yml** - Manual Trigger Workflow

### Triggers
- ✅ **Manual only** - Via GitHub Actions "Run workflow" button

### Configuration
```yaml
on:
  workflow_dispatch:
    inputs:
      headless:
        description: 'Run in headless mode (true/false)'
        required: true
        default: 'false'
```

### Usage
1. Go to **Actions** tab in your GitHub repository
2. Select **"E2E Tests (Manual)"** workflow
3. Click **"Run workflow"** button
4. Choose `headless` mode:
   - `false` - See browser (useful for debugging)
   - `true` - Headless (faster execution)
5. Click **"Run workflow"**

### What It Does
Same as scheduled workflow, but allows:
- ✅ Custom headless setting via input
- ✅ Manual execution anytime
- ✅ Ideal for debugging or testing on-demand
- ✅ Test in visible browser mode if needed

---

## Setup Instructions

### Step 1: Add Secrets to GitHub

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add two secrets:

| Name | Value |
|------|-------|
| `TEST_EMAIL` | Your test account email |
| `TEST_PASSWORD` | Your test account password |

⚠️ **Important:**
- Use a dedicated test account (not personal)
- Ensure it's not MFA-protected or use app password
- Regenerate periodically for security

### Step 2: Verify Workflows

1. Go to **Actions** tab
2. You should see:
   - ✅ "E2E Tests (Scheduled)" - with PR/Push/Schedule triggers
   - ✅ "E2E Tests (Manual)" - with "Run workflow" button

### Step 3: Test Setup

1. Create a PR or push to `main`
2. Go to **Actions** tab
3. See workflow run in progress
4. Wait for completion
5. View results and artifacts

---

## Monitoring & Troubleshooting

### Check Workflow Status
```
Actions → Select workflow → View runs
```

### Download Test Report
1. Go to workflow run
2. Scroll to **Artifacts**
3. Download `playwright-report`
4. Open `index.html` in browser

### Debug Failing Tests
1. Download `playwright-videos` artifact
2. Download `playwright-report`
3. Check video for what failed
4. Run `npm run test:debug` locally to reproduce

### Common Issues

**Issue: "Workflow failed - Cannot find module"**
- Fix: Run `npm install` locally first
- Push: Ensure `package-lock.json` is committed

**Issue: "Secret not found"**
- Fix: Go to Settings → Secrets → Verify `TEST_EMAIL` and `TEST_PASSWORD` exist
- Commit: Restart workflow after adding secrets

**Issue: "Timeout waiting for login"**
- Fix: Verify `TEST_EMAIL` and `TEST_PASSWORD` are correct
- Check: Test account is not locked
- Try: Run manual workflow with debugging

**Issue: Tests pass locally but fail in CI**
- Check: Environment variables in CI vs local `.env`
- Check: Network connectivity to `studio.autonomyai.io`
- Try: Run manual workflow in headed mode to see what's happening

---

## Best Practices

### 1. Run on PR
```yaml
pull_request:
  branches: [main, develop]
```
Ensures all code changes are tested before merging.

### 2. Schedule Nightly Runs
```yaml
schedule:
  - cron: '0 2 * * *'
```
Catches issues with:
- Production environment changes
- API updates
- Upstream dependency issues

### 3. Clear Secrets
Never include credentials in:
- ❌ Source code
- ❌ Workflow files
- ❌ Configuration files
- ✅ GitHub Secrets only

### 4. Artifact Retention
```yaml
retention-days: 30  # Reports
retention-days: 7   # Videos (failures only)
```
Balance: storage cost vs. debugging needs

### 5. Parallelization
Current setup: single worker (stable, no conflicts)

To parallelize (if using multiple accounts):
```yaml
workers: 2  # Update in playwright.config.ts
```

---

## CI/CD Integration Strategy

### For Your Team

1. **Development**
   - Developers run tests locally: `npm run test:headed`
   - Push code with confidence

2. **PR Checks**
   - Automated tests run on all PRs
   - Results posted as comment
   - Blocks merge if tests fail

3. **Nightly Monitoring**
   - Scheduled runs catch environment issues
   - Alerts if production is unstable
   - Baseline health check

4. **On-Demand Debugging**
   - Manual workflow for quick testing
   - Visible browser mode for investigation
   - Useful for hotfixes

### Scaling Recommendations

| Scale | Setup |
|-------|-------|
| **Small** | Current: PR + Nightly |
| **Medium** | Add: Manual workflow, multiple browsers |
| **Large** | Add: Separate staging tests, parallel workers, custom reporters |

---

## Environment Variables Reference

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `BASE_URL` | Yes | `https://studio.autonomyai.io` | Target app URL |
| `TEST_EMAIL` | Yes | None | Test account email |
| `TEST_PASSWORD` | Yes | None | Test account password |
| `HEADLESS` | No | `true` | Run headless browser |
| `DEBUG` | No | `false` | Enable debug logging |
| `TIMEOUT` | No | `120000` | Test timeout (ms) |

---

## Example: Complete Workflow

```
1. Developer creates feature branch
   └─ Makes changes to code

2. Developer commits and pushes
   └─ Creates Pull Request

3. GitHub Actions triggers automatically
   ├─ Runs test suite on PR
   ├─ Posts results as PR comment
   └─ Blocks merge if tests fail

4. Developer reviews failures
   └─ Can run: npm run test:debug locally
   └─ Or use manual workflow for debugging

5. Developer fixes issues
   └─ Commits and pushes updates

6. GitHub Actions re-runs tests
   └─ If all pass → Approve merge

7. Code merged to main
   └─ Workflow runs again on push
   └─ Monitors production

8. Nightly scheduled run
   └─ Tests production environment
   └─ Alerts team if issues found
```

---

## Maintenance Checklist

- [ ] Verify secrets are set correctly
- [ ] Test workflows work manually first
- [ ] Monitor nightly runs for issues
- [ ] Update test credentials when test account expires
- [ ] Review artifact retention settings monthly
- [ ] Update browser versions in `playwright.install`
- [ ] Archive old test reports

---

**Last Updated:** April 14, 2026  
**Status:** ✅ Configured and Ready  
**Support:** Check GitHub Actions logs for detailed error messages

