import { create } from "zustand"
import { User } from "firebase/auth"

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

/**
 * Auth Store - Global authentication state
 * Using Zustand for efficient, minimal re-renders
 *
 * Usage:
 *   const { user, token, loading } = useAuthStore()
 *   const setUser = useAuthStore(state => state.setUser)
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  reset: () => set({ user: null, token: null, loading: false, error: null }),
}))

/**
 * Selector hooks for granular subscriptions
 * These prevent unnecessary re-renders when only one field changes
 */
export const useUser = () => useAuthStore((state) => state.user)
export const useToken = () => useAuthStore((state) => state.token)
export const useAuthLoading = () => useAuthStore((state) => state.loading)
export const useAuthError = () => useAuthStore((state) => state.error)
