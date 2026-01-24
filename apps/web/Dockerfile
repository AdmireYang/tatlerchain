# apps/web/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# 配置 Alpine 国内镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 配置 npm 镜像源（国内加速）
RUN npm config set registry https://registry.npmmirror.com

# 安装 pnpm 并配置镜像源
RUN npm install -g pnpm && \
    pnpm config set registry https://registry.npmmirror.com

# 复制 workspace 配置
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 构建参数：API 地址
ARG API_BASE_URL=http://localhost:3001

# 创建 .env 文件供构建时使用
RUN echo "API_BASE_URL=${API_BASE_URL}" > .env

# 配置 pnpm 使用 hoisted 模式（Docker 中避免符号链接问题）
RUN echo "shamefully-hoist=true" > .npmrc && \
    echo "node-linker=hoisted" >> .npmrc

# 复制各包的 package.json
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY apps/web/package.json ./apps/web/

# 安装依赖（利用 Docker 缓存，依赖不变时不会重新安装）
RUN pnpm install

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

# 配置 Alpine 国内镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装 wget（健康检查需要）
RUN apk add --no-cache wget

# 复制 Nuxt 构建产物
COPY --from=builder /app/apps/web/.output ./.output

# 设置环境变量
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3003

EXPOSE 3003

CMD ["node", ".output/server/index.mjs"]
