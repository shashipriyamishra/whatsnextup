type Props = {
  role: "user" | "assistant"
  content: string
}

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === "user"

  return (
    <div
      className={`max-w-[80%] rounded-lg p-3 text-sm shadow ${
        isUser ? "ml-auto bg-black text-white" : "bg-white"
      }`}
    >
      {content}
    </div>
  )
}
