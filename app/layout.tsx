import type React from "react"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts"
import { ErrorBoundary } from "@/components/ui/error-boundary"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata = {
  title: "Gemini Chat Clone - AI Conversation Assistant",
  description:
    "A modern conversational AI chat application with OTP authentication, real-time messaging, and image sharing capabilities.",
  keywords: ["AI", "chat", "conversation", "Gemini", "assistant", "OTP", "authentication"],
  authors: [{ name: "Kuvaka Tech" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f23" },
  ],
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <KeyboardShortcuts />
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
