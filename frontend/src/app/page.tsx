"use client"

// ✅ Frontend deployment: CI/CD pipeline active
import { useAuth } from "@/lib/AuthContext"
import DiscoveryHub from "@/components/DiscoveryHub"
import ChatScreen from "@/components/ChatScreen"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <DiscoveryHub />
  }

  return <ChatScreen />
}
