# 🚀 Final Setup Checklist & Next Steps

## Part 1: Repository Secrets Setup (DO THIS FIRST)

### Step-by-Step Instructions

1. **Open GitHub**
   - Go to: https://github.com/shashipriyamishra/whatsnextup
   - Click: Settings (top menu bar)

2. **Navigate to Secrets**
   - Left sidebar: Click "Secrets and variables"
   - Click: "Actions"

3. **Add 8 Repository Secrets**

#### Secret #1: GEMINI_API_KEY

```
Name: GEMINI_API_KEY
Value: [See your backend/.env - keep private!]
From: /Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/.env
```

Click "Add secret"

#### Secret #2: GCP_PROJECT_ID

```
Name: GCP_PROJECT_ID
Value: [See your backend/.env]
From: /Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/.env
```

Click "Add secret"

#### Secret #3: NEXT_PUBLIC_API_BASE

```
Name: NEXT_PUBLIC_API_BASE
Value: [Your Cloud Run deployment URL]
From: /Users/shashipriyamishra/Documents/GitHub/whatsnextup/frontend/.env.local
```

Click "Add secret"

#### Secret #4: NEXT_PUBLIC_FIREBASE_API_KEY

```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: [See your frontend/.env.local - keep private!]
From: /Users/shashipriyamishra/Documents/GitHub/whatsnextup/frontend/.env.local
```

Click "Add secret"

#### Secret #5: GCP_SA_KEY (Needs special handling)

```
Name: GCP_SA_KEY
Value: [Run command below]

In Terminal:
cat /Users/shashipriyamishra/Documents/GitHub/whatsnextup/backend/service-account-key.json | base64

Copy the entire output (long string starting with ew0K)
Paste as Value
```

Click "Add secret"

#### Secret #6: VERCEL_TOKEN (Get from Website)

```
Name: VERCEL_TOKEN
Value: [From https://vercel.com/account/tokens]

Steps:
1. Go to https://vercel.com/account/tokens
2. Click "Create New Token"
3. Name: whatsnextup-github-actions
4. Expiration: Optional
5. Click "Create Token"
6. Copy the token (shown only once!)
```

Click "Add secret"

#### Secret #7: VERCEL_ORG_ID (Get from Website)

```
Name: VERCEL_ORG_ID
Value: [From Vercel Dashboard]

Steps:
1. Go to https://vercel.com/account/organization/~/settings/account
2. Or: Go to https://vercel.com/dashboard → Click org name
3. Settings → General
4. Find "ORG ID" field
5. Copy the value
```

Click "Add secret"

#### Secret #8: VERCEL_PROJECT_ID (Get from Website)

```
Name: VERCEL_PROJECT_ID
Value: [From Vercel Project Settings]

Steps:
1. Go to https://vercel.com/dashboard
2. Click "whatsnextup-frontend" project
3. Click Settings (top menu)
4. Find "PROJECT ID"
5. Copy the value
```

Click "Add secret"

---

## Part 2: Verify All Secrets Added

### GitHub Secrets Page Should Show:

```
✅ GEMINI_API_KEY
✅ GCP_PROJECT_ID
✅ NEXT_PUBLIC_API_BASE
✅ NEXT_PUBLIC_FIREBASE_API_KEY
✅ GCP_SA_KEY
✅ VERCEL_TOKEN
✅ VERCEL_ORG_ID
✅ VERCEL_PROJECT_ID
```

If all 8 show: ✅ You're ready!

---

## Part 3: Push to GitHub

### In Terminal:

```bash
# Navigate to your repo
cd /Users/shashipriyamishra/Documents/GitHub/whatsnextup

# Stage all new files
git add .

# Commit
git commit -m "Add GitHub Actions CI/CD workflows and documentation"

# Push to main branch
git push origin main
```

---

## Part 4: Watch Deployment

### GitHub Actions Will Run Automatically

1. Go to: https://github.com/shashipriyamishra/whatsnextup
2. Click: "Actions" tab (next to Pull requests)
3. You'll see workflow running:
   - `lint.yml` - Code quality checks
   - `deploy-backend.yml` - Deploys backend to Cloud Run
   - `deploy-frontend.yml` - Deploys frontend to Vercel

4. Wait for all to complete (usually 5-10 minutes)

### If Deployment Succeeds:

- ✅ Backend: Deployed to https://whatsnextup-api-214675476458.us-central1.run.app
- ✅ Frontend: Deployed to your Vercel domain
- ✅ You can access live site!

### If Deployment Fails:

- Click the failed workflow
- Check the logs (red text indicates errors)
- Fix the issue in code
- Push again → Automatic re-deployment

---

## Part 5: Future Pushes

### Every time you push to main:

1. Code quality checks run
2. If all pass:
   - Backend auto-deploys to Cloud Run
   - Frontend auto-deploys to Vercel
3. If any fail:
   - Deployment stops
   - You get notification
   - Fix and push again

### Manual Trigger (Optional):

- GitHub → Actions → Click workflow → "Run workflow"
- Useful to re-deploy without code changes

---

## Environment Variables Summary

### Local Development (.env files - NOT committed)

```
backend/.env                    → Local testing only
frontend/.env.local            → Local testing only
backend/service-account-key.json → Local testing only
```

### Production (GitHub Secrets - DO commit workflows!)

```
GitHub Secrets                  → Used by CI/CD
deployed to Cloud Run           → Backend
deployed to Vercel             → Frontend
```

**Key Point:** Secrets never leave GitHub Actions → never exposed in code

---

## Document Reference

Created for you:

- `GITHUB_SECRETS_SETUP.md` - Detailed setup instructions
- `SECRETS_QUICK_REFERENCE.md` - Quick lookup table
- `UNTRACKED_FILES_EXPLAINED.md` - Explains the "10k files" mystery
- `DEPLOYMENT.md` - General deployment info

---

## Quick Links

| Task            | URL                                                                       |
| --------------- | ------------------------------------------------------------------------- |
| GitHub Secrets  | https://github.com/shashipriyamishra/whatsnextup/settings/secrets/actions |
| Vercel Tokens   | https://vercel.com/account/tokens                                         |
| Vercel Settings | https://vercel.com/account/organization/~/settings/account                |
| GitHub Actions  | https://github.com/shashipriyamishra/whatsnextup/actions                  |
| Cloud Run       | https://console.cloud.google.com/run                                      |

---

## Troubleshooting

### "Deployment failed" error

→ Check the workflow logs (GitHub → Actions → click failed run)

### Can't find Vercel ORG_ID

→ Go to https://vercel.com/dashboard and look at URL or account settings

### Secret value keeps failing

→ Make sure you copied the ENTIRE value (no extra spaces)

### Want to test locally first?

→ Uncomment `NEXT_PUBLIC_API_BASE=http://localhost:8000` in `frontend/.env.local`
→ Run backend: `cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload`
→ Run frontend: `cd frontend && npm run dev`

---

## You're All Set! 🎉

- ✅ Secrets configured
- ✅ Workflows created
- ✅ CI/CD ready
- ✅ Auto-deployment enabled

**Next time you push to main:**

- Code deploys automatically
- Zero manual steps
- No more `gcloud` commands
- CI/CD handles everything!
