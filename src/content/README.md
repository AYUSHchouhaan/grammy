# Content script guide

This directory contains the browser-facing writing assistant. The content script runs inside matching web pages, discovers editable fields, and renders Grammy’s controls without requiring changes to the host page’s application code.

## Responsibilities

- `../content.tsx` starts the assistant from the extension content-script entry point.
- `EnhancedWritingAssistant.tsx` coordinates the selected field, assistant visibility, and suggestion workflow.
- `components/GrammarlyIcon.tsx` renders the compact control shown near an editable element.
- `components/SuggestionPanel.tsx` displays generated alternatives and actions.
- `hooks/useWritingAssistant.ts` owns interaction state and reusable assistant behavior.
- `services/groqService.ts` sends writing requests to Groq and normalizes the response.
- `types.ts` contains shared types for suggestions, tones, and assistant state.

## Runtime flow

1. The content script is injected according to `manifest.json`.
2. The assistant looks for supported `<input>`, `<textarea>`, and `contentEditable` elements.
3. Focusing an editable element makes the floating control available.
4. The user requests a rewrite or correction and optionally chooses a tone.
5. The Groq service generates alternatives.
6. The suggestion panel lets the user apply an alternative to the active field.

## Developing changes

Run the root development server for React UI work:

```bash
npm run dev
```

For extension behavior, create the packaged output and reload `dist/` from `chrome://extensions/`:

```bash
npm run build:manual
```

After changing a content script, reload the unpacked extension and refresh the target webpage. Content scripts already running in a tab do not automatically receive the rebuilt bundle.

## Adding a supported field

When extending field detection or text replacement:

1. Confirm the element can expose and update its value safely.
2. Preserve the current selection and focus behavior.
3. Keep the active element stable while the request is in flight.
4. Test regular inputs, textareas, and content-editable elements.
5. Verify that applying a suggestion dispatches the events host frameworks use to detect changes.

## Security note

The current Groq integration is client-side because this project is an extension prototype. Values prefixed with `VITE_` are available to the browser bundle. Do not ship a personal or unrestricted API key in a public extension; use an authenticated server-side proxy and rate limits for production.
