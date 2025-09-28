"use client"

import { MessageCircle } from "lucide-react"
import { CreateChatroomDialog } from "./create-chatroom-dialog"

export function EmptyState() {
  return (
    <div className="text-center py-12 space-y-6">
      <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
        <MessageCircle className="w-12 h-12 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-balance">No conversations yet</h3>
        <p className="text-muted-foreground text-pretty max-w-md mx-auto">
          Start your first conversation with Gemini AI. Create a new chatroom to begin exploring ideas, asking
          questions, or having engaging discussions.
        </p>
      </div>

      <CreateChatroomDialog />
    </div>
  )
}
