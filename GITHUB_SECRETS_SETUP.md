# 🔐 Complete GitHub Actions Secrets Setup Guide

## Overview
- **Environment Secrets**: Applied to specific workflow environments (staging, production)
- **Repository Secrets**: Applied to all workflows across all branches
- **For your setup**: Use **Repository Secrets** (simpler, one-time setup)

---

## Part 1: Getting All Secret Values

### 1️⃣ GEMINI_API_KEY

**Local Path:** `/Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/.env`

**Current Value:**
```
GEMINI_API_KEY=AIzaSyC31ANIJyGbetkPzbzXTUbXsRwtD2w8BAA
```

**How to copy:**
1. Open VSCode
2. File → Open File → `/Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/.env`
3. Copy the value after `GEMINI_API_KEY=`

---

### 2️⃣ GCP_PROJECT_ID

**Value:** `whatsnextup-d2415`

**Local Path:** `/Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/.env`

```
FIREBASE_PROJECT_ID=whatsnextup-d2415
```

**How to copy:** Same as above, copy `whatsnextup-d2415`

---

### 3️⃣ GCP_SA_KEY (Service Account Key - Base64 Encoded)

**Local Path:** `/Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/service-account-key.json`

**⚠️ WARNING: This file is sensitive! Never commit it!**

**How to convert to Base64:**

```bash
# Option 1: Open Terminal in VSCode and run this:
cat /Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/service-account-key.json | base64

# This outputs a long string starting with 'ew0KICJt...'
# Copy that entire string
```

**Step-by-step:**
1. Open VSCode Terminal (Ctrl+` or View → Terminal)
2. Paste this command:
```bash
cat /Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/service-account-key.json | base64
```
3. Press Enter
4. Select all output (Cmd+A)
5. Copy (Cmd+C)
6. This is your `GCP_SA_KEY` value

---

### 4️⃣ NEXT_PUBLIC_API_BASE

**Local Path:** `/Users/shashipriyamishra/Documents/GitHub/whatsnextup/frontend/.env.local`

**Current Value:**
```
NEXT_PUBLIC_API_BASE=https://whatsnextup-api-214675476458.us-central1.run.app
```

**How to copy:** Same as other `.env` files

---

### 5️⃣ NEXT_PUBLIC_FIREBASE_API_KEY

**Local Path:** `/Users/shashipriyamishra/Documents/GitHub/whatsnextup/frontend/.env.local`

**Current Value:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCUr9df-M0IMnm_7GLBa3igZ4dpPH02SRw
```

---

### 6️⃣ VERCEL_TOKEN (Website - Create New)

**Steps to Get:**

1. Go to: https://vercel.com/account/tokens
2. Click "Create New Token"
3. Give it a name: `whatsnextup-github-actions`
4. Set Expiration: Optional (or 30 days)
5. Click "Create Token"
6. **Copy the token immediately** (shown only once!)

---

### 7️⃣ VERCEL_ORG_ID

**Steps to Get:**

1. Go to: https://vercel.com/account/settings/general
2. Look at the URL in your browser
3. It looks like: `https://vercel.com/account/organization/XXXXXXXX/settings/general`
4. The `XXXXXXXX` is your ORG_ID (usually starts with `Org_`)

**Or simpler:**
1. Go to https://vercel.com/dashboard
2. Click on your organization name (top left)
3. Go to Settings → General
4. Copy value from "ORG ID" field

---

### 8️⃣ VERCEL_PROJECT_ID

**Steps to Get:**

1. Go to your Vercel project
2. Click "Settings" (in the top menu)
3. Look for "PROJECT ID" field
4. Copy the value (UUID format like: `prj_xxxxx`)

**Or from URL:**
- Vercel URL: https://vercel.com/shashipriyamishra/whatsnextup-frontend
- The `whatsnextup-frontend` part is your project (you can also find exact ID in Settings)

---

## Part 2: Adding Secrets to GitHub

### Where to Add (Repository Secrets - Recommended)

1. Go to: https://github.com/shashipriyamishra/whatsnextup
2. Click **Settings** (top menu bar)
3. Left sidebar → **Secrets and variables** → **Actions**
4. Click **"New repository secret"**

### Add These 8 Secrets:

| # | Secret Name | Value | From Where |
|---|---|---|---|
| 1 | `GEMINI_API_KEY` | `AIzaSyC31ANIJyGbetkPzbzXTUbXsRwtD2w8BAA` | `backend/.env` |
| 2 | `GCP_PROJECT_ID` | `whatsnextup-d2415` | `backend/.env` |
| 3 | `GCP_SA_KEY` | (base64 string) | Terminal base64 command ↑ |
| 4 | `NEXT_PUBLIC_API_BASE` | `https://whatsnextup-api-214675476458.us-central1.run.app` | `frontend/.env.local` |
| 5 | `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyCUr9df-M0IMnm_7GLBa3igZ4dpPH02SRw` | `frontend/.env.local` |
| 6 | `VERCEL_TOKEN` | (from https://vercel.com/account/tokens) | Website ↑ |
| 7 | `VERCEL_ORG_ID` | (from Vercel settings) | Website ↑ |
| 8 | `VERCEL_PROJECT_ID` | (from Vercel project settings) | Website ↑ |

### Step-by-Step for Each Secret:

**Example: Adding GEMINI_API_KEY**
1. GitHub → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. **Name:** `GEMINI_API_KEY`
4. **Value:** `AIzaSyC31ANIJyGbetkPzbzXTUbXsRwtD2w8BAA`
5. Click "Add secret"
6. ✅ Done! Repeat for all 8 secrets

---

## Part 3: Repository vs Environment Secrets

### Repository Secrets (Use This) ✅
- Applied to ALL workflows
- Applied to ALL branches
- Simpler to manage
- Perfect for your setup

### Environment Secrets (Skip for Now)
- Used for staging/production separation
- Add later when you want different secrets per environment
- More complex setup

**For now: Use Repository Secrets only**

---

## Part 4: Verify Setup

After adding all secrets:

1. Go to GitHub → Settings → Secrets and variables → Actions
2. You should see 8 secrets listed:
   - ✅ GEMINI_API_KEY
   - ✅ GCP_PROJECT_ID
   - ✅ GCP_SA_KEY
   - ✅ NEXT_PUBLIC_API_BASE
   - ✅ NEXT_PUBLIC_FIREBASE_API_KEY
   - ✅ VERCEL_TOKEN
   - ✅ VERCEL_ORG_ID
   - ✅ VERCEL_PROJECT_ID

3. Now push to main:
```bash
git add .
git commit -m "Add GitHub Actions CI/CD"
git push origin main
```

4. Go to GitHub → Actions → You should see your workflows running!

---

## Part 5: Why 10k Untracked Files?

**Good news:** You actually only have ~12 untracked files (the new files we created):

```
.github/                           ← New workflows
DEPLOYMENT.md                      ← New guide
backend/.env.example              ← New template
backend/agents/                   ← New agent files
backend/firestore/                ← New firestore module
frontend/.env.example             ← New template
frontend/out/                     ← Build output
frontend/src/app/memory/          ← New pages
frontend/src/app/plans/           ← New pages
frontend/src/app/reflections/     ← New pages
```

**If VSCode shows more**, it might be:
- `node_modules/` (10k+ files) - Should be in `.gitignore` ✅
- `backend/venv/` - Should be in `.gitignore` ✅
- `__pycache__/` - Should be in `.gitignore` ✅

**Check your gitignore is correct:**
```bash
cat /Users/shashipriyamishra/Documents/GitHub/whatsnextup/.gitignore
```

If still seeing issues, run:
```bash
git clean -fd  # Remove untracked files
git clean -fd -X  # Remove ignored files too
```

---

## Quick Summary

1. ✅ Get 8 secret values from your local files or Vercel
2. ✅ Add them to GitHub Settings → Secrets and variables → Actions
3. ✅ Push your code
4. ✅ GitHub Actions runs automatically
5. ✅ Backend deploys to Cloud Run
6. ✅ Frontend deploys to Vercel

**No more manual deployment!**
