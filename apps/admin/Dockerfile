# apps/admin/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# 配置 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com

# 安装 pnpm
RUN npm install -g pnpm && \
    pnpm config set registry https://registry.npmmirror.com

# 配置 pnpm
RUN echo "shamefully-hoist=true" > .npmrc && \
    echo "node-linker=hoisted" >> .npmrc

# 构建参数
ARG API_PORT=3001

# 复制 workspace 配置
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/ui/package.json ./packages/ui/
COPY apps/admin/package.json ./apps/admin/

# 复制源码
COPY packages ./packages
COPY apps/admin ./apps/admin

# 安装依赖
RUN pnpm install

# 构建 Admin
RUN pnpm --filter @port/admin build

# =====================
# 生产镜像（Nginx）
# =====================
FROM nginx:alpine

ARG API_PORT=3001

# 复制构建产物
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY apps/admin/nginx.conf /etc/nginx/templates/default.conf.template

ENV API_PORT=${API_PORT}

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '${API_PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
