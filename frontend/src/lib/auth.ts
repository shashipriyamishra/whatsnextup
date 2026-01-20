import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { getFirebaseAuth } from "./firebase"

export async function loginWithGoogle() {
  try {
    const auth = getFirebaseAuth()
    if (!auth) {
      throw new Error("Firebase authentication not configured. Please check your environment variables.")
    }

    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    console.error("Google login error:", error)
    throw error
  }
}

export function logout() {
  try {
    const auth = getFirebaseAuth()
    if (!auth) {
      throw new Error("Firebase authentication not configured")
    }

    return auth.signOut()
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}
