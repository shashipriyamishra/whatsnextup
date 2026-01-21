"use client"

// ✅ Frontend deployment: CI/CD pipeline active
import { useAuth } from "../lib/AuthContext"
import LoginScreen from "../components/LoginScreen"
import ChatScreen from "../components/ChatScreen"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return <LoginScreen />
  }

  return <ChatScreen />
}
