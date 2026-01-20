import { useState } from "react"

type Props = {
  onSend: (message: string) => void
  loading: boolean
}

export default function ChatInput({ onSend, loading }: Props) {
  const [value, setValue] = useState("")

  function send() {
    if (!value.trim()) return
    onSend(value)
    setValue("")
  }

  return (
    <div className="flex gap-2 border-t bg-white px-4 py-3">
      <input
        className="flex-1 rounded-lg border px-3 py-2 text-sm"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        disabled={loading}
      />
      <button
        onClick={send}
        disabled={loading}
        className="rounded-lg bg-black px-4 py-2 text-sm text-white"
      >
        Send
      </button>
    </div>
  )
}
