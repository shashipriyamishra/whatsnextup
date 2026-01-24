"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/AuthContext"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const [tier, setTier] = useState("free")

  useEffect(() => {
    if (user) {
      const fetchTier = async () => {
        try {
          const token = await user.getIdToken()
          const res = await fetch("/api/user/tier", {
            headers: { authorization: `Bearer ${token}` },
          })
          if (res.ok) {
            const data = await res.json()
            setTier(data.tier || "free")
          }
        } catch (err) {
          console.error("Failed to fetch tier:", err)
        }
      }
      fetchTier()
    }
  }, [user])

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
              className="text-gray-600 hover:text-gray-900 text-xl"
              title="Home"
            >
              ←
            </button>
          )}
          <button
            onClick={() => router.push("/")}
            className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition"
          >
            ✨ What&apos;s Next Up
          </button>
        </div>

        {/* Center - Navigation */}
        {user && !isHomePage && (
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => router.push("/trending")}
              className={`text-sm transition ${
                pathname === "/trending"
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🔥 Trending
            </button>
            <button
              onClick={() => router.push("/agents")}
              className={`text-sm transition ${
                pathname === "/agents"
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🤖 Agents
            </button>
            <button
              onClick={() => router.push("/history")}
              className={`text-sm transition ${
                pathname === "/history"
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📜 History
            </button>
            <button
              onClick={() => router.push("/profile")}
              className={`text-sm transition ${
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
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded">
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </span>
              <button
                onClick={() => router.push("/profile")}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold flex items-center justify-center hover:opacity-80 transition"
              >
                {user.email?.charAt(0).toUpperCase() || "U"}
              </button>
            </div>
          )}
          {!user && !isLoginPage && (
            <button
              onClick={() => router.push("/login")}
              className="text-sm px-3 py-1 text-purple-600 hover:bg-purple-50 rounded transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
