import { create } from "zustand"

interface UIState {
  sidebarOpen: boolean
  navigatingTo: string | null
  showMobileMenu: boolean

  setSidebarOpen: (open: boolean) => void
  setNavigatingTo: (path: string | null) => void
  setShowMobileMenu: (show: boolean) => void
}

/**
 * UI Store - Global UI state
 * Manages sidebar, navigation state, mobile menu
 * Isolated from other stores for optimal performance
 */
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  navigatingTo: null,
  showMobileMenu: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setNavigatingTo: (path) => set({ navigatingTo: path }),
  setShowMobileMenu: (show) => set({ showMobileMenu: show }),
}))

/**
 * Selector hooks for granular subscriptions
 */
export const useSidebarOpen = () => useUIStore((state) => state.sidebarOpen)
export const useNavigatingTo = () => useUIStore((state) => state.navigatingTo)
export const useShowMobileMenu = () =>
  useUIStore((state) => state.showMobileMenu)
