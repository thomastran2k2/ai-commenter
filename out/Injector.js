"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injector = void 0;
class Injector {
    constructor(response, editor, selection) {
        this.MSG = 'AUTO-GENERATED COMMENT PLEASE VERIFY AND UPDATE';
        this.editor = editor;
        this.response = response;
        this.selection = selection;
    }
    genMethodComment(cmt, paramNames, isVoid, alignChars) {
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
    genInlineComment(cmt, alignChars) {
        let inlineCmt = `// ${this.MSG}\n`;
        inlineCmt += `${alignChars}//${cmt}\n`;
        return inlineCmt;
    }
    inject(response) {
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
                cmt = this.genInlineComment(this.response.data, alignChars);
                editBuilder.insert(this.selection.start, cmt + ' '.repeat(this.selection.start.character));
            });
        }
    }
}
exports.Injector = Injector;
//# sourceMappingURL=Injector.js.map