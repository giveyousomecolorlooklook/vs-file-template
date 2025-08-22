import * as vscode from 'vscode';
import { Configuration } from '../config/Configuration';

/**
 * CodeLens提供器 - 在代码编辑器中显示模板相关的快捷操作
 */
export class TemplateCodeLensProvider implements vscode.CodeLensProvider {
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor() {}

    public provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        const codeLenses: vscode.CodeLens[] = [];

        // 检查CodeLens是否启用
        if (!Configuration.getCodeLensEnabled()) {
            return codeLenses;
        }

        // 只在文本文件中显示CodeLens
        if (document.uri.scheme !== 'file') {
            return codeLenses;
        }

        // 获取当前编辑器
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document !== document) {
            return codeLenses;
        }

        // 在光标所在行显示CodeLens
        const cursorLine = editor.selection.active.line;
        const cursorPosition = new vscode.Range(cursorLine, 0, cursorLine, 0);
        
        // "从模板插入" CodeLens - 始终显示
        const insertCodeLens = new vscode.CodeLens(cursorPosition, {
            title: "🔧 从模板插入",
            command: "vs-file-template.insert",
            tooltip: "在当前位置插入模板内容"
        });
        codeLenses.push(insertCodeLens);
        
        // "保存为模板" CodeLens - 只在有选中内容时显示
        if (!editor.selection.isEmpty) {
            const addToTemplateCodeLens = new vscode.CodeLens(cursorPosition, {
                title: "💾 保存选中内容为模板",
                command: "vs-file-template.addToInsertDir",
                tooltip: "将选中的内容保存为模板"
            });
            codeLenses.push(addToTemplateCodeLens);
        }

        return codeLenses;
    }

    public resolveCodeLens?(
        codeLens: vscode.CodeLens,
        token: vscode.CancellationToken
    ): vscode.CodeLens | Thenable<vscode.CodeLens> {
        return codeLens;
    }

    /**
     * 刷新CodeLens
     */
    public refresh(): void {
        this._onDidChangeCodeLenses.fire();
    }
}
