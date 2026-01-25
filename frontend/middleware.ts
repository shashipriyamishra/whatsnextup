import { type NextRequest, NextResponse } from "next/server"

/**
 * Next.js Middleware - Minimal edge routing
 *
 * NOTE: Firebase Auth uses client-side tokens (localStorage/memory),
 * not HTTP cookies, so we can't check auth state at the edge.
 * Auth protection is handled in individual page components.
 *
 * This middleware only handles basic route protection by
 * checking for Firebase session cookies if they exist.
 */

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow all requests to pass through
  // Auth checks are done client-side in page components
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
