import { LearningMode } from "../modeManager";

type ContentInput = {
  mode: LearningMode;
  cspSource: string;
  nonce: string;
};

export function getWebviewContent(input: ContentInput): string {
  const isLearning = input.mode === LearningMode.Learning;
  const title = isLearning ? "🎓 Learning Mode" : "⚡ Builder Mode";
  const description = isLearning
    ? "Blueprints first, then progressive hints and guided questions."
    : "Full-speed coding assistant behavior with direct solutions.";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${input.cspSource} 'unsafe-inline'; script-src 'nonce-${input.nonce}';" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cursor Learning Mode</title>
    <style>
      :root {
        color-scheme: dark;
      }
      body {
        font-family: var(--vscode-font-family);
        color: var(--vscode-foreground);
        background: var(--vscode-sideBar-background);
        margin: 0;
        padding: 12px;
      }
      .card {
        border: 1px solid var(--vscode-panel-border);
        border-radius: 12px;
        padding: 14px;
        background: var(--vscode-editorWidget-background);
      }
      .title {
        font-size: 15px;
        font-weight: 600;
        margin: 0 0 8px 0;
      }
      .description {
        opacity: 0.9;
        margin-bottom: 12px;
        line-height: 1.35;
      }
      .hint {
        font-size: 12px;
        opacity: 0.85;
        margin-top: 10px;
      }
      button {
        border: 0;
        border-radius: 10px;
        padding: 8px 12px;
        color: var(--vscode-button-foreground);
        background: var(--vscode-button-background);
        cursor: pointer;
      }
      button:hover {
        background: var(--vscode-button-hoverBackground);
      }
    </style>
  </head>
  <body>
    <div class="card">
      <p class="title">${title}</p>
      <div class="description">${description}</div>
      <button id="toggleBtn">Toggle Mode</button>
      <div class="hint">
        Hint philosophy: Learn actively by implementing small steps, validating each one, and only then requesting deeper help.
      </div>
    </div>
    <script nonce="${input.nonce}">
      const vscode = acquireVsCodeApi();
      document.getElementById("toggleBtn")?.addEventListener("click", () => {
        vscode.postMessage({ type: "toggleMode" });
      });
    </script>
  </body>
</html>`;
}
