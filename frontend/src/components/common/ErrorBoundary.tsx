"use client"

/**
 * Error Boundary Component
 * Catches errors in child components and displays a fallback UI
 * Prevents entire app from crashing due to component errors
 */

import React from "react"
import { logger } from "@/lib/logger"

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("React Error Boundary caught error", error, {
      componentStack: errorInfo.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center px-4">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Something Went Wrong
              </h1>
              <p className="text-gray-600 mb-4">
                We're sorry for the inconvenience. Please try refreshing the
                page.
              </p>
              {process.env.NODE_ENV === "development" && (
                <details className="text-left bg-gray-100 p-4 rounded mt-4 mb-4">
                  <summary className="cursor-pointer font-semibold text-gray-900">
                    Error Details
                  </summary>
                  <pre className="text-xs text-red-600 overflow-auto mt-2">
                    {this.state.error?.toString()}
                  </pre>
                </details>
              )}
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
