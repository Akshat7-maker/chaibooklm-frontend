# NotebookLM Clone - Frontend

A modern AI knowledge workspace inspired by Google's NotebookLM.

The frontend is built with **Next.js**, **TypeScript**, and **Tailwind CSS**, providing a fast and responsive interface for uploading resources, managing notebooks, and chatting with AI.

---

## Features

- Authentication
- Notebook Management
- Resource Upload
- Real-time Processing Updates
- AI Chat Interface
- Streaming Responses
- Responsive UI
- Dark Mode
- Socket.IO Integration

---

# Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Axios
- Socket.IO Client
- React Hook Form
- Zod
- Lucide React

---

# Folder Structure

```text
src/

├── app/
│
├── components/
│   ├── common/
│   ├── chat/
│   ├── notebook/
│   └── ui/
│
├── hooks/
│
├── lib/
│
├── providers/
│
├── services/
│
├── types/
│
└── utils/
```

---

# Getting Started

## Clone

```bash
git clone <repo-url>

cd frontend
```

Install

```bash
bun install
```

Create Environment File

```bash
cp .env.example .env.local
```

Example

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Run Development Server

```bash
bun dev
```

The application will start on

```
http://localhost:3000
```

---

# Scripts

```bash
bun dev
```

Runs development server.

```bash
bun build
```

Creates production build.

```bash
bun start
```

Runs production server.

```bash
bun lint
```

Runs linting.

---

# Features

## Authentication

- Login
- Register
- JWT Authentication

---

## Dashboard

- View notebooks
- Create notebook
- Delete notebook
- Rename notebook

---

## Resource Upload

Supported resources

- PDF
- Website
- YouTube
- DOCX
- TXT
- VTT

---

## Processing Updates

Uses Socket.IO for

- Upload progress
- Processing status
- Ready notifications
- Failed notifications

---

## Chat

Supports

- Streaming responses
- Markdown rendering
- Citations
- Conversation history

---

# API Communication

Uses REST APIs for

- Authentication
- Notebook Management
- Resource Upload
- Chat
- Conversations

---

# State Management

The application uses TanStack Query for

- API Caching
- Request Deduplication
- Background Refetching
- Cache Invalidation

---

# Real-Time Updates

Socket.IO is used only for

- Processing updates
- Resource status
- Notifications

Chat responses are streamed over HTTP.

---

# Styling

Tailwind CSS

Design principles

- Responsive
- Accessible
- Minimal
- Dark Mode
- Mobile Friendly

---

# Environment Variables

```env
NEXT_PUBLIC_API_URL=

NEXT_PUBLIC_SOCKET_URL=
```

---

# Build

```bash
bun run build
```

---

# Production

```bash
bun start
```

---

# License

MIT