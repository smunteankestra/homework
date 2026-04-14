# 🔐 SSO LOGIN GUIDE - Autonomy AI Studio

## Email Corrected ✅
Your email in `.env` is now fixed:
```env
TEST_EMAIL=trashneak@gmail.com  ✅ (was: trashneak@gmaill.com)
TEST_PASSWORD=your-test-password
```

---

## How to Login with SSO (Single Sign-On)

### Option 1: Gmail/Google SSO (Recommended)

**Step 1: Go to Login Page**
- URL: https://studio.autonomyai.io/
- Look for login options

**Step 2: Choose "Sign in with Google" or Similar**
- You should see buttons like:
  - "Sign in with Google"
  - "Sign in with GitHub"
  - "Sign in with Gmail"

**Step 3: Click Gmail/Google Button**
```
┌─────────────────────────────────────┐
│  Welcome to Autonomy AI Studio      │
│                                     │
│  [Sign in with Google] ← Click this │
│  [Sign in with GitHub]              │
│  [Email & Password]                 │
│                                     │
└─────────────────────────────────────┘
```

**Step 4: Authenticate with Google**
- You'll be redirected to Google login
- Enter your Gmail credentials:
  - Email: `trashneak@gmail.com`
  - Password: (your Gmail password)
- Accept permissions when prompted
- You'll be redirected back to Autonomy AI Studio

**Step 5: Create Account (First Time Only)**
- First login creates your account automatically
- No need to remember separate password
- Account linked to Gmail

---

### Option 2: GitHub SSO

**Step 1-2:** Same as above

**Step 3:** Click "Sign in with GitHub"

**Step 4:** Authenticate with GitHub
- You'll need GitHub account
- Enter GitHub username/password
- Authorize the app

**Step 5:** Account is created/linked

---

### Option 3: Traditional Email/Password (If Available)

If SSO doesn't work or you prefer email:

**Step 1:** Click "Sign up" on login page

**Step 2:** Choose "Email & Password"

**Step 3:** Fill in:
```
Email:    trashneak@gmail.com
Password: YourSecurePassword123!
Name:     Your Name
```

**Step 4:** Click "Create Account"

**Step 5:** Verify email (check inbox for link)

**Step 6:** Login with those credentials

---

## For Your Tests

### Using Gmail Credentials
If you logged in with Gmail SSO:
```env
TEST_EMAIL=trashneak@gmail.com
TEST_PASSWORD=your-gmail-password
```

### Using Email/Password Account
If you created with email/password:
```env
TEST_EMAIL=trashneak@gmail.com
TEST_PASSWORD=the-password-you-created
```

---

## Troubleshooting SSO

**Q: Google login button doesn't work**
- Check if browser cookies are enabled
- Try incognito/private mode
- Try different browser
- Check if Google account is active

**Q: Getting "Account not found" error**
- First time login creates account automatically
- If error persists, try regular email/password signup
- Check if you're using correct email

**Q: "Permissions denied" during OAuth**
- Click "Accept" or "Allow" when prompted
- Don't block pop-ups (OAuth uses pop-ups)
- Check browser permissions for studio.autonomyai.io

**Q: Still can't login?**
- Use regular email/password signup instead
- Contact support at Autonomy AI Studio
- Check if account is verified via email

---

## Quick Reference

| Method | Email | Password | Pros | Cons |
|--------|-------|----------|------|------|
| Gmail SSO | Gmail email | Gmail password | No password to remember | Requires Google account |
| GitHub SSO | GitHub email | GitHub password | No password to remember | Requires GitHub account |
| Email/Password | Any email | Custom password | Works without accounts | Need to remember password |

---

## Your Current Setup

```env
# Email (now corrected ✅)
TEST_EMAIL=trashneak@gmail.com

# Password (set this!)
TEST_PASSWORD=???
```

**What to do:**
1. Go to https://studio.autonomyai.io/
2. Choose SSO method (Gmail recommended)
3. Login with your credentials
4. If you used SSO, use your Gmail password
5. Update TEST_PASSWORD in `.env`
6. You're ready to test!

---

## Next Steps

1. ✅ Email corrected in `.env`
2. ⏳ Go to https://studio.autonomyai.io/
3. ⏳ Login with SSO (Gmail recommended)
4. ⏳ Update TEST_PASSWORD in `.env`
5. ⏳ Run: `npm test`

**You're almost ready! 🚀**

