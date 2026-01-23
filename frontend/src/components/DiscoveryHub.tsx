"use client"

import { CategoryCard } from "@/components/glass/CategoryCard"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

const categories = [
  {
    id: "entertainment",
    icon: "🎬",
    title: "Entertainment",
    description: "Movies, shows, books, and music to explore",
    path: "/discovery/entertainment",
  },
  {
    id: "food",
    icon: "☕",
    title: "Food & Dining",
    description: "Recipes, restaurants, and culinary adventures",
    path: "/discovery/food",
  },
  {
    id: "learning",
    icon: "📚",
    title: "Learning",
    description: "Skills, courses, and knowledge to acquire",
    path: "/discovery/learning",
  },
  {
    id: "travel",
    icon: "✈️",
    title: "Travel",
    description: "Destinations, trips, and adventures await",
    path: "/discovery/travel",
  },
  {
    id: "wellness",
    icon: "💪",
    title: "Wellness",
    description: "Fitness, health, and self-care activities",
    path: "/discovery/wellness",
  },
  {
    id: "shopping",
    icon: "🛍️",
    title: "Shopping",
    description: "Trending products and smart purchases",
    path: "/discovery/shopping",
  },
  {
    id: "hobbies",
    icon: "🎨",
    title: "Hobbies",
    description: "Creative projects and fun activities",
    path: "/discovery/hobbies",
  },
  {
    id: "home",
    icon: "🏡",
    title: "Home",
    description: "Organization, decor, and improvement ideas",
    path: "/discovery/home",
  },
  {
    id: "career",
    icon: "💼",
    title: "Career",
    description: "Professional growth and opportunities",
    path: "/discovery/career",
  },
  {
    id: "events",
    icon: "🎉",
    title: "Events",
    description: "Concerts, meetups, and social activities",
    path: "/discovery/events",
  },
]

export default function DiscoveryHub() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-black/95 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/50 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/40 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        ></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 md:px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div
            className="flex items-center gap-4 cursor-pointer hover:opacity-80"
            onClick={() => router.push("/")}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/30">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">What's Next Up</h1>
              <p className="text-xs text-white/50">Your AI Companion</p>
            </div>
          </div>
          <Link href="/login">
            <Button variant="default" size="sm" className="cursor-pointer">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 md:px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 shadow-xl bg-gradient-to-br from-purple-600/40 to-pink-600/30 border border-white/20 backdrop-blur-sm">
            <span className="text-4xl">🚀</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            What Should You Do <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Next?
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover endless possibilities with AI-powered suggestions across
            every aspect of your life. No login required—start exploring now.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="relative z-10 px-4 md:px-6 pb-16 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                icon={category.icon}
                title={category.title}
                description={category.description}
                gradientIndex={index}
                onClick={() => router.push(category.path)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 md:px-6 py-16 border-t border-white/10 bg-white/5 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready for Your Personal AI Companion?
          </h3>
          <p className="text-white/70 mb-8">
            Sign in to unlock 15+ specialized AI agents, save your progress, and
            get personalized recommendations.
          </p>
          <Link href="/login">
            <Button variant="default" size="lg" className="cursor-pointer">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
