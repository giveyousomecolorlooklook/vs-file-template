# 模板目录结构示例

为了帮助用户理解如何组织模板文件，这里提供一个示例模板目录结构。

## 目录结构

```
templates/                    # 主模板目录
├── import/                   # 用于批量导入的模板目录
│   ├── react-component/      # React组件模板
│   │   ├── Component.tsx
│   │   ├── Component.test.tsx
│   │   ├── Component.module.css
│   │   └── index.ts
│   ├── vue-component/        # Vue组件模板
│   │   ├── Component.vue
│   │   ├── Component.spec.ts
│   │   └── index.ts
│   └── express-route/        # Express路由模板
│       ├── controller.ts
│       ├── service.ts
│       ├── model.ts
│       └── routes.ts
├── insert/                   # 用于插入的模板片段
│   ├── javascript/           # JavaScript代码片段
│   │   ├── function.js       # 函数模板
│   │   ├── class.js          # 类模板
│   │   ├── async-function.js # 异步函数模板
│   │   └── promise.js        # Promise模板
│   ├── typescript/           # TypeScript代码片段
│   │   ├── interface.ts      # 接口模板
│   │   ├── type.ts           # 类型别名模板
│   │   ├── enum.ts           # 枚举模板
│   │   └── generic.ts        # 泛型模板
│   ├── html/                 # HTML代码片段
│   │   ├── basic-page.html   # 基础页面模板
│   │   ├── form.html         # 表单模板
│   │   └── table.html        # 表格模板
│   ├── css/                  # CSS代码片段
│   │   ├── flexbox.css       # Flexbox布局
│   │   ├── grid.css          # Grid布局
│   │   └── animation.css     # 动画模板
│   └── config/               # 配置文件片段
│       ├── package.json      # package.json模板
│       ├── tsconfig.json     # TypeScript配置
│       ├── webpack.config.js # Webpack配置
│       └── .eslintrc.json    # ESLint配置
└── new/                      # 用于创建新文件的模板
    ├── component.tsx         # React组件文件模板
    ├── service.ts            # 服务类模板
    ├── model.ts              # 数据模型模板
    ├── controller.ts         # 控制器模板
    ├── test.spec.ts          # 测试文件模板
    ├── readme.md             # README文件模板
    ├── dockerfile            # Dockerfile模板
    ├── gitignore.txt         # .gitignore模板
    └── license.txt           # 许可证文件模板
```

## 模板文件示例

### insert/typescript/interface.ts
```typescript
interface ${1:InterfaceName} {
    ${2:property}: ${3:type};
    
    ${4:method}(${5:params}): ${6:returnType};
}
```

### insert/javascript/function.js
```javascript
function ${1:functionName}(${2:parameters}) {
    ${3:// 函数体}
    return ${4:result};
}
```

### new/component.tsx
```tsx
import React from 'react';
import styles from './Component.module.css';

interface ComponentProps {
    // 定义组件属性
}

const Component: React.FC<ComponentProps> = (props) => {
    return (
        <div className={styles.container}>
            {/* 组件内容 */}
        </div>
    );
};

export default Component;
```

### import/react-component/Component.tsx
```tsx
import React, { useState, useEffect } from 'react';
import styles from './Component.module.css';

interface ComponentProps {
    title: string;
    onAction?: () => void;
}

const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
    const [state, setState] = useState(false);

    useEffect(() => {
        // 组件挂载时的副作用
    }, []);

    const handleClick = () => {
        setState(!state);
        onAction?.();
    };

    return (
        <div className={styles.container}>
            <h2>{title}</h2>
            <button onClick={handleClick}>
                {state ? '激活' : '未激活'}
            </button>
        </div>
    );
};

export default Component;
```

## 导入功能说明

当使用**导入模板**功能时，系统会递归复制选中模板目录的所有内容到目标位置，并**保留内部目录结构**。

### 导入示例

假设你选择导入 `react-component` 模板到项目的 `src/components/UserProfile/` 目录：

**源目录结构** (`templates/import/react-component/`):
```
react-component/
├── components/
│   ├── UserCard.tsx
│   └── UserList.tsx
├── hooks/
│   └── useUser.ts
├── types/
│   └── user.types.ts
├── Component.tsx
├── Component.test.tsx
├── Component.module.css
└── index.ts
```

**导入后的目标目录结构** (`src/components/UserProfile/`):
```
UserProfile/
├── components/          # 保留了子目录结构
│   ├── UserCard.tsx
│   └── UserList.tsx
├── hooks/               # 保留了子目录结构
│   └── useUser.ts
├── types/               # 保留了子目录结构
│   └── user.types.ts
├── Component.tsx        # 根级文件直接复制
├── Component.test.tsx
├── Component.module.css
└── index.ts
```

**注意**: 只有 `react-component` 目录内部的内容被复制，`react-component` 目录本身不会被创建。

## 使用建议

1. **模板变量**: 在模板中使用 `${n:placeholder}` 格式的占位符，方便快速替换
2. **文件命名**: 使用有意义的文件名，便于识别模板用途
3. **目录分类**: 按照技术栈、用途或项目类型分类组织模板
4. **目录结构**: 在 `import` 模板中合理组织子目录，导入时会完整保留这些结构
5. **注释说明**: 在模板中添加适当的注释，说明使用方法和注意事项
6. **定期更新**: 根据项目需求和技术发展，定期更新和维护模板文件

## 配置步骤

1. 创建模板目录（如: `C:\templates` 或 `/home/user/templates`）
2. 按照上述结构创建子目录和模板文件
3. 在 VS Code 中配置模板路径：设置 → 搜索 "vs-file-template" → 设置模板路径
4. 开始使用模板功能
