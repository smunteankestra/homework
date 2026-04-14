# 🐛 Bug & UX Report - Autonomy AI Studio

## 📋 Testing Summary
**Product:** Autonomy AI Studio (studio.autonomyai.io)  
**Tested:** April 14, 2026  
**Tester:** QA Evaluation  
**Environment:** Production

---

## 🚨 Issue #1: Dark Mode Toggle Doesn't Work

**Title:** Dark Mode Toggle button in header doesn't change theme ❌

**Severity:** 🔴 **Critical**

**Steps to Reproduce:**
1. Log into Autonomy AI Studio
2. Initialize a project (connect GitHub repo, wait for completion)
3. Look at the top navbar
4. Find the dark mode toggle button (sun/moon icon)
5. Click it multiple times
6. Observe nothing happens

**Expected Behavior:** 🎯
- ✅ Theme switches instantly between light ↔ dark
- ✅ Icon changes (sun → moon or vice versa)
- ✅ All page colors update smoothly
- ✅ Preference persists after page reload

**Actual Behavior:** 😞
- ❌ Button appears to work (clickable) but does nothing
- ❌ Theme doesn't change at all
- ❌ No visual feedback to user
- ❌ No error messages (fails silently)

**User Impact:** 
Users trying to use dark mode get frustrated and must use the clunky dropdown menu instead.

**Workaround:** 🔧
Use the full theme selector dropdown to the right of the broken toggle

---

## 🔄 Issue #2: Theme Toggle Not Synced with Dropdown

**Title:** Toggle icon doesn't reflect actual theme state

**Severity:** 🟡 **Major**

**Steps to Reproduce:**
1. Log in to a project
2. Change theme using the dropdown selector to "Dark"
3. App switches to dark mode successfully
4. Look at the toggle button's icon
5. Icon still shows the old state

**Expected Behavior:** 🎯
- ✅ Toggle icon always shows current theme
- ✅ When dark mode is on → moon icon visible
- ✅ When light mode is on → sun icon visible
- ✅ Icon updates whether theme changed via toggle OR dropdown

**Actual Behavior:** 😞
- ❌ Toggle icon doesn't update when theme changes
- ❌ Icon gets out-of-sync with real theme
- ❌ Confusing for users (what mode am I in?)

**User Impact:**
Users can't trust the toggle button as a visual indicator of current theme.

---

## 💾 Issue #3: Theme Preference Doesn't Save

**Title:** Theme resets to light every time page reloads

**Severity:** 🟡 **Major**

**Steps to Reproduce:**
1. Log in and open a project
2. Change theme to Dark using dropdown
3. Confirm app shows dark mode
4. Reload page (Cmd+R or F5)
5. App loads... back to light mode 😤

**Expected Behavior:** 🎯
- ✅ Theme preference is saved (cookie or localStorage)
- ✅ When user refreshes, their choice is remembered
- ✅ Theme loads before page render (no flash)

**Actual Behavior:** 😞
- ❌ Theme resets to light mode on every reload
- ❌ Preference not being saved at all
- ❌ Frustrating user experience

**User Impact:**
Users must set theme preference every single time they reload. Annoying.

---

## 🔐 Issue #4: Password Reset API Crashes (500 Error)

**Title:** Forgot password completely broken for Gmail/OAuth accounts

**Severity:** 🔴 **Critical** ⚠️ **SECURITY ISSUE**

**Steps to Reproduce:**
1. Go to https://studio.autonomyai.io/
2. Click "Forgot password?"
3. Enter Gmail address (e.g., trashneak@gmail.com)
4. Click "Send reset link"
5. Watch the error... 💥

**Expected Behavior:** 🎯
- ✅ Reset email sent to inbox
- ✅ User sees success message
- ✅ User can click email link and reset password

**Actual Behavior:** 😞
```
❌ HTTP 500 Internal Server Error
❌ API: https://api.prod.autonomyai.io/auth/v1/oauth/user/cognito/password/forgot
❌ No email sent
❌ User completely locked out
```

**User Impact:** 🚨 SEVERE
- Users with Gmail accounts **cannot recover forgotten passwords**
- They're permanently locked out
- Affects ALL OAuth providers (Google, GitHub, etc.)

**Root Cause (Suspected):**
- Cognito OAuth integration broken
- Backend not handling OAuth users correctly

---

## 📄 Issue #5: Projects Page Completely Broken

**Title:** /projects/ page shows nothing (blank page)

**Severity:** 🔴 **Critical**

**Steps to Reproduce:**
1. Log in
2. Navigate to https://studio.autonomyai.io/projects/
3. Stare at blank page... 😑

**Expected Behavior:** 🎯
- ✅ See list of all your projects
- ✅ Project cards show name, status, repo info
- ✅ Can click to open or manage projects
- ✅ "Create new project" button visible

**Actual Behavior:** 😞
- ❌ Page is completely blank
- ❌ No projects displayed (even though they exist!)
- ❌ No navigation options
- ❌ Loading forever or error state

**User Impact:**
Projects exist but users can't view them from the /projects/ hub. Forces users to use workarounds.

**Workaround:** 🔧
- Access projects from dashboard home
- Use direct project URLs if you know them
- Use sidebar navigation

---

## 📊 Summary Table

| # | Issue | Severity | Type | Status |
|---|-------|----------|------|--------|
| 1 | 🌓 Dark Mode Toggle Broken | 🔴 Critical | Feature Bug | 🆕 New |
| 2 | 🔄 Toggle Icon Out-of-Sync | 🟡 Major | UI Bug | 🆕 New |
| 3 | 💾 Theme Not Saved | 🟡 Major | UX Bug | 🆕 New |
| 4 | 🔐 Password Reset (500 Error) | 🔴 Critical | Security | 🆕 New |
| 5 | 📄 Projects Page Blank | 🔴 Critical | Navigation | 🆕 New |

---

## ⚡ Fix Priority

### 🔴 P0 - CRITICAL (Do ASAP!)
1. **Issue #4** - Password reset broken = users locked out forever 🚨
2. **Issue #5** - Projects page broken = navigation destroyed 🗺️
3. **Issue #1** - Dark mode toggle = broken feature 🌓

### 🟡 P1 - HIGH (Soon!)
4. **Issue #3** - Theme not saving = annoying but not blocking 💾
5. **Issue #2** - Toggle icon out of sync = confusing 🔄

---

## 💡 Recommendations

✅ **Immediate Actions:**
- [ ] Investigate Cognito OAuth password reset endpoint
- [ ] Check /projects/ API endpoint health
- [ ] Debug dark mode toggle component wiring
- [ ] Add error logging to see failures

✅ **Testing:**
- [ ] Add E2E tests for theme switching
- [ ] Add tests for theme persistence
- [ ] Test password reset with Gmail/GitHub accounts
- [ ] Monitor /projects/ page performance

✅ **User Communication:**
- [ ] Let users know about password reset issue
- [ ] Document workaround for projects page
- [ ] Let users know about dark mode limitations

---

**Last Updated:** April 14, 2026  
**Status:** 🆕 Ready for dev team review  
**Estimated Impact:** High - affects core features

