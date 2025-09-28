"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChatStore } from "@/lib/store"
import { debounce } from "@/lib/utils"

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useChatStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)

  // Debounced search function
  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query)
  }, 300)

  useEffect(() => {
    debouncedSearch(localQuery)
  }, [localQuery, debouncedSearch])

  const handleClear = () => {
    setLocalQuery("")
    setSearchQuery("")
  }

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Search chatrooms..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="pl-10 pr-10"
      />
      {localQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
