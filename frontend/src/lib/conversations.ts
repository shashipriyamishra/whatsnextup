import { API_URL } from "./api"

export interface Conversation {
  id: string
  user_id: string
  agent_id: string
  user_message: string
  agent_response: string
  timestamp: string
  metadata: Record<string, any>
}

export interface ConversationStats {
  total_conversations: number
  total_messages: number
  agents_used: string[]
  date_range?: {
    first: string
    last: string
  }
}

export async function getConversationHistory(
  token: string,
  agentId?: string,
  limit: number = 50,
): Promise<Conversation[]> {
  const params = new URLSearchParams()
  if (agentId) params.append("agent_id", agentId)
  params.append("limit", limit.toString())

  const response = await fetch(`${API_URL}/api/conversations?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch conversations: ${response.statusText}`)
  }

  return response.json()
}

export async function searchConversations(
  token: string,
  query: string,
  limit: number = 20,
): Promise<Conversation[]> {
  const params = new URLSearchParams({ q: query, limit: limit.toString() })

  const response = await fetch(
    `${API_URL}/api/conversations/search?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to search conversations: ${response.statusText}`)
  }

  return response.json()
}

export async function deleteConversation(
  token: string,
  conversationId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/conversations/${conversationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to delete conversation: ${response.statusText}`)
  }
}

export async function getConversationStats(
  token: string,
): Promise<ConversationStats> {
  const response = await fetch(`${API_URL}/api/conversations/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`)
  }

  const data = await response.json()
  
  // Ensure agents_used is always an array
  return {
    total_conversations: data.total_conversations ?? 0,
    total_messages: data.total_messages ?? 0,
    agents_used: Array.isArray(data.agents_used) ? data.agents_used : [],
    date_range: data.date_range,
  }
}
}
