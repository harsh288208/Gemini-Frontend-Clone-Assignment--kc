export interface User {
  id: string
  phone: string
  countryCode: string
  isAuthenticated: boolean
  createdAt: Date
}

export interface Chatroom {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount: number
}

export interface Message {
  id: string
  chatroomId: string
  content: string
  type: "user" | "ai"
  timestamp: Date
  imageUrl?: string
}

export interface Country {
  name: {
    common: string
  }
  cca2: string
  idd: {
    root: string
    suffixes: string[]
  }
  flag: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export interface ChatState {
  chatrooms: Chatroom[]
  currentChatroom: Chatroom | null
  messages: Record<string, Message[]>
  isTyping: boolean
  searchQuery: string
  messagePagination: Record<string, { page: number; hasMore: boolean; isLoading: boolean; totalMessages: number }>
  addChatroom: (chatroom: Chatroom) => void
  deleteChatroom: (id: string) => void
  setCurrentChatroom: (chatroom: Chatroom | null) => void
  addMessage: (message: Message) => void
  setMessages: (chatroomId: string, messages: Message[]) => void
  loadMoreMessages: (chatroomId: string) => Promise<void>
  getPaginatedMessages: (chatroomId: string, page: number, pageSize?: number) => Message[]
  getTotalPages: (chatroomId: string, pageSize?: number) => number
  getCurrentPage: (chatroomId: string) => number
  setCurrentPage: (chatroomId: string, page: number) => void
  setTyping: (typing: boolean) => void
  setSearchQuery: (query: string) => void
  getChatroomMessages: (chatroomId: string) => Message[]
}
