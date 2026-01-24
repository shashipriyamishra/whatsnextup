/**
 * ChatHeader Component
 * Header for chat screen with navigation and user info
 */

import React from "react"
import Link from "next/link"
import { User } from "firebase/auth"

interface ChatHeaderProps {
  user: User | null
  userTier: string
  onLogout: () => void
}

export const ChatHeader = React.memo(function ChatHeader({
  user,
  userTier,
  onLogout,
}: ChatHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-4 md:px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo - Only on Desktop */}
        <Link
          href="/"
          className="hidden md:flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <span className="text-lg">✨</span>
          </div>
          <div>
            <h1 className="font-bold text-base text-white">
              What&apos;s Next Up
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {user && (
            <>
              <Link
                href="/agents"
                className="text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition font-semibold cursor-pointer"
              >
                🤖 Agents
              </Link>
              <Link
                href="/trending"
                className="text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition font-semibold cursor-pointer"
              >
                🔥 Trending
              </Link>
              <Link
                href="/history"
                className="text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition font-semibold cursor-pointer"
              >
                💬 History
              </Link>
              <Link
                href="/memories"
                className="text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition font-semibold cursor-pointer"
              >
                🧠 Memories
              </Link>
              <Link
                href="/plans"
                className="text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition font-semibold cursor-pointer"
              >
                📋 Plans
              </Link>
              <Link
                href="/reflections"
                className="text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition font-semibold cursor-pointer"
              >
                💭 Reflect
              </Link>
              <Link
                href="/pricing"
                className="text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-pink-400 border border-pink-500/30 transition font-bold cursor-pointer"
              >
                {userTier === "free" ? "💎 Upgrade" : "📊 Manage Plan"}
              </Link>
              <Link
                href="/profile"
                className="text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition font-semibold cursor-pointer"
              >
                👤 Profile
              </Link>
            </>
          )}
        </nav>

        {/* User Info & Sign Out */}
        <div className="flex items-center gap-2 ml-auto">
          {user?.photoURL && (
            <>
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-6 h-6 rounded-full border-2 border-pink-400"
                />
                <span className="text-xs font-semibold text-white">
                  {user.displayName?.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-pink-500/50 transition-all font-bold cursor-pointer whitespace-nowrap"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
})

ChatHeader.displayName = "ChatHeader"
