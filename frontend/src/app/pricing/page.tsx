"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for trying out WhatsNextUp",
    features: [
      "10 messages per day",
      "Access to all 10+ AI agents",
      "Basic trending feed",
      "Reddit & Hacker News integration",
      "GitHub trending projects",
      "Community support",
    ],
    limitations: [
      "No conversation history",
      "No advanced APIs (News, YouTube, Weather)",
      "No priority support",
    ],
    cta: "Get Started Free",
    popular: false,
    color: "from-gray-600 to-gray-700",
  },
  {
    name: "Plus",
    price: "₹499",
    period: "per month",
    description: "For power users who want more",
    features: [
      "Unlimited messages",
      "All 10+ specialized AI agents",
      "Full trending dashboard with all sources",
      "News API integration (1000+ sources)",
      "YouTube trending videos",
      "Weather updates for any city",
      "Conversation history & search",
      "Export chat transcripts",
      "Priority email support",
      "No ads",
    ],
    limitations: [],
    cta: "Upgrade to Plus",
    popular: true,
    color: "from-purple-600 to-pink-600",
  },
  {
    name: "Pro",
    price: "₹999",
    period: "per month",
    description: "For professionals & teams",
    features: [
      "Everything in Plus",
      "API access for integrations",
      "Custom AI agent creation",
      "Advanced analytics & insights",
      "Bulk operations",
      "Team collaboration (up to 5 members)",
      "Custom workflows & automation",
      "White-label options",
      "Dedicated account manager",
      "24/7 priority support",
      "Early access to new features",
    ],
    limitations: [],
    cta: "Go Pro",
    popular: false,
    color: "from-orange-600 to-red-600",
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [isAnnual, setIsAnnual] = useState(false)

  function calculatePrice(monthlyPrice: string): string {
    if (monthlyPrice === "₹0") return monthlyPrice
    const price = parseInt(monthlyPrice.replace("₹", ""))
    if (isAnnual) {
      const annualPrice = Math.round(price * 12 * 0.8) // 20% discount
      return `₹${annualPrice.toLocaleString()}`
    }
    return monthlyPrice
  }

  function getPeriod(): string {
    return isAnnual ? "per year" : "per month"
  }

  return (
    <div className="min-h-screen flex flex-col bg-black/95 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/50 rounded-full blur-3xl animate-blob"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/40 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-600/30 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 md:px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-4 cursor-pointer hover:opacity-80"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/30">
              <span className="text-xl">💎</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Pricing Plans</h1>
              <p className="text-xs text-white/50">
                Choose the perfect plan for you
              </p>
            </div>
          </button>
          <Link href="/">
            <Button variant="glass" size="sm" className="cursor-pointer">
              ← Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-4 md:px-6 py-12 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Start free, upgrade when you're ready. No hidden fees.
            </p>

            {/* Annual Toggle */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <span
                className={`text-white ${!isAnnual ? "font-bold" : "opacity-60"}`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-14 h-7 bg-white/20 rounded-full transition-colors hover:bg-white/30 cursor-pointer"
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-pink-500 rounded-full transition-transform ${
                    isAnnual ? "translate-x-7" : ""
                  }`}
                />
              </button>
              <span
                className={`text-white ${isAnnual ? "font-bold" : "opacity-60"}`}
              >
                Annual
                <Badge
                  variant="glass"
                  className="ml-2 bg-green-500/20 text-green-300"
                >
                  Save 20%
                </Badge>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, idx) => (
              <Card
                key={idx}
                className={`relative overflow-hidden ${
                  plan.popular ? "border-2 border-pink-500 scale-105" : ""
                } hover:scale-110 transition-transform`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-8">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white text-2xl`}
                  >
                    {plan.name === "Free"
                      ? "🎁"
                      : plan.name === "Plus"
                        ? "⚡"
                        : "🚀"}
                  </div>
                  <CardTitle className="text-2xl text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <p className="text-white/60 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-white">
                      {calculatePrice(plan.price)}
                    </span>
                    {plan.price !== "₹0" && (
                      <span className="text-white/60 text-sm">
                        {isAnnual ? "per year" : plan.period}
                      </span>
                    )}
                  </div>
                  {isAnnual && plan.price !== "₹0" && (
                    <p className="text-green-400 text-sm mt-2">
                      Save ₹{parseInt(plan.price.replace("₹", "")) * 12 * 0.2}{" "}
                      annually
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, fidx) => (
                      <div key={fidx} className="flex items-start gap-3">
                        <div className="text-green-400 mt-0.5">✓</div>
                        <span className="text-white/80 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      {plan.limitations.map((limitation, lidx) => (
                        <div key={lidx} className="flex items-start gap-3">
                          <div className="text-red-400 mt-0.5">✗</div>
                          <span className="text-white/60 text-sm">
                            {limitation}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    className={`w-full mt-6 cursor-pointer ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "glass"}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    Can I switch plans anytime?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">
                    Yes! You can upgrade or downgrade your plan at any time.
                    Changes take effect immediately, and we'll prorate your
                    billing accordingly.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    What payment methods do you accept?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">
                    We accept all major credit/debit cards, UPI, net banking,
                    and wallets through Stripe's secure payment gateway.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    Is there a free trial for paid plans?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">
                    Yes! All new users get 7 days free trial of Plus plan when
                    they first sign up. No credit card required for the free
                    plan.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    Do you offer refunds?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">
                    Yes, we offer a 30-day money-back guarantee. If you're not
                    satisfied, we'll refund your payment - no questions asked.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    What happens to my data if I downgrade?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">
                    Your conversation history and data are preserved for 90
                    days. You can always upgrade again to regain full access.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enterprise CTA */}
          <Card className="mt-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50">
            <CardContent className="py-12 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">
                Need an Enterprise Solution?
              </h3>
              <p className="text-white/70 text-lg mb-6">
                Custom pricing, dedicated infrastructure, and white-label
                options available.
              </p>
              <Button size="lg" variant="default" className="cursor-pointer">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  )
}
