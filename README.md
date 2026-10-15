# Grammy ✍️

> An AI-powered writing assistant browser extension built with React, TypeScript, Vite, and the Groq SDK. Grammy adds writing suggestions to browser pages with editable text fields.

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

Grammy is a Manifest V3 browser-extension prototype. Its content script detects editable fields, mounts the writing-assistant UI, and uses Groq to generate improved versions of the selected text. The extension is intentionally lightweight: the browser-facing experience lives in `src/content`, while Vite provides the development and production build workflow.

> **Current scope:** this checkout contains the browser extension only. The previously documented Next.js web platform is not part of this repository, so web-platform setup and deployment instructions are intentionally omitted.

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


---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Extension | React 19, TypeScript 5, Vite 5, Tailwind CSS 4, @crxjs/vite-plugin |
| AI integration | Groq SDK |
| Build tooling | Vite 5, TypeScript 5, ESLint |

---

## 🛠️ Setup

### Prerequisites

- Node.js 20 or newer
- npm (or another package manager compatible with the lockfile, if present)
- Chrome or another Chromium browser for loading the unpacked extension
- A Groq API key for AI suggestions

### Install dependencies

```bash
npm install
```

### Configure Groq

Create a `.env` file in the repository root:

```env
VITE_GROQ_API_KEY=your-groq-api-key
```

Do not commit `.env` or expose a production API key in a public extension. A browser extension can expose client-side environment values; use a server-side proxy before distributing this beyond local testing.

### Start development

```bash
npm run dev
```

Vite prints the local development URL. The regular development page is useful for iterating on React components; extension behavior is tested by loading a production-style build into the browser.

### Build the extension

```bash
npm run build:manual
```

This runs TypeScript/Vite build steps and copies the manifest, service worker, and icons into `dist/`.

### Load in Chrome

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select the generated `dist/` directory.
5. Open a page containing an input, textarea, or editable element and refresh it after rebuilding.

The `npm run build` command creates the Vite output. Use `npm run build:manual` when you need the additional extension files copied into `dist/`.


## 🔑 Environment variables

| Variable | File | Purpose |
|---|---|---|
| `VITE_GROQ_API_KEY` | `.env` | Groq API key used by the client-side service during local development |

Get a key from the [Groq console](https://console.groq.com/keys). Keep local environment files out of version control.

---

## 📁 Project structure

```text
.
├── manifest.json                 # Manifest V3 extension definition
├── vite.config.ts                # Vite and CRXJS configuration
├── public/icons/                 # Extension icons copied to dist/
├── src/
│   ├── main.tsx                  # React development entry point
│   ├── content.tsx               # Content-script entry point
│   ├── background.js             # Extension service worker
│   └── content/
│       ├── EnhancedWritingAssistant.tsx
│       ├── components/            # Floating icon and suggestion panel
│       ├── hooks/                 # Assistant state and interactions
│       ├── services/              # Groq API integration
│       └── types.ts
└── dist/                         # Generated build output (not source)
```

See [`src/content/README.md`](src/content/README.md) for the content-script data flow and extension-specific development notes.

---

## 📦 Packaging and deployment

For local testing, `npm run build:manual` creates the unpacked extension in `dist/`. Before publishing, review the generated manifest, permissions, content-script matches, and API-key handling. Zip the contents of `dist/` and upload the archive through the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

Because the Groq key is referenced by a browser-facing build, do not treat the current client-side integration as suitable for a public release without adding a protected backend proxy and usage controls.

---

## 🗺️ Roadmap

- [ ] Firefox support
- [ ] Plagiarism detection
- [ ] Writing analytics dashboard
<!-- - [ ] Premium subscription tiers -->
- [ ] Style guide presets (Academic, AP, MLA)

---

<p align="center">Made with ❤️ by the Grammerly Team</p>

