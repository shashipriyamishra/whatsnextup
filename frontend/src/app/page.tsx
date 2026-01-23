"use client"

// ✅ Frontend deployment: CI/CD pipeline active
import { useAuth } from "@/lib/AuthContext"
import DiscoveryHub from "@/components/DiscoveryHub"
import ChatScreen from "@/components/ChatScreen"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return <DiscoveryHub />
  }

  return <ChatScreen />
}
