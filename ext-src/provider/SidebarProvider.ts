import * as vscode from "vscode";
import * as path from "path";
import getNonce from "../utils/getNonce";
import JWTManager from "../manager/JWTManager";
import { TODOS_VSCODE_API_BASE_URL } from "../utils/constants";
import authenticate from "../utils/authenticate";

export default class SidebarProvider implements vscode.WebviewViewProvider {
  private static readonly viewType = "side-bar";
  private readonly _extensionPath: string;
  public _view?: vscode.WebviewView;

  constructor(extensionPath: string) {
    this._extensionPath = extensionPath;
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this._extensionPath, "build")),
      ],
    };

    webviewView.webview.html = this._getHtmlForWebview();

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "authenticate": {
          authenticate(() => {
            webviewView.webview.postMessage({
              type: "jwt-token",
              value: JWTManager.getToken(),
            });
          });
          break;
        }
        case "get-jwt-token": {
          webviewView.webview.postMessage({
            type: "jwt-token",
            value: JWTManager.getToken(),
          });
          break;
        }
        case "logout": {
          JWTManager.setToken("");
          break;
        }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview() {
    const manifest = require(path.join(
      this._extensionPath,
      "build",
      "asset-manifest.json"
    ));
    const mainScript = manifest["files"]["main.js"];
    const mainStyle = manifest["files"]["main.css"];

    const scriptPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "build", mainScript)
    );
    const scriptUri = scriptPathOnDisk.with({ scheme: "vscode-resource" });
    const stylePathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "build", mainStyle)
    );
    const styleUri = stylePathOnDisk.with({ scheme: "vscode-resource" });

    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
				<title>React App</title>
				<link rel="stylesheet" type="text/css" href="${styleUri}">
				<meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline'">
				<base href="${vscode.Uri.file(path.join(this._extensionPath, "build")).with({
          scheme: "vscode-resource",
        })}/">
			</head>
			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
				<script nonce="${nonce}">
          const tsvscode = acquireVsCodeApi();
          const apiBaseURL = ${JSON.stringify(TODOS_VSCODE_API_BASE_URL)};
        </script>
			</body>
			</html>`;
  }
}