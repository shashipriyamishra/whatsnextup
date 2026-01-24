# API Debugging & Troubleshooting Guide

## Current State Analysis

### Backend Status ✅

- Cloud Run deployment: **ACTIVE**
- All endpoints responding: **WORKING**
- Confirmed working endpoints:
  - ✅ `/api/memories` - 200 OK
  - ✅ `/api/plans` - 200 OK
  - ✅ `/api/agents` - 200 OK
  - ✅ `/api/conversations` - 200 OK (with valid auth token)
  - ✅ `/api/conversations/search` - 200 OK (with valid auth token)

### Frontend Status ⚠️

- Code structure: **CORRECT**
- Endpoints in code: **CORRECT** (all use `/api/` prefix)
- **CRITICAL**: `NEXT_PUBLIC_API_URL` environment variable likely **NOT SET** in Vercel

### Why APIs Show 404

When `NEXT_PUBLIC_API_URL` is not set in production:

```
Frontend tries to call API
        ↓
baseUrl = "" (empty string, because env var is missing)
        ↓
Full URL = "" + "/api/plans" = "/api/plans"
        ↓
Browser interprets as relative URL
        ↓
Requests go to: https://www.whatsnextup.com/api/plans
        ↓
Vercel frontend server returns 404 (it's not an API endpoint)
```

## Immediate Fix Required

### Set `NEXT_PUBLIC_API_URL` in Vercel

**Steps:**

1. Go to Vercel Dashboard: https://vercel.com
2. Click on "whatsnextup" project
3. Go to Settings → Environment Variables
4. Add new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://whatsnextup-api-214675476458.us-central1.run.app`
   - **Environments**: Production, Preview, Development (select all)
5. Click Save
6. Go to Deployments
7. Click "Redeploy" on latest deployment
8. Wait for build to complete

### Verify Fix

After redeployment, in browser DevTools (F12):

**Network Tab:**

- Refresh page
- Look for API calls
- Check the full URL in "Request URL" column
- Should show: `https://whatsnextup-api-214675476458.us-central1.run.app/api/...`
- NOT: `https://www.whatsnextup.com/api/...`

**Console:**

- Should NOT see error about missing `NEXT_PUBLIC_API_URL`

## Detailed Debugging Steps

### 1. Verify Variable in Deployment

```bash
# Check if variable was picked up by build
# Look for this in deployment logs
grep "NEXT_PUBLIC_API_URL" build-logs
```

Or in browser console after visiting the site, you may see error messages logged about the missing variable.

### 2. Check Actual API Requests

**Browser DevTools (F12):**

1. Open Network tab
2. Refresh page
3. Click on API request (e.g., one that starts with "api")
4. Check "Request URL" - should be full URL to Cloud Run backend
5. Check "Status" - should be 200, not 404

### 3. Test Endpoints Manually

```bash
# Test backend directly
curl https://whatsnextup-api-214675476458.us-central1.run.app/health -v

# Test specific endpoint with token
VALID_TOKEN="your_firebase_jwt_token"
curl 'https://whatsnextup-api-214675476458.us-central1.run.app/api/plans' \
  -H "Authorization: Bearer $VALID_TOKEN" \
  -v
```

### 4. Check Backend Logs

```bash
# Get all API requests from last hour
gcloud run services logs read whatsnextup-api \
  --region us-central1 \
  --limit 200 | grep -E "GET|POST|PUT|DELETE"

# Check for 404 errors
gcloud run services logs read whatsnextup-api \
  --region us-central1 \
  --limit 200 | grep "404"

# Check for specific endpoint
gcloud run services logs read whatsnextup-api \
  --region us-central1 \
  --limit 200 | grep "api/plans"
```

### Expected Log Output

**Good (shows requests to Cloud Run):**

```
GET https://whatsnextup-api-214675476458.us-central1.run.app/api/plans 200 OK
```

**Bad (shows requests to frontend instead of backend):**

```
GET https://www.whatsnextup.com/api/plans 404 Not Found
```

## All Required Environment Variables

For complete setup, Vercel needs these variables set:

```
# API Configuration (CRITICAL)
NEXT_PUBLIC_API_URL=https://whatsnextup-api-214675476458.us-central1.run.app

# Firebase (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=whatsnextup-d2415.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=whatsnextup-d2415
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=whatsnextup-d2415.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Common Error Messages

### "CRITICAL: NEXT_PUBLIC_API_URL not configured!"

- **Meaning**: Environment variable not set in production
- **Fix**: Set it in Vercel dashboard and redeploy

### 404 Not Found

- **Meaning**: Request went to wrong server (frontend instead of backend)
- **Fix**: Verify `NEXT_PUBLIC_API_URL` is set in Vercel

### CORS error

- **Meaning**: Backend doesn't allow requests from `whatsnextup.com`
- **Check**: Backend `main.py` CORS config includes your domain

### 401 Unauthorized

- **Meaning**: Authentication token invalid or missing
- **Check**: User is logged in and has valid Firebase token

## Verification Checklist

After setting environment variables and redeploying:

- [ ] Can see in Vercel deployment that `NEXT_PUBLIC_API_URL` is set
- [ ] Deployed successfully (green checkmark in Vercel)
- [ ] Network requests go to `whatsnextup-api-...run.app` (not www.whatsnextup.com)
- [ ] API responses are 200 OK (not 404)
- [ ] Data displays on page (memories, plans, agents load)
- [ ] No console errors about missing NEXT_PUBLIC_API_URL

Once all checks pass, the application should work correctly!
