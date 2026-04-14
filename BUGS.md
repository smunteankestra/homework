# Bug & UX Report - Autonomy AI Studio

## Testing Session: April 14, 2026
**Product:** Autonomy AI Studio (studio.autonomyai.io)  
**Tested By:** QA Evaluation  
**Test Environment:** Production

---

## Issue #1: Dark Mode Toggle Component Doesn't Change Theme

**Title:** Dark Mode Toggle button in header does not switch between light and dark themes

**Severity:** 🔴 **Major** — Core UX feature doesn't work as intended

**Steps to Reproduce:**
1. Log into Autonomy AI Studio
2. Create a new project by connecting a GitHub repository
3. Wait for project initialization to complete
4. Look at the top navbar header
5. Locate the dark mode toggle button (sun/moon icon)
6. Click the toggle button to switch themes
7. Observe the app behavior

**Expected Behavior:**
- When the toggle button is clicked, the entire app theme should switch instantly
- If currently in light mode, clicking should switch to dark mode
- If currently in dark mode, clicking should switch to light mode
- The toggle icon should update (sun ↔ moon)
- The existing theme dropdown selector should stay in sync with the toggle
- Theme preference should persist on page reload

**Actual Behavior:**
- Clicking the toggle button has no visible effect
- The theme does not change
- Neither light mode nor dark mode is activated
- The toggle appears to be non-functional
- No console errors visible to the user

**Environment:**
- Browser: Chrome/Edge (exact version from recording: TBD)
- App URL: studio.autonomyai.io
- Session: Active project with initialization complete

**Evidence:**
- Recording: `screenshots:recordings/theme change.mov` shows multiple click attempts with no theme change

**Root Cause Analysis (Suspected):**
- The `setTheme()` function may not be wired up correctly in the dark-mode-toggle component
- The server action `action/set-theme` route may not be responding correctly
- Theme context may not be propagating to the DOM/CSS classes
- Cookie persistence may be failing silently

**Workaround:**
- Use the full theme selector dropdown (located to the right of the toggle)
- Select "Dark" or "Light" from the full theme menu

---

## Issue #2: Existing Theme Dropdown Selector Works, But Toggle Is Inconsistent

**Title:** Theme selector dropdown works but toggle button state doesn't sync with actual theme

**Severity:** 🟡 **Major** — Confusing UX; button state vs. actual theme mismatch

**Steps to Reproduce:**
1. Log in and initialize a project
2. Use the full theme selector dropdown (right of the broken toggle) to change to "Dark" theme
3. Observe that the app successfully changes to dark mode
4. Now look at the toggle button's icon (sun/moon)
5. The toggle icon may not reflect the actual current theme

**Expected Behavior:**
- The toggle button icon should always match the current theme state
- If dark mode is active, the moon icon should be visible
- If light mode is active, the sun icon should be visible
- Icon should update immediately after using either the toggle or the dropdown selector

**Actual Behavior:**
- Toggle button icon does not update when theme is changed via the dropdown
- Icon state becomes out-of-sync with actual theme
- This suggests the component is not properly reading from the ThemeContext

**Impact:**
- Users cannot trust the toggle as a visual indicator of the current theme
- Reduces usability and creates confusion about which mode is active

---

## Issue #3: Theme Preference Not Persisting After Page Reload

**Title:** Selected theme preference resets to default after page refresh

**Severity:** 🟡 **Major** — Data loss/session management issue

**Steps to Reproduce:**
1. Log into the app and initialize a project
2. Use the theme selector to change to "Dark" theme
3. Verify the app switches to dark mode
4. Reload the page (Cmd+R or F5)
5. Observe the theme after reload

**Expected Behavior:**
- The previously selected theme (dark mode) should persist
- User should see the same theme they set before the reload
- Cookie or localStorage should store the preference

**Actual Behavior:**
- The app reverts to light mode after page reload
- Theme preference is not being saved/persisted
- OR preference is saved but not being read on app initialization

**Environment:**
- Tested in Chrome/Edge with cookies enabled
- Session is still active (user is not logged out)

**Root Cause Analysis (Suspected):**
- Server-side cookie persistence (`action/set-theme`) may not be working
- Client-side session storage may not be reading the saved preference
- Timing issue: theme preference being read before it's written to storage

**Workaround:**
- Users must reset their theme preference each time they reload the page

---

## Issue #4: Forgot Password API Returns 500 Error for Gmail Accounts

**Title:** Forgot password endpoint returns 500 Internal Server Error

**Severity:** 🔴 **Critical** — Authentication/account recovery is completely broken

**Steps to Reproduce:**
1. Navigate to login page at https://studio.autonomyai.io/
2. Click on **"Forgot password?"** link
3. Enter a Gmail email address (e.g., `trashneak@gmail.com`)
4. Click **"Send reset link"** or equivalent button
5. Observe the error

**Expected Behavior:**
- Password reset email should be sent to the user's inbox
- User should see confirmation message: "Check your email for password reset link"
- No server errors should occur
- Email should arrive within 1-5 minutes

**Actual Behavior:**
- Request fails with HTTP 500 Internal Server Error
- User sees error message or blank page
- No reset email is sent
- Backend is throwing an unhandled exception

**API Details:**
```
Request URL: https://api.prod.autonomyai.io/auth/v1/oauth/user/cognito/password/forgot
Request Method: POST
Status Code: 500 Internal Server Error
Content-Type: application/json
Referrer Policy: strict-origin-when-cross-origin
```

**Environment:**
- Browser: Chrome/Edge
- App URL: https://studio.autonomyai.io/
- Test Email: Gmail account (trashneak@gmail.com)
- Session: Unauthenticated (on login page)

**Root Cause Analysis (Suspected):**
- Cognito integration may not handle Gmail OAuth accounts correctly
- Password reset endpoint may not support OAuth-connected accounts
- Email service may be misconfigured or have invalid credentials
- Database query for user lookup may be failing
- CORS or authentication headers may be missing/incorrect

**Impact:**
- Users with Gmail accounts cannot reset forgotten passwords
- Account recovery flow is broken for OAuth users
- Likely affects all OAuth providers (Google, GitHub, etc.)
- Users may be permanently locked out if they forget passwords

**Workaround:**
- None available - users cannot access their accounts
- May require support team intervention to manually reset password

**Recommendation:**
- Immediately investigate Cognito OAuth integration
- Check email service configuration and credentials
- Add error logging to identify exact failure point
- Test password reset with all OAuth providers
- Add proper error handling and user-friendly error messages

---

## Summary

| Issue # | Title | Severity | Blocker? | Status |
|---------|-------|----------|----------|--------|
| 1 | Dark Mode Toggle doesn't change theme | Major | Yes | New |
| 2 | Toggle icon doesn't sync with actual theme | Major | Yes | New |
| 3 | Theme preference not persisting | Major | Yes | New |
| 4 | Forgot password API returns 500 error | Critical | Yes | New |

### Recommended Fix Priority
1. **Immediate (P0):** Issue #4 - Fix forgot password API (authentication is broken!)
2. **Immediate (P0):** Issue #1 - Fix the toggle button functionality (core UX feature)
3. **High (P1):** Issue #3 - Fix theme persistence (affects all users)
4. **High (P1):** Issue #2 - Fix icon sync (UX clarity issue)

### Test Coverage Recommendations
- Add automated E2E tests for theme switching via toggle
- Add tests for theme persistence across page reloads
- Add tests for password reset with Gmail/OAuth accounts
- Add tests for password reset error handling
- Add visual regression tests for theme-dependent styling
- Add API health checks for critical endpoints

