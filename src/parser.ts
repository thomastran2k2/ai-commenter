import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

/*
    Todo: 
    - haved the source path and line/col location in ParsedEntity so that we know where to inject the comment
*/

// and object which describe the entity parsed from the file
export interface ParsedEntity {
    type: string; // the type of the entity: Class of Object
    name: string; // the class name of function name
    code: string; // the code of the entity (a.k.a the entire class of function as a string)
}

export class Parser {
    private tokenizedItems: ParsedEntity[] = [];
    /*
        workspaceFolder: the URI object pointing to the root of the project to comment
    */
    constructor(private workspaceFolder: vscode.Uri) {}

    /*
        Parse and return all of the function in the project as an array of ParsedEntity
    */
    public async parse(): Promise<ParsedEntity[]> {
        try {
            this.tokenizedItems = [];
            const files = await this.getAllFilesInFolder(this.workspaceFolder.fsPath);

            for (const file of files) {
                const fileContent = fs.readFileSync(file, 'utf-8');
                const parsedEntities = this.parseFunctionsAndClasses(fileContent);
                this.tokenizedItems.push(...parsedEntities);
                // console.log(this.tokenizedItems[-1])
                // console.log(file)

                
            }

            // for debugging
            // for (const tkn of this.tokenizedItems) {
            //     console.log(tkn.code)
            // }
            return this.tokenizedItems;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Error tokenizing: ${error.message}`);
            return [];
        }
    }

    // get every single file in the root folder
    private async getAllFilesInFolder(folderPath: string): Promise<string[]> {
        const items: string[] = [];
        const dirents = fs.readdirSync(folderPath, { withFileTypes: true });

        for (const dirent of dirents) {
            const itemPath = path.join(folderPath, dirent.name);

            if (dirent.isDirectory()) {
                const subItems = await this.getAllFilesInFolder(itemPath);
                items.push(...subItems);
            } else {
                items.push(itemPath);
            }
        }

        return items;
    }

    // Basically compiles the file and get the child nodes that are class of function
    private parseFunctionsAndClasses(code: string): ParsedEntity[] {
        const functionsAndClasses: ParsedEntity[] = [];
      
        try {
          const sourceFile = ts.createSourceFile('code.ts', code, ts.ScriptTarget.Latest, true);
      
          function visitNode(node: ts.Node) {
            if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
              const type = ts.isFunctionDeclaration(node) ? 'Function' : 'Class';
              const name = (node.name && node.name.text) || 'Anonymous';
      
              const start = node.getStart(sourceFile);
              const end = node.getEnd();
      
              const functionOrClassCode = code.substring(start, end);
      
              functionsAndClasses.push({
                type,
                name,
                code: functionOrClassCode,
              });
            }
      
            ts.forEachChild(node, visitNode);
          }
      
          visitNode(sourceFile);
        } catch (error) {
          console.error(`Error parsing code: ${error}`);
        }
      
        return functionsAndClasses;
      }
}