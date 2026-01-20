import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "whatsnextup-d2415.firebaseapp.com",
  projectId: "whatsnextup-d2415",
}

let authInstance: any = null

function initializeFirebase() {
  if (typeof window === "undefined") return null

  // Check if already initialized
  if (getApps().length > 0) {
    return getApps()[0]
  }

  if (!firebaseConfig.apiKey) {
    console.warn("Firebase API key not set in environment variables")
    return null
  }

  try {
    const app = initializeApp(firebaseConfig)
    return app
  } catch (error) {
    console.error("Firebase initialization error:", error)
    return null
  }
}

export function getFirebaseAuth() {
  if (typeof window === "undefined") return null

  const firebaseApp = initializeFirebase()
  if (!firebaseApp) {
    console.warn("Firebase app not initialized")
    return null
  }

  if (!authInstance) {
    try {
      authInstance = getAuth(firebaseApp)
    } catch (error) {
      console.error("Failed to get Firebase auth:", error)
      return null
    }
  }
  return authInstance
}

export const auth = typeof window !== "undefined" ? getFirebaseAuth() : null

export const auth = typeof window !== "undefined" ? getFirebaseAuth() : null
