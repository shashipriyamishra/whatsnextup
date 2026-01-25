/**
 * Navigation Loading Indicator
 * Shows a subtle loader when navigating between pages
 */

import React from "react"

export const NavigationLoadingIndicator = ({
  isPending,
}: {
  isPending: boolean
}) => {
  return (
    <>
      {isPending && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse z-50">
          <div className="h-full bg-white/20 animate-pulse"></div>
        </div>
      )}
    </>
  )
}
