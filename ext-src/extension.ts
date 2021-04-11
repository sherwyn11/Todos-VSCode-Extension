import * as vscode from 'vscode';
import SidebarProvider from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('todos-vscode-extension.refresh', () => {
		SidebarProvider.kill();
		SidebarProvider.createOrShow(context.extensionPath);
		setTimeout(() => {
			vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
		}, 500);
	}));
	
}

export function deactivate() {}