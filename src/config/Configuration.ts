import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * 配置管理类 - 负责管理插件的配置项
 */
export class Configuration {
    private static readonly CONFIG_SECTION = 'vs-file-template';
    private static readonly TEMPLATE_PATH_KEY = 'templatePath';

    /**
     * 获取模板路径配置
     */
    public static getTemplatePath(): string | undefined {
        const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
        return config.get<string>(this.TEMPLATE_PATH_KEY);
    }

    /**
     * 设置模板路径配置
     */
    public static async setTemplatePath(templatePath: string): Promise<void> {
        const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
        await config.update(this.TEMPLATE_PATH_KEY, templatePath, vscode.ConfigurationTarget.Global);
    }

    /**
     * 验证模板路径是否有效
     */
    public static validateTemplatePath(templatePath: string): boolean {
        if (!templatePath) {
            return false;
        }

        try {
            const stat = fs.statSync(templatePath);
            return stat.isDirectory();
        } catch {
            return false;
        }
    }

    /**
     * 获取模板子目录路径
     */
    public static getTemplateSubDirectories(): { import: string; insert: string; new: string } | null {
        const templatePath = this.getTemplatePath();
        if (!templatePath || !this.validateTemplatePath(templatePath)) {
            return null;
        }

        return {
            import: path.join(templatePath, 'import'),
            insert: path.join(templatePath, 'insert'),
            new: path.join(templatePath, 'new')
        };
    }

    /**
     * 打开设置页面
     */
    public static async openSettings(): Promise<void> {
        await vscode.commands.executeCommand('workbench.action.openSettings', this.CONFIG_SECTION);
    }
}
