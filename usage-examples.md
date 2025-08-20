# 功能演示说明

本文档演示VS Code文件模板插件的各项功能。

## 1. 智能模板筛选功能

### 场景描述
当你在编辑一个TypeScript文件（如`Component.tsx`）时，想要插入相关的模板代码片段。

### 操作步骤
1. 打开一个`.ts`或`.tsx`文件
2. 将光标定位到要插入模板的位置
3. 右键点击，选择"插入模板"
4. 在弹出的选择框中，会自动填入`ts`作为筛选条件
5. 此时所有包含"ts"的模板类型会被优先显示
6. 按回车确认选择，或者清除筛选条件重新选择

### 效果展示
```
当前文件: Component.tsx
筛选框自动填入: ts
匹配的模板类型: typescript/, react-ts/, vue-ts/
```

## 2. 递归导入保留结构功能

### 场景描述
你有一个完整的React组件模板，包含组件文件、测试文件、样式文件和子组件，希望导入到项目中并保持原有的目录结构。

### 模板目录结构示例
```
templates/import/react-component/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── index.ts
│   └── Modal/
│       ├── Modal.tsx
│       ├── Modal.module.css
│       └── index.ts
├── hooks/
│   ├── useToggle.ts
│   └── useLocalStorage.ts
├── types/
│   └── component.types.ts
├── Component.tsx
├── Component.test.tsx
├── Component.module.css
└── index.ts
```

### 操作步骤
1. 在VS Code资源管理器中，右键点击目标目录（如`src/components/UserProfile/`）
2. 选择"导入模板"
3. 从列表中选择`react-component`
4. 确认导入

### 导入后的结果
```
src/components/UserProfile/
├── components/              # 完整保留子目录结构
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── index.ts
│   └── Modal/
│       ├── Modal.tsx
│       ├── Modal.module.css
│       └── index.ts
├── hooks/                   # 完整保留子目录结构
│   ├── useToggle.ts
│   └── useLocalStorage.ts
├── types/                   # 完整保留子目录结构
│   └── component.types.ts
├── Component.tsx            # 根级文件直接复制
├── Component.test.tsx
├── Component.module.css
└── index.ts
```

**注意**: 只有`react-component`目录内部的内容被复制，`react-component`目录本身不会被创建。

## 3. 新建文件功能

### 场景描述
基于预定义的模板创建新文件，如创建一个新的React组件。

### 操作步骤
1. 在资源管理器中右键点击目标目录
2. 选择"从模板新建文件"
3. 选择模板文件（如`component.tsx`）
4. 输入新文件名（如`UserCard`）
5. 新文件`UserCard.tsx`将被创建并自动打开

## 4. 插件配置和管理

### 初始配置
1. 点击状态栏的"模板"按钮
2. 选择"配置模板路径"
3. 设置模板目录的绝对路径

### 模板管理
1. 点击状态栏的"模板"按钮
2. 选择"管理模板"
3. 将在新窗口中打开模板目录，可以直接编辑模板文件

## 5. 使用技巧

### 模板变量
在模板文件中使用占位符，方便快速修改：
```typescript
interface ${1:InterfaceName} {
    ${2:property}: ${3:type};
}

const ${4:componentName}: React.FC = () => {
    return <div>${5:content}</div>;
};
```

### 目录命名建议
- `insert/typescript/`: TypeScript代码片段
- `insert/javascript/`: JavaScript代码片段  
- `insert/react/`: React相关模板
- `import/full-component/`: 完整组件模板
- `import/page-template/`: 页面模板
- `new/`: 各种文件类型的基础模板

### 最佳实践
1. 按技术栈和用途分类组织模板
2. 在模板中添加注释说明使用方法
3. 定期更新模板以适应项目需求
4. 使用有意义的文件和目录名称

## 6. 保存为模板功能

### 场景描述
在编码过程中，你写了一段有用的代码片段，希望保存为模板以便将来重复使用。

### 操作步骤

#### 保存TypeScript接口模板
1. 在TypeScript文件中编写一个接口：
```typescript
interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}
```

2. 选中这段代码
3. 右键选择"保存为模板"
4. 在弹出的目录选择框中，会自动填入`ts`作为筛选条件
5. 选择或确认`typescript`目录
6. 输入文件名，如`user-interface`
7. 模板被保存为`templates/insert/typescript/user-interface.ts`

#### 保存React组件模板
1. 编写一个常用的React组件结构：
```tsx
import React, { useState } from 'react';
import styles from './Component.module.css';

interface ComponentProps {
    title: string;
    onAction?: () => void;
}

const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
    const [isActive, setIsActive] = useState(false);

    const handleClick = () => {
        setIsActive(!isActive);
        onAction?.();
    };

    return (
        <div className={styles.container}>
            <h3>{title}</h3>
            <button onClick={handleClick}>
                {isActive ? 'Active' : 'Inactive'}
            </button>
        </div>
    );
};

export default Component;
```

2. 选中代码并保存为模板
3. 系统会自动匹配`.tsx`文件类型
4. 可以选择`react`或`typescript`目录
5. 输入文件名如`functional-component`

### 智能功能展示

**自动扩展名匹配**:
- 在`.js`文件中保存 → 自动填入`js`筛选条件
- 在`.vue`文件中保存 → 自动填入`vue`筛选条件  
- 在`.py`文件中保存 → 自动填入`py`筛选条件

**智能目录推荐**:
- 如果insert目录下有`javascript`、`react-js`等包含`js`的目录，会优先显示
- 支持模糊匹配，`ts`可以匹配`typescript`、`react-ts`等

**文件名自动扩展名**:
- 保存的模板文件会自动使用当前编辑文件的扩展名
- 在`.ts`文件中保存模板 → 生成`.ts`模板文件
- 在`.lua`文件中保存模板 → 生成`.lua`模板文件
