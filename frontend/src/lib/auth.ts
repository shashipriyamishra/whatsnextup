import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { getFirebaseAuth } from "./firebase"

export async function loginWithGoogle() {
  const auth = getFirebaseAuth()
  if (!auth) throw new Error("Firebase not initialized")
  
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export function logout() {
  const auth = getFirebaseAuth()
  if (!auth) throw new Error("Firebase not initialized")
  
  return auth.signOut()
}
