import * as vscode from 'vscode';
import { TemplateService } from '../services/TemplateService';
import { Configuration } from '../config/Configuration';
import { UIUtils } from '../utils/UIUtils';

/**
 * 命令处理器类 - 处理各种命令的执行
 */
export class CommandHandler {
    /**
     * 注册所有命令
     */
    public static registerCommands(context: vscode.ExtensionContext): void {
        // 注册插入模板命令
        const insertCommand = vscode.commands.registerCommand(
            'vs-file-template.insert',
            () => this.handleInsertCommand()
        );

        // 注册导入模板命令
        const importCommand = vscode.commands.registerCommand(
            'vs-file-template.import',
            (uri: vscode.Uri) => this.handleImportCommand(uri)
        );

        // 注册新建文件命令
        const newCommand = vscode.commands.registerCommand(
            'vs-file-template.new',
            (uri: vscode.Uri) => this.handleNewCommand(uri)
        );

        // 注册状态栏按钮命令
        const btnCommand = vscode.commands.registerCommand(
            'vs-file-template.btn',
            () => this.handleBtnCommand()
        );

        // 注册添加到insert目录命令
        const addToInsertCommand = vscode.commands.registerCommand(
            'vs-file-template.addToInsertDir',
            () => this.handleAddToInsertDirCommand()
        );

        // 注册切换CodeLens命令
        const toggleCodeLensCommand = vscode.commands.registerCommand(
            'vs-file-template.toggleCodeLens',
            () => this.handleToggleCodeLensCommand()
        );

        // 添加到订阅列表
        context.subscriptions.push(insertCommand, importCommand, newCommand, btnCommand, addToInsertCommand, toggleCodeLensCommand);
    }

    /**
     * 处理插入模板命令
     */
    private static async handleInsertCommand(): Promise<void> {
        try {
            await TemplateService.insertTemplate();
        } catch (error) {
            UIUtils.showError(`插入模板失败: ${error}`);
        }
    }

    /**
     * 处理导入模板命令
     */
    private static async handleImportCommand(uri: vscode.Uri): Promise<void> {
        try {
            await TemplateService.importTemplate(uri);
        } catch (error) {
            UIUtils.showError(`导入模板失败: ${error}`);
        }
    }

    /**
     * 处理新建文件命令
     */
    private static async handleNewCommand(uri: vscode.Uri): Promise<void> {
        try {
            await TemplateService.createNewFile(uri);
        } catch (error) {
            UIUtils.showError(`创建新文件失败: ${error}`);
        }
    }

    /**
     * 处理状态栏按钮命令
     */
    private static async handleBtnCommand(): Promise<void> {
        try {
            const action = await UIUtils.showActionMenu();
            if (!action) {
                return;
            }

            switch (action) {
                case '配置模板路径':
                    await Configuration.openSettings();
                    break;
                case '管理模板':
                    await TemplateService.manageTemplates();
                    break;
                case '启用代码镜头':
                case '禁用代码镜头':
                    await this.handleToggleCodeLensCommand();
                    break;
            }
        } catch (error) {
            UIUtils.showError(`执行操作失败: ${error}`);
        }
    }

    /**
     * 处理添加到insert目录命令
     */
    private static async handleAddToInsertDirCommand(): Promise<void> {
        try {
            await TemplateService.addToInsertDir();
        } catch (error) {
            UIUtils.showError(`添加模板失败: ${error}`);
        }
    }

    /**
     * 处理切换CodeLens命令
     */
    private static async handleToggleCodeLensCommand(): Promise<void> {
        try {
            const newState = await Configuration.toggleCodeLens();
            UIUtils.showInfo(`代码镜头已${newState ? '启用' : '禁用'}`);
            
            // 触发CodeLens刷新
            vscode.commands.executeCommand('vscode.executeCodeLensProvider');
        } catch (error) {
            UIUtils.showError(`切换代码镜头状态失败: ${error}`);
        }
    }
}
