# Grammerly ✍️

> An AI-powered writing assistant browser extension with real-time grammar corrections, tone adjustment, and smart paraphrasing. Backed by a Next.js web platform with user auth and a credit system.

<p align="center">
  <img src="https://img.shields.io/badge/Chrome_Extension-Manifest_V3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome Extension">
  <img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/PostgreSQL-Drizzle-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

---

## 🚀 Overview

Grammerly is a professional writing assistant that works across any website with input fields. As you type, it provides real-time AI-powered suggestions to fix grammar, improve clarity, and adjust tone — powered by Groq AI.

---

## ✅ Key Features

### ✨ Browser Extension
- **Universal Input Detection**: Works on `<input>`, `<textarea>`, and `contentEditable` fields
- **Floating Icon**: Grammarly-style icon appears when you focus an input field
- **Draggable Panel**: Click and drag the suggestion panel anywhere on screen
- **AI Suggestions**: Powered by Groq (Llama 3.1 8B) — fixes grammar, spelling, and clarity
- **4 Alternatives**: Returns 4 improved versions of your text per request
- **6 Tone Presets**: Default, Friendly 😊, Formal 👔, Professional 💼, Casual 😎, Confident 💪
- **Keyboard Shortcuts**:
  - `Ctrl+Shift+G` — Apply first suggestion instantly
  - `Ctrl+Shift+E` — Toggle assistant on/off
  - `Ctrl+Shift+A` — Apply suggestion shortcut

### 🌐 Web Platform
- **NextAuth Authentication**: JWT-based credential login with bcrypt password hashing
- **Credit System**: 50 free credits on signup; 1 credit deducted per AI request
- **User Dashboard**: View credit balance, account info, and usage stats
- **Extension API**: Endpoints for auth verification, credit checks, and deductions
- **PostgreSQL + Drizzle ORM**: Type-safe schema with UUID keys, timestamps, and migrations

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Extension | React 19, TypeScript 5, Vite 5, Tailwind CSS 4, @crxjs/vite-plugin |
| Web Platform | Next.js 16, NextAuth 4.24, Drizzle ORM, PostgreSQL |
| AI | Groq SDK, Llama 3.1 8B Instant |
| Auth & DB | bcryptjs, JWT, UUID, pg |

---

## � Setup

### Prerequisites
- Node.js 20+, pnpm, PostgreSQL, Groq API key, Chrome/Edge browser

### 1. Web Platform

```bash
cd grammerly-website/grammy
pnpm install
```

Create `.env.local`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/grammerly
NEXTAUTH_SECRET=your-random-secret-key-min-32-characters
NEXTAUTH_URL=http://localhost:3000
```

```bash
pnpm db:generate
pnpm db:migrate
pnpm dev          # http://localhost:3000
```

### 2. Browser Extension

```bash
cd grammerly
pnpm install
```

Create `.env`:
```env
VITE_GROQ_API_KEY=your-groq-api-key
```

```bash
pnpm build
```

**Load in Chrome:**
1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** → select `grammerly/dist/`

---

## 🔑 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `VITE_GROQ_API_KEY` | `grammerly/.env` | Groq API key — [console.groq.com](https://console.groq.com/keys) |
| `DATABASE_URL` | `grammy/.env.local` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | `grammy/.env.local` | Random secret (min 32 chars) |
| `NEXTAUTH_URL` | `grammy/.env.local` | App URL (e.g. `http://localhost:3000`) |

---

## 📁 Project Structure

```
grammerly-clone/
├── grammerly/                    # Browser Extension
│   ├── manifest.json            # Chrome Manifest V3
│   ├── vite.config.ts           # Vite + CRXJS config
│   └── src/
│       ├── content.tsx          # Content script entry
│       ├── background.js        # Service worker
│       └── content/
│           ├── EnhancedWritingAssistant.tsx
│           ├── types.ts
│           ├── components/
│           │   ├── GrammarlyIcon.tsx
│           │   └── SuggestionPanel.tsx
│           ├── hooks/
│           │   └── useWritingAssistant.ts
│           └── services/
│               └── groqService.ts
│
└── grammerly-website/grammy/    # Web Platform
    ├── app/
    │   ├── api/
    │   │   ├── auth/[...nextauth]/route.ts
    │   │   ├── auth/signup/route.ts
    │   │   ├── extension/auth/verify/
    │   │   ├── extension/credits/check/
    │   │   ├── extension/credits/deduct/
    │   │   └── user/credits/route.ts
    │   ├── auth/signin/page.tsx
    │   ├── auth/signup/page.tsx
    │   └── dashboard/page.tsx
    ├── db/
    │   ├── schema.ts
    │   ├── queries.ts
    │   └── migrations/
    └── lib/auth.ts
```

---

## 🚀 Deployment

### Extension → Chrome Web Store
```bash
cd grammerly
pnpm build          # outputs dist/
```
1. Zip the `dist/` folder
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Upload zip → fill listing details → submit for review

### Web Platform → Vercel
```bash
cd grammerly-website/grammy
vercel
```
Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` in the Vercel dashboard, then run `pnpm db:push`.

---

## 🗺️ Roadmap

- [ ] Firefox / chrome extension support
- [ ] Plagiarism detection
- [ ] Writing analytics dashboard
<!-- - [ ] Premium subscription tiers -->
- [ ] Style guide presets (Academic, AP, MLA)

---

<p align="center">Made with ❤️ by the Grammerly Team</p>

