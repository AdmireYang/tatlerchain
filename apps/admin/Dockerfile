# Admin 多阶段构建
# 阶段1: 构建
FROM node:20-alpine AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 复制 workspace 配置
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/admin ./apps/admin

# 安装依赖（利用 Docker 缓存）
RUN pnpm install --frozen-lockfile

# 构建 Admin
WORKDIR /app/apps/admin
RUN pnpm build

# 阶段2: 运行（使用 Nginx）
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

# 复制 Nginx 配置模板
COPY apps/admin/nginx.conf /etc/nginx/templates/default.conf.template

# 接收构建参数（从 docker-compose 或构建命令传递）
ARG API_PORT=3001

# 设置环境变量（使用构建参数）
ENV API_PORT=${API_PORT}

EXPOSE 80

# 使用 envsubst 处理模板并启动 nginx
CMD ["/bin/sh", "-c", "envsubst '${API_PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

