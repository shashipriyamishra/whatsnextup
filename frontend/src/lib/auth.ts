"use client"

import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { auth } from "./firebase"

const googleProvider = new GoogleAuthProvider()

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    // Redirect to home page after successful login
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
    return result.user
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}
