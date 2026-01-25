# Caching & Browser Console Debugging Guide

## Overview of Changes

This document explains the recent changes to address:
1. **Aggressive caching** preventing UI updates on new deployments
2. **API errors in browser console** and how to debug them
3. **Consistent header navigation** across all pages

---

## 1. Cache Busting Strategy

### Problem
- Hard refresh (Cmd+Shift+R / Ctrl+Shift+R) wasn't clearing the Vercel cache
- Old UI was persisting after deployments
- Service Worker caching HTML files indefinitely

### Solution Implemented

#### a) Dynamic Build ID (`next.config.ts`)
```typescript
generateBuildId: async () => {
  return new Date().getTime().toString()
}
```
- **What it does**: Generates a unique build ID based on current timestamp
- **Result**: Every deployment creates a new build folder (`_next/static/<new-hash>/*`)
- **Benefit**: Old assets are never served, forcing browsers to fetch new code

#### b) Strict Cache Headers (`next.config.ts`)
```typescript
{
  source: '/:path*',
  headers: [
    { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }
  ]
}

{
  source: '/_next/static/:path*',
  headers: [
    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
  ]
}
```

**What this means:**
- **HTML pages** (`max-age=0`): Never cached, always revalidate with server
  - Users get latest code on every page load
  - Hard refresh still works if needed
  
- **Static assets** (`max-age=31536000`): Cached for 1 year
  - New build ID = new hash = new asset URLs
  - Old assets never served because old URLs don't exist
  - This is safe because URLs themselves change with each build

### How to Force Refresh on Vercel

Users can now reliably refresh:
1. **Hard Refresh** (Cmd+Shift+R on Mac / Ctrl+Shift+R on Windows)
2. **Clear Browser Cache** and reload
3. **Incognito Mode** will always have fresh content

After deploying to Vercel, users will see updates within seconds.

---

## 2. API Errors in Browser Console

### Checking Console for API Errors

1. Open browser DevTools: `F12` or `Cmd+Option+I`
2. Go to **Console** tab
3. Look for messages starting with:
   - `[API]` - Debug info (development only)
   - `🚨 CRITICAL` - Production errors
   - `Failed to fetch` - Network errors

### Common Console Errors & Solutions

#### Error: "🚨 CRITICAL: NEXT_PUBLIC_API_URL environment variable is not set"
**Cause**: API environment variable not configured in Vercel
**Fix**: See [VERCEL_SETUP_INSTRUCTIONS.md](./VERCEL_SETUP_INSTRUCTIONS.md)

#### Error: "404: This page could not be found"
**Cause**: Request going to Vercel (frontend) instead of Cloud Run (backend)
**Why**: Empty `NEXT_PUBLIC_API_URL` = requests fail to resolve correct backend
**Fix**: Set `NEXT_PUBLIC_API_URL` to Cloud Run backend URL in Vercel

#### Error: "Network error. Please check your connection"
**Cause**: Network connectivity issue or CORS blocked
**Debug Steps**:
1. Check backend is running: Visit `https://whatsnextup-api-xxx.run.app/health`
2. Check CORS headers - should include `whatsnextup.com`
3. Open DevTools **Network** tab, check failed request headers

#### Error: "Failed to fetch / TypeError"
**Cause**: Backend unreachable or timeout
**Debug Steps**:
1. Check `NEXT_PUBLIC_API_URL` is correct in Vercel
2. Check Cloud Run service is healthy: `gcloud run services describe whatsnextup-api --region us-central1`
3. Check service has external traffic allowed

### Debugging API Requests

#### Step 1: Open DevTools Network Tab
- Press `F12` → **Network** tab
- Look for requests to your API URL (e.g., `whatsnextup-api-xxx.run.app/api/...`)

#### Step 2: Check Request Details
Click on a failed request:
- **Headers** tab: Verify `Authorization: Bearer <token>` present
- **Response** tab: See error message from backend

#### Step 3: Enable Verbose Logging
In development, the API client logs all requests:
```
[API] GET https://localhost:8000/api/memories
[API] Response: 200 OK
```

To enable in production (temporarily):
1. Open Console
2. Run: `localStorage.debug = '*'`
3. Reload page
4. Check console output

---

## 3. Fixed Header Navigation

### Changes Made

**Before**: 
- Home page header had different links than other pages
- "Agents", "Trending" navigation inconsistent

**After**:
- All pages (except login) show: 🔥 Trending | 🤖 Agents | 📜 History | 👤 Profile
- Active link highlighted with purple underline
- Consistent spacing and styling

### Location
- File: [frontend/src/components/Header.tsx](./frontend/src/components/Header.tsx)
- Active link styling: `border-b-2 border-purple-600 pb-1` with font-bold

---

## 4. Trending Page Color Updates

### Changes Made

**Before**: All cards had uniform `bg-white/10` (very dark)

**After**: Random solid color combinations with max 60% darkness

**Color Palette:**
- Blue 900/40
- Indigo 900/40  
- Purple 900/40
- Pink 900/40
- Rose 900/40
- Red 900/40
- Orange 900/40
- Amber 900/40
- Cyan 900/40
- Teal 900/40

Each card gets a random color from the palette, creating visual variety while maintaining readability.

### Technical Implementation
```typescript
// Color is selected randomly on component render
const colors = [
  "bg-blue-900/40 border-blue-600/30...",
  "bg-indigo-900/40 border-indigo-600/30...",
  // ... more colors
]
const colorClass = colors[Math.floor(Math.random() * colors.length)]
```

---

## 5. Testing the Fixes

### Test Cache Busting
1. Deploy to Vercel
2. Open the site
3. Make code change (e.g., change button text)
4. Deploy again
5. Do hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
6. Verify change appears immediately

### Test API Errors
1. Open DevTools: `F12`
2. Go to **Console** tab
3. Try making an API call (e.g., go to Agents page)
4. Watch console for `[API]` debug logs or errors
5. Check Network tab for actual HTTP requests

### Test Header
1. Navigate between pages: Trending → Agents → History → Profile
2. Verify header stays consistent
3. Verify active page is underlined in purple
4. Verify "What's Next Up" logo is always present with back button on non-home pages

---

## 6. Deployment Checklist

Before deploying to production:

- [ ] Build succeeds: `npm run build` (0 errors)
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel environment variables
- [ ] API URL points to Cloud Run backend
- [ ] Backend is accessible and healthy
- [ ] Test page loads in incognito mode
- [ ] Open console to check for critical errors
- [ ] Hard refresh works (`Cmd+Shift+R`)

---

## 7. Quick Reference Commands

```bash
# Build locally
npm run build

# Check Vercel environment variables
# Go to: https://vercel.com → Project → Settings → Environment Variables

# Check backend health
curl https://whatsnextup-api-xxx.run.app/health

# Hard refresh on Windows
Ctrl+Shift+R

# Hard refresh on Mac
Cmd+Shift+R

# Check backend logs
gcloud run services logs read whatsnextup-api --region us-central1 --limit 50
```

---

## Files Modified

1. **next.config.ts** - Added cache headers and dynamic build ID
2. **Header.tsx** - Consolidated navigation across pages
3. **card.tsx** - Colorized trending cards with solid backgrounds
4. **api/client.ts** - Enhanced logging and error messages

---

## Related Documentation

- [VERCEL_SETUP_INSTRUCTIONS.md](./VERCEL_SETUP_INSTRUCTIONS.md) - How to configure environment variables
- [TROUBLESHOOTING_APIs.md](./TROUBLESHOOTING_APIs.md) - Common API issues and solutions
- [SESSION_SUMMARY.md](./SESSION_SUMMARY.md) - Overall work summary
