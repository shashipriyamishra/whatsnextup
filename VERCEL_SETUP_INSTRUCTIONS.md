# Vercel Environment Configuration - CRITICAL

## Current Issue

**All API calls are failing in production because `NEXT_PUBLIC_API_URL` environment variable is NOT set in Vercel.**

When this variable is missing:

- API calls default to empty string in production
- All requests fail with network errors or show as being sent to wrong URLs
- Users see blank pages or errors when loading data

## Root Cause

The frontend code has:

```typescript
this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
```

But in production:

- `process.env.NODE_ENV === "production"` is true
- The fallback to localhost is intentionally disabled
- Without the env var, `baseUrl` becomes empty string
- All API calls fail

## Solution: Set Environment Variable in Vercel

### Step 1: Get Backend URL

Your Cloud Run backend is deployed at:

```
https://whatsnextup-api-214675476458.us-central1.run.app
```

### Step 2: Configure in Vercel Dashboard

1. **Go to Vercel Dashboard**: https://vercel.com
2. **Select "whatsnextup" project**
3. **Click Settings → Environment Variables**
4. **Add New Variable**:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://whatsnextup-api-214675476458.us-central1.run.app`
   - **Environments**: Select all (Production, Preview, Development)
5. **Click Save**

### Step 3: Redeploy

After setting the environment variable:

1. **Go to Deployments**
2. **Click the three dots on latest deployment**
3. **Select "Redeploy"**
4. **Wait for build to complete**

### Step 4: Verify

Test the API endpoints:

**Test Plans API:**

```bash
curl https://www.whatsnextup.com/api/plans \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Test Memories API:**

```bash
curl https://www.whatsnextup.com/api/memories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Test Agents API:**

```bash
curl https://www.whatsnextup.com/api/agents \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Should all return 200 OK (not 404 or empty).

## Environment Variables Needed

Here's the complete list of environment variables needed in Vercel:

```
# API Configuration - CRITICAL
NEXT_PUBLIC_API_URL=https://whatsnextup-api-214675476458.us-central1.run.app

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyABC123...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=whatsnextup-d2415.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=whatsnextup-d2415
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=whatsnextup-d2415.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...
```

## Troubleshooting

### If APIs still don't work after setting env var:

1. **Check variable is set**: Go to deployment → Logs → search for "API_URL"
2. **Redeploy is required**: Changes to environment variables require a new deployment
3. **Clear browser cache**: Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
4. **Check CORS**: Backend CORS should allow `https://www.whatsnextup.com`

### How to verify env var is loaded:

1. Deploy to Vercel
2. Open browser DevTools → Console
3. Check for error message like: `"CRITICAL: NEXT_PUBLIC_API_URL not configured!"`
4. If you see this, env var is not set

## Code Changes Made

The frontend code was updated to:

1. Remove unsafe localhost fallback in production
2. Consolidate API URL resolution to single source
3. Add clear error messages when NEXT_PUBLIC_API_URL is missing
4. Require explicit environment variable setup for production

This ensures the app will **fail loudly and clearly** if misconfigured, rather than silently defaulting to localhost.

## Why This Matters

- **Security**: Never hardcode production URLs or fallback to localhost
- **Reliability**: Clear errors help identify configuration issues
- **Production-Ready**: Forces proper deployment configuration

## Questions?

If you need to change the backend URL or add other variables, update ONLY the `NEXT_PUBLIC_API_URL` value in Vercel Settings.
