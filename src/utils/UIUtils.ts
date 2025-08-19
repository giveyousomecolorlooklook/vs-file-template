import * as vscode from 'vscode';

/**
 * UI工具类 - 处理用户界面交互
 */
export class UIUtils {
    /**
     * 显示错误消息
     */
    public static showError(message: string): void {
        vscode.window.showErrorMessage(`文件模板: ${message}`);
    }

    /**
     * 显示信息消息
     */
    public static showInfo(message: string): void {
        vscode.window.showInformationMessage(`文件模板: ${message}`);
    }

    /**
     * 显示警告消息
     */
    public static showWarning(message: string): void {
        vscode.window.showWarningMessage(`文件模板: ${message}`);
    }

    /**
     * 显示选择列表
     */
    public static async showQuickPick(items: string[], placeholder?: string): Promise<string | undefined> {
        if (items.length === 0) {
            this.showWarning('没有可选项');
            return undefined;
        }

        return await vscode.window.showQuickPick(items, {
            placeHolder: placeholder || '请选择一个选项'
        });
    }

    /**
     * 显示输入框
     */
    public static async showInputBox(placeholder?: string, prompt?: string): Promise<string | undefined> {
        return await vscode.window.showInputBox({
            placeHolder: placeholder,
            prompt: prompt
        });
    }

    /**
     * 显示文件夹选择对话框
     */
    public static async showOpenDialog(title?: string): Promise<vscode.Uri | undefined> {
        const result = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            title: title || '选择文件夹'
        });

        return result?.[0];
    }

    /**
     * 显示确认对话框
     */
    public static async showConfirmDialog(message: string): Promise<boolean> {
        const result = await vscode.window.showInformationMessage(
            message,
            { modal: true },
            '确定',
            '取消'
        );
        
        return result === '确定';
    }

    /**
     * 显示操作选择菜单
     */
    public static async showActionMenu(): Promise<string | undefined> {
        const actions = [
            '配置模板路径',
            '管理模板'
        ];

        return await this.showQuickPick(actions, '选择操作');
    }
}
