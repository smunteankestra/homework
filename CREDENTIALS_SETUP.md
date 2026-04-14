# 🔐 CREDENTIALS SETUP GUIDE

## Step-by-Step Instructions

### ✅ Step 1: Create Autonomy AI Studio Test Account

**Go to:** https://studio.autonomyai.io/

1. Click **"Sign up"** button
2. Fill in:
   - **Email:** Use a test email (Gmail, etc.)
   - **Password:** Use a strong password
   - Example:
     ```
     Email: stefan-test-ai@gmail.com
     Password: TestPassword123!@#
     ```
3. Verify your email if prompted
4. **Login** with these credentials
5. Note down the email and password - you'll need them!

---

### ✅ Step 2: Get GitHub Personal Access Token (PAT)

**Go to:** https://github.com/settings/tokens

1. Click **"Generate new token"**
2. Select **"Generate new token (classic)"**
3. Fill in the form:
   - **Token name:** `autonomy-ai-studio-tests`
   - **Expiration:** 90 days
   - **Select scopes:** Check these boxes:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `read:user` (Read user profile data)
4. Scroll down and click **"Generate token"**
5. **⚠️ COPY THE TOKEN IMMEDIATELY** - you won't see it again!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### ✅ Step 3: Update Your `.env` File

**File location:** `/Users/stefanmuntean/work/repos/homework/.env`

Replace the placeholder values:

```env
# Your Autonomy AI Studio credentials
TEST_EMAIL=your-studio-email@gmail.com
TEST_PASSWORD=your-studio-password

# Your GitHub token (optional but recommended)
GITHUB_TOKEN=ghp_your_github_token_here

# Other optional settings
TEST_REPO_NAME=daniserrano7/jira-clone
HEADLESS=false
```

**Example:**
```env
TEST_EMAIL=stefan-test-ai@gmail.com
TEST_PASSWORD=TestPassword123!@#
GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz
TEST_REPO_NAME=daniserrano7/jira-clone
```

---

### ✅ Step 4: Verify Everything is Secure

Run this to confirm `.env` won't be committed:

```bash
cd /Users/stefanmuntean/work/repos/homework
git check-ignore .env
# Should output: .env
```

If it shows `.env`, you're good! ✅

---

## 🔑 What Each Credential Does

| Variable | Purpose | Where to Get | Required? |
|----------|---------|-------------|-----------|
| `TEST_EMAIL` | Login to Autonomy AI Studio | Sign up at https://studio.autonomyai.io/ | ✅ YES |
| `TEST_PASSWORD` | Login password | Same as above | ✅ YES |
| `GITHUB_TOKEN` | Connect GitHub repos | https://github.com/settings/tokens | ⚠️ Optional (for bonus tests) |
| `TEST_REPO_NAME` | Which repo to use for tests | Any GitHub repo | ⚠️ Optional |
| `HEADLESS` | Show browser during tests | Set to `true` or `false` | ⚠️ Optional |
| `DEBUG` | Debug output | Set to `true` or `false` | ⚠️ Optional |

---

## ⚠️ SECURITY BEST PRACTICES

1. **NEVER commit `.env` to Git**
   - It's already in `.gitignore` ✅
   - Git will prevent accidental commits

2. **NEVER share your `.env` file**
   - Don't email it
   - Don't paste it in chat
   - Don't upload it to GitHub

3. **Use test credentials, not your personal account**
   - Create a separate test account for Autonomy AI Studio
   - Use a test GitHub account if possible
   - Rotate GitHub PAT tokens regularly

4. **If you accidentally expose credentials:**
   - GitHub: Go to https://github.com/settings/tokens and delete the token
   - Autonomy AI: Change your password immediately

---

## 🚀 Quick Reference

### To use your credentials for testing:

```bash
# 1. Edit the .env file with your credentials
nano /Users/stefanmuntean/work/repos/homework/.env

# 2. Save and exit (Ctrl+X, then Y, then Enter)

# 3. Run tests
cd /Users/stefanmuntean/work/repos/homework
npm test
```

---

## ❓ FAQ

**Q: Where do I get my Autonomy AI Studio email/password?**
A: Create an account at https://studio.autonomyai.io/

**Q: Do I need a GitHub token?**
A: Only if you want to run the project initialization tests. It's optional for basic testing.

**Q: Will my `.env` be uploaded to GitHub?**
A: No! It's in `.gitignore`, so Git will never commit it.

**Q: What if I don't have a GitHub account?**
A: Create one for free at https://github.com/

**Q: Can I use my personal GitHub credentials?**
A: Yes, but it's safer to create a dedicated token just for testing.

---

## ✅ Your .env File is Ready!

Location: `/Users/stefanmuntean/work/repos/homework/.env`

**Next steps:**
1. Create Autonomy AI Studio account (if you don't have one)
2. Get GitHub PAT token (if you want to use it)
3. Edit `.env` with your credentials
4. Run tests: `npm test`

---

**Status:** ✅ `.env` file created and protected  
**Security:** ✅ Credentials are gitignored  
**Next:** Fill in your credentials and run tests!

