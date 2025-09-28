"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useChatStore } from "@/lib/store"
import { ChatHeader } from "@/components/chat/chat-header"
import { MessageList } from "@/components/chat/message-list"
import { MessageInput } from "@/components/chat/message-input"
import { TypingIndicator } from "@/components/chat/typing-indicator"
import { Loader2 } from "lucide-react"
import { generateId, simulateAIResponse } from "@/lib/utils"
import type { Message } from "@/lib/types"

interface ChatPageProps {
  params: {
    id: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  const { user, isLoading: authLoading } = useAuthStore()
  const { chatrooms, currentChatroom, setCurrentChatroom, addMessage, getChatroomMessages, isTyping, setTyping } =
    useChatStore()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user?.isAuthenticated) {
      router.push("/auth")
      return
    }

    // Find the chatroom by ID
    const chatroom = chatrooms.find((room) => room.id === params.id)

    if (!chatroom) {
      router.push("/dashboard")
      return
    }

    setCurrentChatroom(chatroom)
    setIsLoading(false)
  }, [params.id, chatrooms, user, authLoading, router, setCurrentChatroom])

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    if (!currentChatroom || !user) return

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      chatroomId: currentChatroom.id,
      content,
      type: "user",
      timestamp: new Date(),
      imageUrl,
    }

    addMessage(userMessage)

    // Show typing indicator
    setTyping(true)

    try {
      // Simulate AI response (with image analysis if image is present)
      let prompt = content
      if (imageUrl && !content.trim()) {
        prompt = "I can see you've shared an image with me. What would you like to know about it?"
      } else if (imageUrl) {
        prompt = `${content} (Note: User also shared an image)`
      }

      const aiResponse = await simulateAIResponse(prompt)

      // Add AI message
      const aiMessage: Message = {
        id: generateId(),
        chatroomId: currentChatroom.id,
        content: aiResponse,
        type: "ai",
        timestamp: new Date(),
      }

      addMessage(aiMessage)
    } catch (error) {
      console.error("Failed to get AI response:", error)
    } finally {
      setTyping(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    )
  }

  if (!user?.isAuthenticated || !currentChatroom) {
    return null
  }

  const messages = getChatroomMessages(currentChatroom.id)

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader chatroom={currentChatroom} />

      <div className="flex-1 flex flex-col min-h-0">
        <MessageList messages={messages} />
        {isTyping && <TypingIndicator />}
        <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  )
}
