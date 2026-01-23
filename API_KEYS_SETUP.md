# API Keys Setup Guide

This document explains which API keys you need to get and how to configure them for the trending features.

## ⚠️ IMPORTANT: Which APIs Need Keys?

### ✅ FREE APIS (No Keys Needed - Already Working!)

These APIs work immediately without any setup:

- **Reddit** - Public JSON endpoints
- **Hacker News** - Official public API
- **GitHub Trending** - Unofficial API (no auth required)

### 🔑 APIS THAT REQUIRE KEYS (Follow Instructions Below)

You need to create accounts and get API keys for these 3 services:

---

## 1. News API (newsapi.org)

**Free Tier:** 100 requests per day

### Setup Steps:

1. Go to [https://newsapi.org/register](https://newsapi.org/register)
2. Create a free account
3. Verify your email
4. Copy your API key from the dashboard
5. Add to Google Cloud Run environment variables (see below)

**Key Name:** `NEWS_API_KEY`

---

## 2. YouTube Data API v3 (Google Cloud)

**Free Tier:** 10,000 quota units per day (approximately 1,000 requests)

### Setup Steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Go to **APIs & Services > Library**
4. Search for "YouTube Data API v3"
5. Click **Enable**
6. Go to **APIs & Services > Credentials**
7. Click **Create Credentials > API Key**
8. Copy the API key
9. (Optional) Restrict the key to only YouTube Data API v3 for security
10. Add to Google Cloud Run environment variables (see below)

**Key Name:** `YOUTUBE_API_KEY`

---

## 3. OpenWeather API (openweathermap.org)

**Free Tier:** 1,000 API calls per day

### Setup Steps:

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click **Sign Up** and create a free account
3. Verify your email
4. Go to **API keys** in your account
5. Copy the default API key (or create a new one)
6. **IMPORTANT:** It takes 10-15 minutes for new keys to activate
7. Add to Google Cloud Run environment variables (see below)

**Key Name:** `OPENWEATHER_API_KEY`

---

## Adding Keys to Google Cloud Run

### Option 1: Using Google Cloud Console (Recommended)

1. Go to [Google Cloud Run Console](https://console.cloud.google.com/run)
2. Click on your backend service (`whatsnextup-backend` or similar)
3. Click **Edit & Deploy New Revision**
4. Scroll down to **Variables & Secrets**
5. Click **Add Variable** for each key:
   - Name: `NEWS_API_KEY`
   - Value: `your_news_api_key_here`
   - Name: `YOUTUBE_API_KEY`
   - Value: `your_youtube_api_key_here`
   - Name: `OPENWEATHER_API_KEY`
   - Value: `your_openweather_api_key_here`

6. Click **Deploy**
7. Wait for the new revision to finish deploying (1-2 minutes)

### Option 2: Using gcloud CLI

```bash
gcloud run services update whatsnextup-backend \
  --set-env-vars="NEWS_API_KEY=your_news_api_key_here,YOUTUBE_API_KEY=your_youtube_api_key_here,OPENWEATHER_API_KEY=your_openweather_api_key_here" \
  --region=us-central1
```

---

## Testing Your Setup

After adding the keys and deploying, test each endpoint:

### Test News API:

```bash
curl "https://your-backend-url.run.app/api/trending/news?country=us&category=technology"
```

### Test YouTube API:

```bash
curl "https://your-backend-url.run.app/api/trending/youtube?region=US"
```

### Test Weather API:

```bash
curl "https://your-backend-url.run.app/api/trending/weather?city=Mumbai&country=IN"
```

### Test Aggregated Feed (All Sources):

```bash
curl "https://your-backend-url.run.app/api/trending/feed?city=Mumbai&country=IN"
```

---

## Rate Limits & Cost Monitoring

### News API (100 req/day)

- Monitor at: [https://newsapi.org/account](https://newsapi.org/account)
- If exceeded: Users see Reddit/HN instead, or upgrade to paid plan

### YouTube API (10,000 quota/day)

- Monitor at: [Google Cloud Console > APIs & Services > Dashboard](https://console.cloud.google.com/apis/dashboard)
- Each video list request costs ~1 quota unit
- If exceeded: Users see message "YouTube trending unavailable"

### OpenWeather API (1,000 calls/day)

- Monitor at: [https://home.openweathermap.org/statistics](https://home.openweathermap.org/statistics)
- If exceeded: Weather widget won't show

---

## Security Best Practices

✅ **DO:**

- Use API key restrictions (IP/domain restrictions in Google Cloud)
- Monitor usage regularly
- Set up billing alerts in provider dashboards
- Rotate keys if compromised

❌ **DON'T:**

- Commit API keys to Git
- Share keys publicly
- Use production keys in development (create separate keys)

---

## Fallback Behavior

If an API key is missing or rate limit is exceeded:

- **News API:** Falls back to Reddit + Hacker News
- **YouTube API:** Shows message "YouTube unavailable"
- **Weather API:** Hides weather widget
- **Aggregated Feed:** Shows only available sources

Users on **Free Tier** only get Reddit, HN, and GitHub (no keys needed).

---

## Troubleshooting

### "API key not valid" errors:

- Double-check the key is copied correctly (no extra spaces)
- Verify environment variable names match exactly
- Redeploy Cloud Run service after adding keys

### "API quota exceeded" errors:

- Check usage in provider dashboards
- Wait for daily reset (usually midnight UTC)
- Consider upgrading to paid tiers

### Weather API not working:

- Wait 10-15 minutes after creating the key
- Check if key is activated at openweathermap.org

---

## Cost Estimates (If You Exceed Free Tiers)

### News API Paid Plans:

- **Developer**: $449/month (250K requests)
- Only needed if you have 2500+ daily active users

### YouTube Data API:

- Free quota usually sufficient
- Paid: $0.30 per 10,000 quota units
- Would need 100K+ daily users to exceed free tier

### OpenWeather API:

- **Startup**: $40/month (100K calls)
- Only needed if you have 100+ daily active users checking weather

**Recommendation:** Start with free tiers, monitor usage, upgrade only when needed.

---

## Summary Checklist

- [ ] Create News API account and get key
- [ ] Enable YouTube Data API v3 and create API key
- [ ] Create OpenWeather account and get key
- [ ] Add all 3 keys to Google Cloud Run environment variables
- [ ] Deploy new revision
- [ ] Test all endpoints
- [ ] Set up usage monitoring
- [ ] Configure billing alerts

---

**Questions?** Check provider documentation or Cloud Run logs for detailed error messages.
