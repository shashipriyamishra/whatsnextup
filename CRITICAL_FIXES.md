# Critical Performance & Stability Issues - Analysis & Fixes

## Issues Found

### 1. Memories Page - Flickering & Freeze Issues

**Problem**: Infinite re-render loop

- `fetchMemories` called in useEffect with `user` as dependency
- `user` object likely changes on every render
- No memoization of callback
- No cleanup to prevent memory leaks

**Root Cause**: Missing dependency array optimization

**Files Affected**:

- `frontend/src/app/memories/page.tsx` (lines 31-61)

**Fix**:

- Move fetchMemories outside useEffect as useCallback
- Use proper dependency array
- Add cleanup function

### 2. History Page - Search API Fails

**Problem**: Frontend calls wrong endpoint

- Frontend: `/conversations/search`
- Backend: `/api/conversations/search`
- Missing `/api` prefix

**Root Cause**: Path mismatch between frontend and backend

**Files Affected**:

- `frontend/src/lib/conversations.ts` (line 52)

**Fix**:

- Change endpoint from `/conversations/search` to `/api/conversations/search`
- Ensure all endpoints use `/api` prefix

### 3. Conversations Module - Endpoint Path Issues

**Problems Found**:

- `/conversations` → should be `/api/conversations`
- `/conversations/{id}` → should be `/api/conversations/{id}`
- `/conversations/stats` → should be `/api/conversations/stats`

**Files Affected**:

- `frontend/src/lib/conversations.ts` (lines 32, 52, 67, 84)

**Fix**: Add `/api` prefix to all conversation endpoints

### 4. API_URL Consistency

**Problem**: Mix of `API_URL` and `getApiUrl()` usage

- Some files use `${API_URL}`
- Some use `${getApiUrl()}`
- Should be consistent

**Solution**: Use `getApiUrl()` everywhere for consistency

## Implementation Order

1. Fix conversations.ts endpoints (add /api prefix)
2. Fix memories page (useCallback + proper dependencies)
3. Add performance monitoring
4. Test all fixes
5. Push to production
