"use client"

/**
 * Auth Provider - Syncs Firebase auth to Zustand store
 *
 * This component:
 * - Listens to Firebase auth state changes
 * - Updates the Zustand auth store
 * - Provides a React Context wrapper for easy provider setup
 *
 * Usage:
 *   const { user, loading, token } = useAuth() // Legacy hook
 *   const user = useUser() // New Zustand hook (more efficient)
 */

import React, { createContext, useContext, useEffect } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuthStore } from "@/lib/store/authStore"

export interface AuthContextType {
  user: User | null
  loading: boolean
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider - Wraps app with Firebase auth sync to Zustand
 * Memoized to prevent unnecessary re-renders
 */
export const AuthProvider = React.memo(function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, token, loading, setUser, setToken, setLoading } = useAuthStore()

  useEffect(() => {
    // Listen for Firebase auth state changes and sync to Zustand
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken()
          setToken(idToken)
        } catch (error) {
          console.error("Failed to get ID token:", error)
          setToken(null)
        }
      } else {
        setToken(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [setUser, setToken, setLoading])

  // Context value stays the same for React Context consumers
  const value: AuthContextType = {
    user,
    loading,
    token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
})

/**
 * useAuth Hook - Legacy hook for backward compatibility
 * Consider using Zustand hooks directly for better performance:
 * - useUser() - only rerenders when user changes
 * - useToken() - only rerenders when token changes
 * - useAuthLoading() - only rerenders when loading changes
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
