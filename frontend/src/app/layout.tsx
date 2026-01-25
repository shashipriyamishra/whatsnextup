import "./globals.css"
import { AuthProvider } from "@/components/contexts"
import { Header } from "@/components/Header"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"

export const metadata = {
  title: "What's Next Up - AI Planning Companion",
  description:
    "Your personal AI planning companion to help you make better decisions instantly",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "What's Next Up",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%239333ea;stop-opacity:1' /><stop offset='100%' style='stop-color:%23ec4899;stop-opacity:1' /></linearGradient></defs><rect width='192' height='192' fill='url(%23grad)'/><text x='50%' y='50%' font-size='96' font-weight='bold' text-anchor='middle' dominant-baseline='middle' fill='white' font-family='Arial'>✨</text></svg>",
        sizes: "192x192",
        type: "image/svg+xml",
      },
    ],
    apple:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%239333ea;stop-opacity:1' /><stop offset='100%' style='stop-color:%23ec4899;stop-opacity:1' /></linearGradient></defs><rect width='180' height='180' fill='url(%23grad)' rx='40'/><text x='50%' y='50%' font-size='90' font-weight='bold' text-anchor='middle' dominant-baseline='middle' fill='white' font-family='Arial'>✨</text></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="What's Next Up" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <ErrorBoundary>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </ErrorBoundary>
        <script>
          {`
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch((err) => {
                  console.log('Service Worker registration failed: ', err)
                })
              })
            }
          `}
        </script>
      </body>
    </html>
  )
}
