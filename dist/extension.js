/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommandHandler = void 0;
const vscode = __importStar(__webpack_require__(2));
const TemplateService_1 = __webpack_require__(3);
const Configuration_1 = __webpack_require__(5);
const UIUtils_1 = __webpack_require__(8);
/**
 * 命令处理器类 - 处理各种命令的执行
 */
class CommandHandler {
    /**
     * 注册所有命令
     */
    static registerCommands(context) {
        // 注册插入模板命令
        const insertCommand = vscode.commands.registerCommand('vs-file-template.insert', () => this.handleInsertCommand());
        // 注册导入模板命令
        const importCommand = vscode.commands.registerCommand('vs-file-template.import', (uri) => this.handleImportCommand(uri));
        // 注册新建文件命令
        const newCommand = vscode.commands.registerCommand('vs-file-template.new', (uri) => this.handleNewCommand(uri));
        // 注册状态栏按钮命令
        const btnCommand = vscode.commands.registerCommand('vs-file-template.btn', () => this.handleBtnCommand());
        // 注册添加到insert目录命令
        const addToInsertCommand = vscode.commands.registerCommand('vs-file-template.addToInsertDir', () => this.handleAddToInsertDirCommand());
        // 添加到订阅列表
        context.subscriptions.push(insertCommand, importCommand, newCommand, btnCommand, addToInsertCommand);
    }
    /**
     * 处理插入模板命令
     */
    static async handleInsertCommand() {
        try {
            await TemplateService_1.TemplateService.insertTemplate();
        }
        catch (error) {
            UIUtils_1.UIUtils.showError(`插入模板失败: ${error}`);
        }
    }
    /**
     * 处理导入模板命令
     */
    static async handleImportCommand(uri) {
        try {
            await TemplateService_1.TemplateService.importTemplate(uri);
        }
        catch (error) {
            UIUtils_1.UIUtils.showError(`导入模板失败: ${error}`);
        }
    }
    /**
     * 处理新建文件命令
     */
    static async handleNewCommand(uri) {
        try {
            await TemplateService_1.TemplateService.createNewFile(uri);
        }
        catch (error) {
            UIUtils_1.UIUtils.showError(`创建新文件失败: ${error}`);
        }
    }
    /**
     * 处理状态栏按钮命令
     */
    static async handleBtnCommand() {
        try {
            const action = await UIUtils_1.UIUtils.showActionMenu();
            if (!action) {
                return;
            }
            switch (action) {
                case '配置模板路径':
                    await Configuration_1.Configuration.openSettings();
                    break;
                case '管理模板':
                    await TemplateService_1.TemplateService.manageTemplates();
                    break;
            }
        }
        catch (error) {
            UIUtils_1.UIUtils.showError(`执行操作失败: ${error}`);
        }
    }
    /**
     * 处理添加到insert目录命令
     */
    static async handleAddToInsertDirCommand() {
        try {
            await TemplateService_1.TemplateService.addToInsertDir();
        }
        catch (error) {
            UIUtils_1.UIUtils.showError(`添加模板失败: ${error}`);
        }
    }
}
exports.CommandHandler = CommandHandler;


/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplateService = void 0;
const vscode = __importStar(__webpack_require__(2));
const path = __importStar(__webpack_require__(4));
const Configuration_1 = __webpack_require__(5);
const FileSystemUtils_1 = __webpack_require__(7);
const UIUtils_1 = __webpack_require__(8);
/**
 * 模板服务类 - 核心业务逻辑
 */
class TemplateService {
    /**
     * 插入模板内容到当前编辑器
     */
    static async insertTemplate() {
        const templateDirs = Configuration_1.Configuration.getTemplateSubDirectories();
        if (!templateDirs) {
            UIUtils_1.UIUtils.showError('未配置模板路径或路径无效');
            return;
        }
        const insertDir = templateDirs.insert;
        if (!FileSystemUtils_1.FileSystemUtils.directoryExists(insertDir)) {
            UIUtils_1.UIUtils.showError('insert目录不存在');
            return;
        }
        // 获取当前活动编辑器
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            UIUtils_1.UIUtils.showError('没有打开的编辑器');
            return;
        }
        // 获取当前文件的扩展名作为默认筛选器
        const currentFileName = editor.document.fileName;
        const fileExtension = path.extname(currentFileName);
        const defaultFilter = fileExtension ? fileExtension.substring(1) : undefined; // 移除点号
        // 选择模板类型文件夹
        const subDirs = FileSystemUtils_1.FileSystemUtils.getSubDirectories(insertDir);
        if (subDirs.length === 0) {
            UIUtils_1.UIUtils.showError('insert目录下没有模板文件夹');
            return;
        }
        const selectedDir = await UIUtils_1.UIUtils.showQuickPickWithFilter(subDirs, defaultFilter, `选择模板类型${defaultFilter ? ` (当前文件: .${defaultFilter})` : ''}`);
        if (!selectedDir) {
            return;
        }
        // 选择具体模板文件
        const templateDirPath = path.join(insertDir, selectedDir);
        const templateFiles = FileSystemUtils_1.FileSystemUtils.getFiles(templateDirPath);
        if (templateFiles.length === 0) {
            UIUtils_1.UIUtils.showError('所选模板类型下没有模板文件');
            return;
        }
        const selectedFile = await UIUtils_1.UIUtils.showQuickPick(templateFiles, '选择模板文件');
        if (!selectedFile) {
            return;
        }
        // 读取模板内容并插入
        const templateFilePath = path.join(templateDirPath, selectedFile);
        const content = FileSystemUtils_1.FileSystemUtils.readFileContent(templateFilePath);
        if (content === null) {
            UIUtils_1.UIUtils.showError('无法读取模板文件内容');
            return;
        }
        // 在光标位置插入内容
        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, content);
        });
        UIUtils_1.UIUtils.showInfo('模板内容已插入');
    }
    /**
     * 导入模板目录到目标位置
     */
    static async importTemplate(targetUri) {
        const templateDirs = Configuration_1.Configuration.getTemplateSubDirectories();
        if (!templateDirs) {
            UIUtils_1.UIUtils.showError('未配置模板路径或路径无效');
            return;
        }
        const importDir = templateDirs.import;
        if (!FileSystemUtils_1.FileSystemUtils.directoryExists(importDir)) {
            UIUtils_1.UIUtils.showError('import目录不存在');
            return;
        }
        // 确定目标目录
        let targetPath;
        if (targetUri) {
            const resourcePath = FileSystemUtils_1.FileSystemUtils.getPathFromUri(targetUri);
            if (FileSystemUtils_1.FileSystemUtils.fileExists(resourcePath)) {
                // 如果是文件，使用其父目录
                targetPath = FileSystemUtils_1.FileSystemUtils.getParentDirectory(resourcePath);
            }
            else {
                // 如果是目录，直接使用
                targetPath = resourcePath;
            }
        }
        else {
            UIUtils_1.UIUtils.showError('请在资源管理器中选择目标位置');
            return;
        }
        // 选择要导入的模板目录
        const subDirs = FileSystemUtils_1.FileSystemUtils.getSubDirectories(importDir);
        if (subDirs.length === 0) {
            UIUtils_1.UIUtils.showError('import目录下没有模板目录');
            return;
        }
        const selectedDir = await UIUtils_1.UIUtils.showQuickPick(subDirs, '选择要导入的模板目录');
        if (!selectedDir) {
            return;
        }
        // 执行导入操作 - 保留内部目录结构
        const sourceDir = path.join(importDir, selectedDir);
        const success = FileSystemUtils_1.FileSystemUtils.copyDirectoryWithStructure(sourceDir, targetPath);
        if (success) {
            UIUtils_1.UIUtils.showInfo(`已成功导入模板到: ${targetPath}（保留目录结构）`);
        }
        else {
            UIUtils_1.UIUtils.showError('导入模板失败');
        }
    }
    /**
     * 创建新文件从模板
     */
    static async createNewFile(targetUri) {
        const templateDirs = Configuration_1.Configuration.getTemplateSubDirectories();
        if (!templateDirs) {
            UIUtils_1.UIUtils.showError('未配置模板路径或路径无效');
            return;
        }
        const newDir = templateDirs.new;
        if (!FileSystemUtils_1.FileSystemUtils.directoryExists(newDir)) {
            UIUtils_1.UIUtils.showError('new目录不存在');
            return;
        }
        // 确定目标目录
        let targetPath;
        if (targetUri) {
            const resourcePath = FileSystemUtils_1.FileSystemUtils.getPathFromUri(targetUri);
            if (FileSystemUtils_1.FileSystemUtils.fileExists(resourcePath)) {
                // 如果是文件，使用其父目录
                targetPath = FileSystemUtils_1.FileSystemUtils.getParentDirectory(resourcePath);
            }
            else {
                // 如果是目录，直接使用
                targetPath = resourcePath;
            }
        }
        else {
            UIUtils_1.UIUtils.showError('请在资源管理器中选择目标位置');
            return;
        }
        // 选择模板文件
        const templateFiles = FileSystemUtils_1.FileSystemUtils.getFiles(newDir);
        if (templateFiles.length === 0) {
            UIUtils_1.UIUtils.showError('new目录下没有模板文件');
            return;
        }
        const selectedFile = await UIUtils_1.UIUtils.showQuickPick(templateFiles, '选择模板文件');
        if (!selectedFile) {
            return;
        }
        // 获取新文件名
        const fileName = await UIUtils_1.UIUtils.showInputBox('输入新文件名', '请输入新文件名（不含扩展名）');
        if (!fileName) {
            return;
        }
        // 确定文件扩展名
        const templateExt = path.extname(selectedFile);
        const newFileName = fileName + templateExt;
        const newFilePath = path.join(targetPath, newFileName);
        // 检查文件是否已存在
        if (FileSystemUtils_1.FileSystemUtils.fileExists(newFilePath)) {
            const overwrite = await UIUtils_1.UIUtils.showConfirmDialog(`文件 ${newFileName} 已存在，是否覆盖？`);
            if (!overwrite) {
                return;
            }
        }
        // 复制模板文件
        const templateFilePath = path.join(newDir, selectedFile);
        const success = FileSystemUtils_1.FileSystemUtils.copyFile(templateFilePath, newFilePath);
        if (success) {
            UIUtils_1.UIUtils.showInfo(`已创建新文件: ${newFileName}`);
            // 打开新创建的文件
            const document = await vscode.workspace.openTextDocument(newFilePath);
            await vscode.window.showTextDocument(document);
        }
        else {
            UIUtils_1.UIUtils.showError('创建新文件失败');
        }
    }
    /**
     * 管理模板 - 在新窗口中打开模板目录
     */
    static async manageTemplates() {
        const templatePath = Configuration_1.Configuration.getTemplatePath();
        if (!templatePath) {
            UIUtils_1.UIUtils.showError('未配置模板路径');
            return;
        }
        if (!Configuration_1.Configuration.validateTemplatePath(templatePath)) {
            UIUtils_1.UIUtils.showError('模板路径无效');
            return;
        }
        // 在新窗口中打开模板目录
        const uri = vscode.Uri.file(templatePath);
        await vscode.commands.executeCommand('vscode.openFolder', uri, { forceNewWindow: true });
    }
    /**
     * 将当前选中的文本添加到insert模板目录
     */
    static async addToInsertDir() {
        const templateDirs = Configuration_1.Configuration.getTemplateSubDirectories();
        if (!templateDirs) {
            UIUtils_1.UIUtils.showError('未配置模板路径或路径无效');
            return;
        }
        const insertDir = templateDirs.insert;
        if (!FileSystemUtils_1.FileSystemUtils.directoryExists(insertDir)) {
            UIUtils_1.UIUtils.showError('insert目录不存在');
            return;
        }
        // 获取当前活动编辑器
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            UIUtils_1.UIUtils.showError('没有打开的编辑器');
            return;
        }
        // 获取选中的文本
        const selection = editor.selection;
        if (selection.isEmpty) {
            UIUtils_1.UIUtils.showError('请先选中要保存为模板的文本');
            return;
        }
        const selectedText = editor.document.getText(selection);
        if (!selectedText.trim()) {
            UIUtils_1.UIUtils.showError('选中的文本不能为空');
            return;
        }
        // 获取当前文件的扩展名作为默认目录
        const currentFileName = editor.document.fileName;
        const fileExtension = path.extname(currentFileName);
        const defaultDir = fileExtension ? fileExtension.substring(1) : undefined; // 移除点号
        // 获取insert目录下的所有子目录
        const subDirs = FileSystemUtils_1.FileSystemUtils.getSubDirectories(insertDir);
        if (subDirs.length === 0) {
            UIUtils_1.UIUtils.showError('insert目录下没有子目录，请先创建相应的模板分类目录');
            return;
        }
        // 选择目标子目录
        const selectedSubDir = await UIUtils_1.UIUtils.showQuickPickWithFilter(subDirs, defaultDir, `选择模板分类目录${defaultDir ? ` (当前文件: .${defaultDir})` : ''}`);
        if (!selectedSubDir) {
            return;
        }
        // 输入文件名
        const fileName = await UIUtils_1.UIUtils.showInputBox('请输入模板文件名（不含扩展名）', '输入模板文件名');
        if (!fileName) {
            return;
        }
        // 确定文件扩展名（使用当前文件的扩展名）
        const templateFileName = fileName + (fileExtension || '.txt');
        const templateFilePath = path.join(insertDir, selectedSubDir, templateFileName);
        // 检查文件是否已存在
        if (FileSystemUtils_1.FileSystemUtils.fileExists(templateFilePath)) {
            const overwrite = await UIUtils_1.UIUtils.showConfirmDialog(`模板文件 ${templateFileName} 已存在，是否覆盖？`);
            if (!overwrite) {
                return;
            }
        }
        // 保存选中的文本到模板文件
        const success = FileSystemUtils_1.FileSystemUtils.writeFileContent(templateFilePath, selectedText);
        if (success) {
            UIUtils_1.UIUtils.showInfo(`已成功保存模板: ${selectedSubDir}/${templateFileName}`);
        }
        else {
            UIUtils_1.UIUtils.showError('保存模板文件失败');
        }
    }
}
exports.TemplateService = TemplateService;


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Configuration = void 0;
const vscode = __importStar(__webpack_require__(2));
const path = __importStar(__webpack_require__(4));
const fs = __importStar(__webpack_require__(6));
/**
 * 配置管理类 - 负责管理插件的配置项
 */
class Configuration {
    static CONFIG_SECTION = 'vs-file-template';
    static TEMPLATE_PATH_KEY = 'templatePath';
    /**
     * 获取模板路径配置
     */
    static getTemplatePath() {
        const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
        return config.get(this.TEMPLATE_PATH_KEY);
    }
    /**
     * 设置模板路径配置
     */
    static async setTemplatePath(templatePath) {
        const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
        await config.update(this.TEMPLATE_PATH_KEY, templatePath, vscode.ConfigurationTarget.Global);
    }
    /**
     * 验证模板路径是否有效
     */
    static validateTemplatePath(templatePath) {
        if (!templatePath) {
            return false;
        }
        try {
            const stat = fs.statSync(templatePath);
            return stat.isDirectory();
        }
        catch {
            return false;
        }
    }
    /**
     * 获取模板子目录路径
     */
    static getTemplateSubDirectories() {
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
    static async openSettings() {
        await vscode.commands.executeCommand('workbench.action.openSettings', this.CONFIG_SECTION);
    }
}
exports.Configuration = Configuration;


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileSystemUtils = void 0;
const fs = __importStar(__webpack_require__(6));
const path = __importStar(__webpack_require__(4));
/**
 * 文件系统工具类 - 处理文件和目录操作
 */
class FileSystemUtils {
    /**
     * 检查目录是否存在
     */
    static directoryExists(dirPath) {
        try {
            const stat = fs.statSync(dirPath);
            return stat.isDirectory();
        }
        catch {
            return false;
        }
    }
    /**
     * 检查文件是否存在
     */
    static fileExists(filePath) {
        try {
            const stat = fs.statSync(filePath);
            return stat.isFile();
        }
        catch {
            return false;
        }
    }
    /**
     * 读取目录下的所有子目录
     */
    static getSubDirectories(dirPath) {
        if (!this.directoryExists(dirPath)) {
            return [];
        }
        try {
            return fs.readdirSync(dirPath)
                .filter(item => {
                const fullPath = path.join(dirPath, item);
                return this.directoryExists(fullPath);
            });
        }
        catch {
            return [];
        }
    }
    /**
     * 读取目录下的所有文件
     */
    static getFiles(dirPath) {
        if (!this.directoryExists(dirPath)) {
            return [];
        }
        try {
            return fs.readdirSync(dirPath)
                .filter(item => {
                const fullPath = path.join(dirPath, item);
                return this.fileExists(fullPath);
            });
        }
        catch {
            return [];
        }
    }
    /**
     * 递归获取目录下的所有文件
     */
    static getFilesRecursively(dirPath) {
        if (!this.directoryExists(dirPath)) {
            return [];
        }
        const files = [];
        try {
            const items = fs.readdirSync(dirPath);
            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);
                if (stat.isFile()) {
                    files.push(fullPath);
                }
                else if (stat.isDirectory()) {
                    files.push(...this.getFilesRecursively(fullPath));
                }
            }
        }
        catch {
            // 忽略错误
        }
        return files;
    }
    /**
     * 读取文件内容
     */
    static readFileContent(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf8');
        }
        catch {
            return null;
        }
    }
    /**
     * 写入文件内容
     */
    static writeFileContent(filePath, content) {
        try {
            // 确保目录存在
            const dir = path.dirname(filePath);
            if (!this.directoryExists(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * 复制文件
     */
    static copyFile(sourcePath, targetPath) {
        try {
            // 确保目标目录存在
            const targetDir = path.dirname(targetPath);
            if (!this.directoryExists(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            fs.copyFileSync(sourcePath, targetPath);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * 递归复制目录下的所有文件（不包含目录结构）
     */
    static copyFilesRecursively(sourceDir, targetDir) {
        try {
            const files = this.getFilesRecursively(sourceDir);
            for (const file of files) {
                const fileName = path.basename(file);
                const targetPath = path.join(targetDir, fileName);
                if (!this.copyFile(file, targetPath)) {
                    return false;
                }
            }
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * 递归复制目录并保留内部目录结构（不包含根目录本身）
     * @param sourceDir 源目录路径
     * @param targetDir 目标目录路径
     * @returns 是否复制成功
     */
    static copyDirectoryWithStructure(sourceDir, targetDir) {
        try {
            if (!this.directoryExists(sourceDir)) {
                return false;
            }
            const items = fs.readdirSync(sourceDir);
            for (const item of items) {
                const sourcePath = path.join(sourceDir, item);
                const targetPath = path.join(targetDir, item);
                const stat = fs.statSync(sourcePath);
                if (stat.isFile()) {
                    // 复制文件
                    if (!this.copyFile(sourcePath, targetPath)) {
                        return false;
                    }
                }
                else if (stat.isDirectory()) {
                    // 递归复制子目录
                    if (!this.directoryExists(targetPath)) {
                        fs.mkdirSync(targetPath, { recursive: true });
                    }
                    if (!this.copyDirectoryWithStructure(sourcePath, targetPath)) {
                        return false;
                    }
                }
            }
            return true;
        }
        catch (error) {
            console.error('复制目录失败:', error);
            return false;
        }
    }
    /**
     * 获取文件或目录的父目录
     */
    static getParentDirectory(filePath) {
        return path.dirname(filePath);
    }
    /**
     * 从URI获取文件系统路径
     */
    static getPathFromUri(uri) {
        return uri.fsPath;
    }
}
exports.FileSystemUtils = FileSystemUtils;


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIUtils = void 0;
const vscode = __importStar(__webpack_require__(2));
/**
 * UI工具类 - 处理用户界面交互
 */
class UIUtils {
    /**
     * 显示错误消息
     */
    static showError(message) {
        vscode.window.showErrorMessage(`文件模板: ${message}`);
    }
    /**
     * 显示信息消息
     */
    static showInfo(message) {
        vscode.window.showInformationMessage(`文件模板: ${message}`);
    }
    /**
     * 显示警告消息
     */
    static showWarning(message) {
        vscode.window.showWarningMessage(`文件模板: ${message}`);
    }
    /**
     * 显示选择列表
     */
    static async showQuickPick(items, placeholder) {
        if (items.length === 0) {
            this.showWarning('没有可选项');
            return undefined;
        }
        return await vscode.window.showQuickPick(items, {
            placeHolder: placeholder || '请选择一个选项'
        });
    }
    /**
     * 显示带有默认筛选值的选择列表
     * 使用createQuickPick API来实现默认输入值
     */
    static async showQuickPickWithFilter(items, defaultFilter, placeholder) {
        if (items.length === 0) {
            this.showWarning('没有可选项');
            return undefined;
        }
        return new Promise((resolve) => {
            const quickPick = vscode.window.createQuickPick();
            // 转换为QuickPickItem格式
            const quickPickItems = items.map(item => ({
                label: item,
                description: ''
            }));
            quickPick.items = quickPickItems;
            quickPick.placeholder = placeholder || '请选择一个选项';
            // 设置默认筛选值
            if (defaultFilter) {
                quickPick.value = defaultFilter;
            }
            quickPick.onDidChangeSelection(selection => {
                if (selection[0]) {
                    resolve(selection[0].label);
                    quickPick.hide();
                }
            });
            quickPick.onDidHide(() => {
                resolve(undefined);
                quickPick.dispose();
            });
            quickPick.show();
        });
    }
    /**
     * 显示输入框
     */
    static async showInputBox(placeholder, prompt) {
        return await vscode.window.showInputBox({
            placeHolder: placeholder,
            prompt: prompt
        });
    }
    /**
     * 显示文件夹选择对话框
     */
    static async showOpenDialog(title) {
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
    static async showConfirmDialog(message) {
        const result = await vscode.window.showInformationMessage(message, { modal: true }, '确定', '取消');
        return result === '确定';
    }
    /**
     * 显示操作选择菜单
     */
    static async showActionMenu() {
        const actions = [
            '配置模板路径',
            '管理模板'
        ];
        return await this.showQuickPick(actions, '选择操作');
    }
}
exports.UIUtils = UIUtils;


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatusBarManager = void 0;
const vscode = __importStar(__webpack_require__(2));
/**
 * 状态栏管理器 - 管理状态栏按钮
 */
class StatusBarManager {
    statusBarItem;
    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.setupStatusBarItem();
    }
    /**
     * 设置状态栏按钮
     */
    setupStatusBarItem() {
        this.statusBarItem.text = '$(file-code) 模板';
        this.statusBarItem.tooltip = '文件模板管理';
        this.statusBarItem.command = 'vs-file-template.btn';
        this.statusBarItem.show();
    }
    /**
     * 显示状态栏按钮
     */
    show() {
        this.statusBarItem.show();
    }
    /**
     * 隐藏状态栏按钮
     */
    hide() {
        this.statusBarItem.hide();
    }
    /**
     * 销毁状态栏按钮
     */
    dispose() {
        this.statusBarItem.dispose();
    }
}
exports.StatusBarManager = StatusBarManager;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
exports.deactivate = deactivate;
const CommandHandler_1 = __webpack_require__(1);
const StatusBarManager_1 = __webpack_require__(9);
const Configuration_1 = __webpack_require__(5);
const UIUtils_1 = __webpack_require__(8);
let statusBarManager;
/**
 * 扩展激活时调用
 */
function activate(context) {
    console.log('文件模板插件已激活');
    // 注册所有命令
    CommandHandler_1.CommandHandler.registerCommands(context);
    // 创建状态栏管理器
    statusBarManager = new StatusBarManager_1.StatusBarManager();
    context.subscriptions.push({
        dispose: () => statusBarManager.dispose()
    });
    // 检查模板路径配置
    checkTemplateConfiguration();
    UIUtils_1.UIUtils.showInfo('文件模板插件已启动');
}
/**
 * 扩展停用时调用
 */
function deactivate() {
    if (statusBarManager) {
        statusBarManager.dispose();
    }
    console.log('文件模板插件已停用');
}
/**
 * 检查模板配置
 */
function checkTemplateConfiguration() {
    const templatePath = Configuration_1.Configuration.getTemplatePath();
    if (!templatePath) {
        UIUtils_1.UIUtils.showWarning('尚未配置模板路径，请先配置模板路径');
        return;
    }
    if (!Configuration_1.Configuration.validateTemplatePath(templatePath)) {
        UIUtils_1.UIUtils.showWarning('配置的模板路径无效，请检查路径是否存在');
        return;
    }
    console.log(`模板路径已配置: ${templatePath}`);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map