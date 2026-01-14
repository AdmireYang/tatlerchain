# apps/web/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 workspace 配置
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .env ./

# 复制各包的 package.json
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY apps/web/package.json ./apps/web/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY packages ./packages
COPY apps/web ./apps/web

# 构建 Web
RUN pnpm --filter @port/web build

# =====================
# 生产镜像
# =====================
FROM node:20-alpine AS runner

WORKDIR /app

# 复制 Nuxt 构建产物
COPY --from=builder /app/apps/web/.output ./.output

# 设置环境变量
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3003

EXPOSE 3003

CMD ["node", ".output/server/index.mjs"]

