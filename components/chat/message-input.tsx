"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, X, ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface MessageInputProps {
  onSendMessage: (message: string, imageUrl?: string) => void
  disabled?: boolean
}

export function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if ((message.trim() || selectedImage) && !disabled) {
      onSendMessage(message.trim(), selectedImage || undefined)
      setMessage("")
      setSelectedImage(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    setIsUploading(true)

    // Convert to base64 for preview (in real app, you'd upload to a server)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setSelectedImage(result)
      setIsUploading(false)
      toast.success("Image uploaded successfully")
    }
    reader.onerror = () => {
      setIsUploading(false)
      toast.error("Failed to upload image")
    }
    reader.readAsDataURL(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
  }

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [message])

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        {selectedImage && (
          <div className="mb-4 relative inline-block">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Upload preview"
              className="max-w-xs max-h-32 rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={removeImage}
              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={disabled || isUploading}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 mb-2"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? <ImageIcon className="w-4 h-4 animate-pulse" /> : <Paperclip className="w-4 h-4" />}
          </Button>

          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={disabled ? "Gemini is thinking..." : "Type your message..."}
              disabled={disabled}
              className="min-h-[44px] max-h-[120px] resize-none pr-12 rounded-2xl"
              rows={1}
            />
            <Button
              type="submit"
              size="sm"
              disabled={(!message.trim() && !selectedImage) || disabled}
              className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Press Enter to send, Shift+Enter for new line • Attach images up to 5MB
        </p>
      </div>
    </div>
  )
}
