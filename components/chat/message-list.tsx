"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MessageBubble } from "./message-bubble"
import { MessageSkeleton } from "./message-skeleton"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"
import { useChatStore } from "@/lib/store"
import type { Message } from "@/lib/types"

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [paginationMode, setPaginationMode] = useState(false)
  const [currentPaginationPage, setCurrentPaginationPage] = useState(0)

  const { currentChatroom, loadMoreMessages, messagePagination, getPaginatedMessages, getTotalPages } = useChatStore()

  const pagination = currentChatroom ? messagePagination[currentChatroom.id] : undefined

  const displayMessages =
    paginationMode && currentChatroom ? getPaginatedMessages(currentChatroom.id, currentPaginationPage, 20) : messages

  const totalPages = currentChatroom ? getTotalPages(currentChatroom.id, 20) : 0

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container || !currentChatroom || paginationMode) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    const isAtTop = scrollTop < 100

    setShouldAutoScroll(isNearBottom)
    setShowScrollButton(!isNearBottom && messages.length > 5)

    if (isAtTop && pagination?.hasMore && !pagination.isLoading) {
      console.log("[v0] Loading more messages - scrolled to top")
      loadMoreMessages(currentChatroom.id)
    }
  }, [currentChatroom, messages.length, pagination, loadMoreMessages, paginationMode])

  // Auto-scroll to bottom when new messages arrive (only if user is near bottom and not in pagination mode)
  useEffect(() => {
    if (shouldAutoScroll && !paginationMode) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, shouldAutoScroll, paginationMode])

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current
    if (container && !paginationMode) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll, paginationMode])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setShouldAutoScroll(true)
  }

  const togglePaginationMode = () => {
    setPaginationMode(!paginationMode)
    setCurrentPaginationPage(0)
    if (!paginationMode) {
      // When entering pagination mode, scroll to top
      setTimeout(() => {
        containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
      }, 100)
    }
  }

  const goToPreviousPage = () => {
    if (currentPaginationPage > 0) {
      setCurrentPaginationPage(currentPaginationPage - 1)
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goToNextPage = () => {
    if (currentPaginationPage < totalPages - 1) {
      setCurrentPaginationPage(currentPaginationPage + 1)
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full chat-gradient flex items-center justify-center">
            <span className="text-2xl">👋</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-balance">Start the conversation</h3>
            <p className="text-muted-foreground text-pretty">
              Ask me anything! I'm here to help with questions, creative projects, problem-solving, and more. You can
              also share images for me to analyze.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Button
          onClick={togglePaginationMode}
          size="sm"
          variant={paginationMode ? "default" : "secondary"}
          className="text-xs"
        >
          {paginationMode ? "Live Mode" : "Pagination"}
        </Button>

        {paginationMode && totalPages > 1 && (
          <div className="flex items-center gap-1 bg-background/90 backdrop-blur rounded-lg p-1 border">
            <Button
              onClick={goToPreviousPage}
              size="sm"
              variant="ghost"
              disabled={currentPaginationPage === 0}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            <span className="text-xs px-2 text-muted-foreground">
              {currentPaginationPage + 1} / {totalPages}
            </span>
            <Button
              onClick={goToNextPage}
              size="sm"
              variant="ghost"
              disabled={currentPaginationPage === totalPages - 1}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      <div ref={containerRef} className="h-full overflow-y-auto p-4 space-y-4">
        {pagination?.isLoading && !paginationMode && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Loading older messages...</p>
            </div>
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
          </div>
        )}

        {displayMessages.map((message, index) => (
          <MessageBubble key={message.id} message={message} isLast={index === displayMessages.length - 1} />
        ))}

        {paginationMode && (
          <div className="text-center py-4 border-t">
            <p className="text-xs text-muted-foreground">
              Showing {displayMessages.length} messages (Page {currentPaginationPage + 1} of {totalPages})
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && !paginationMode && (
        <Button
          onClick={scrollToBottom}
          size="sm"
          className="absolute bottom-4 right-4 rounded-full shadow-lg"
          variant="secondary"
        >
          <ChevronUp className="w-4 h-4 rotate-180" />
        </Button>
      )}
    </div>
  )
}
