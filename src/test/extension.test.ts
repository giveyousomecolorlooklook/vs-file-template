import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { Configuration } from '../config/Configuration';
import { FileSystemUtils } from '../utils/FileSystemUtils';
import { TemplateService } from '../services/TemplateService';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('开始运行所有测试');

    suite('Configuration Tests', () => {
        test('应该能够获取和设置模板路径', async () => {
            const testPath = '/test/template/path';
            await Configuration.setTemplatePath(testPath);
            const retrievedPath = Configuration.getTemplatePath();
            assert.strictEqual(retrievedPath, testPath);
        });

        test('应该能够验证模板路径', () => {
            // 测试无效路径
            assert.strictEqual(Configuration.validateTemplatePath(''), false);
            assert.strictEqual(Configuration.validateTemplatePath('/nonexistent/path'), false);
        });
    });

    suite('FileSystemUtils Tests', () => {
        test('应该能够检查文件和目录是否存在', () => {
            // 测试不存在的路径
            assert.strictEqual(FileSystemUtils.directoryExists('/nonexistent/directory'), false);
            assert.strictEqual(FileSystemUtils.fileExists('/nonexistent/file.txt'), false);
        });

        test('应该能够获取文件扩展名和父目录', () => {
            const filePath = '/test/directory/file.txt';
            const parentDir = FileSystemUtils.getParentDirectory(filePath);
            assert.strictEqual(parentDir, '/test/directory');
        });
    });

    suite('Command Registration Tests', () => {
        test('扩展应该已激活', () => {
            const extension = vscode.extensions.getExtension('chentp0601.vs-file-template');
            assert.ok(extension);
        });

        test('应该注册了所有必需的命令', async () => {
            const commands = await vscode.commands.getCommands(true);
            const requiredCommands = [
                'vs-file-template.insert',
                'vs-file-template.import',
                'vs-file-template.new',
                'vs-file-template.btn'
            ];

            for (const command of requiredCommands) {
                assert.ok(commands.includes(command), `命令 ${command} 应该已注册`);
            }
        });
    });
});
