import * as vscode from 'vscode';
import { CommandHandler } from './commands/CommandHandler';
import { StatusBarManager } from './ui/StatusBarManager';
import { Configuration } from './config/Configuration';
import { UIUtils } from './utils/UIUtils';

let statusBarManager: StatusBarManager;

/**
 * 扩展激活时调用
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('文件模板插件已激活');

    // 注册所有命令
    CommandHandler.registerCommands(context);

    // 创建状态栏管理器
    statusBarManager = new StatusBarManager();
    context.subscriptions.push({
        dispose: () => statusBarManager.dispose()
    });

    // 注册配置变化监听器
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('vs-file-template.templatePath')) {
            handleTemplatePathChanged();
        }
    });
    context.subscriptions.push(configChangeListener);

    // 检查模板路径配置
    checkTemplateConfiguration();

    UIUtils.showInfo('文件模板插件已启动');
}

/**
 * 扩展停用时调用
 */
export function deactivate() {
    if (statusBarManager) {
        statusBarManager.dispose();
    }
    console.log('文件模板插件已停用');
}

/**
 * 检查模板配置
 */
function checkTemplateConfiguration(): void {
    const templatePath = Configuration.getTemplatePath();
    
    if (!templatePath) {
        UIUtils.showWarning('尚未配置模板路径，请先配置模板路径');
        return;
    }

    if (!Configuration.validateTemplatePath(templatePath)) {
        UIUtils.showWarning('配置的模板路径无效，请检查路径是否存在');
        return;
    }

    // 确保必需的子目录存在
    Configuration.ensureTemplateSubDirectories();

    console.log(`模板路径已配置: ${templatePath}`);
}

/**
 * 处理模板路径配置变化
 */
function handleTemplatePathChanged(): void {
    console.log('模板路径配置已变化，检查目录结构...');
    
    const templatePath = Configuration.getTemplatePath();
    
    if (!templatePath) {
        UIUtils.showWarning('模板路径已清空');
        return;
    }

    if (!Configuration.validateTemplatePath(templatePath)) {
        UIUtils.showWarning('新配置的模板路径无效，请检查路径是否存在');
        return;
    }

    // 检查并创建必需的子目录
    const success = Configuration.ensureTemplateSubDirectories();
    if (success) {
        console.log(`模板路径已更新: ${templatePath}`);
    }
}
