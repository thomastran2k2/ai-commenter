// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';
import { ParsedEntity, Parser } from './parser';
import path = require('path');
import { privateEncrypt } from 'crypto';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ai-commenter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ai-commenter.start', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		
		

		// sample code for Parser, to be removed after prod, change the project path to the correct one on your machine
		sampleParseFunc('/home/will/MACathon/src')
		
		
		const editor = vscode.window.activeTextEditor;
		if (!editor){
			return;
		}

		const document = editor.document;
		const headers = {
			
			'Content-Type': 'application/json'
		};
		const url = "" //api address;
		let code = document.getText();
		code = code.split(/[\s]+/).join(' ').toLowerCase(); //Basic parser
		axios.post(String(url), { code: code }, {
			headers: headers
		})
			.then(function (response) {

				if (editor) {
					editor.edit(
						//Todo: Injector function
						() => {}
					);
				}
			});
		
	});

	context.subscriptions.push(disposable);
}


async function sampleParseFunc(projectPath: string) {
	var parser: any = new Parser(vscode.Uri.parse(projectPath))
	let res = await parser.parse()
	console.log(res)
}
// This method is called when your extension is deactivated
export function deactivate() {}

