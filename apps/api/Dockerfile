# apps/api/Dockerfile
# 使用阿里云镜像源
FROM registry.cn-hangzhou.aliyuncs.com/library/node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 workspace 配置
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .env ./

# 复制各包的 package.json
COPY packages/config/package.json ./packages/config/
COPY packages/database/package.json ./packages/database/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY apps/api/package.json ./apps/api/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY packages ./packages
COPY apps/api ./apps/api

# 生成 Prisma Client
RUN pnpm --filter @port/database db:generate

# 构建 API
RUN pnpm --filter @port/api build

# =====================
# 生产镜像
# =====================
FROM registry.cn-hangzhou.aliyuncs.com/library/node:20-alpine AS runner

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/apps/api/package.json ./

# 创建上传目录
RUN mkdir -p uploads

# 设置环境变量
ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main.js"]

