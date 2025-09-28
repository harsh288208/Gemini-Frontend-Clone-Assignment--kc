"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Moon, Sun, Sparkles, Keyboard } from "lucide-react"
import { toast } from "sonner"

export function DashboardHeader() {
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    router.push("/auth")
  }

  const showKeyboardShortcuts = () => {
    toast.info("⌘K Search • ⌘N New Chat • Esc Back • ⌘⇧L Logout • ? Help", {
      duration: 5000,
    })
  }

  const getUserInitials = () => {
    if (user?.phone) {
      return user.phone.slice(-2).toUpperCase()
    }
    return "U"
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg chat-gradient flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">Gemini Chat</span>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">
                  {user?.countryCode} {user?.phone}
                </p>
                <p className="text-xs text-muted-foreground">Signed in</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              <span>{theme === "dark" ? "Light" : "Dark"} mode</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={showKeyboardShortcuts}>
              <Keyboard className="mr-2 h-4 w-4" />
              <span>Keyboard shortcuts</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
