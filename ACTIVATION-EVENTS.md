# 插件激活事件说明

## 当前配置

插件使用 `onStartupFinished` 激活事件，这意味着：

- 插件会在 VS Code 完全启动后激活
- 不会影响 VS Code 的启动性能
- 当用户需要使用模板功能时，插件已经准备就绪

## 激活事件变更历史

### 原始配置
```json
"activationEvents": [
  "*"
]
```
**问题**: 插件在 VS Code 启动时立即激活，可能影响启动性能。

### 当前配置  
```json
"activationEvents": [
  "onStartupFinished"
]
```
**优势**: 
- 延迟激活，等待 VS Code 完全启动
- 性能友好，不影响启动速度
- 用户体验更好

## 其他可选的激活事件

如果需要进一步优化，可以考虑以下激活事件：

1. **命令激活** (自动生成)
   - VS Code 会自动为 package.json 中定义的命令生成激活事件
   - 当用户首次调用插件命令时才激活

2. **工作区激活**
   ```json
   "activationEvents": [
     "workspaceContains:**/.vscode/settings.json"
   ]
   ```
   - 当工作区包含特定文件时激活

3. **语言激活**
   ```json
   "activationEvents": [
     "onLanguage:javascript",
     "onLanguage:typescript"
   ]
   ```
   - 当打开特定语言文件时激活

## 推荐配置

对于文件模板插件，当前的 `onStartupFinished` 配置是最佳选择，因为：

1. 插件提供全局功能（状态栏按钮）
2. 需要在启动时检查模板路径配置
3. 用户可能随时需要访问模板功能
4. 不会显著影响启动性能
