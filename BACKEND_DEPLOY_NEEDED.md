# Backend Deployment Required

## ⚠️ IMPORTANT: New Endpoints Not Deployed Yet

The trending feed API is returning 404 because the new backend code hasn't been deployed to Cloud Run yet.

---

## 🚀 Deploy Backend with New Features

### Quick Deploy Command:

```bash
cd backend

# Deploy to Cloud Run
gcloud run deploy whatsnextup-api \
  --source . \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=2Gi \
  --timeout=300
```

### Or use your existing deployment:

```bash
# If you have a deploy script
./deploy.sh

# Or build and push Docker image
docker build -t gcr.io/whatsnextup/backend:latest .
docker push gcr.io/whatsnextup/backend:latest

gcloud run deploy whatsnextup-api \
  --image gcr.io/whatsnextup/backend:latest \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --cpu 1 \
  --allow-unauthenticated \
  --timeout 300 \
  --project=whatsnextup
```

---

## 📝 What's Being Deployed

### New Backend Modules:

1. `conversations/` - Chat history persistence
2. `trending/` - Social media & trending integrations
3. `usage/` - Tier management & usage tracking

### New API Endpoints (13 total):

**Trending (No Auth):**

- `GET /api/trending/reddit`
- `GET /api/trending/youtube`
- `GET /api/trending/news`
- `GET /api/trending/weather`
- `GET /api/trending/hackernews`
- `GET /api/trending/github`
- `GET /api/trending/feed` ← **This is the 404 endpoint**

**Conversations (Auth Required):**

- `GET /api/conversations`
- `GET /api/conversations/search`
- `DELETE /api/conversations/{id}`
- `GET /api/conversations/stats`

**Usage & Subscription:**

- `GET /api/usage/stats`
- `POST /api/subscription/upgrade`

---

## ✅ After Deployment, Test:

```bash
# Should return trending data (not 404)
curl 'https://whatsnextup-api-214675476458.us-central1.run.app/api/trending/feed'

# Should return Reddit posts
curl 'https://whatsnextup-api-214675476458.us-central1.run.app/api/trending/reddit?subreddit=popular&limit=5'

# Should return Hacker News stories
curl 'https://whatsnextup-api-214675476458.us-central1.run.app/api/trending/hackernews?limit=5'
```

---

## 🔑 API Keys (Optional but Recommended)

After deploying, add API keys for premium features:

```bash
gcloud run services update whatsnextup-api \
  --set-env-vars="NEWS_API_KEY=your_key,YOUTUBE_API_KEY=your_key,OPENWEATHER_API_KEY=your_key" \
  --region=us-central1
```

**Note:** The app will work without these! Reddit, Hacker News, and GitHub work immediately.

See [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) for detailed instructions.

---

## 🐛 Troubleshooting

### If deploy fails with "Module not found":

Make sure all `__init__.py` files exist:

```bash
cd backend
touch conversations/__init__.py
touch trending/__init__.py
touch usage/__init__.py
```

### If requirements.txt is missing dependencies:

```bash
# Make sure httpx is in requirements.txt
grep -q "httpx" requirements.txt || echo "httpx==0.27.0" >> requirements.txt
```

### Check if deployment succeeded:

```bash
# Should show the latest version
gcloud run services describe whatsnextup-api --region=us-central1 --format="value(status.latestReadyRevisionName)"
```

---

## ⏱️ Estimated Deploy Time

- **Build:** 2-3 minutes
- **Deploy:** 1-2 minutes
- **Total:** ~5 minutes

---

## 📊 What Will Work After Deploy

✅ **Immediately Working:**

- Trending feed with Reddit, Hacker News, GitHub
- Usage tracking and tier limits
- Conversation history (Plus/Pro users)

⏳ **Need API Keys:**

- YouTube trending (requires YOUTUBE_API_KEY)
- News articles (requires NEWS_API_KEY)
- Weather updates (requires OPENWEATHER_API_KEY)

---

## Summary

**Current Issue:** 404 on `/api/trending/feed` because backend hasn't been deployed

**Solution:** Run the deploy command above (takes ~5 minutes)

**After Deploy:** All trending features will work (at least Reddit/HN/GitHub immediately, others after adding API keys)
