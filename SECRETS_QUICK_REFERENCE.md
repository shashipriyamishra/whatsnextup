# Quick Reference: Where to Find Each Secret

## 🔴 RED: From Local Files (Copy & Paste)

### Secret 1: GEMINI_API_KEY

```
📁 Location: /Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/.env
🔑 Key name: GEMINI_API_KEY
📋 Value: [See backend/.env - keep private!]
```

### Secret 2: GCP_PROJECT_ID

```
📁 Location: /Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/.env
🔑 Key name: FIREBASE_PROJECT_ID
📋 Value: whatsnextup-d2415
```

### Secret 3: NEXT_PUBLIC_API_BASE

```
📁 Location: /Users/shashipriyamishra/Documents/GitHub/whatsnextup/frontend/.env.local
🔑 Key name: NEXT_PUBLIC_API_BASE
📋 Value: https://whatsnextup-api-214675476458.us-central1.run.app
```

### Secret 4: NEXT_PUBLIC_FIREBASE_API_KEY

```
📁 Location: /Users/shashipriyamishra/Documents/GitHub/whatsnextup/frontend/.env.local
🔑 Key name: NEXT_PUBLIC_FIREBASE_API_KEY
📋 Value: [See frontend/.env.local - keep private!]
```

### Secret 5: GCP_SA_KEY (Needs Base64 Encoding)

```
📁 Location: /Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/service-account-key.json

⚠️ Run this in Terminal:
cat /Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/service-account-key.json | base64

Copy the entire output (long string starting with 'ew0K...')
```

---

## 🟢 GREEN: From Vercel Website

### Secret 6: VERCEL_TOKEN

```
🌐 Website: https://vercel.com/account/tokens
📝 Steps:
   1. Click "Create New Token"
   2. Name: whatsnextup-github-actions
   3. Click "Create Token"
   4. Copy token (shown only once!)
```

### Secret 7: VERCEL_ORG_ID

```
🌐 Website: https://vercel.com/account/organization/~/settings/account
📝 Steps:
   1. Go to Vercel Dashboard
   2. Click organization name (top left)
   3. Settings → General
   4. Copy "ORG ID" field
📋 Format: Usually starts with Org_...
```

### Secret 8: VERCEL_PROJECT_ID

```
🌐 Website: https://vercel.com/dashboard
📝 Steps:
   1. Click your whatsnextup-frontend project
   2. Click Settings (top menu)
   3. Find "PROJECT ID" field
   4. Copy the value
📋 Format: UUID like prj_xxxxx
```

---

## 📍 Where to Add All Secrets in GitHub

### Location

```
GitHub.com → Your Repository
   ↓
Settings (top menu bar)
   ↓
Secrets and variables (left sidebar)
   ↓
Actions tab
   ↓
"New repository secret" button
```

### Add All 8:

1. GEMINI_API_KEY
2. GCP_PROJECT_ID
3. NEXT_PUBLIC_API_BASE
4. NEXT_PUBLIC_FIREBASE_API_KEY
5. GCP_SA_KEY
6. VERCEL_TOKEN
7. VERCEL_ORG_ID
8. VERCEL_PROJECT_ID

---

## 🎯 Repository vs Environment Secrets

### Use: Repository Secrets ✅

- Simpler
- Works for all branches
- One-time setup
- Perfect for your case

### Don't use yet: Environment Secrets

- For staging/production separation
- Adds complexity
- Set up later if needed

---

## ✅ After Setup

```bash
# Commit and push
git add .
git commit -m "Add CI/CD workflows"
git push origin main

# Watch GitHub → Actions tab
# Your workflows should start automatically!
```
