# apps/api/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# 配置 npm 镜像源（国内加速）
RUN npm config set registry https://registry.npmmirror.com

# 安装 pnpm 并配置镜像源
RUN npm install -g pnpm && \
    pnpm config set registry https://registry.npmmirror.com

# 复制 workspace 配置
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 配置 pnpm 使用 hoisted 模式（Docker 中避免符号链接问题）
RUN echo "shamefully-hoist=true" > .npmrc && \
    echo "node-linker=hoisted" >> .npmrc

# 复制各包的 package.json
COPY packages/config/package.json ./packages/config/
COPY packages/database/package.json ./packages/database/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY apps/api/package.json ./apps/api/

# 复制 Prisma schema（生成 client 需要）
COPY packages/database/prisma ./packages/database/prisma

# 安装依赖（不使用 frozen-lockfile，因为 Docker 中使用不同的 node-linker）
RUN pnpm install

# 生成 Prisma Client
RUN cd packages/database && npx prisma generate

# 复制源码
COPY packages ./packages
COPY apps/api ./apps/api

# 注意：不复制 .env 文件，生产环境通过 docker-compose 传入环境变量

# 构建 API（Webpack 会打包除 Prisma 外的所有依赖）
RUN pnpm --filter @port/api build

# =====================
# 生产镜像（使用 Debian slim，Prisma 兼容性更好）
# =====================
FROM node:20-slim AS runner

WORKDIR /app

# 安装 OpenSSL 和其他必要依赖（Prisma 需要，wget 用于健康检查）
RUN apt-get update && \
    apt-get install -y openssl ca-certificates wget && \
    rm -rf /var/lib/apt/lists/*

# 配置 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com

# 复制构建产物
COPY --from=builder /app/apps/api/dist ./dist

# 复制 Prisma schema
COPY --from=builder /app/packages/database/prisma ./prisma

# 只安装 Prisma（唯一无法被 Webpack 打包的依赖）
# 锁定版本为 5.x，Prisma 7 有破坏性变更
RUN npm init -y && \
    npm install prisma@^5.8.0 @prisma/client@^5.8.0

# 生成 Prisma Client
RUN ./node_modules/.bin/prisma generate --schema=./prisma/schema/

# 创建上传目录
RUN mkdir -p uploads

# 设置环境变量
ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main.js"]
