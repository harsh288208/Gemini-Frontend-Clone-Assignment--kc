"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface MessageSkeletonProps {
  isUser?: boolean
}

export function MessageSkeleton({ isUser = false }: MessageSkeletonProps) {
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Skeleton className="w-8 h-8 rounded-full shrink-0" />}

      <div className={`flex flex-col max-w-[70%] ${isUser ? "items-end" : ""}`}>
        <div className="bg-muted rounded-2xl px-4 py-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-3 w-12 mt-1 px-1" />
      </div>

      {isUser && <Skeleton className="w-8 h-8 rounded-full shrink-0" />}
    </div>
  )
}
