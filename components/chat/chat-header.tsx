"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import type { Chatroom } from "@/lib/types"

interface ChatHeaderProps {
  chatroom: Chatroom
}

export function ChatHeader({ chatroom }: ChatHeaderProps) {
  const router = useRouter()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg chat-gradient flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-balance">{chatroom.title}</h1>
              <p className="text-xs text-muted-foreground">Gemini AI Assistant</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">{chatroom.messageCount} messages</div>
      </div>
    </header>
  )
}
