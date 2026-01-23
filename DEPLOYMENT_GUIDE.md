# Deployment Guide

## 🚀 Complete Feature List

This deployment includes the following new features:

### ✅ Conversation History

- Save all agent chats to Firestore
- Search through past conversations
- View statistics (total messages, agents used)
- Delete individual conversations
- Only available for Plus and Pro users

### ✅ Trending Dashboard

- **Free APIs (No Keys Needed):**
  - Reddit trending posts
  - Hacker News top stories
  - GitHub trending repositories
- **Premium APIs (Require Keys):**
  - YouTube trending videos
  - Top news from 1000+ sources
  - Real-time weather data

### ✅ Pricing Page

- Free tier: 10 messages/day
- Plus tier: ₹499/month - unlimited messages
- Pro tier: ₹999/month - everything + API access
- Annual billing with 20% discount option

### ✅ Usage Tracking

- Daily message limits for free tier
- Visual usage bar shows remaining messages
- Automatic tier checking before each message
- Upgrade prompts when approaching limits

### ✅ Navigation Updates

- New "Trending" link in header
- New "History" link in header (when logged in)
- New "Upgrade" link with special styling
- Removed old Memories/Plans/Reflections links

---

## 📁 Files Modified/Created

### Backend (8 new files + 1 modified):

**New Files:**

1. `/backend/conversations/store.py` - Conversation persistence system
2. `/backend/conversations/__init__.py` - Module exports
3. `/backend/trending/api_integrations.py` - Social media integrations
4. `/backend/trending/__init__.py` - Module exports
5. `/backend/usage/tracking.py` - Usage limits and tier management
6. `/backend/usage/__init__.py` - Module exports

**Modified:** 7. `/backend/main.py` - Added 13 new endpoints:

- 4 conversation endpoints (GET/DELETE/search/stats)
- 7 trending endpoints (Reddit/YouTube/News/Weather/HN/GitHub/Feed)
- 2 usage/subscription endpoints

### Frontend (7 new files + 2 modified):

**New Files:**

1. `/frontend/src/lib/trending.ts` - Trending API client
2. `/frontend/src/lib/conversations.ts` - Conversations API client
3. `/frontend/src/app/trending/page.tsx` - Trending Dashboard page
4. `/frontend/src/app/history/page.tsx` - Chat History page
5. `/frontend/src/app/pricing/page.tsx` - Pricing page
6. `/frontend/src/components/UsageBar.tsx` - Usage indicator component

**Modified:** 7. `/frontend/src/components/ChatScreen.tsx` - Added new navigation links + UsageBar 8. `/frontend/src/lib/api.ts` - Exported API_URL 9. `/frontend/src/lib/AuthContext.tsx` - Added token state

### Documentation:

10. `/MONETIZATION_PLAN.md` - Full monetization strategy
11. `/API_KEYS_SETUP.md` - Step-by-step API key setup guide
12. `/DEPLOYMENT_GUIDE.md` - This file

---

## 🔑 Required Actions Before Deployment

### Step 1: Get API Keys (Optional but Recommended)

Follow instructions in [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) to get:

1. **News API** - newsapi.org (Free: 100 req/day)
2. **YouTube Data API** - Google Cloud Console (Free: 10K quota/day)
3. **OpenWeather API** - openweathermap.org (Free: 1K calls/day)

**Note:** The app will still work without these keys! Reddit, Hacker News, and GitHub will still function.

### Step 2: Add Environment Variables to Google Cloud Run

```bash
gcloud run services update whatsnextup-backend \
  --set-env-vars="NEWS_API_KEY=your_news_api_key_here,YOUTUBE_API_KEY=your_youtube_api_key_here,OPENWEATHER_API_KEY=your_openweather_api_key_here" \
  --region=us-central1
```

Or add via Google Cloud Console:

1. Go to Cloud Run → Your Service → Edit & Deploy New Revision
2. Add Variables & Secrets:
   - `NEWS_API_KEY`
   - `YOUTUBE_API_KEY`
   - `OPENWEATHER_API_KEY`
3. Deploy

---

## 🚀 Deployment Commands

### Backend Deployment:

```bash
# From project root
cd backend

# Build and deploy to Cloud Run
gcloud run deploy whatsnextup-backend \
  --source . \
  --region=us-central1 \
  --allow-unauthenticated

# Or using existing build setup
./deploy.sh
```

### Frontend Deployment:

```bash
# From project root
cd frontend

# Install dependencies (if needed)
npm install

# Build for production
npm run build

# Deploy to Vercel (auto-deploys on push to main)
git push origin main

# Or manual deploy
vercel --prod
```

---

## ✅ Post-Deployment Testing

### 1. Test Trending Endpoints (No Auth Required):

```bash
# Reddit trending
curl "https://your-backend-url.run.app/api/trending/reddit?subreddit=popular&limit=5"

# Hacker News
curl "https://your-backend-url.run.app/api/trending/hackernews?limit=5"

# GitHub trending
curl "https://your-backend-url.run.app/api/trending/github?language=python"

# Aggregated feed
curl "https://your-backend-url.run.app/api/trending/feed"
```

### 2. Test Premium APIs (If Keys Added):

```bash
# News (requires NEWS_API_KEY)
curl "https://your-backend-url.run.app/api/trending/news?country=us"

# YouTube (requires YOUTUBE_API_KEY)
curl "https://your-backend-url.run.app/api/trending/youtube?region=US"

# Weather (requires OPENWEATHER_API_KEY)
curl "https://your-backend-url.run.app/api/trending/weather?city=Mumbai&country=IN"
```

### 3. Test Conversation History (Requires Auth):

```bash
# Get conversations (requires Firebase token)
curl "https://your-backend-url.run.app/api/conversations" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"

# Search conversations
curl "https://your-backend-url.run.app/api/conversations/search?q=budget" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"

# Get stats
curl "https://your-backend-url.run.app/api/conversations/stats" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

### 4. Test Usage Tracking:

```bash
# Get usage stats (requires auth)
curl "https://your-backend-url.run.app/api/usage/stats" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

### 5. Test in Browser:

1. **Login** → Should see new navigation links (Trending, History, Upgrade)
2. **Trending Page** → Navigate to `/trending`, should see Reddit/HN/GitHub working
3. **Send 10 messages** → Should see usage bar progress and hit limit
4. **History Page** → Navigate to `/history`, should see past conversations (Plus/Pro only)
5. **Pricing Page** → Navigate to `/pricing`, should see all 3 tiers

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors in backend

**Solution:** Ensure all new directories have `__init__.py`:

```bash
touch backend/conversations/__init__.py
touch backend/trending/__init__.py
touch backend/usage/__init__.py
```

### Issue: Frontend can't fetch from backend

**Solution:** Check CORS settings in `main.py`:

```python
allow_origins=[
    "http://localhost:3000",
    "https://www.whatsnextup.com",
    "https://whatsnextup.vercel.app",
]
```

### Issue: Trending APIs return errors

**Solution:**

1. Check if API keys are set in Cloud Run environment
2. Verify keys are active (OpenWeather takes 10-15 min to activate)
3. Check rate limits in provider dashboards

### Issue: Conversation history not saving

**Solution:**

1. Check Firestore permissions
2. Verify user is on Plus or Pro tier (free tier can't save history)
3. Check Cloud Run logs for errors

### Issue: Usage limits not working

**Solution:**

1. Check Firestore `users` collection exists
2. Verify user document is being created
3. Check if date resets are working (check `last_reset` field)

---

## 📊 Monitoring & Alerts

### Cloud Run Metrics:

Monitor in Google Cloud Console:

- Request count (should increase with trending features)
- Error rate (watch for 429 errors if API limits exceeded)
- Memory usage (trending APIs cache data)

### API Usage Monitoring:

1. **News API:** https://newsapi.org/account
2. **YouTube API:** Google Cloud Console > APIs & Services > Dashboard
3. **OpenWeather:** https://home.openweathermap.org/statistics

### Set Up Alerts:

```bash
# Example: Alert when error rate > 5%
gcloud monitoring policies create \
  --notification-channels=YOUR_CHANNEL_ID \
  --display-name="High Error Rate" \
  --condition-display-name="Error Rate > 5%" \
  --condition-threshold-value=5
```

---

## 🔄 Rollback Plan

If issues occur, rollback to previous version:

```bash
# Backend rollback
gcloud run services update whatsnextup-backend \
  --image=gcr.io/YOUR_PROJECT/whatsnextup-backend:PREVIOUS_TAG \
  --region=us-central1

# Or use the saved commit
git reset --hard beee35bd19287167525a8a41ec3e659faf7eca21
git push origin main --force

# Frontend rollback
# In Vercel dashboard: Deployments → Previous deployment → Promote to Production
```

---

## 📈 Expected Impact

### User Engagement:

- ✅ Trending feature increases daily active users (browsing without login)
- ✅ Conversation history increases retention (users return to check past chats)
- ✅ Usage limits encourage upgrades (see conversion in Stripe dashboard)

### Technical:

- ⚠️ Increased API calls to trending sources (monitor quotas)
- ⚠️ More Firestore writes (conversations being saved)
- ✅ Free tier gets free trending content (Reddit/HN/GitHub)

### Revenue:

- 🎯 Target: 5-10% free→Plus conversion within 30 days
- 🎯 Monitor via Stripe dashboard and Firestore `users` collection

---

## 🎯 Next Steps (Future Enhancements)

1. **Stripe Integration** - Add payment gateway (not included yet)
2. **Email Notifications** - Usage limit warnings
3. **Analytics Dashboard** - User engagement metrics
4. **Custom Agents** - Pro tier feature
5. **API Access** - Pro tier feature
6. **Team Collaboration** - Pro tier feature

---

## ✅ Deployment Checklist

- [ ] Get API keys (News, YouTube, Weather) - Optional
- [ ] Add environment variables to Cloud Run
- [ ] Deploy backend to Google Cloud Run
- [ ] Deploy frontend to Vercel
- [ ] Test all trending endpoints
- [ ] Test conversation history (with Plus/Pro user)
- [ ] Test usage limits (with free user)
- [ ] Verify navigation links work
- [ ] Check error logs for issues
- [ ] Monitor API usage dashboards
- [ ] Set up billing alerts
- [ ] Update status page / announce new features

---

**Estimated Deployment Time:** 30-45 minutes
**Rollback Commit:** `beee35bd19287167525a8a41ec3e659faf7eca21`
**Date Created:** $(date)
