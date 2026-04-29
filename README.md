# Cursor Learning Mode

Cursor Learning Mode is a Cursor/VS Code extension that toggles between:

- `⚡ Builder Mode` for normal coding assistant behavior.
- `🎓 Learning Mode` for guided, progressive learning support.

## Features

- One-click status bar toggle between Builder and Learning mode.
- Command palette commands:
  - `Toggle Learning Mode`
  - `Enable Learning Mode`
  - `Enable Builder Mode`
  - `Generate Learning Hint`
  - `Generate Scaffold`
- Mode persistence via extension `globalState`.
- Sidebar panel with current mode, description, and quick toggle.
- Notifications when mode changes.
- Keyboard shortcut: `Ctrl+Shift+L` to toggle mode.

## Learning Mode Behavior

When Learning Mode is active, prompts are shaped around:

1. No full code immediately.
2. Blueprint first.
3. TODO-based scaffolding.
4. Fill-in-the-blank guidance.
5. Progressive hints.
6. Guiding questions.
7. Full solution only on explicit request.

## Run Locally

1. Install dependencies:
   - `npm install`
2. Build:
   - `npm run compile`
3. Press `F5` in VS Code/Cursor to launch the Extension Development Host.
4. Open command palette and run `Toggle Learning Mode`.

## Project Structure

- `src/extension.ts` - activation, commands, status bar wiring.
- `src/modeManager.ts` - mode state and persistence.
- `src/promptEngine.ts` - learning vs builder prompt templates.
- `src/webview/learningModeViewProvider.ts` - sidebar webview provider.
- `src/webview/getWebviewContent.ts` - webview HTML/UI.
