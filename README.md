# Port Magazine

基于 Monorepo 架构的内容管理系统，包含前台展示和后台管理功能。

## 📦 项目结构

```
port/
├── apps/
│   ├── web/              # 前台应用 (Nuxt 3)
│   ├── admin/            # 后台管理应用 (Vue 3 + Vite)
│   └── api/              # 后端 API 服务 (Nest.js)
├── packages/
│   ├── ui/               # 共享 Vue 组件库
│   ├── utils/            # 共享工具函数
│   ├── types/            # 共享 TypeScript 类型定义
│   ├── config/           # 共享配置
│   └── database/         # 数据库模型和迁移
└── prd/                  # 产品需求文档
```

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 15
- Redis (可选)

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
# 启动所有应用
pnpm dev

# 或分别启动
pnpm web:dev      # 前台应用
pnpm admin:dev    # 后台管理
pnpm api:dev      # API 服务
```

### 构建生产版本

```bash
pnpm build
```

## 📚 文档

- [需求文档](./prd/需求文档.md)
- [设计方案](./prd/设计方案.md)
- [本地环境安装清单](./prd/本地环境安装清单.md)
- [开发流程](./prd/开发流程.md)

## 🛠️ 技术栈

### 前端
- Vue 3 + TypeScript
- Nuxt 3 (前台 SSR)
- Vite (后台 SPA)
- Tailwind CSS
- Pinia (状态管理)
- Element Plus / Naive UI

### 后端
- Nest.js + TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT 认证

### DevOps
- pnpm workspace
- Turbo (构建优化)
- Docker + Docker Compose
- ESLint + Prettier

## 📝 开发规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 规范
- Git commit 遵循 Conventional Commits
- 代码审查后合并到主分支

## 📄 License

MIT
