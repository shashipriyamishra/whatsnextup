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

import React, { createContext, useContext, useEffect, useMemo } from "react"
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
 * Syncs Firebase auth state to Zustand store on mount
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)
  const setLoading = useAuthStore((state) => state.setLoading)
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const loading = useAuthStore((state) => state.loading)

  useEffect(() => {
    // Listen for Firebase auth state changes and sync to Zustand
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const {
        user: prevUser,
        token: prevToken,
        loading: prevLoading,
      } = useAuthStore.getState()

      const userChanged = prevUser?.uid !== currentUser?.uid

      if (userChanged) {
        setUser(currentUser)
      }

      if (currentUser && userChanged) {
        try {
          const idToken = await currentUser.getIdToken()
          if (prevToken !== idToken) {
            setToken(idToken)
          }
        } catch (error) {
          console.error("Failed to get ID token:", error)
          if (prevToken !== null) {
            setToken(null)
          }
        }
      } else if (!currentUser && prevToken !== null) {
        setToken(null)
      }

      if (prevLoading) {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [setUser, setToken, setLoading])

  // Memoize context value to prevent unnecessary rerenders
  const value: AuthContextType = useMemo(
    () => ({
      user,
      loading,
      token,
    }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

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
