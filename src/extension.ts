import * as vscode from 'vscode';
import { CommandHandler } from './commands/CommandHandler';
import { StatusBarManager } from './ui/StatusBarManager';
import { Configuration } from './config/Configuration';
import { UIUtils } from './utils/UIUtils';
import { TemplateCodeLensProvider } from './providers/CodeLensProvider';

let statusBarManager: StatusBarManager;
let codeLensProvider: TemplateCodeLensProvider;

/**
 * 扩展激活时调用
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('文件模板插件已激活');

    // 注册所有命令
    CommandHandler.registerCommands(context);

    // 创建并注册CodeLens提供器
    codeLensProvider = new TemplateCodeLensProvider();
    const codeLensDisposable = vscode.languages.registerCodeLensProvider(
        { scheme: 'file' }, // 支持所有文件类型
        codeLensProvider
    );
    context.subscriptions.push(codeLensDisposable);

    // 监听文本选择变化以刷新CodeLens
    const selectionChangeListener = vscode.window.onDidChangeTextEditorSelection(() => {
        codeLensProvider.refresh();
    });
    context.subscriptions.push(selectionChangeListener);

    // 监听活动编辑器变化以刷新CodeLens
    const activeEditorChangeListener = vscode.window.onDidChangeActiveTextEditor(() => {
        codeLensProvider.refresh();
    });
    context.subscriptions.push(activeEditorChangeListener);

    // 监听光标位置变化以刷新CodeLens
    const cursorChangeListener = vscode.window.onDidChangeTextEditorSelection(() => {
        codeLensProvider.refresh();
    });
    context.subscriptions.push(cursorChangeListener);

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
        if (event.affectsConfiguration('vs-file-template.enableCodeLens')) {
            handleCodeLensConfigChanged();
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
    if (codeLensProvider) {
        // CodeLens提供器会通过context.subscriptions自动清理
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

/**
 * 处理CodeLens配置变化
 */
function handleCodeLensConfigChanged(): void {
    console.log('CodeLens配置已变化，刷新CodeLens...');
    if (codeLensProvider) {
        codeLensProvider.refresh();
    }
}
