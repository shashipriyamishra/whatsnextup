import "./globals.css"
import { AuthProvider } from "../lib/AuthContext"

export const metadata = {
  title: "whatsnextup",
  description: "Your personal AI for what’s next",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
