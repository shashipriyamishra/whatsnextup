import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: "whatsnextup-d2415.firebaseapp.com",
  projectId: "whatsnextup-d2415",
}

let app: any = null
let authInstance: any = null

function initializeFirebase() {
  if (typeof window === "undefined") return null
  if (!app) {
    app = initializeApp(firebaseConfig)
  }
  return app
}

export function getFirebaseAuth() {
  if (typeof window === "undefined") return null
  const firebaseApp = initializeFirebase()
  if (!firebaseApp) return null
  if (!authInstance) {
    authInstance = getAuth(firebaseApp)
  }
  return authInstance
}

export const auth = typeof window !== "undefined" ? getFirebaseAuth() : null
