import { create } from "zustand"

interface AppState {
  theme: "light" | "dark"
  locale: string
  version: string

  setTheme: (theme: "light" | "dark") => void
  setLocale: (locale: string) => void
}

/**
 * App Store - Global app-wide settings
 * Theme, locale, app metadata
 */
export const useAppStore = create<AppState>((set) => ({
  theme: "dark",
  locale: "en",
  version: "1.0.0",

  setTheme: (theme) => set({ theme }),
  setLocale: (locale) => set({ locale }),
}))

export const useTheme = () => useAppStore((state) => state.theme)
export const useLocale = () => useAppStore((state) => state.locale)
