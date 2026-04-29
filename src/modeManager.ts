import * as vscode from "vscode";

export enum LearningMode {
  Builder = "builder",
  Learning = "learning"
}

const MODE_KEY = "cursorLearningMode.currentMode";

export class ModeManager {
  private readonly onDidChangeModeEmitter = new vscode.EventEmitter<LearningMode>();

  public readonly onDidChangeMode = this.onDidChangeModeEmitter.event;

  public constructor(private readonly context: vscode.ExtensionContext) {}

  public getMode(): LearningMode {
    return this.context.globalState.get<LearningMode>(MODE_KEY, LearningMode.Builder);
  }

  public async setMode(mode: LearningMode): Promise<void> {
    await this.context.globalState.update(MODE_KEY, mode);
    this.onDidChangeModeEmitter.fire(mode);
  }

  public async toggleMode(): Promise<LearningMode> {
    const nextMode = this.getMode() === LearningMode.Builder ? LearningMode.Learning : LearningMode.Builder;
    await this.setMode(nextMode);
    return nextMode;
  }

  public getModeLabel(mode: LearningMode = this.getMode()): string {
    return mode === LearningMode.Learning ? "🎓 Learning Mode" : "⚡ Builder Mode";
  }

  public getModeDescription(mode: LearningMode = this.getMode()): string {
    return mode === LearningMode.Learning
      ? "Guided tutoring mode with scaffolds, hints, and progressive disclosure."
      : "Standard AI coding mode with direct full-solution assistance.";
  }
}
