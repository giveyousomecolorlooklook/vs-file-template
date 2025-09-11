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

        // 获取当前文件的扩展名作为默认筛选器
        const currentFileName = editor.document.fileName;
        const fileExtension = path.extname(currentFileName);
        const defaultFilter = fileExtension ? fileExtension.substring(1) : undefined; // 移除点号

        // 选择模板类型文件夹
        const subDirs = FileSystemUtils.getSubDirectories(insertDir);
        if (subDirs.length === 0) {
            UIUtils.showError('insert目录下没有模板文件夹');
            return;
        }

        const selectedDir = await UIUtils.showQuickPickWithFilter(
            subDirs, 
            defaultFilter, 
            `选择模板类型${defaultFilter ? ` (当前文件: .${defaultFilter})` : ''}`
        );
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

        // 在光标位置插入内容，支持多行缩进
        await editor.edit(editBuilder => {
            const cursorColumn = editor.selection.active.character;
            // 用空格补齐到光标同列
            const indentText = ' '.repeat(cursorColumn);
        
            let formattedContent = content;
            if (content.includes('\n')) {
                const lines = content.split('\n');
                formattedContent = lines.map((line, index) => {
                    if (index === 0) {
                        return line;
                    } else {
                        // 只加空白，不复制光标左侧已有内容
                        return indentText + line;
                    }
                }).join('\n');
            }
        
            editBuilder.insert(editor.selection.active, formattedContent);
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

        // 执行导入操作 - 保留内部目录结构
        const sourceDir = path.join(importDir, selectedDir);
        const success = FileSystemUtils.copyDirectoryWithStructure(sourceDir, targetPath);
        
        if (success) {
            UIUtils.showInfo(`已成功导入模板到: ${targetPath}（保留目录结构）`);
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

    /**
     * 将当前选中的文本添加到insert模板目录
     */
    public static async addToInsertDir(): Promise<void> {
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

        // 获取选中的文本
        const selection = editor.selection;
        if (selection.isEmpty) {
            UIUtils.showError('请先选中要保存为模板的文本');
            return;
        }

        const selectedText = editor.document.getText(selection);
        if (!selectedText.trim()) {
            UIUtils.showError('选中的文本不能为空');
            return;
        }

        // 获取当前文件的扩展名作为默认目录
        const currentFileName = editor.document.fileName;
        const fileExtension = path.extname(currentFileName);
        const defaultDir = fileExtension ? fileExtension.substring(1) : undefined; // 移除点号

        // 获取insert目录下的所有子目录
        const subDirs = FileSystemUtils.getSubDirectories(insertDir);
        if (subDirs.length === 0) {
            UIUtils.showError('insert目录下没有子目录，请先创建相应的模板分类目录');
            return;
        }

        // 选择目标子目录
        const selectedSubDir = await UIUtils.showQuickPickWithFilter(
            subDirs,
            defaultDir,
            `选择模板分类目录${defaultDir ? ` (当前文件: .${defaultDir})` : ''}`
        );
        if (!selectedSubDir) {
            return;
        }

        // 输入文件名
        const fileName = await UIUtils.showInputBox(
            '请输入模板文件名（不含扩展名）',
            '输入模板文件名'
        );
        if (!fileName) {
            return;
        }

        // 确定文件扩展名（使用当前文件的扩展名）
        const templateFileName = fileName + (fileExtension || '.txt');
        const templateFilePath = path.join(insertDir, selectedSubDir, templateFileName);

        // 检查文件是否已存在
        if (FileSystemUtils.fileExists(templateFilePath)) {
            const overwrite = await UIUtils.showConfirmDialog(`模板文件 ${templateFileName} 已存在，是否覆盖？`);
            if (!overwrite) {
                return;
            }
        }

        // 保存选中的文本到模板文件
        const success = FileSystemUtils.writeFileContent(templateFilePath, selectedText);
        
        if (success) {
            UIUtils.showInfo(`已成功保存模板: ${selectedSubDir}/${templateFileName}`);
        } else {
            UIUtils.showError('保存模板文件失败');
        }
    }
}
