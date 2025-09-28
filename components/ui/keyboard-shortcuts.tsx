"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useChatStore } from "@/lib/store"
import { toast } from "sonner"

export function KeyboardShortcuts() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { setSearchQuery } = useChatStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Cmd/Ctrl + K - Focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }

      // Cmd/Ctrl + N - New chat
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault()
        const newChatButton = document.querySelector('button:has(svg + span:contains("New Chat"))') as HTMLButtonElement
        if (newChatButton) {
          newChatButton.click()
        }
      }

      // Escape - Go back to dashboard
      if (e.key === "Escape" && window.location.pathname.includes("/chat/")) {
        e.preventDefault()
        router.push("/dashboard")
      }

      // Cmd/Ctrl + Shift + L - Logout
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "L") {
        e.preventDefault()
        if (user) {
          logout()
          toast.success("Logged out successfully")
          router.push("/auth")
        }
      }

      // ? - Show keyboard shortcuts (could be implemented as a modal)
      if (e.key === "?" && !e.shiftKey) {
        e.preventDefault()
        toast.info("Keyboard shortcuts: ⌘K (Search), ⌘N (New Chat), Esc (Back), ⌘⇧L (Logout)")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [router, user, logout, setSearchQuery])

  return null
}
