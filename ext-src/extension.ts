import * as vscode from 'vscode';
import HelloWorldPanel from './HelloWorldPanel';
import SidebarProvider from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {

	console.log({'path': context.extensionPath});
	console.log({'uri': context.extensionUri});

	context.subscriptions.push(vscode.commands.registerCommand('todos-vscode-extension.helloWorld', () => {
		SidebarProvider.createOrShow(context.extensionPath);
	}));

	// context.subscriptions.push(vscode.commands.registerCommand('todos-vscode-extension.helloWorld', () => {
	// 	HelloWorldPanel.createOrShow(context.extensionUri);
	// }));

	// 	const provider = new ColorsViewProvider(context.extensionUri);

	// context.subscriptions.push(
	// 	vscode.window.registerWebviewViewProvider(ColorsViewProvider.viewType, provider));

	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('calicoColors.addColor', () => {
	// 		provider.addColor();
	// 	}));

	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('calicoColors.clearColors', () => {
	// 		provider.clearColors();
	// 	}));
}

export function deactivate() {}