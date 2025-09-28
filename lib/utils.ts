import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return "Today"
  } else if (days === 1) {
    return "Yesterday"
  } else if (days < 7) {
    return `${days} days ago`
  } else {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(dateObj)
  }
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function simulateOTPSend(phone: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`OTP sent to ${phone}`)
      resolve(true)
    }, 1500)
  })
}

export function simulateOTPVerify(otp: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Accept any 6-digit OTP for demo
    resolve(otp.length === 6 && /^\d+$/.test(otp))
  }, 1000)
}

export function simulateAIResponse(message: string): Promise<string> {
  const responses = [
    "That's an interesting question! Let me think about that for a moment.",
    "I understand what you're asking. Here's my perspective on that topic.",
    "Great point! I'd be happy to help you with that.",
    "That's a thoughtful question. Let me provide you with some insights.",
    "I see what you mean. Here's how I would approach that.",
    "Thanks for sharing that with me. I have some thoughts on this.",
    "That's a complex topic. Let me break it down for you.",
    "I appreciate you asking about that. Here's what I think.",
    "Interesting! Let me explore this idea with you.",
    "That's a great question that deserves a thoughtful response.",
  ]

  return new Promise((resolve) => {
    const delay = Math.random() * 2000 + 1500 // 1.5-3.5 seconds
    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      resolve(randomResponse)
    }, delay)
  })
}
