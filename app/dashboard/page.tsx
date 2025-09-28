"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useChatStore } from "@/lib/store"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ChatroomList } from "@/components/dashboard/chatroom-list"
import { ChatroomListSkeleton } from "@/components/dashboard/chatroom-list-skeleton"
import { CreateChatroomDialog } from "@/components/dashboard/create-chatroom-dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { SearchBar } from "@/components/dashboard/search-bar"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuthStore()
  const { chatrooms, searchQuery } = useChatStore()
  const [isLoadingChatrooms, setIsLoadingChatrooms] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user?.isAuthenticated) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  // Simulate loading chatrooms
  useEffect(() => {
    if (user?.isAuthenticated) {
      const timer = setTimeout(() => {
        setIsLoadingChatrooms(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user?.isAuthenticated) {
    return null
  }

  // Filter chatrooms based on search query
  const filteredChatrooms = chatrooms.filter((chatroom) =>
    chatroom.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-balance">Welcome back!</h1>
            <p className="text-muted-foreground text-pretty">Start a new conversation or continue where you left off</p>
          </div>

          {/* Search and Create Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <SearchBar />
            <CreateChatroomDialog />
          </div>

          {/* Chatrooms List */}
          {isLoadingChatrooms ? (
            <ChatroomListSkeleton />
          ) : filteredChatrooms.length > 0 ? (
            <ChatroomList chatrooms={filteredChatrooms} />
          ) : chatrooms.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No chatrooms match your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
