import * as vscode from 'vscode';
export class Injector {
    response: any;
    editor: vscode.TextEditor;
    text: string;
    selection: vscode.Selection;
    constructor(
        response: JSON,
        editor: vscode.TextEditor,
        text: string,
        selection: vscode.Selection
    ){ 
        this.editor = editor
        this.response = response
        this.text = text
        this.selection = selection}
    
    
    private MSG = 'AUTO-GENERATED COMMENT PLEASE VERIFY AND UPDATE';

    public genMethodComment(
        cmt: string, paramNames: Array<string>, isVoid: boolean, alignChars: string
    ): string {
        let mthdCmt = `/** ${this.MSG}\n${alignChars} *${cmt}\n${alignChars} *\n`;
        for (let i = 0; i < paramNames.length; i++) {
            mthdCmt += `${alignChars} * @param ${paramNames[i]}\n`;
        }
        if (!isVoid) {
            mthdCmt += `${alignChars} * @return STUB PLEASE FILL IN\n`;
        }
        mthdCmt += `${alignChars} */\n`;
    
        return mthdCmt;
    }

    public genInlineComment(cmt: string, alignChars: string): string {
        let inlineCmt = `// ${this.MSG}\n`;
        inlineCmt += `${alignChars}//${cmt}\n`;
    
        return inlineCmt;
    }
    public inject(response: any) 
    {
        // From https://stackoverflow.com/questions/53585737/vscode-extension-how-to-alter-files-text
        // Take response from server and place generated comment above the highlighted code
        const alignChars = ' '.repeat(this.selection.start.character);
        if (this.editor) {
            this.editor.edit(editBuilder => {
                let cmt;
                // if (isMthd) {
                //     cmt = genMethodComment(response.data, paramNames, isVoid, alignChars);
                // } else {
                //     cmt = genInlineComment(response.data, alignChars);
                // }
                cmt = this.genInlineComment(this.response.data, alignChars)
                editBuilder.insert(this.selection.start, cmt + ' '.repeat(this.selection.start.character));
            });
        }
    }

}