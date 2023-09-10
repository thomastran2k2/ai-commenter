"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const axios_1 = require("axios");
const parser_1 = require("./parser");
const Injector_1 = require("./Injector");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
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
        sampleParseFunc('/home/will/MACathon/src');
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
        const selection = editor.selection;
        const headers = {
            'Content-Type': 'application/json'
        };
        const url = ""; //api address;
        let code = document.getText();
        code = code.split(/[\s]+/).join(' ').toLowerCase(); //Basic parser
        let response = " ";
        let injector = new Injector_1.Injector(response, editor, selection);
        injector.inject();
        axios_1.default.post(String(url), { code: code }, {
            headers: headers
        })
            .then(function (response) {
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
async function sampleParseFunc(projectPath) {
    var parser = new parser_1.Parser(vscode.Uri.parse(projectPath));
    let res = await parser.parse();
    console.log(res);
}
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map