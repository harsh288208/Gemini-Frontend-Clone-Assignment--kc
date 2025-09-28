"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useChatStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MessageCircle, MoreVertical, Trash2 } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { toast } from "sonner"
import type { Chatroom } from "@/lib/types"

interface ChatroomListProps {
  chatrooms: Chatroom[]
}

export function ChatroomList({ chatrooms }: ChatroomListProps) {
  const { deleteChatroom, setCurrentChatroom } = useChatStore()
  const router = useRouter()

  const handleChatroomClick = (chatroom: Chatroom) => {
    setCurrentChatroom(chatroom)
    router.push(`/chat/${chatroom.id}`)
  }

  const handleDeleteChatroom = (chatroom: Chatroom, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteChatroom(chatroom.id)
    toast.success("Chatroom deleted successfully")
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {chatrooms.map((chatroom) => (
        <Card
          key={chatroom.id}
          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] group"
          onClick={() => handleChatroomClick(chatroom)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm truncate text-balance">{chatroom.title}</h3>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>{formatDate(chatroom.updatedAt)}</p>
                  <p>{chatroom.messageCount} messages</p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => handleDeleteChatroom(chatroom, e)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground">Last updated {formatTime(chatroom.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
