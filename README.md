# Clothes Try-On Website

本项目是一个基于 Next.js 15 + React 19 + TypeScript 的 AI 虚拟试衣网站，采用现代前后端分层架构，代码结构清晰，易于扩展和维护。

## 技术栈
- Next.js 15 (App Router)
- React 19 (函数组件)
- TypeScript (类型安全)
- Shadcn UI + Radix UI + Tailwind CSS (现代UI)
- @fal-ai/client (AI 试衣/图片上传)

## 目录结构

```
├── app/
│   ├── api/
│   │   ├── try-on/route.ts      # 试穿API
│   │   └── upload/route.ts      # 图片上传API
│   └── page.tsx                # 主页（仅负责页面组合）
├── components/
│   └── try-on/
│       ├── try-on-form.tsx     # 上传与参数输入组件
│       ├── try-on-result.tsx   # 结果展示组件
│       └── try-on-history.tsx  # 历史记录组件
│   └── ui/                    # 基础UI组件
├── lib/
│   ├── fal-client.ts           # fal.ai 客户端初始化
│   ├── try-on-service.ts       # 试穿服务
│   ├── upload-service.ts       # 上传服务
│   ├── utils.ts                # 工具函数
│   └── types/tryon.ts          # 类型定义
├── public/                     # 静态资源
```

## 主要功能
- AI 虚拟试衣（上传人物和衣服图片，生成试穿效果）
- 历史记录本地保存
- 响应式设计，移动端友好
- 现代化 UI 体验

## 运行方式

1. 安装依赖
```bash
npm install
```
2. 配置环境变量
```
# .env.local
FAL_KEY=你的fal.ai API Key
```
3. 启动开发服务器
```bash
npm run dev
```

## 代码规范与扩展性
- 业务与UI分层，类型定义独立，易于维护
- 组件职责单一，便于复用和扩展
- 所有API Key仅在服务端使用，安全可靠
- 支持未来扩展（如多模型、多参数、更多上传类型）

## 贡献
欢迎 PR 和 issue！

## 许可证
MIT 