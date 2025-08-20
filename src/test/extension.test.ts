import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
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

        test('应该能够自动创建必需的模板子目录', async () => {
            // 创建临时测试目录
            const tempDir = path.join(os.tmpdir(), 'vs-file-template-test-' + Date.now());
            
            try {
                // 设置临时模板路径
                await Configuration.setTemplatePath(tempDir);
                
                // 确保子目录存在
                const success = Configuration.ensureTemplateSubDirectories();
                assert.strictEqual(success, true, '应该成功创建子目录');
                
                // 验证所有必需的子目录都已创建
                const requiredDirs = ['import', 'insert', 'new'];
                for (const dirName of requiredDirs) {
                    const dirPath = path.join(tempDir, dirName);
                    assert.strictEqual(FileSystemUtils.directoryExists(dirPath), true, 
                        `目录 ${dirName} 应该已创建`);
                }
                
                // 获取子目录路径
                const subDirs = Configuration.getTemplateSubDirectories();
                assert.ok(subDirs, '应该能够获取子目录路径');
                assert.strictEqual(subDirs?.import, path.join(tempDir, 'import'));
                assert.strictEqual(subDirs?.insert, path.join(tempDir, 'insert'));
                assert.strictEqual(subDirs?.new, path.join(tempDir, 'new'));
                
            } finally {
                // 清理临时目录
                try {
                    if (fs.existsSync(tempDir)) {
                        fs.rmSync(tempDir, { recursive: true, force: true });
                    }
                } catch (error) {
                    console.warn('清理临时目录失败:', error);
                }
            }
        });
    });

    suite('FileSystemUtils Tests', () => {
        test('应该能够检查文件和目录是否存在', () => {
            // 测试不存在的路径
            assert.strictEqual(FileSystemUtils.directoryExists('/nonexistent/directory'), false);
            assert.strictEqual(FileSystemUtils.fileExists('/nonexistent/file.txt'), false);
        });

        test('应该能够创建目录', () => {
            const tempDir = path.join(os.tmpdir(), 'fs-utils-test-' + Date.now());
            
            try {
                // 创建目录
                const success = FileSystemUtils.createDirectory(tempDir);
                assert.strictEqual(success, true, '应该成功创建目录');
                assert.strictEqual(FileSystemUtils.directoryExists(tempDir), true, '目录应该存在');
                
                // 测试创建已存在的目录（应该仍然返回true）
                const success2 = FileSystemUtils.createDirectory(tempDir);
                assert.strictEqual(success2, true, '创建已存在的目录应该返回true');
                
            } finally {
                // 清理
                try {
                    if (fs.existsSync(tempDir)) {
                        fs.rmSync(tempDir, { recursive: true, force: true });
                    }
                } catch (error) {
                    console.warn('清理临时目录失败:', error);
                }
            }
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
