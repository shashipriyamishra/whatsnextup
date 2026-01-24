# Vercel Deployment - Critical Environment Configuration

## CRITICAL: API Configuration Issue - MUST FIX NOW

Your frontend is currently calling `http://localhost:8000` in production because `NEXT_PUBLIC_API_URL` is not set in Vercel.

### Issue Details

- **Problem**: Frontend defaults to localhost when `NEXT_PUBLIC_API_URL` is not configured
- **Result**: All API calls fail because they try to reach `localhost:8000` from the browser
- **Affected Endpoints**:
  - `/api/plans`
  - `/api/conversations`
  - `/api/conversations/search`
  - `/api/memories`
  - `/api/reflections`
  - All other API endpoints

### Solution: Set Environment Variable in Vercel

1. Go to: **Vercel Dashboard** → Your Project (`whatsnextup`) → **Settings** → **Environment Variables**

2. Add a new environment variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://whatsnextup-api-214675476458.us-central1.run.app`
   - **Environments**: Select all (Production, Preview, Development)

3. **Important**: After adding the environment variable, trigger a new deployment:
   - Push a new commit to main branch, OR
   - Manually trigger a redeploy from Vercel dashboard

### Verification

After deployment, test that API calls work:

```bash
# Should connect to Cloud Run, not localhost
curl 'https://www.whatsnextup.com/api/conversations?limit=5' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Should NOT show "Connection refused" or "Failed to fetch from localhost"
```

### Browser Console Errors to Look For (Before Fix)

- `ERR_NAME_NOT_RESOLVED` - trying to reach localhost
- `Connection refused` - localhost not available
- Network tab showing requests to `localhost:8000`

### After Fix

- All requests should show `whatsnextup-api-214675476458.us-central1.run.app` in network tab
- API responses should return proper data with 200/401 status codes

## Additional Firebase Environment Variables

Make sure these are also configured in Vercel (if not already):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=whatsnextup-d2415.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=whatsnextup-d2415
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=whatsnextup-d2415.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=427...
NEXT_PUBLIC_FIREBASE_APP_ID=1:427...
```

## Backend Deployment Status

Backend Cloud Run service (`whatsnextup-api`) is running at:

```
https://whatsnextup-api-214675476458.us-central1.run.app
```

All endpoints are responding:

- ✅ `/health` → 200 OK
- ✅ `/api/plans` → 200 OK (with auth)
- ✅ `/api/conversations` → 200 OK (with auth)
- ✅ `/api/conversations/search` → 200 OK (with auth)
- ✅ `/api/memories` → 200 OK (with auth)
- ✅ `/api/trending/feed` → 200 OK

## Frontend API Configuration Details

**File**: `frontend/src/lib/api/client.ts`

The API client now:

1. Requires `NEXT_PUBLIC_API_URL` to be set in production
2. Logs clear error messages if the environment variable is missing
3. No longer falls back to `localhost` in production
4. Will fail with clear API errors if env var is not configured

This is a **security improvement** that prevents accidental use of localhost URLs in production.

## Deployment Steps

1. **Set `NEXT_PUBLIC_API_URL` in Vercel** (Required)
2. **Trigger new deployment** (push commit or manual redeploy)
3. **Verify API calls** are working in production
4. **Check browser console** for any errors

## Expected Timeline

- Setting env var: 5 minutes
- Vercel redeploy: 2-5 minutes
- API calls working: Immediately after deployment

---

**Contact**: Ensure this is completed before further testing
