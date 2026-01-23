# API Quotas & Billing: No Auto-Charge Policy

## 🛡️ SAFE: These APIs STOP Service After Free Quota (No Auto-Charge)

All the APIs we're using have **safe free tiers** that will STOP working when quota is exceeded. They will NOT automatically charge you.

---

## 1. News API (newsapi.org)

### Free Tier:

- **100 requests per day**
- **1000 articles per request**
- No credit card required

### What Happens After Quota:

- ✅ **Service STOPS** - Returns error
- ❌ **NO auto-charge**
- You must manually upgrade to continue

### Upgrade Required For:

- More than 100 requests/day
- Commercial use
- Historical articles (older than 30 days)

### Pricing (If You Choose to Upgrade):

- **Developer**: $449/month (250,000 requests/month)
- **Business**: $1,999/month (1,000,000 requests/month)

**You control when to upgrade** - No surprises!

---

## 2. YouTube Data API v3 (Google Cloud)

### Free Tier:

- **10,000 quota units per day**
- Each video list request = ~1 unit
- Effectively ~10,000 requests/day
- No credit card required for free tier

### What Happens After Quota:

- ✅ **Service STOPS** - Returns 403 error
- ❌ **NO auto-charge**
- Resets daily at midnight Pacific Time

### To Enable Billing (Optional):

You must **manually enable billing** in Google Cloud Console:

1. Go to Billing settings
2. Link a credit card
3. Set a budget alert
4. Then quota can exceed 10,000

### Pricing (If You Enable Billing):

- **$0.30 per 10,000 quota units** (after free tier)
- You set budget alerts to prevent overuse

**Default behavior: Stops at 10,000 units/day** - Safe!

---

## 3. OpenWeather API (openweathermap.org)

### Free Tier:

- **1,000 API calls per day**
- **60 calls per minute**
- No credit card required

### What Happens After Quota:

- ✅ **Service STOPS** - Returns 429 error
- ❌ **NO auto-charge**
- Resets daily at 00:00 UTC

### Upgrade Required For:

- More than 1,000 calls/day
- Historical weather data
- Forecasts beyond 5 days

### Pricing (If You Choose to Upgrade):

- **Startup**: $40/month (100,000 calls/day)
- **Developer**: $180/month (1,000,000 calls/day)

**You must manually subscribe** - No auto-billing!

---

## 4. Reddit API (Free Forever)

### Free Tier:

- **Unlimited** (with rate limits)
- **60 requests per minute**
- No API key needed (we use public JSON)

### What Happens:

- ✅ Always free
- ❌ No charges ever
- Just respect rate limits

---

## 5. Hacker News API (Free Forever)

### Free Tier:

- **Completely free**
- **Unlimited requests**
- No API key needed

### What Happens:

- ✅ Always free
- ❌ No charges ever

---

## 6. GitHub Trending (Free Forever)

### Free Tier:

- **Free unofficial API**
- No API key needed

### What Happens:

- ✅ Always free
- ❌ No charges ever

---

## 💳 Payment Gateway: Stripe

### For Your Pricing Plans:

When users upgrade to Plus or Pro, you'll use **Stripe** for payments.

### Required Keys:

#### 1. Publishable Key (Safe for Frontend):

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

- Safe to expose in frontend
- Used for checkout UI

#### 2. Secret Key (Backend Only):

```env
STRIPE_SECRET_KEY=sk_live_xxxxx
```

- ⚠️ NEVER expose in frontend or Git
- Only in backend environment variables

### Stripe Billing:

#### Free Tier:

- ✅ No charge to you for using Stripe
- Only pay when users make payments

#### Transaction Fees:

- **India**: 2.9% + ₹2 per transaction
- **No monthly fees**
- **No setup fees**

### How It Works:

1. **User clicks "Upgrade"**
2. **Redirected to Stripe Checkout** (PCI compliant)
3. **User pays ₹499/month**
4. **Stripe takes fee** (2.9% + ₹2 = ~₹16.5)
5. **You receive** ₹482.5
6. **User tier upgraded automatically** via webhook

### Stripe Quota:

- ✅ **No API limits** on free tier
- ✅ **No auto-charges**
- ✅ **Pay only transaction fees**

---

## 🎯 Summary: Zero Auto-Charge Risk

| Service         | Free Limit    | After Quota | Auto-Charge?                      |
| --------------- | ------------- | ----------- | --------------------------------- |
| **News API**    | 100/day       | Stops       | ❌ NO                             |
| **YouTube API** | 10,000/day    | Stops       | ❌ NO (unless you enable billing) |
| **Weather API** | 1,000/day     | Stops       | ❌ NO                             |
| **Reddit**      | Unlimited     | N/A         | ❌ Never charges                  |
| **Hacker News** | Unlimited     | N/A         | ❌ Never charges                  |
| **GitHub**      | Unlimited     | N/A         | ❌ Never charges                  |
| **Stripe**      | Unlimited API | N/A         | ❌ NO (only % of transactions)    |

---

## 📊 Budget Recommendations

### Month 1 (Testing):

- **All APIs**: $0 (use free tiers)
- **Stripe**: $0 (no transactions yet)
- **Total**: **$0**

### Month 2-3 (If You Get 100+ Daily Users):

- **News API**: Consider upgrade to $449/month (if needed)
- **YouTube API**: Still free (10K quota is ~10K users/day)
- **Weather API**: Still free (1K calls = 100 users checking weather)
- **Stripe**: ~2.9% of revenue

### When to Upgrade:

| API         | Upgrade When      | Estimated Users         |
| ----------- | ----------------- | ----------------------- |
| News API    | >100 requests/day | >100 daily active users |
| YouTube API | >10,000 quota/day | >10,000 daily users     |
| Weather API | >1,000 calls/day  | >1,000 daily users      |

**You'll know because the API will stop working** - No surprise charges!

---

## 🔔 Recommended Monitoring

### Set Up Alerts:

1. **Google Cloud (YouTube API):**

   ```
   Alert when quota usage > 8,000/day (80%)
   ```

2. **News API:**
   - Check dashboard daily
   - Monitor at: newsapi.org/account

3. **Weather API:**
   - Check dashboard daily
   - Monitor at: openweathermap.org/statistics

### All alerts are FREE and prevent hitting limits!

---

## ✅ Final Answer to Your Question

> "Will I be charged automatically after quota exhaustion?"

**NO!** All services will:

1. ✅ STOP working when free quota is exhausted
2. ✅ Show you errors in logs
3. ✅ Require manual upgrade decision
4. ❌ NEVER auto-charge without your explicit consent

You have complete control over costs! 🎉
