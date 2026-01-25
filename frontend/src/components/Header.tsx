"use client"

/**
 * Header Component - Production-optimized navigation
 *
 * Optimizations:
 * - React.memo to prevent rerenders when props don't change
 * - useTransition for smooth route transitions without blocking UI
 * - Zustand selectors for granular subscriptions
 * - Memoized callbacks to prevent child re-renders
 */

import React, { useTransition, useCallback, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { auth } from "@/lib/firebase"
import { apiClient } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/store"

function HeaderComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const user = useUser() // Zustand hook - only rerenders when user changes
  const [tier, setTier] = useState("free")
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isPending, startTransition] = useTransition() // For smooth route transitions
  const isLoginPage = pathname === "/login"

  // Memoized navigation handler using useTransition
  const handleNavigation = useCallback(
    (path: string) => {
      startTransition(() => {
        router.push(path)
      })
    },
    [router],
  )

  // Memoized sign out handler
  const handleSignOut = useCallback(async () => {
    try {
      setIsSigningOut(true)
      await auth.signOut()
      // Use replace to avoid back button issues
      router.replace("/")
    } catch (err) {
      console.error("Sign out failed:", err)
      setIsSigningOut(false)
    }
  }, [router])

  // Fetch tier on user change
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
        // Silently fail - tier already defaults to 'free'
        if (mounted && process.env.NODE_ENV === 'development') {
          console.error("Failed to fetch tier:", err)
        }
      }
    }
    fetchTier()

    return () => {
      mounted = false
    }
  }, [user, isSigningOut])

  // Don't render header on login page
  if (isLoginPage) return null

  return (
    <header className="bg-black/80 border-b border-white/10 sticky top-0 z-40 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - Logo/Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition cursor-pointer"
          >
            ✨ What&apos;s Next Up
          </button>
        </div>

        {/* Center - Navigation */}
        {user && (
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavigation("/trending")}
              className={`transition cursor-pointer pb-2 border-b-2 font-medium hover:opacity-80 ${
                pathname === "/trending"
                  ? "font-bold border-purple-500"
                  : "border-transparent"
              }`}
              style={
                pathname === "/trending"
                  ? { color: "#a855f7", fontSize: "16px" }
                  : { color: "#c084fc", fontSize: "14px" }
              }
            >
              Trending
            </button>
            <button
              onClick={() => handleNavigation("/agents")}
              className={`transition cursor-pointer pb-2 border-b-2 font-medium hover:opacity-80 ${
                pathname === "/agents"
                  ? "font-bold border-purple-500"
                  : "border-transparent"
              }`}
              style={
                pathname === "/agents"
                  ? { color: "#a855f7", fontSize: "16px" }
                  : { color: "#c084fc", fontSize: "14px" }
              }
            >
              Agents
            </button>
            <button
              onClick={() => handleNavigation("/history")}
              className={`transition cursor-pointer pb-2 border-b-2 font-medium hover:opacity-80 ${
                pathname === "/history"
                  ? "font-bold border-purple-500"
                  : "border-transparent"
              }`}
              style={
                pathname === "/history"
                  ? { color: "#a855f7", fontSize: "16px" }
                  : { color: "#c084fc", fontSize: "14px" }
              }
            >
              History
            </button>
            <button
              onClick={() => handleNavigation("/memories")}
              className={`transition cursor-pointer pb-2 border-b-2 font-medium hover:opacity-80 ${
                pathname === "/memories"
                  ? "font-bold border-purple-500"
                  : "border-transparent"
              }`}
              style={
                pathname === "/memories"
                  ? { color: "#a855f7", fontSize: "16px" }
                  : { color: "#c084fc", fontSize: "14px" }
              }
            >
              Memories
            </button>
            <button
              onClick={() => handleNavigation("/plans")}
              className={`transition cursor-pointer pb-2 border-b-2 font-medium hover:opacity-80 ${
                pathname === "/plans"
                  ? "font-bold border-purple-500"
                  : "border-transparent"
              }`}
              style={
                pathname === "/plans"
                  ? { color: "#a855f7", fontSize: "16px" }
                  : { color: "#c084fc", fontSize: "14px" }
              }
            >
              Plans
            </button>
            <button
              onClick={() => handleNavigation("/reflections")}
              className={`transition cursor-pointer pb-2 border-b-2 font-medium hover:opacity-80 ${
                pathname === "/reflections"
                  ? "font-bold border-purple-500"
                  : "border-transparent"
              }`}
              style={
                pathname === "/reflections"
                  ? { color: "#a855f7", fontSize: "16px" }
                  : { color: "#c084fc", fontSize: "14px" }
              }
            >
              Reflect
            </button>
            <button
              onClick={() => handleNavigation("/pricing")}
              className={`transition cursor-pointer pb-2 border-b-2 font-medium hover:opacity-80 ${
                pathname === "/pricing"
                  ? "font-bold border-purple-500"
                  : "border-transparent"
              }`}
              style={
                pathname === "/pricing"
                  ? { color: "#a855f7", fontSize: "16px" }
                  : { color: "#c084fc", fontSize: "14px" }
              }
            >
              Upgrade
            </button>
          </nav>
        )}

        {/* Right side - User & Tier Info */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1 bg-purple-500/30 text-purple-300 rounded border border-purple-500/50">
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
                className="text-xs px-3 py-1 text-white/70 hover:text-white transition cursor-pointer"
                title="Sign out"
              >
                Sign Out
              </button>
            </div>
          )}
          {!user && (
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

export const Header = React.memo(HeaderComponent)
