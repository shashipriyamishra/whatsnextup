"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/contexts"
import { auth } from "@/lib/firebase"
import { apiClient } from "@/lib/api"

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

  const isHomePage = pathname === "/"
  const isLoginPage = pathname === "/login"
  const isLandingPage = pathname === "/"

  // Don't show header on login page
  if (isLoginPage) return null

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - Logo/Title */}
        <div className="flex items-center gap-4">
          {!isLandingPage && (
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-900 text-xl cursor-pointer transition hover:scale-110"
              title="Back to home"
            >
              ←
            </button>
          )}
          <button
            onClick={() => router.push("/")}
            className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition cursor-pointer ml-4"
          >
            ✨ What&apos;s Next Up
          </button>
        </div>

        {/* Center - Navigation */}
        {user && !isHomePage && (
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => router.push("/trending")}
              className={`text-sm transition cursor-pointer ${
                pathname === "/trending"
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🔥 Trending
            </button>
            <button
              onClick={() => router.push("/agents")}
              className={`text-sm transition cursor-pointer ${
                pathname === "/agents"
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🤖 Agents
            </button>
            <button
              onClick={() => router.push("/history")}
              className={`text-sm transition cursor-pointer ${
                pathname === "/history"
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📜 History
            </button>
            <button
              onClick={() => router.push("/profile")}
              className={`text-sm transition cursor-pointer ${
                pathname === "/profile"
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              👤 Profile
            </button>
          </nav>
        )}

        {/* Right side - User & Tier Info */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded">
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </span>
              <button
                onClick={() => router.push("/profile")}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold flex items-center justify-center hover:opacity-80 transition cursor-pointer hover:scale-110"
                title="View profile"
              >
                {user.email?.charAt(0).toUpperCase() || "U"}
              </button>
              <button
                onClick={handleSignOut}
                className="text-xs px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition cursor-pointer"
                title="Sign out"
              >
                Sign Out
              </button>
            </div>
          )}
          {!user && !isLoginPage && (
            <button
              onClick={() => router.push("/login")}
              className="text-sm px-3 py-1 text-purple-600 hover:bg-purple-50 rounded transition cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
