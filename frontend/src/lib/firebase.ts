import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: "whatsnextup-d2415.firebaseapp.com",
  projectId: "whatsnextup-d2415",
}

let app: any = null
let authInstance: any = null
let initError: Error | null = null

function initializeFirebase() {
  if (typeof window === "undefined") return null
  if (initError) return null

  if (!app) {
    try {
      if (!firebaseConfig.apiKey) {
        throw new Error("Firebase API key not configured")
      }
      app = initializeApp(firebaseConfig)
    } catch (error) {
      initError = error as Error
      console.warn("Firebase initialization failed:", initError.message)
      return null
    }
  }
  return app
}

export function getFirebaseAuth() {
  if (typeof window === "undefined") return null
  if (initError) return null

  const firebaseApp = initializeFirebase()
  if (!firebaseApp) return null

  if (!authInstance) {
    try {
      authInstance = getAuth(firebaseApp)
    } catch (error) {
      console.warn("Failed to get Firebase auth:", error)
      return null
    }
  }
  return authInstance
}

export const auth = typeof window !== "undefined" ? getFirebaseAuth() : null
