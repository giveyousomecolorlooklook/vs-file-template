import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 文件系统工具类 - 处理文件和目录操作
 */
export class FileSystemUtils {
    /**
     * 检查目录是否存在
     */
    public static directoryExists(dirPath: string): boolean {
        try {
            const stat = fs.statSync(dirPath);
            return stat.isDirectory();
        } catch {
            return false;
        }
    }

    /**
     * 检查文件是否存在
     */
    public static fileExists(filePath: string): boolean {
        try {
            const stat = fs.statSync(filePath);
            return stat.isFile();
        } catch {
            return false;
        }
    }

    /**
     * 读取目录下的所有子目录
     */
    public static getSubDirectories(dirPath: string): string[] {
        if (!this.directoryExists(dirPath)) {
            return [];
        }

        try {
            return fs.readdirSync(dirPath)
                .filter(item => {
                    const fullPath = path.join(dirPath, item);
                    return this.directoryExists(fullPath);
                });
        } catch {
            return [];
        }
    }

    /**
     * 读取目录下的所有文件
     */
    public static getFiles(dirPath: string): string[] {
        if (!this.directoryExists(dirPath)) {
            return [];
        }

        try {
            return fs.readdirSync(dirPath)
                .filter(item => {
                    const fullPath = path.join(dirPath, item);
                    return this.fileExists(fullPath);
                });
        } catch {
            return [];
        }
    }

    /**
     * 递归获取目录下的所有文件
     */
    public static getFilesRecursively(dirPath: string): string[] {
        if (!this.directoryExists(dirPath)) {
            return [];
        }

        const files: string[] = [];
        
        try {
            const items = fs.readdirSync(dirPath);
            
            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isFile()) {
                    files.push(fullPath);
                } else if (stat.isDirectory()) {
                    files.push(...this.getFilesRecursively(fullPath));
                }
            }
        } catch {
            // 忽略错误
        }

        return files;
    }

    /**
     * 读取文件内容
     */
    public static readFileContent(filePath: string): string | null {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch {
            return null;
        }
    }

    /**
     * 写入文件内容
     */
    public static writeFileContent(filePath: string, content: string): boolean {
        try {
            // 确保目录存在
            const dir = path.dirname(filePath);
            if (!this.directoryExists(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 复制文件
     */
    public static copyFile(sourcePath: string, targetPath: string): boolean {
        try {
            // 确保目标目录存在
            const targetDir = path.dirname(targetPath);
            if (!this.directoryExists(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            
            fs.copyFileSync(sourcePath, targetPath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 递归复制目录下的所有文件（不包含目录结构）
     */
    public static copyFilesRecursively(sourceDir: string, targetDir: string): boolean {
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
        } catch {
            return false;
        }
    }

    /**
     * 获取文件或目录的父目录
     */
    public static getParentDirectory(filePath: string): string {
        return path.dirname(filePath);
    }

    /**
     * 从URI获取文件系统路径
     */
    public static getPathFromUri(uri: vscode.Uri): string {
        return uri.fsPath;
    }
}
