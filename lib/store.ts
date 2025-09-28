import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthState, ChatState, Message } from "./types"
import { generateId } from "./utils"

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
    },
  ),
)

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      currentChatroom: null,
      messages: {},
      isTyping: false,
      searchQuery: "",
      messagePagination: {},

      addChatroom: (chatroom) =>
        set((state) => ({
          chatrooms: [chatroom, ...state.chatrooms],
        })),

      deleteChatroom: (id) =>
        set((state) => ({
          chatrooms: state.chatrooms.filter((room) => room.id !== id),
          currentChatroom: state.currentChatroom?.id === id ? null : state.currentChatroom,
          messages: Object.fromEntries(Object.entries(state.messages).filter(([key]) => key !== id)),
          messagePagination: Object.fromEntries(Object.entries(state.messagePagination).filter(([key]) => key !== id)),
        })),

      setCurrentChatroom: (chatroom) => set({ currentChatroom: chatroom }),

      addMessage: (message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [message.chatroomId]: [...(state.messages[message.chatroomId] || []), message],
          },
          chatrooms: state.chatrooms.map((room) =>
            room.id === message.chatroomId
              ? { ...room, messageCount: room.messageCount + 1, updatedAt: message.timestamp }
              : room,
          ),
          messagePagination: {
            ...state.messagePagination,
            [message.chatroomId]: {
              ...(state.messagePagination[message.chatroomId] || {
                page: 0,
                hasMore: true,
                isLoading: false,
                totalMessages: 0,
              }),
              totalMessages: (state.messagePagination[message.chatroomId]?.totalMessages || 0) + 1,
            },
          },
        })),

      setMessages: (chatroomId, messages) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatroomId]: messages,
          },
          messagePagination: {
            ...state.messagePagination,
            [chatroomId]: {
              ...(state.messagePagination[chatroomId] || {
                page: 0,
                hasMore: true,
                isLoading: false,
                totalMessages: 0,
              }),
              totalMessages: messages.length,
            },
          },
        })),

      loadMoreMessages: async (chatroomId) => {
        const state = get()
        const pagination = state.messagePagination[chatroomId] || {
          page: 0,
          hasMore: true,
          isLoading: false,
          totalMessages: 0,
        }

        if (!pagination.hasMore || pagination.isLoading) return

        set((state) => ({
          messagePagination: {
            ...state.messagePagination,
            [chatroomId]: { ...pagination, isLoading: true },
          },
        }))

        await new Promise((resolve) => setTimeout(resolve, 1000))

        const olderMessages: Message[] = Array.from({ length: 20 }, (_, i) => ({
          id: generateId(),
          chatroomId,
          content: `This is an older message #${pagination.page * 20 + i + 1}. It contains some sample text to demonstrate the reverse infinite scroll functionality. This message was generated ${pagination.page + 1} pages ago.`,
          type: i % 3 === 0 ? "ai" : "user",
          timestamp: new Date(Date.now() - (pagination.page + 1) * 24 * 60 * 60 * 1000 - i * 60 * 60 * 1000),
          imageUrl: i % 7 === 0 ? `/placeholder.svg?height=200&width=300&query=sample image ${i}` : undefined,
        }))

        const currentMessages = state.messages[chatroomId] || []
        const hasMore = pagination.page < 4

        set((state) => ({
          messages: {
            ...state.messages,
            [chatroomId]: [...olderMessages, ...currentMessages],
          },
          messagePagination: {
            ...state.messagePagination,
            [chatroomId]: {
              page: pagination.page + 1,
              hasMore,
              isLoading: false,
              totalMessages: pagination.totalMessages + 20,
            },
          },
        }))
      },

      getPaginatedMessages: (chatroomId, page, pageSize = 20) => {
        const state = get()
        const allMessages = state.messages[chatroomId] || []
        const startIndex = page * pageSize
        const endIndex = startIndex + pageSize
        return allMessages.slice(startIndex, endIndex)
      },

      getTotalPages: (chatroomId, pageSize = 20) => {
        const state = get()
        const allMessages = state.messages[chatroomId] || []
        return Math.ceil(allMessages.length / pageSize)
      },

      getCurrentPage: (chatroomId) => {
        const state = get()
        const pagination = state.messagePagination[chatroomId]
        return pagination?.page || 0
      },

      setCurrentPage: (chatroomId, page) => {
        set((state) => ({
          messagePagination: {
            ...state.messagePagination,
            [chatroomId]: {
              ...(state.messagePagination[chatroomId] || { hasMore: true, isLoading: false, totalMessages: 0 }),
              page,
            },
          },
        }))
      },

      setTyping: (isTyping) => set({ isTyping }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      getChatroomMessages: (chatroomId) => {
        const state = get()
        return state.messages[chatroomId] || []
      },
    }),
    {
      name: "chat-storage",
    },
  ),
)
