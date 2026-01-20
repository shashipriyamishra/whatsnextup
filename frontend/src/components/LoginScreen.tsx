"use client"

import { loginWithGoogle } from "../lib/auth"

export default function LoginScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-semibold">What’s Next Up ✨</h1>

        <p className="text-gray-600">
          Your calm, intelligent assistant for planning life — one step at a
          time.
        </p>

        <button
          onClick={loginWithGoogle}
          className="w-full py-3 rounded-xl bg-black text-white text-lg hover:bg-gray-900 transition"
        >
          Continue with Google
        </button>

        <p className="text-xs text-gray-400">
          No spam. No ads. Your data stays yours.
        </p>
      </div>
    </div>
  )
}
