# API Debugging Guide - Production Issues

## Root Cause Analysis - Why APIs Call Localhost

### The Problem

Frontend is calling `http://localhost:8000` instead of the Cloud Run backend.

### Why This Happens

1. **Missing Environment Variable**: `NEXT_PUBLIC_API_URL` not set in Vercel
2. **Fallback Code**: Frontend has fallback logic for development (not for production)
3. **Browser Can't Reach Localhost**: Localhost only works on the same machine; browser can't connect

### Evidence from Your Curl Tests

Your curl showed:

```
curl 'http://localhost:8000/api/plans' ...
```

This is NOT what the browser is doing. The browser would get:

- `ERR_NAME_NOT_RESOLVED` - DNS lookup fails for "localhost" from production domain
- Or blank page/timeout

### Fixed Implementation

**Before (Dangerous)**:

```typescript
this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
```

❌ Always falls back to localhost if env var not set

**After (Safe)**:

```typescript
if (!apiUrl) {
  if (process.env.NODE_ENV === "production") {
    console.error("CRITICAL: NEXT_PUBLIC_API_URL not configured!")
    return "" // Empty URL - causes clear API errors
  }
  this.baseUrl = "http://localhost:8000" // Only in dev
}
```

✅ Production requires env var, development uses localhost

---

## Checking What URL Is Actually Being Used

### 1. Check Browser Console

Open DevTools → Console on production:

```javascript
// Paste this in console:
import { getApiUrl } from "@/lib/api"
console.log("API URL:", getApiUrl())
```

Should show: `https://whatsnextup-api-214675476458.us-central1.run.app`

If it shows empty string → `NEXT_PUBLIC_API_URL` not set

### 2. Check Network Tab

In DevTools → Network tab, look at API requests:

✅ Correct:

- Request URL: `https://whatsnextup-api-214675476458.us-central1.run.app/api/plans`
- Status: 200, 401, or 5xx (real response from backend)

❌ Wrong:

- Request URL: `http://localhost:8000/api/plans`
- Status: `(pending)`, `(failed)`, or timeout

### 3. Check for Error Messages

DevTools → Console should show:

✅ After fix:

- No "CRITICAL: NEXT_PUBLIC_API_URL" messages
- API responses show actual data or auth errors

❌ Before fix:

- "CRITICAL: NEXT_PUBLIC_API_URL not configured for production API calls"
- API requests fail with network errors

---

## Backend Verification

### Endpoints Working Correctly

Based on Cloud Run logs, all these are returning 200 OK:

```bash
# Test each endpoint
curl https://whatsnextup-api-214675476458.us-central1.run.app/health

curl https://whatsnextup-api-214675476458.us-central1.run.app/api/plans \
  -H "Authorization: Bearer YOUR_TOKEN"

curl https://whatsnextup-api-214675476458.us-central1.run.app/api/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"

curl "https://whatsnextup-api-214675476458.us-central1.run.app/api/conversations/search?q=test" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Backend Logs

Check Cloud Run logs for errors:

```bash
gcloud run services logs read whatsnextup-api --region us-central1 --limit 100 | grep -i "404\|error"
```

---

## Why Search API Returns 404

The search endpoint `/api/conversations/search` is correctly implemented on backend.

### Possible Causes

1. **Frontend calling wrong URL** → Fixed now with proper `API_URL`
2. **Auth token invalid** → Check Firebase token is still valid
3. **User doesn't have conversations** → Search returns empty but not 404

### To Debug

1. Set `NEXT_PUBLIC_API_URL` in Vercel
2. Trigger redeploy
3. In production, open DevTools → Network
4. Go to History page → Search for something
5. Check network request:
   - URL should be: `...whatsnextup-api.../api/conversations/search?q=...`
   - Should NOT be: `...localhost:8000/...`
   - Response should show data or 401 (not 404)

---

## API Endpoints Status

### ✅ Working (200 OK in logs)

- GET `/health`
- GET `/api/plans` (with auth)
- GET `/api/conversations` (with auth)
- GET `/api/conversations/stats` (with auth)
- GET `/api/trending/feed`
- GET `/api/memories` (with auth)
- GET `/api/agents`
- GET `/api/reflections` (with auth)

### ⚠️ Needs Testing After Env Var Fix

- GET `/api/conversations/search` (should work)
- All POST endpoints (create plan, etc.)

### ❌ Not Yet Tested

- DELETE `/api/conversations/{id}`
- PUT endpoints (if any)

---

## Configuration Files Changed

### Updated Files (Commit f79aeda)

1. `frontend/src/lib/api.ts` - Now re-exports from unified API client
2. `frontend/src/lib/api/client.ts` - Removed production localhost fallback

### What These Changes Do

- Prevent accidental localhost usage in production
- Require explicit `NEXT_PUBLIC_API_URL` configuration
- Show clear error messages when env var missing
- Consolidate API configuration in one place

---

## Next Steps

1. **Immediate**: Set `NEXT_PUBLIC_API_URL` in Vercel
2. **Verify**: Redeploy and check DevTools Network tab
3. **Test**: Try searching, creating plans, viewing memories
4. **Monitor**: Check Cloud Run logs for errors

---

## Contact

If API calls still fail after setting env var, check:

1. DevTools Console for "CRITICAL" messages
2. DevTools Network tab for actual URLs being called
3. Backend logs for errors on Cloud Run
