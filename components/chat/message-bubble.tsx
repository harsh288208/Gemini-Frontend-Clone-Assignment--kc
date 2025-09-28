"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, User, Sparkles, Download } from "lucide-react"
import { formatTime } from "@/lib/utils"
import { toast } from "sonner"
import type { Message } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: Message
  isLast: boolean
}

export function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      toast.success("Message copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy message")
    }
  }

  const handleImageDownload = () => {
    if (!message.imageUrl) return

    const link = document.createElement("a")
    link.href = message.imageUrl
    link.download = `image-${message.id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Image downloaded")
  }

  const isUser = message.type === "user"

  return (
    <div
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full chat-gradient flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={cn("flex flex-col max-w-[80%] sm:max-w-[70%]", isUser && "items-end")}>
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 shadow-sm",
            isUser ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md",
          )}
        >
          {message.imageUrl && (
            <div className="mb-2 relative group">
              <img
                src={message.imageUrl || "/placeholder.svg"}
                alt="Shared image"
                className="max-w-full max-h-64 rounded-lg object-cover cursor-pointer"
                onClick={() => window.open(message.imageUrl, "_blank")}
              />
              {isHovered && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleImageDownload}
                  className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}

          {message.content && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-pretty">{message.content}</p>
          )}

          {/* Copy button */}
          {isHovered && message.content && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={cn(
                "absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full shadow-md",
                isUser ? "bg-primary-foreground text-primary" : "bg-background text-foreground",
              )}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 px-1">
          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </div>
  )
}
