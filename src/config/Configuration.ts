import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { FileSystemUtils } from '../utils/FileSystemUtils';
import { UIUtils } from '../utils/UIUtils';

/**
 * 配置管理类 - 负责管理插件的配置项
 */
export class Configuration {
    private static readonly CONFIG_SECTION = 'vs-file-template';
    private static readonly TEMPLATE_PATH_KEY = 'templatePath';
    private static readonly ENABLE_CODELENS_KEY = 'enableCodeLens';

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
     * 检查并创建必需的模板子目录
     */
    public static ensureTemplateSubDirectories(): boolean {
        const templatePath = this.getTemplatePath();
        if (!templatePath) {
            return false;
        }

        // 如果模板根目录不存在，先创建它
        if (!this.validateTemplatePath(templatePath)) {
            if (!FileSystemUtils.createDirectory(templatePath)) {
                UIUtils.showError(`无法创建模板根目录: ${templatePath}`);
                return false;
            }
        }

        // 创建必需的子目录
        const requiredDirs = ['import', 'insert', 'new'];
        const createdDirs: string[] = [];
        let allSuccess = true;

        for (const dirName of requiredDirs) {
            const dirPath = path.join(templatePath, dirName);
            if (!FileSystemUtils.directoryExists(dirPath)) {
                if (FileSystemUtils.createDirectory(dirPath)) {
                    createdDirs.push(dirName);
                } else {
                    UIUtils.showError(`无法创建目录: ${dirPath}`);
                    allSuccess = false;
                }
            }
        }

        // 显示创建结果
        if (createdDirs.length > 0) {
            UIUtils.showInfo(`已自动创建模板目录: ${createdDirs.join(', ')}`);
        }

        return allSuccess;
    }

    /**
     * 打开设置页面
     */
    public static async openSettings(): Promise<void> {
        await vscode.commands.executeCommand('workbench.action.openSettings', this.CONFIG_SECTION);
    }

    /**
     * 获取CodeLens启用状态
     */
    public static getCodeLensEnabled(): boolean {
        const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
        return config.get<boolean>(this.ENABLE_CODELENS_KEY, true);
    }

    /**
     * 设置CodeLens启用状态
     */
    public static async setCodeLensEnabled(enabled: boolean): Promise<void> {
        const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
        await config.update(this.ENABLE_CODELENS_KEY, enabled, vscode.ConfigurationTarget.Global);
    }

    /**
     * 切换CodeLens启用状态
     */
    public static async toggleCodeLens(): Promise<boolean> {
        const currentState = this.getCodeLensEnabled();
        const newState = !currentState;
        await this.setCodeLensEnabled(newState);
        return newState;
    }
}
