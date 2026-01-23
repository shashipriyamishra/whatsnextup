# Stripe Payment Gateway Setup Guide

Complete guide to integrate Stripe for Plus and Pro subscriptions.

---

## 📋 Prerequisites

- ✅ Stripe account (free to create)
- ✅ Indian business registered (or use Stripe Atlas)
- ✅ Bank account for payouts

---

## 1️⃣ Create Stripe Account

### Sign Up:

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now"
3. Fill in business details:
   - **Country:** India
   - **Business type:** Individual or Company
   - **Email:** Your business email

### Complete Verification:

- Provide business documents
- Link bank account (for payouts)
- Verify phone number

⏱️ **Verification time:** 1-2 business days

---

## 2️⃣ Get API Keys

### Development Keys (Test Mode):

1. Go to [Dashboard](https://dashboard.stripe.com/test/dashboard)
2. Click **Developers** → **API keys**
3. Copy both keys:

```env
# Backend (.env)
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY_HERE

# Frontend (.env.local)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY_HERE
```

⚠️ **Test keys** start with `sk_test_` and `pk_test_`

### Production Keys (Live Mode):

After verification, get live keys:

1. Toggle to **Live mode** (top-right)
2. Go to **Developers** → **API keys**
3. Copy both keys:

```env
# Backend (.env.production)
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY_HERE

# Frontend (.env.production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY_HERE
```

⚠️ **NEVER commit these to Git!**

---

## 3️⃣ Create Products & Prices

### Create Plus Plan:

1. Go to **Products** → **Add product**
2. Fill in details:
   ```
   Name: WhatsNextUp Plus
   Description: Unlimited messages, conversation history, full trending feed
   Price: ₹499
   Billing period: Monthly
   ```
3. Click **Add product**
4. Copy **Price ID**: `price_xxxxxxxxxxxxx`

### Create Pro Plan:

1. **Products** → **Add product**
2. Fill in details:
   ```
   Name: WhatsNextUp Pro
   Description: Everything in Plus + API access + Custom agents
   Price: ₹999
   Billing period: Monthly
   ```
3. Click **Add product**
4. Copy **Price ID**: `price_yyyyyyyyyyyyy`

### Add to Environment:

```env
# Backend (.env)
STRIPE_PRICE_ID_PLUS=price_xxxxxxxxxxxxx
STRIPE_PRICE_ID_PRO=price_yyyyyyyyyyyyy
```

---

## 4️⃣ Set Up Webhooks

Webhooks notify your backend when payment succeeds/fails.

### Create Webhook Endpoint:

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter endpoint URL:
   ```
   https://whatsnextup-api-214675476458.us-central1.run.app/api/webhooks/stripe
   ```
4. Select events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

5. Click **Add endpoint**
6. Copy **Signing secret**: `whsec_xxxxxxxxxxxxxx`

### Add to Environment:

```env
# Backend (.env)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx
```

---

## 5️⃣ Backend Integration

### Install Stripe SDK:

```bash
cd backend
pip install stripe==8.0.0
echo "stripe==8.0.0" >> requirements.txt
```

### Create Stripe Module:

Create `backend/payments/stripe_service.py`:

```python
import stripe
import os
from typing import Optional

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

PRICE_ID_PLUS = os.getenv("STRIPE_PRICE_ID_PLUS")
PRICE_ID_PRO = os.getenv("STRIPE_PRICE_ID_PRO")

async def create_checkout_session(
    user_id: str,
    user_email: str,
    tier: str,  # "plus" or "pro"
    success_url: str,
    cancel_url: str
) -> Optional[str]:
    """Create a Stripe Checkout session"""
    try:
        price_id = PRICE_ID_PLUS if tier == "plus" else PRICE_ID_PRO

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=success_url,
            cancel_url=cancel_url,
            client_reference_id=user_id,
            customer_email=user_email,
            metadata={
                'user_id': user_id,
                'tier': tier,
            }
        )

        return session.url  # Redirect URL
    except Exception as e:
        print(f"Error creating checkout: {e}")
        return None

async def handle_webhook(payload: bytes, sig_header: str) -> dict:
    """Handle Stripe webhook events"""
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            user_id = session['metadata']['user_id']
            tier = session['metadata']['tier']

            # Upgrade user tier in database
            from usage.tracking import update_user_tier
            await update_user_tier(user_id, tier)

            return {"status": "success", "upgraded": tier}

        return {"status": "success"}

    except Exception as e:
        print(f"Webhook error: {e}")
        return {"status": "error", "message": str(e)}

async def cancel_subscription(subscription_id: str) -> bool:
    """Cancel a user's subscription"""
    try:
        stripe.Subscription.delete(subscription_id)
        return True
    except Exception as e:
        print(f"Error canceling subscription: {e}")
        return False
```

### Add Endpoints to main.py:

```python
from payments.stripe_service import create_checkout_session, handle_webhook

@app.post("/api/checkout/create")
async def create_checkout(
    request: dict,
    user: dict = Depends(get_current_user)
):
    """Create Stripe checkout session"""
    tier = request.get("tier")  # "plus" or "pro"

    if tier not in ["plus", "pro"]:
        raise HTTPException(status_code=400, detail="Invalid tier")

    success_url = f"https://www.whatsnextup.com/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = "https://www.whatsnextup.com/pricing"

    checkout_url = await create_checkout_session(
        user_id=user['uid'],
        user_email=user['email'],
        tier=tier,
        success_url=success_url,
        cancel_url=cancel_url
    )

    if not checkout_url:
        raise HTTPException(status_code=500, detail="Failed to create checkout")

    return {"checkout_url": checkout_url}

@app.post("/api/webhooks/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    result = await handle_webhook(payload, sig_header)
    return result
```

---

## 6️⃣ Frontend Integration

### Install Stripe.js:

```bash
cd frontend
npm install @stripe/stripe-js
```

### Update Pricing Page:

```typescript
// frontend/src/app/pricing/page.tsx
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

async function handleUpgrade(tier: "plus" | "pro") {
  const token = await user.getIdToken()

  // Create checkout session
  const response = await fetch(`${API_URL}/api/checkout/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tier }),
  })

  const { checkout_url } = await response.json()

  // Redirect to Stripe Checkout
  window.location.href = checkout_url
}
```

### Create Success Page:

Create `frontend/src/app/payment/success/page.tsx`:

```typescript
"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          🎉 Payment Successful!
        </h1>
        <p className="text-white/70 mb-8">
          Your account has been upgraded. Enjoy unlimited features!
        </p>
        <Link href="/">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
```

---

## 7️⃣ Testing in Test Mode

### Test Cards:

```
# Success
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits

# Decline
Card: 4000 0000 0000 0002

# Requires Authentication (3D Secure)
Card: 4000 0025 0000 3155
```

### Test Flow:

1. Click "Upgrade to Plus" on pricing page
2. Redirected to Stripe Checkout
3. Enter test card: `4242 4242 4242 4242`
4. Complete payment
5. Redirected to success page
6. Backend webhook upgrades user tier
7. User can now use unlimited messages

---

## 8️⃣ Go Live

### Checklist:

- [ ] Business verification complete
- [ ] Bank account linked
- [ ] Live API keys obtained
- [ ] Products created in Live mode
- [ ] Webhook configured for production URL
- [ ] Test mode thoroughly tested
- [ ] Environment variables updated to Live keys

### Switch to Production:

```bash
# Update backend .env
STRIPE_SECRET_KEY=sk_live_51xxxxxx  # Live key
STRIPE_WEBHOOK_SECRET=whsec_xxxxxx  # Live webhook secret

# Update frontend .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51xxxxxx  # Live key

# Deploy
cd backend && gcloud run deploy whatsnextup-api --source .
cd frontend && git push origin main
```

---

## 💰 Pricing & Fees

### Transaction Fees (India):

- **2.9% + ₹2** per successful charge

### Example Revenue:

| Plan | Price | Stripe Fee | You Receive |
| ---- | ----- | ---------- | ----------- |
| Plus | ₹499  | ₹16.5      | ₹482.5      |
| Pro  | ₹999  | ₹31        | ₹968        |

### Payout Schedule:

- **Daily automatic payouts** to bank account
- **7-day rolling basis** (7 days after charge)

---

## 🔒 Security Best Practices

✅ **DO:**

- Store secret key in environment variables only
- Use webhook signatures for verification
- Validate all webhook events
- Use HTTPS for all endpoints

❌ **DON'T:**

- Commit secret keys to Git
- Store keys in frontend code
- Trust webhook data without verification
- Process payments in frontend

---

## 📊 Monitoring

### Stripe Dashboard:

- Track revenue: [Dashboard](https://dashboard.stripe.com)
- View subscriptions
- Monitor failed payments
- Check webhook deliveries

### Set Up Alerts:

- Email on failed payment
- Slack integration for new subscriptions
- Export revenue reports

---

## ✅ Summary

**Setup Time:** ~2 hours total

- Account creation: 30 min
- Product setup: 15 min
- Backend integration: 45 min
- Frontend integration: 30 min

**Costs:**

- Setup: ₹0
- Monthly: ₹0 (only transaction fees)
- Per transaction: 2.9% + ₹2

**You're protected:** No auto-charges, no hidden fees, complete control!
