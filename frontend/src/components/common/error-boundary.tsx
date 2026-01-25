"use client"

/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 * Prevents entire app from crashing
 */

import React, { Component, ReactNode } from "react"
import { logger } from "@/lib/logger"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    logger.error("React Error Boundary caught error", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

function ErrorFallback({ error }: { error: Error | null }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95 px-4">
      <div className="max-w-md w-full">
        <div className="bg-red-950/50 border border-red-500/50 rounded-2xl p-8 backdrop-blur-xl">
          <div className="text-center mb-6">
            <span className="text-6xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4 text-center">
            Oops! Something went wrong
          </h1>
          <p className="text-white/70 mb-6 text-center">
            We've encountered an unexpected error. Our team has been notified
            and we're working on a fix.
          </p>
          {process.env.NODE_ENV === "development" && error && (
            <details className="mb-6 bg-black/30 rounded-lg p-4">
              <summary className="text-white/80 text-sm font-semibold cursor-pointer">
                Error Details (Dev Only)
              </summary>
              <pre className="mt-2 text-xs text-red-300 overflow-auto">
                {error.message}
              </pre>
              <pre className="mt-2 text-xs text-red-300/70 overflow-auto max-h-40">
                {error.stack}
              </pre>
            </details>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition"
            >
              Reload Page
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition border border-white/20"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
