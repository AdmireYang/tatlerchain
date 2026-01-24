# apps/api/Dockerfile
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

# 复制 workspace 配置和所有 package.json（用于依赖缓存判断）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/config/package.json ./packages/config/
COPY packages/database/package.json ./packages/database/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY apps/api/package.json ./apps/api/

# 复制 workspace 包源码（这些包很小，很少变化）
COPY packages ./packages

# 安装依赖（使用缓存挂载加速）
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install

# 生成 Prisma Client
RUN cd packages/database && npx prisma generate

# 复制 api 源码（经常变化的部分）
COPY apps/api ./apps/api

# 构建 API
RUN pnpm --filter @port/api build

# =====================
# 生产镜像
# =====================
FROM node:20-slim AS runner

WORKDIR /app

RUN apt-get update && \
    apt-get install -y openssl ca-certificates wget && \
    rm -rf /var/lib/apt/lists/*

RUN npm config set registry https://registry.npmmirror.com

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/packages/database/prisma ./prisma

RUN npm init -y && \
    npm install prisma@^5.8.0 @prisma/client@^5.8.0

RUN ./node_modules/.bin/prisma generate --schema=./prisma/schema/

RUN mkdir -p uploads

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main.js"]
