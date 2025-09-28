# Gemini Chat Clone - AI Conversation Assistant

A modern, fully-featured conversational AI chat application built with Next.js 15, featuring OTP authentication, real-time messaging simulation, image sharing, and a beautiful gradient-based design system.

## 🚀 Live Demo

**[View Live Application](https://your-deployment-url.vercel.app)**

## ✨ Features

### 🔐 Authentication
- **OTP-based Login/Signup** with country code selection
- **Real-time country data** fetched from restcountries.com API
- **Form validation** using React Hook Form + Zod
- **Simulated OTP delivery** with realistic delays

### 💬 Chat Interface
- **AI Message Simulation** with realistic response delays
- **Typing indicators** ("Gemini is typing...")
- **Message timestamps** and user/AI message distinction
- **Copy-to-clipboard** functionality on message hover
- **Auto-scroll** to latest messages with smart scroll detection
- **Reverse infinite scroll** for loading older messages (20 per page)

### 🖼️ Media Support
- **Image upload** with drag-and-drop support
- **File validation** (type and size limits)
- **Image preview** and download functionality
- **Base64 encoding** for client-side storage

### 🎨 UI/UX Excellence
- **Modern gradient design** inspired by Google's Gemini
- **Dark/Light mode** with system preference detection
- **Fully responsive** mobile-first design
- **Loading skeletons** for enhanced perceived performance
- **Toast notifications** for all user actions
- **Keyboard accessibility** with comprehensive shortcuts

### 🔍 Dashboard Features
- **Chatroom management** (create, delete, search)
- **Debounced search** for real-time filtering
- **Message count tracking** and last updated timestamps
- **Empty states** with engaging call-to-actions

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **State Management** | Zustand with persistence |
| **Form Handling** | React Hook Form + Zod |
| **UI Components** | Radix UI primitives |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Theme** | next-themes |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/gemini-chat-clone.git
   cd gemini-chat-clone
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
gemini-chat-clone/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   ├── chat/[id]/               # Dynamic chat routes
│   ├── dashboard/               # Dashboard page
│   ├── globals.css              # Global styles & design tokens
│   ├── layout.tsx               # Root layout with providers
│   ├── loading.tsx              # Global loading UI
│   ├── not-found.tsx           # 404 page
│   └── page.tsx                # Home page with auth redirect
├── components/                  # Reusable components
│   ├── auth/                   # Authentication components
│   ├── chat/                   # Chat interface components
│   ├── dashboard/              # Dashboard components
│   ├── ui/                     # Base UI components (shadcn/ui)
│   └── theme-provider.tsx      # Theme context provider
├── lib/                        # Utilities and configuration
│   ├── store.ts               # Zustand state management
│   ├── types.ts               # TypeScript type definitions
│   └── utils.ts               # Utility functions
└── public/                     # Static assets
\`\`\`

## 🔧 Key Implementation Details

### State Management
- **Zustand stores** with localStorage persistence
- **Separate stores** for authentication and chat data
- **Optimistic updates** for better UX

### Form Validation
\`\`\`typescript
const phoneSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
})
\`\`\`

### AI Response Simulation
\`\`\`typescript
export function simulateAIResponse(message: string): Promise<string> {
  return new Promise((resolve) => {
    const delay = Math.random() * 2000 + 1500 // 1.5-3.5 seconds
    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      resolve(randomResponse)
    }, delay)
  })
}
\`\`\`

### Infinite Scroll Implementation
- **Reverse pagination** loading older messages at the top
- **Scroll position preservation** during message loading
- **Loading states** with skeleton components
- **Pagination limits** (demo: 4 pages max)

### Keyboard Shortcuts
- `⌘/Ctrl + K` - Focus search
- `⌘/Ctrl + N` - Create new chat
- `Escape` - Navigate back to dashboard
- `⌘/Ctrl + Shift + L` - Logout
- `?` - Show help

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#8B5CF6) - Brand color for CTAs and highlights
- **Gradient**: Purple to Pink - Used for chat backgrounds and accents
- **Neutrals**: Carefully selected grays for text and backgrounds
- **Semantic**: Success, warning, and error colors for feedback

### Typography
- **Headings**: Inter font family with multiple weights
- **Body**: Inter for readability
- **Code**: JetBrains Mono for technical content

### Responsive Breakpoints
- **Mobile**: < 640px (default)
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 🧪 Testing the Application

### Authentication Flow
1. Enter any phone number with country code
2. Use any 6-digit number as OTP (e.g., 123456)
3. Successfully authenticate and access dashboard

### Chat Features
1. Create a new chatroom from dashboard
2. Send text messages and observe AI responses
3. Upload images (max 5MB) and see preview
4. Test infinite scroll by scrolling to top
5. Try keyboard shortcuts and copy functionality

## 📱 Mobile Experience

- **Touch-optimized** interface with proper tap targets
- **Responsive typography** that scales appropriately
- **Mobile-first** CSS with progressive enhancement
- **Gesture support** for image interactions
- **Optimized performance** for mobile devices

## ♿ Accessibility Features

- **Keyboard navigation** for all interactive elements
- **Focus indicators** with proper contrast ratios
- **Screen reader support** with semantic HTML and ARIA labels
- **Reduced motion** support for users with vestibular disorders
- **High contrast mode** compatibility

## 🔒 Security Considerations

- **Client-side validation** with server-side simulation
- **Input sanitization** for all user-generated content
- **XSS protection** through React's built-in escaping
- **CSRF protection** through SameSite cookies (in production)

## 🚀 Performance Optimizations

- **Code splitting** with Next.js automatic optimization
- **Image optimization** with Next.js Image component
- **Lazy loading** for components and routes
- **Debounced search** to reduce unnecessary API calls
- **Memoized components** to prevent unnecessary re-renders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Kuvaka Tech**
- Email: hr@kuvaka.io
- Assignment: Gemini Frontend Clone

## 🙏 Acknowledgments

- Design inspiration from Google's Gemini AI interface
- Country data provided by [REST Countries API](https://restcountries.com/)
- UI components built with [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

**Built with ❤️ for the Kuvaka Tech Frontend Developer Assignment**
