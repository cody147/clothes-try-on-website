# Clothes Try-On Website

这是一个基于 Next.js 15 构建的虚拟试衣网站，使用最新的 React 19 和 TypeScript 开发。该项目采用了现代化的技术栈和最佳实践，提供了一个流畅的用户体验。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI 库**: 
  - Shadcn UI
  - Radix UI
  - Tailwind CSS
- **状态管理**: React Hooks
- **表单处理**: React Hook Form + Zod
- **样式**: Tailwind CSS
- **动画**: tailwindcss-animate
- **主题**: next-themes
- **AI 集成**: @fal-ai/serverless-client

## 项目结构

```
├── app/                    # Next.js App Router 目录
│   ├── api/               # API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页
├── components/            # React 组件
│   ├── ui/               # UI 组件
│   └── theme-provider.tsx # 主题提供者
├── hooks/                # 自定义 React Hooks
├── lib/                  # 工具函数和配置
├── public/              # 静态资源
└── styles/              # 样式文件
```

## 主要功能

1. **虚拟试衣**: 使用 AI 技术实现虚拟试衣功能
2. **响应式设计**: 采用移动优先的设计理念
3. **主题支持**: 支持亮色/暗色主题切换
4. **现代化 UI**: 使用 Shadcn UI 和 Radix UI 组件
5. **性能优化**: 
   - 使用 React Server Components
   - 图片优化
   - 动态加载

## 开发指南

### 环境要求

- Node.js 18+
- npm 包管理器

### 安装依赖

```bash
# 首次安装
npm install

# 如果遇到依赖问题，可以尝试清理后重新安装
npm run install:clean
```

### 开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm run start
```

## 代码规范

- 使用 TypeScript 进行类型检查
- 遵循函数式编程范式
- 使用 React Server Components 优化性能
- 采用移动优先的响应式设计
- 使用 Tailwind CSS 进行样式管理

## 性能优化

- 最小化客户端组件使用
- 实现图片懒加载
- 使用 Suspense 进行代码分割
- 优化 Web Vitals 指标

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT 