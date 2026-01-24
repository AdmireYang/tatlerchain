# apps/web/Dockerfile
# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS builder

WORKDIR /app

# 配置 npm 镜像源（国内加速）
RUN npm config set registry https://registry.npmmirror.com

# 安装 pnpm 并配置镜像源
RUN npm install -g pnpm && \
    pnpm config set registry https://registry.npmmirror.com

# 配置 pnpm 使用 hoisted 模式
RUN echo "shamefully-hoist=true" > .npmrc && \
    echo "node-linker=hoisted" >> .npmrc

# 构建参数：API 地址
ARG API_BASE_URL=http://localhost:3001
RUN echo "API_BASE_URL=${API_BASE_URL}" > .env

# 复制 workspace 配置和所有 package.json（用于依赖缓存判断）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY apps/web/package.json ./apps/web/

# 复制 workspace 包源码（这些包很小，很少变化）
COPY packages ./packages

# 安装依赖（使用缓存挂载加速）
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install

# 复制 web 源码（经常变化的部分）
COPY apps/web ./apps/web

# 构建 Web
RUN pnpm --filter @port/web build

# =====================
# 生产镜像
# =====================
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache wget

COPY --from=builder /app/apps/web/.output ./.output

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3003

EXPOSE 3003

CMD ["node", ".output/server/index.mjs"]
