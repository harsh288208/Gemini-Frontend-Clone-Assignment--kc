"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user?.isAuthenticated) {
        router.push("/dashboard")
      } else {
        router.push("/auth")
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-full chat-gradient flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
        <p className="text-muted-foreground">Loading Gemini Chat...</p>
      </div>
    </div>
  )
}
