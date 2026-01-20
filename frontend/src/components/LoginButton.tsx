"use client"

import { User } from "firebase/auth"
import { loginWithGoogle, logout } from "../lib/auth"
import { getFirebaseAuth } from "../lib/firebase"
import { useEffect, useState } from "react"

export default function LoginButton() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) return

    return auth.onAuthStateChanged(setUser)
  }, [])

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm">👋 Hi, {user.displayName}</span>
        <button onClick={logout} className="px-3 py-1 border rounded">
          Logout
        </button>
      </div>
    )
  }

  return (
    <button onClick={loginWithGoogle} className="px-4 py-2 border rounded">
      Continue with Google
    </button>
  )
}
