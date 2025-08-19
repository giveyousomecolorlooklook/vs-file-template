import * as vscode from 'vscode';

/**
 * 状态栏管理器 - 管理状态栏按钮
 */
export class StatusBarManager {
    private statusBarItem: vscode.StatusBarItem;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.setupStatusBarItem();
    }

    /**
     * 设置状态栏按钮
     */
    private setupStatusBarItem(): void {
        this.statusBarItem.text = '$(file-code) 模板';
        this.statusBarItem.tooltip = '文件模板管理';
        this.statusBarItem.command = 'vs-file-template.btn';
        this.statusBarItem.show();
    }

    /**
     * 显示状态栏按钮
     */
    public show(): void {
        this.statusBarItem.show();
    }

    /**
     * 隐藏状态栏按钮
     */
    public hide(): void {
        this.statusBarItem.hide();
    }

    /**
     * 销毁状态栏按钮
     */
    public dispose(): void {
        this.statusBarItem.dispose();
    }
}
