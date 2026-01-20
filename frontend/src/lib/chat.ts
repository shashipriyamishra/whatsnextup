import { auth } from "./firebase"

export async function sendMessage(message: string) {
  const token = await auth.currentUser?.getIdToken()

  if (!token) {
    console.error("❌ No token available - user not authenticated")
    throw new Error("User not authenticated")
  }

  console.log(`📤 Sending message with token: ${token.substring(0, 20)}...`)

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  })

  if (!res.ok) {
    const error = await res.text()
    console.error(`❌ API Error: ${res.status} - ${error}`)
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}
