import * as vscode from "vscode";
import { LearningModeViewProvider } from "./webview/learningModeViewProvider";
import { LearningMode, ModeManager } from "./modeManager";
import { PromptEngine } from "./promptEngine";

export function activate(context: vscode.ExtensionContext): void {
  const modeManager = new ModeManager(context);
  const promptEngine = new PromptEngine();
  const viewProvider = new LearningModeViewProvider(modeManager);

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = "cursorLearningMode.toggleMode";
  statusBarItem.show();

  const updateUI = (mode: LearningMode): void => {
    statusBarItem.text = modeManager.getModeLabel(mode);
    statusBarItem.tooltip = modeManager.getModeDescription(mode);
    viewProvider.render(mode);
  };

  const switchAndNotify = async (targetMode: LearningMode): Promise<void> => {
    await modeManager.setMode(targetMode);
    const label = targetMode === LearningMode.Learning ? "Learning Mode 🎓" : "Builder Mode ⚡";
    void vscode.window.showInformationMessage(`Switched to ${label}`);
  };

  context.subscriptions.push(
    statusBarItem,
    vscode.window.registerWebviewViewProvider(LearningModeViewProvider.viewType, viewProvider),
    modeManager.onDidChangeMode((mode) => {
      updateUI(mode);
      void syncCursorChatRuleFile(promptEngine, mode);
    }),
    vscode.commands.registerCommand("cursorLearningMode.toggleMode", async () => {
      const nextMode = await modeManager.toggleMode();
      const label = nextMode === LearningMode.Learning ? "Learning Mode 🎓" : "Builder Mode ⚡";
      void vscode.window.showInformationMessage(`Switched to ${label}`);
    }),
    vscode.commands.registerCommand("cursorLearningMode.enableLearningMode", async () => {
      await switchAndNotify(LearningMode.Learning);
    }),
    vscode.commands.registerCommand("cursorLearningMode.enableBuilderMode", async () => {
      await switchAndNotify(LearningMode.Builder);
    }),
    vscode.commands.registerCommand("cursorLearningMode.generateLearningHint", async () => {
      await generatePromptForMode(promptEngine, modeManager, "hint");
    }),
    vscode.commands.registerCommand("cursorLearningMode.generateScaffold", async () => {
      await generatePromptForMode(promptEngine, modeManager, "scaffold");
    })
  );

  updateUI(modeManager.getMode());
  void syncCursorChatRuleFile(promptEngine, modeManager.getMode());
}

export function deactivate(): void {
  // Nothing to clean up.
}

async function syncCursorChatRuleFile(promptEngine: PromptEngine, mode: LearningMode): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    return;
  }

  const cursorDir = vscode.Uri.joinPath(workspaceFolder.uri, ".cursor");
  const rulesDir = vscode.Uri.joinPath(cursorDir, "rules");
  const ruleFile = vscode.Uri.joinPath(rulesDir, "learning-mode.mdc");

  try {
    if (mode !== LearningMode.Learning) {
      await vscode.workspace.fs.delete(ruleFile, { recursive: false, useTrash: true });
      return;
    }

    await vscode.workspace.fs.createDirectory(rulesDir);

    const ruleBody = [
      "---",
      'description: "When enabled, make Cursor chat act like a tutor (no full code first; progressive hints and scaffolds)."',
      "alwaysApply: true",
      "---",
      "",
      promptEngine.getSystemBehavior(LearningMode.Learning),
      ""
    ].join("\n");

    await vscode.workspace.fs.writeFile(ruleFile, Buffer.from(ruleBody, "utf8"));
  } catch {
    // Best-effort: if write/delete fails, don't break activation or toggling.
  }
}

async function generatePromptForMode(
  promptEngine: PromptEngine,
  modeManager: ModeManager,
  kind: "hint" | "scaffold"
): Promise<void> {
  const editorSelection = getCurrentSelectionOrDocument();
  const task = await vscode.window.showInputBox({
    title: kind === "hint" ? "Generate Learning Hint" : "Generate Scaffold",
    prompt: "Describe what you want help with",
    value: editorSelection
  });

  if (!task) {
    return;
  }

  const modeBehavior = promptEngine.getSystemBehavior(modeManager.getMode());
  const body = kind === "hint" ? promptEngine.buildHintPrompt(task) : promptEngine.buildScaffoldPrompt(task);
  const fullPrompt = `${modeBehavior}\n\n---\n\n${body}`;

  await vscode.env.clipboard.writeText(fullPrompt);
  void vscode.window.showInformationMessage("Learning prompt copied to clipboard.");
}

function getCurrentSelectionOrDocument(): string {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return "";
  }

  const selectionText = editor.document.getText(editor.selection).trim();
  if (selectionText.length > 0) {
    return selectionText;
  }

  const documentText = editor.document.getText();
  return documentText.slice(0, 300).trim();
}
