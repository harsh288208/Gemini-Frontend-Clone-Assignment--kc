"use client"

import { Sparkles } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="px-4 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full chat-gradient flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Gemini is typing</span>
            <div className="flex gap-1 ml-2">
              <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
