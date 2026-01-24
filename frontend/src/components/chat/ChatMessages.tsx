/**
 * ChatMessages Component
 * Displays list of messages and loading state
 * Auto-scrolls to bottom when new messages arrive
 * Optimized with useMemo to prevent unnecessary re-renders
 */

import React, { useRef, useEffect, useMemo } from "react"
import { ChatMessage, MessageProps } from "./ChatMessage"

interface ChatMessagesProps {
  messages: MessageProps[]
  loading: boolean
  containerRef: React.RefObject<HTMLDivElement>
}

export const ChatMessages = React.memo(function ChatMessages({
  messages,
  loading,
  containerRef,
}: ChatMessagesProps) {
  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    }
    setTimeout(scrollToBottom, 0)
  }, [messages, loading, containerRef])

  // Memoize starter suggestions to prevent recreating on every render
  const starterSuggestions = useMemo(
    () => [
      {
        title: "Plan Tomorrow",
        description: "Help me plan my day",
        icon: "📅",
      },
      {
        title: "Prioritize",
        description: "Which tasks matter most?",
        icon: "🎯",
      },
      {
        title: "New Ideas",
        description: "I want to try something new",
        icon: "💭",
      },
    ],
    []
  )

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 md:px-6 py-6 relative z-10 mt-20 mb-28 scroll-smooth"
      data-messages
    >
      <div className="max-w-3xl mx-auto w-full space-y-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 shadow-xl bg-gradient-to-br from-purple-600/40 to-pink-600/30 border border-white/20 backdrop-blur-sm">
                <span className="text-4xl">🚀</span>
              </div>
              <h2 className="text-4xl font-black text-white mb-3">
                What's Your Next Move?
              </h2>
              <p className="text-base text-white/70 max-w-lg leading-relaxed font-medium">
                Tell me about your goals, challenges, or decisions. I'll help
                you think through them with clarity and confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 w-full max-w-2xl">
              {starterSuggestions.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    // Find textarea and set its value
                    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
                    if (textarea) {
                      textarea.value = item.description
                      textarea.focus()
                    }
                  }}
                  className="group p-5 rounded-2xl bg-white/10 border border-white/20 hover:border-white/40 hover:bg-white/15 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 text-left cursor-pointer backdrop-blur-sm"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 origin-center">
                    {item.icon}
                  </div>
                  <div className="font-bold text-white text-sm">
                    {item.title}
                  </div>
                  <p className="text-xs text-white/60 font-medium">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} text={msg.text} timestamp={msg.timestamp} />
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/15 text-white border border-white/20 px-4 py-3 rounded-2xl rounded-bl-none shadow-lg backdrop-blur-sm">
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes message-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-message-in {
          animation: message-in 0.3s ease-out;
        }

        .scroll-smooth {
          scroll-behavior: smooth;
        }

        /* Smooth scrollbar */
        [data-messages]::-webkit-scrollbar {
          width: 6px;
        }

        [data-messages]::-webkit-scrollbar-track {
          background: transparent;
        }

        [data-messages]::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.4);
          border-radius: 3px;
        }

        [data-messages]::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.6);
        }
      `}</style>
    </div>
  )
})

ChatMessages.displayName = "ChatMessages"
