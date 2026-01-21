# GitHub Actions Setup Guide

## Required GitHub Secrets

Add these secrets to your GitHub repository: `Settings → Secrets and variables → Actions`

### Backend Deployment (Cloud Run)

- `GCP_SA_KEY` - Service account key JSON (base64 encoded)
- `GCP_PROJECT_ID` - `whatsnextup-d2415`
- `GEMINI_API_KEY` - Your Gemini API key

### Frontend Deployment (Vercel)

- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID
- `NEXT_PUBLIC_API_BASE` - Backend API URL (production)
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API key

## How to Get These Values

### GCP Service Account Key

```bash
# Download from Google Cloud Console
# IAM & Admin → Service Accounts → whatsnextup-backend → Keys → Add Key → JSON

# Encode to base64
cat backend/service-account-key.json | base64 -w 0
```

### Vercel Setup

1. Go to https://vercel.com/account/tokens
2. Create new token
3. Go to https://vercel.com/account/organization/~/settings/account
4. Copy `ORG_ID` from URL
5. Go to your Vercel project → Settings → General → `PROJECT_ID`

### Gemini API Key

Already set in `backend/.env`

## Deployment Flow

### On Push to Main:

1. Code quality checks run (linting)
2. If all pass:
   - Backend builds Docker image → pushes to GCP → deploys to Cloud Run
   - Frontend builds → pushes to Vercel
3. If any step fails: deployment stops, you get notification

### Manual Trigger

GitHub Actions → Your workflow → Run workflow

## Environment Variables

### Local Development (Never Committed)

- `backend/.env` - For local testing
- `frontend/.env.local` - For local testing

### Production (Set via Secrets)

- Stored in GitHub Secrets
- CI/CD injects them during build
- Never exposed in code/logs
