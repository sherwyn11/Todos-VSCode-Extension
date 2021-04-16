import * as vscode from "vscode";
import JWTManager from "./manager/JWTManager";
import SidebarProvider from "./provider/SidebarProvider";
import authenticate from "./utils/authenticate";

export function activate(context: vscode.ExtensionContext) {
  JWTManager.globalState = context.globalState;

  const sidebarProvider: SidebarProvider = new SidebarProvider(
    context.extensionPath
  );

  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = "$(list-unordered) Add a Todo";
  item.command = "todos-vscode-extension.addTodo";
  item.show();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "todos-vscode-extension-sidebar",
      sidebarProvider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "todos-vscode-extension.refresh",
      async () => {
        await vscode.commands.executeCommand("workbench.action.closeSidebar");
        await vscode.commands.executeCommand(
          "workbench.view.extension.todos-vscode-extension-sidebar-view"
        );
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "todos-vscode-extension.authenticate",
      async () => {
        authenticate(() => {});
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "todos-vscode-extension.addTodo",
      async () => {
        const { activeTextEditor } = vscode.window;
        if (activeTextEditor === undefined) {
          vscode.window.showErrorMessage("No active text editor present!");
          return;
        } else {
          let selectedText = activeTextEditor.document.getText(
            activeTextEditor.selection
          );
          vscode.window.showInformationMessage(
            `"${selectedText}" added to your Todos!`
          );
          sidebarProvider._view?.webview.postMessage({
            type: "add-todo",
            value: selectedText,
          });
        }
      }
    )
  );
}

export function deactivate() {}