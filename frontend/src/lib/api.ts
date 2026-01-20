const API_BASE = process.env.NEXT_PUBLIC_API_BASE!

export async function sendMessage(message: string) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  })

  if (!res.ok) {
    throw new Error("API error")
  }

  return res.json()
}
