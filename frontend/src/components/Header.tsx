"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/contexts"
import { auth } from "@/lib/firebase"
import { apiClient } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const [tier, setTier] = useState("free")
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    // Skip if signing out to prevent re-renders
    if (!user || isSigningOut) return

    let mounted = true
    const fetchTier = async () => {
      try {
        const tierValue = await apiClient.getUserTier()
        if (mounted) {
          setTier(tierValue)
        }
      } catch (err) {
        if (mounted) console.error("Failed to fetch tier:", err)
      }
    }
    fetchTier()

    return () => {
      mounted = false
    }
  }, [user, isSigningOut])

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await auth.signOut()
      // Use replace to avoid back button issues and prevent re-renders
      router.replace("/")
    } catch (err) {
      console.error("Sign out failed:", err)
      setIsSigningOut(false)
    }
  }

  const isLoginPage = pathname === "/login"

  // Don't show header on login page only
  if (isLoginPage) return null

  return (
    <header className="relative z-10 px-4 md:px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side - Logo */}
        <div
          className="flex items-center gap-4 cursor-pointer hover:opacity-80"
          onClick={() => router.push("/")}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/30">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">What's Next Up</h1>
            <p className="text-xs text-white/50">
              {user ? "Your AI Companion" : "Discover What's Next"}
            </p>
          </div>
        </div>

        {/* Center - Navigation for authenticated users */}
        {user && (
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => router.push("/trending")}
              className={`text-sm font-medium transition cursor-pointer ${
                pathname === "/trending"
                  ? "text-purple-400 font-bold border-b-2 border-purple-400 pb-1"
                  : "text-white/70 hover:text-white"
              }`}
            >
              🔥 Trending
            </button>
            <button
              onClick={() => router.push("/agents")}
              className={`text-sm font-medium transition cursor-pointer ${
                pathname === "/agents"
                  ? "text-purple-400 font-bold border-b-2 border-purple-400 pb-1"
                  : "text-white/70 hover:text-white"
              }`}
            >
              🤖 Agents
            </button>
            <button
              onClick={() => router.push("/history")}
              className={`text-sm font-medium transition cursor-pointer ${
                pathname === "/history"
                  ? "text-purple-400 font-bold border-b-2 border-purple-400 pb-1"
                  : "text-white/70 hover:text-white"
              }`}
            >
              📜 History
            </button>
            <button
              onClick={() => router.push("/memories")}
              className={`text-sm font-medium transition cursor-pointer ${
                pathname === "/memories"
                  ? "text-purple-400 font-bold border-b-2 border-purple-400 pb-1"
                  : "text-white/70 hover:text-white"
              }`}
            >
              💭 Memories
            </button>
            <button
              onClick={() => router.push("/plans")}
              className={`text-sm font-medium transition cursor-pointer ${
                pathname === "/plans"
                  ? "text-purple-400 font-bold border-b-2 border-purple-400 pb-1"
                  : "text-white/70 hover:text-white"
              }`}
            >
              📋 Plans
            </button>
          </nav>
        )}

        {/* Right side - Auth buttons/user info */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1 bg-purple-500/30 text-purple-300 rounded border border-purple-500/50">
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </span>
              <button
                onClick={() => router.push("/profile")}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xs font-bold flex items-center justify-center hover:opacity-80 transition cursor-pointer hover:scale-110"
                title="View profile"
              >
                {user.email?.charAt(0).toUpperCase() || "U"}
              </button>
              <button
                onClick={handleSignOut}
                className="text-xs px-3 py-1 text-white/70 hover:text-white transition cursor-pointer"
                title="Sign out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="cursor-pointer">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
