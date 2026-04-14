# 📋 CREDENTIALS & .ENV FILE - COMPLETE SETUP

## ✅ Files Created for You

### 1. **`.env` File** (Your Credentials Storage)
- **Location:** `/Users/stefanmuntean/work/repos/homework/.env`
- **Status:** ✅ Created and protected
- **Security:** ✅ Listed in `.gitignore` (won't be committed to Git)

### 2. **CREDENTIALS_SETUP.md** (Detailed Guide)
- **Location:** `/Users/stefanmuntean/work/repos/homework/CREDENTIALS_SETUP.md`
- **Status:** ✅ Created with step-by-step instructions

---

## 📝 What Goes in Your `.env` File

### **Required (To Run Tests)**

```env
TEST_EMAIL=your-studio-email@gmail.com
TEST_PASSWORD=your-studio-password
```

**Where to get these:**
- Go to: **https://studio.autonomyai.io/**
- Click **Sign up** if you don't have an account
- Create account with email and password
- Use that same email/password in your `.env`

### **Optional (For GitHub Features)**

```env
GITHUB_TOKEN=ghp_your_token_here
TEST_REPO_NAME=daniserrano7/jira-clone
```

**Where to get GitHub token:**
- Go to: **https://github.com/settings/tokens**
- Click **Generate new token** → **Classic**
- Name: `autonomy-ai-studio-tests`
- Check scopes: `repo` and `read:user`
- Click **Generate token**
- **COPY IT** (won't show again!)

---

## 🚀 How to Use Your `.env` File

### Step 1: Open the `.env` File
```bash
nano /Users/stefanmuntean/work/repos/homework/.env
```

### Step 2: Replace Placeholder Values
Find these lines:
```env
TEST_EMAIL=your-test-email@example.com
TEST_PASSWORD=your-test-password
```

Replace with YOUR actual credentials:
```env
TEST_EMAIL=stefan-test@gmail.com
TEST_PASSWORD=MySecurePassword123!
```

### Step 3: Save the File
- Press: `Ctrl + X`
- Type: `Y`
- Press: `Enter`

### Step 4: Run Tests
```bash
cd /Users/stefanmuntean/work/repos/homework
npm test
```

---

## ✅ Security Verification

### Check That .env Won't Be Committed
```bash
cd /Users/stefanmuntean/work/repos/homework
git check-ignore .env
# Output should be: .env ✅
```

### View What Would Be Committed
```bash
git status
# .env should NOT appear in the list ✅
```

---

## 📊 Your Credentials Checklist

- ✅ `.env` file created at `/Users/stefanmuntean/work/repos/homework/.env`
- ✅ `.env` is in `.gitignore` (won't commit to Git)
- ✅ Template includes all required variables
- ✅ Setup guide created (`CREDENTIALS_SETUP.md`)
- ✅ Ready for your credentials

---

## 🎯 Next Steps

### 1. Create Autonomy AI Studio Account (If Needed)
```
URL: https://studio.autonomyai.io/
Click: Sign up
Fill: Email & Password
Save: Email & Password for .env
```

### 2. Get GitHub Token (Optional)
```
URL: https://github.com/settings/tokens
Click: Generate new token (classic)
Name: autonomy-ai-studio-tests
Scopes: repo, read:user
Generate: Token
Save: Token for .env
```

### 3. Update Your `.env` File
```bash
nano /Users/stefanmuntean/work/repos/homework/.env
# Fill in your credentials
```

### 4. Run Tests
```bash
cd /Users/stefanmuntean/work/repos/homework
npm test
```

---

## 🔒 Security Best Practices

### ✅ DO
- Use test credentials (not personal account)
- Keep `.env` file locally only
- Rotate GitHub tokens regularly
- Use strong passwords
- Delete exposed tokens immediately

### ❌ DON'T
- Commit `.env` to Git (it's protected, but don't try)
- Share `.env` in emails or chat
- Use personal GitHub account tokens
- Use simple passwords
- Hardcode credentials in source code

---

## 📞 Troubleshooting

**Q: Where do I get my Autonomy AI Studio credentials?**
A: Create account at https://studio.autonomyai.io/

**Q: Do I need a GitHub token?**
A: Only for project initialization tests (optional)

**Q: Will my `.env` be uploaded to GitHub?**
A: No! It's in `.gitignore` and won't be committed

**Q: What if I accidentally commit my `.env`?**
A: It won't - Git will ignore it. Delete and rotate tokens if needed

**Q: Can I use multiple test accounts?**
A: Yes, just update your `.env` to switch accounts

**Q: Where exactly do I edit the `.env`?**
A: Run: `nano /Users/stefanmuntean/work/repos/homework/.env`

---

## 📋 Your `.env` Template

```env
# ============================================
# REQUIRED: Autonomy AI Studio Credentials
# ============================================
# Get from: https://studio.autonomyai.io/
TEST_EMAIL=your-test-email@example.com
TEST_PASSWORD=your-test-password

# ============================================
# OPTIONAL: GitHub Configuration
# ============================================
# Get from: https://github.com/settings/tokens
GITHUB_TOKEN=ghp_your_token_here

# GitHub repo for project init tests
TEST_REPO_NAME=daniserrano7/jira-clone

# ============================================
# OPTIONAL: Playwright Settings
# ============================================
APP_URL=https://studio.autonomyai.io
HEADLESS=false
DEBUG=false
TIMEOUT=60000
```

---

## 🎉 You're All Set!

Your project now has:
- ✅ `.env` file for storing credentials
- ✅ Complete setup guides
- ✅ Security protections (gitignore)
- ✅ Ready to run tests

**Just fill in your credentials and start testing!**

---

**Status:** ✅ Setup Complete  
**Security:** ✅ Protected  
**Next:** Fill in credentials & run tests

