"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { logout } from "@/lib/auth"
import { Button } from "./ui/button"
import { API_URL } from "@/lib/api"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, token } = useAuth()
  const router = useRouter()
  const [userTier, setUserTier] = useState<string>("free")

  useEffect(() => {
    if (!user || !token) return

    async function fetchTier() {
      try {
        const response = await fetch(`${API_URL}/api/usage/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setUserTier(data.tier || "free")
        }
      } catch (error) {
        console.error("Failed to fetch tier:", error)
      }
    }

    fetchTier()
  }, [user, token])

  async function handleLogout() {
    await logout()
    router.push("/")
    setIsOpen(false)
  }

  const menuItems = [
    { href: "/", icon: "🏠", label: "Home", show: true },
    { href: "/agents", icon: "🤖", label: "AI Agents", show: true },
    { href: "/trending", icon: "🔥", label: "Trending Feed", show: true },
    { href: "/history", icon: "💬", label: "Chat History", show: !!user },
    { href: "/memories", icon: "🧠", label: "Memories", show: !!user },
    { href: "/plans", icon: "📋", label: "Plans", show: !!user },
    { href: "/reflections", icon: "💭", label: "Reflections", show: !!user },
    { href: "/profile", icon: "👤", label: "My Profile", show: !!user },
    {
      href: "/pricing",
      icon: userTier === "free" ? "💎" : "📊",
      label: userTier === "free" ? "Upgrade" : "Manage Plan",
      show: true,
      special: true,
    },
  ]

  return (
    <>
      {/* Hamburger Button - Only on Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 transition-all cursor-pointer"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span
            className={`block h-0.5 w-full bg-white transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-full bg-white transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-full bg-white transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-black/95 backdrop-blur-2xl border-r border-white/10 z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg text-white">
                    What&apos;s Next Up
                  </h2>
                  <p className="text-xs text-white/50">AI Planning Companion</p>
                </div>
              </div>
            </Link>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-pink-400"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-xs text-white/60">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {menuItems.map(
                (item) =>
                  item.show && (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                        item.special
                          ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-pink-500/30 text-pink-400"
                          : "hover:bg-white/10 text-white"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ),
              )}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 space-y-2">
            {!user ? (
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full cursor-pointer" variant="default">
                  Sign In
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleLogout}
                className="w-full cursor-pointer"
                variant="glass"
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
