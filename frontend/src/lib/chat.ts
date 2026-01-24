"use client"

import { auth } from "./firebase"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!

export const sendMessage = async (message: string) => {
  const token = await auth.currentUser?.getIdToken()

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({ message }),
    })

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}
