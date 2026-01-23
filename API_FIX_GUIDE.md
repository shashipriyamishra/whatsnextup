# API Endpoint Fix Guide

## ❌ Issue: 404 Errors on API Calls

### Problem:

You're getting 404 errors because the API endpoints are missing the `/api` prefix.

---

## ✅ Correct API Endpoints

All endpoints should start with `/api`:

### Trending Endpoints (No Auth Required):

```bash
# ❌ WRONG
curl 'https://whatsnextup-api-214675476458.us-central1.run.app/trending/feed'

# ✅ CORRECT
curl 'https://whatsnextup-api-214675476458.us-central1.run.app/api/trending/feed'
```

**All Trending Endpoints:**

- ✅ `GET /api/trending/reddit?subreddit=popular&limit=10`
- ✅ `GET /api/trending/youtube?region=US&limit=10`
- ✅ `GET /api/trending/news?country=us&category=technology`
- ✅ `GET /api/trending/weather?city=Mumbai&country=IN`
- ✅ `GET /api/trending/hackernews?limit=10`
- ✅ `GET /api/trending/github?language=python&since=daily`
- ✅ `GET /api/trending/feed` (aggregated)

### Usage & Subscription Endpoints (Auth Required):

```bash
# ❌ WRONG
curl 'http://localhost:8000/usage/stats' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# ✅ CORRECT
curl 'http://localhost:8000/api/usage/stats' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**All Usage Endpoints:**

- ✅ `GET /api/usage/stats` - Get current usage statistics
- ✅ `POST /api/subscription/upgrade` - Upgrade subscription tier

### Conversation Endpoints (Auth Required):

- ✅ `GET /api/conversations?agent_id=budget_tracker&limit=50`
- ✅ `GET /api/conversations/search?q=budget`
- ✅ `DELETE /api/conversations/{conversation_id}`
- ✅ `GET /api/conversations/stats`

### Agent Endpoints (Auth Required):

- ✅ `POST /api/agents/{agent_id}/chat` - Chat with agent
- ✅ `GET /api/agents` - List all agents

---

## 🧪 Test Commands (Copy-Paste Ready)

### Test Trending Feed (No Auth):

```bash
# Production
curl 'https://whatsnextup-api-214675476458.us-central1.run.app/api/trending/feed'

# Local
curl 'http://localhost:8000/api/trending/feed'
```

### Test Reddit Trending (No Auth):

```bash
curl 'https://whatsnextup-api-214675476458.us-central1.run.app/api/trending/reddit?subreddit=popular&limit=5'
```

### Test Usage Stats (With Auth):

```bash
# Replace YOUR_TOKEN with your actual Firebase token
curl 'http://localhost:8000/api/usage/stats' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Test Hacker News (No Auth):

```bash
curl 'https://whatsnextup-api-214675476458.us-central1.run.app/api/trending/hackernews?limit=5'
```

---

## 🔍 Frontend API Calls

The frontend should automatically use the correct endpoints. Check these files:

### `/frontend/src/lib/trending.ts`

All functions should call `/api/trending/*`:

```typescript
const response = await fetch(`${API_URL}/api/trending/feed?${params}`)
```

### `/frontend/src/lib/conversations.ts`

All functions should call `/api/conversations/*`:

```typescript
const response = await fetch(`${API_URL}/api/conversations?${params}`, {
  headers: { Authorization: `Bearer ${token}` },
})
```

### `/frontend/src/components/UsageBar.tsx`

Should call `/api/usage/stats`:

```typescript
const response = await fetch(`${API_URL}/api/usage/stats`, {
  headers: { Authorization: `Bearer ${token}` },
})
```

---

## 🐛 Debugging Tips

### Check if endpoint exists:

```bash
# List all routes (if you have access to backend)
cd backend
python -c "from main import app; print([route.path for route in app.routes])"
```

### Check CORS settings:

If you get CORS errors when calling from localhost:3000, verify `main.py` has:

```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:3001",
    "https://www.whatsnextup.com",
    "https://whatsnextup.vercel.app",
]
```

### Check if backend is running:

```bash
# Local
curl http://localhost:8000/health || echo "Backend not running"

# Production
curl https://whatsnextup-api-214675476458.us-central1.run.app/health
```

---

## ✅ Quick Verification Checklist

- [ ] All API calls include `/api` prefix
- [ ] Auth endpoints include `Authorization: Bearer TOKEN` header
- [ ] Trending endpoints work without auth
- [ ] CORS allows localhost:3000
- [ ] Backend is deployed and running
- [ ] Frontend is calling correct API_URL

---

## 📝 Summary

**The key issue:** Missing `/api` prefix in URL paths.

**Quick fix:**

```bash
# Add /api after the domain
OLD: https://your-domain.com/trending/feed
NEW: https://your-domain.com/api/trending/feed
```

All endpoints follow this pattern: `{BASE_URL}/api/{endpoint}`
