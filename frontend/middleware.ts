import { type NextRequest, NextResponse } from "next/server"

/**
 * Next.js Middleware - Auth checks at edge level
 *
 * This runs BEFORE the page renders, allowing:
 * - Faster redirects (at edge, not in browser)
 * - Preventing unauthorized page loads
 * - Consistent auth state across requests
 *
 * Public routes are accessible without auth
 * Protected routes require valid auth
 */

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/login", "/auth/callback"]

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/chat",
  "/trending",
  "/agents",
  "/history",
  "/memories",
  "/plans",
  "/reflections",
]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const authToken = request.cookies.get("auth-token")?.value

  // If user is accessing a protected route without auth
  if (
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) &&
    !authToken
  ) {
    // Redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If user is on login page and already authenticated
  if (pathname === "/login" && authToken) {
    // Redirect to home
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Allow the request to continue
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
