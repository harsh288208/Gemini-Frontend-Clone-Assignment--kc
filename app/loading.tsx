import { Loader2, Sparkles } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-full chat-gradient flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
        <div className="flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading Gemini Chat...</p>
        </div>
      </div>
    </div>
  )
}
