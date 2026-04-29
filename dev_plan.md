You are a senior VSCode/Cursor extension engineer.

Build a production-ready Cursor / VSCode extension called:

Cursor Learning Mode

Goal:
Create an extension that adds a one-click toggle between:

1. Builder Mode
- AI behaves normally
- Full code generation allowed

2. Learning Mode
- AI should NOT give full solutions first
- AI gives blueprint / scaffold / TODO comments
- Uses hints progressively
- Helps user learn coding actively

==================================================
PROJECT REQUIREMENTS
==================================================

Tech Stack:
- TypeScript
- VSCode Extension API
- Node.js
- Clean modular architecture

Create full project files including:

- package.json
- tsconfig.json
- src/extension.ts
- src/modeManager.ts
- src/promptEngine.ts
- src/webview/*
- README.md

==================================================
CORE FEATURES
==================================================

1. Status Bar Toggle

Bottom right status bar button:

⚡ Builder Mode
🎓 Learning Mode

Click toggles mode instantly.

2. Command Palette Support

Commands:

Toggle Learning Mode
Enable Learning Mode
Enable Builder Mode

3. Persistent Mode Storage

Remember selected mode after restart using globalState.

4. Prompt Engine

When Learning Mode is ON:

Use this system behavior:

--------------------------------
You are an expert coding tutor.

Rules:
1. Never provide full code immediately.
2. Provide blueprint first.
3. Use TODO comments.
4. Use fill-in-the-blank style.
5. Give hints progressively.
6. Ask guiding questions.
7. Reveal full solution only if explicitly requested.
--------------------------------

When Builder Mode:

Normal coding assistant behavior.

5. Sidebar Webview Panel

Create a clean modern sidebar panel showing:

Current Mode
Description
Quick Toggle Button
Hint Philosophy

6. Notifications

When mode switches:

Switched to Learning Mode 🎓
Switched to Builder Mode ⚡

==================================================
UI STYLE
==================================================

Modern Cursor-like UI:
- clean
- minimal
- dark mode friendly
- rounded buttons
- elegant spacing

==================================================
CODE QUALITY
==================================================

- Strong TypeScript typing
- Modular code
- Reusable classes
- Comments explaining logic
- No placeholder pseudo code
- Fully runnable project

==================================================
BONUS FEATURES (if possible)
==================================================

1. Keyboard shortcut:
Ctrl+Shift+L

2. Hint command:
"Generate Learning Hint"

3. Blueprint command:
"Generate Scaffold"

==================================================
DELIVERABLE FORMAT
==================================================

Generate complete project folder structure first.

Then output each file one by one with full code.

Use markdown code blocks.

No explanations unless necessary.

Make it ready to paste into Cursor and run immediately.