// Agent API calls
import { getApiUrl } from "./api"
import { auth } from "@/lib/firebase"

const API_URL = getApiUrl()

// Helper function to get auth token
async function getAuthToken(): Promise<string | null> {
  try {
    const user = auth.currentUser
    if (!user) return null
    return await user.getIdToken()
  } catch (error) {
    console.error("Error getting auth token:", error)
    return null
  }
}

export interface Agent {
  id: string
  name: string
  description: string
  icon: string
}

export async function getAllAgents(): Promise<Agent[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      console.error("No auth token available")
      return []
    }
    const response = await fetch(`${API_URL}/api/agents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.statusText}`)
    }

    const data = await response.json()
    return data.agents || []
  } catch (error) {
    console.error("Error fetching agents:", error)
    return []
  }
}

export async function chatWithAgent(
  agentId: string,
  message: string,
  token: string,
  context?: Record<string, any>,
): Promise<{ agent: string; response: string; agent_icon: string }> {
  try {
    const response = await fetch(`${API_URL}/api/agents/${agentId}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        context,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        error.detail || `Agent chat failed: ${response.statusText}`,
      )
    }

    return await response.json()
  } catch (error) {
    console.error(`Error chatting with agent ${agentId}:`, error)
    throw error
  }
}
