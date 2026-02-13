# CopilotUI 🤖

Production-grade AI conversational interface built to simulate modern LLM-powered SaaS tools.

CopilotUI is a system-level frontend engineering showcase designed to demonstrate conversational UX, streaming responses, markdown rendering, and AI copilot interface design.

This project is part of the GigDevOS capability lab — created to replace NDA-protected AI product work with anonymized capability demonstrations.

---

## ✨ Overview

CopilotUI replicates the interface experience of modern AI products such as copilots, assistants, and knowledge tools.

It demonstrates how users interact with conversational AI systems across workflows like coding, documentation, analytics, and product operations.

The project focuses on:

- Conversational UI architecture
- Streaming response systems
- Markdown rendering
- Code block visualization
- Prompt interaction design

---

## 🎯 Purpose

Many AI product interfaces cannot be publicly shared due to NDAs.

CopilotUI exists to demonstrate:

- AI SaaS frontend capability
- Real-time conversational UX
- LLM interface engineering
- Developer tooling UI patterns

It serves as a flagship demo for AI-focused freelance and gig positioning.

---

## 🧠 Core Features

### Conversational Threads

- User & AI message bubbles
- Avatar indicators
- Timestamp labels
- Message grouping
- Edit & regenerate messages
- Like/dislike feedback
- Copy & share actions

### Streaming Responses

- Simulated real-time generation
- Word-by-word streaming
- Typing indicator states

### Markdown Rendering

AI responses support:

- Headings
- Lists
- Tables
- Links
- Rich formatting

### Code Block Visualization

- Syntax highlighting (Prism)
- Language detection
- Copy-to-clipboard
- Scrollable blocks

### Prompt Composer

- Auto-resizing textarea
- Keyboard submission (Enter to send, Shift+Enter for newline)
- Prompt suggestions
- File attachments (images, PDF, text, etc.)
- Drag & drop support

### Conversation Sidebar

- Chat history
- New chat creation
- Rename threads
- Delete threads
- Favorites / pinned chats
- Search conversations
- Collapsible on mobile

### Additional Pages

- **Profile** — User info, display name, email
- **Settings** — Theme, notifications, cookies, data controls, export, account deletion
- **Subscription** — Plan selection (Free, Pro, Team)
- **Help & Support** — FAQ accordion

---

## 🛠 Tech Stack

| Category   | Stack                            |
| ---------- | -------------------------------- |
| Framework  | Next.js 16 (App Router)          |
| Language   | TypeScript                       |
| UI         | React 19                         |
| Styling    | Tailwind CSS 4                   |
| Markdown   | react-markdown, remark-gfm       |
| Code       | react-syntax-highlighter (Prism) |
| Icons      | Lucide React                     |
| Deployment | Vercel                           |

**Note:** LLM integration is mocked — no real API required. Responses use realistic mock data.

---

## 🎨 Design System

CopilotUI follows a modern AI product interface language.

### Visual Traits

- Light/dark theme toggle
- Conversational canvas
- Glass input composer
- Gradient AI responses
- Sidebar workspace layout

Built to feel production-ready — not a chatbot widget.

---

## 📂 Project Structure

```structure
/app
  /(dashboard)          # Authenticated routes
    /chat               # Chat list & conversation view
    /help               # Help & FAQ
    /profile            # User profile
    /settings           # App settings
    /subscription       # Plan management
  /logged-out           # Post-sign-out page
  /signin               # Sign-in redirect

/components
  /chat                 # ChatBubble, Sidebar, PromptInput, etc.
  /layout               # PageHeader, PageContent, PageFooterLinks
  /ui                   # Button, Modal, Card, Spinner, etc.

/contexts               # Auth, User, Chat, Sidebar, Subscription

/data                   # Constants, mock data, FAQ, prompts

/hooks                  # useChat, useTheme, useIsMobile, useStreamingText

/lib                    # streamText, settings, subscription, account, etc.
```

---

## 💬 Data Layer

All conversations use realistic mock datasets.

Examples include:

- Product design prompts
- Code generation queries
- Analytics insights
- Technical explanations

No lorem ipsum or placeholder dialogue. Data is persisted in `localStorage` for demo continuity.

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/dchobarkar/copilotui.git
cd copilotui
```

Install dependencies (npm or pnpm):

```bash
npm install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🏗 Build

```bash
npm run build
npm start
```

---

## 🌐 Deployment

Optimized for Vercel deployment.

1. Push repo to GitHub
2. Import into Vercel
3. Deploy instantly

---

## ⚡ Performance Focus

- Optimized markdown parsing
- Lazy syntax highlighting
- Smooth streaming rendering
- Memoized chat bubbles

---

## 🔐 NDA Compliance

CopilotUI contains no proprietary AI product interfaces or client data.

All conversational systems and UI flows are self-initiated demonstrations.

---

## 🤝 Contributing

This project is part of a capability showcase, but forks and adaptations are welcome.

---

## 🪪 License

MIT License — free for personal and commercial adaptation.

---

## ⭐ Support

If you found this project helpful, consider starring the repository.

---

Built to simulate real AI product experiences ⚡
