# ⚡ 5-Minute Quick Start

## Your Setup Complete ✅

Everything is ready. Follow these exact steps:

---

## Step 1: Copy 4 Values from Your Computer (2 min)

### From `backend/.env`

```bash
# Open this file and copy these values:
/Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/.env

GEMINI_API_KEY → COPY THIS
whatsnextup-d2415 → COPY THIS
```

### From `frontend/.env.local`

```bash
# Open this file and copy these values:
/Users/shashipriyamishra/Documents/GitHub/whatsnextup/frontend/.env.local

https://whatsnextup-api-214675476458.us-central1.run.app → COPY THIS
AIzaSyCUr9df-M0IMnm_7GLBa3igZ4dpPH02SRw → COPY THIS
```

### From Terminal (1 command)

```bash
# Open Terminal and run:
cat /Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/service-account-key.json | base64

# Copy the entire output (long string)
```

---

## Step 2: Get 3 Values from Vercel (2 min)

### Token

1. Go: https://vercel.com/account/tokens
2. Click "Create New Token"
3. Name: `whatsnextup-github-actions`
4. Click "Create Token"
5. COPY THE TOKEN

### ORG_ID

1. Go: https://vercel.com/dashboard
2. Click your org name (top left)
3. Settings → General
4. Find "ORG ID" → COPY IT

### PROJECT_ID

1. Go: https://vercel.com/dashboard
2. Click "whatsnextup-frontend"
3. Settings → Find "PROJECT ID" → COPY IT

---

## Step 3: Add All 8 Secrets to GitHub (1 min)

### Go Here

https://github.com/shashipriyamishra/whatsnextup/settings/secrets/actions

### Add 8 Secrets

For each one, click "New repository secret":

1. **GEMINI_API_KEY** = From your `backend/.env`
2. **GCP_PROJECT_ID** = From your `backend/.env`
3. **NEXT_PUBLIC_API_BASE** = Your Cloud Run deployment URL
4. **NEXT_PUBLIC_FIREBASE_API_KEY** = From your `frontend/.env.local`
5. **GCP_SA_KEY** = `[from terminal base64 command]`
6. **VERCEL_TOKEN** = `[from Vercel website]`
7. **VERCEL_ORG_ID** = `[from Vercel org settings]`
8. **VERCEL_PROJECT_ID** = `[from Vercel project settings]`

✅ All 8 should be listed

---

## Step 4: Push to GitHub (< 1 min)

```bash
cd /Users/shashipriyamishra/Documents/GitHub/whatsnextup

git add .
git commit -m "Add CI/CD workflows"
git push origin main
```

---

## Step 5: Watch It Deploy

1. Go: https://github.com/shashipriyamishra/whatsnextup/actions
2. You'll see your workflows running
3. Wait 5-10 minutes for completion
4. ✅ Backend deployed to Cloud Run
5. ✅ Frontend deployed to Vercel

---

## Done! 🎉

- Next time you push → Auto-deploys
- No manual steps needed
- GitHub Actions handles everything

---

## Reference Docs

Created for you (in your repo):

- `SETUP_FINAL_CHECKLIST.md` - Detailed step-by-step
- `ALL_QUESTIONS_ANSWERED.md` - All your questions answered
- `GITHUB_SECRETS_SETUP.md` - Deep dive guide
- `SECRETS_QUICK_REFERENCE.md` - Quick lookup
- `UNTRACKED_FILES_EXPLAINED.md` - The "10k files" explained

---

## Need Help?

### Secrets not working?

- Check all 8 are in GitHub (Settings → Secrets)
- Make sure values are exact (no extra spaces)

### Deployment failed?

- Go to Actions tab
- Click the failed workflow
- Read the error message (usually clear)

### Can't find Vercel ID?

- Go to https://vercel.com/account/settings
- Look at the account settings page

---

## You're Set! 🚀
