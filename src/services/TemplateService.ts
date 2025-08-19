import * as vscode from 'vscode';
import * as path from 'path';
import { Configuration } from '../config/Configuration';
import { FileSystemUtils } from '../utils/FileSystemUtils';
import { UIUtils } from '../utils/UIUtils';

/**
 * 模板服务类 - 核心业务逻辑
 */
export class TemplateService {
    /**
     * 插入模板内容到当前编辑器
     */
    public static async insertTemplate(): Promise<void> {
        const templateDirs = Configuration.getTemplateSubDirectories();
        if (!templateDirs) {
            UIUtils.showError('未配置模板路径或路径无效');
            return;
        }

        const insertDir = templateDirs.insert;
        if (!FileSystemUtils.directoryExists(insertDir)) {
            UIUtils.showError('insert目录不存在');
            return;
        }

        // 获取当前活动编辑器
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            UIUtils.showError('没有打开的编辑器');
            return;
        }

        // 选择模板类型文件夹
        const subDirs = FileSystemUtils.getSubDirectories(insertDir);
        if (subDirs.length === 0) {
            UIUtils.showError('insert目录下没有模板文件夹');
            return;
        }

        const selectedDir = await UIUtils.showQuickPick(subDirs, '选择模板类型');
        if (!selectedDir) {
            return;
        }

        // 选择具体模板文件
        const templateDirPath = path.join(insertDir, selectedDir);
        const templateFiles = FileSystemUtils.getFiles(templateDirPath);
        if (templateFiles.length === 0) {
            UIUtils.showError('所选模板类型下没有模板文件');
            return;
        }

        const selectedFile = await UIUtils.showQuickPick(templateFiles, '选择模板文件');
        if (!selectedFile) {
            return;
        }

        // 读取模板内容并插入
        const templateFilePath = path.join(templateDirPath, selectedFile);
        const content = FileSystemUtils.readFileContent(templateFilePath);
        if (content === null) {
            UIUtils.showError('无法读取模板文件内容');
            return;
        }

        // 在光标位置插入内容
        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, content);
        });

        UIUtils.showInfo('模板内容已插入');
    }

    /**
     * 导入模板目录到目标位置
     */
    public static async importTemplate(targetUri?: vscode.Uri): Promise<void> {
        const templateDirs = Configuration.getTemplateSubDirectories();
        if (!templateDirs) {
            UIUtils.showError('未配置模板路径或路径无效');
            return;
        }

        const importDir = templateDirs.import;
        if (!FileSystemUtils.directoryExists(importDir)) {
            UIUtils.showError('import目录不存在');
            return;
        }

        // 确定目标目录
        let targetPath: string;
        if (targetUri) {
            const resourcePath = FileSystemUtils.getPathFromUri(targetUri);
            if (FileSystemUtils.fileExists(resourcePath)) {
                // 如果是文件，使用其父目录
                targetPath = FileSystemUtils.getParentDirectory(resourcePath);
            } else {
                // 如果是目录，直接使用
                targetPath = resourcePath;
            }
        } else {
            UIUtils.showError('请在资源管理器中选择目标位置');
            return;
        }

        // 选择要导入的模板目录
        const subDirs = FileSystemUtils.getSubDirectories(importDir);
        if (subDirs.length === 0) {
            UIUtils.showError('import目录下没有模板目录');
            return;
        }

        const selectedDir = await UIUtils.showQuickPick(subDirs, '选择要导入的模板目录');
        if (!selectedDir) {
            return;
        }

        // 执行导入操作
        const sourceDir = path.join(importDir, selectedDir);
        const success = FileSystemUtils.copyFilesRecursively(sourceDir, targetPath);
        
        if (success) {
            UIUtils.showInfo(`已成功导入模板到: ${targetPath}`);
        } else {
            UIUtils.showError('导入模板失败');
        }
    }

    /**
     * 创建新文件从模板
     */
    public static async createNewFile(targetUri?: vscode.Uri): Promise<void> {
        const templateDirs = Configuration.getTemplateSubDirectories();
        if (!templateDirs) {
            UIUtils.showError('未配置模板路径或路径无效');
            return;
        }

        const newDir = templateDirs.new;
        if (!FileSystemUtils.directoryExists(newDir)) {
            UIUtils.showError('new目录不存在');
            return;
        }

        // 确定目标目录
        let targetPath: string;
        if (targetUri) {
            const resourcePath = FileSystemUtils.getPathFromUri(targetUri);
            if (FileSystemUtils.fileExists(resourcePath)) {
                // 如果是文件，使用其父目录
                targetPath = FileSystemUtils.getParentDirectory(resourcePath);
            } else {
                // 如果是目录，直接使用
                targetPath = resourcePath;
            }
        } else {
            UIUtils.showError('请在资源管理器中选择目标位置');
            return;
        }

        // 选择模板文件
        const templateFiles = FileSystemUtils.getFiles(newDir);
        if (templateFiles.length === 0) {
            UIUtils.showError('new目录下没有模板文件');
            return;
        }

        const selectedFile = await UIUtils.showQuickPick(templateFiles, '选择模板文件');
        if (!selectedFile) {
            return;
        }

        // 获取新文件名
        const fileName = await UIUtils.showInputBox('输入新文件名', '请输入新文件名（不含扩展名）');
        if (!fileName) {
            return;
        }

        // 确定文件扩展名
        const templateExt = path.extname(selectedFile);
        const newFileName = fileName + templateExt;
        const newFilePath = path.join(targetPath, newFileName);

        // 检查文件是否已存在
        if (FileSystemUtils.fileExists(newFilePath)) {
            const overwrite = await UIUtils.showConfirmDialog(`文件 ${newFileName} 已存在，是否覆盖？`);
            if (!overwrite) {
                return;
            }
        }

        // 复制模板文件
        const templateFilePath = path.join(newDir, selectedFile);
        const success = FileSystemUtils.copyFile(templateFilePath, newFilePath);
        
        if (success) {
            UIUtils.showInfo(`已创建新文件: ${newFileName}`);
            // 打开新创建的文件
            const document = await vscode.workspace.openTextDocument(newFilePath);
            await vscode.window.showTextDocument(document);
        } else {
            UIUtils.showError('创建新文件失败');
        }
    }

    /**
     * 管理模板 - 在新窗口中打开模板目录
     */
    public static async manageTemplates(): Promise<void> {
        const templatePath = Configuration.getTemplatePath();
        if (!templatePath) {
            UIUtils.showError('未配置模板路径');
            return;
        }

        if (!Configuration.validateTemplatePath(templatePath)) {
            UIUtils.showError('模板路径无效');
            return;
        }

        // 在新窗口中打开模板目录
        const uri = vscode.Uri.file(templatePath);
        await vscode.commands.executeCommand('vscode.openFolder', uri, { forceNewWindow: true });
    }
}
