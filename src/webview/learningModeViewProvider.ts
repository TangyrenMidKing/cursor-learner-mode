import * as vscode from "vscode";
import { LearningMode, ModeManager } from "../modeManager";
import { getWebviewContent } from "./getWebviewContent";

export class LearningModeViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "cursorLearningMode.sidebar";

  private view?: vscode.WebviewView;

  public constructor(private readonly modeManager: ModeManager) {}

  public resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true
    };

    webviewView.webview.onDidReceiveMessage(async (message: { type?: string }) => {
      if (message.type === "toggleMode") {
        await this.modeManager.toggleMode();
      }
    });

    this.render(this.modeManager.getMode());
  }

  public render(mode: LearningMode): void {
    if (!this.view) {
      return;
    }

    this.view.webview.html = getWebviewContent({
      mode,
      cspSource: this.view.webview.cspSource,
      nonce: createNonce()
    });
  }
}

function createNonce(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let value = "";
  for (let i = 0; i < 24; i += 1) {
    value += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return value;
}
