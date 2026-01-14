# 部署方案（阿里云 2核2G）

## 🚀 快速开始（无域名版）

服务器公网 IP：`8.153.15.139`

```bash
# 1. 登录服务器
ssh root@8.153.15.139

# 2. 初始化服务器（首次需要）
chmod +x scripts/init-server.sh
./scripts/init-server.sh

# 3. 克隆代码
cd /var/www/tatlerchain
git clone your-repo-url .

# 4. 配置环境变量
cp scripts/env.production.template .env
vim .env
# 修改: DB_PASSWORD=你的数据库密码
# 修改: JWT_SECRET=你的JWT密钥
# API_BASE_URL 已配置为 http://8.153.15.139

# 5. 一键部署
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

**部署完成后访问：**
| 服务 | 地址 |
|------|------|
| 主站 | http://8.153.15.139 |
| 后台 | http://8.153.15.139:8080 |
| API | http://8.153.15.139/api/health |

---

## 📋 服务器配置要求

| 配置项 | 最低要求     | 推荐配置     |
| ------ | ------------ | ------------ |
| CPU    | 2核          | 2核+         |
| 内存   | 2GB          | 4GB+         |
| 硬盘   | 40GB SSD     | 50GB+ SSD    |
| 系统   | Ubuntu 22.04 | Ubuntu 22.04 |

---

## 🏗️ 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                      Nginx (反向代理)                    │
│   :80/:443 → SSL 终止 + 静态资源缓存 + Gzip 压缩         │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Web (SSR)  │      │    Admin    │      │     API     │
│  Port 3003  │      │  静态文件    │      │  Port 3001  │
│   Nuxt 3    │      │    Nginx    │      │   NestJS    │
└─────────────┘      └─────────────┘      └─────────────┘
                                                  │
                                                  ▼
                                         ┌─────────────┐
                                         │ PostgreSQL  │
                                         │  Port 5432  │
                                         └─────────────┘
```

---

## 🚀 一键部署脚本

### 1. 服务器初始化脚本

```bash
#!/bin/bash
# init-server.sh - 在新服务器上运行

# 更新系统
apt update && apt upgrade -y

# 安装必要软件
apt install -y curl git nginx certbot python3-certbot-nginx

# 安装 Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 创建应用目录
mkdir -p /var/www/tatlerchain
mkdir -p /var/log/tatlerchain

echo "✅ 服务器初始化完成！"
```

---

## 📦 Docker Compose 生产配置

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # PostgreSQL 数据库
  postgres:
    image: postgres:15-alpine
    container_name: tatlerchain-postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER:-tatlerchain}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME:-tatlerchain}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    # 内存限制（2G 服务器优化）
    deploy:
      resources:
        limits:
          memory: 512M

  # NestJS API 服务
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    container_name: tatlerchain-api
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}?schema=public
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-7d}
      API_BASE_URL: ${API_BASE_URL}
    ports:
      - '3001:3001'
    depends_on:
      - postgres
    networks:
      - app-network
    deploy:
      resources:
        limits:
          memory: 384M

  # Nuxt Web 服务
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: tatlerchain-web
    restart: always
    environment:
      NODE_ENV: production
      NUXT_PUBLIC_API_BASE: ${API_BASE_URL}
    ports:
      - '3003:3003'
    depends_on:
      - api
    networks:
      - app-network
    deploy:
      resources:
        limits:
          memory: 384M

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

---

## 🐳 Dockerfile 配置

### API Dockerfile

```dockerfile
# apps/api/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
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

# 构建
RUN pnpm --filter @port/api build

# 生产镜像
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./

# 创建上传目录
RUN mkdir -p uploads

EXPOSE 3001
CMD ["node", "dist/main.js"]
```

### Web Dockerfile

```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY apps/web/package.json ./apps/web/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY packages ./packages
COPY apps/web ./apps/web

# 构建
RUN pnpm --filter @port/web build

# 生产镜像
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/web/.output ./.output

EXPOSE 3003
CMD ["node", ".output/server/index.mjs"]
```

---

## 🔧 Nginx 配置

```nginx
# /etc/nginx/sites-available/tatlerchain

# API 服务
upstream api_backend {
    server 127.0.0.1:3001;
    keepalive 32;
}

# Web 服务
upstream web_backend {
    server 127.0.0.1:3003;
    keepalive 32;
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com admin.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# 主站 (Web)
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;

    # API 代理
    location /api/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 上传文件访问
    location /uploads/ {
        alias /var/www/tatlerchain/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Web 代理
    location / {
        proxy_pass http://web_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Admin 后台
server {
    listen 443 ssl http2;
    server_name admin.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    root /var/www/tatlerchain/admin;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API 代理
    location /api/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📜 部署脚本

```bash
#!/bin/bash
# deploy.sh - 部署脚本

set -e

APP_DIR="/var/www/tatlerchain"
REPO_URL="your-git-repo-url"
BRANCH="main"

echo "🚀 开始部署..."

# 进入应用目录
cd $APP_DIR

# 拉取最新代码
if [ -d ".git" ]; then
    git pull origin $BRANCH
else
    git clone $REPO_URL .
    git checkout $BRANCH
fi

# 加载环境变量
source .env

# 构建并启动服务
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# 等待服务启动
sleep 10

# 运行数据库迁移
docker-compose -f docker-compose.prod.yml exec -T api npx prisma migrate deploy

# 构建 Admin 静态文件
pnpm install
pnpm --filter @port/admin build
cp -r apps/admin/dist/* /var/www/tatlerchain/admin/

# 重启 Nginx
nginx -t && systemctl reload nginx

echo "✅ 部署完成！"
```

---

## 🔐 生产环境变量

```bash
# /var/www/tatlerchain/.env

# 数据库
DB_USER=tatlerchain
DB_PASSWORD=your-strong-password-here
DB_NAME=tatlerchain
DATABASE_URL="postgresql://tatlerchain:your-strong-password-here@postgres:5432/tatlerchain?schema=public"

# API
API_PORT=3001
API_BASE_URL=https://your-domain.com

# Web
WEB_PORT=3003

# JWT（使用强密码）
JWT_SECRET=your-very-long-and-secure-jwt-secret-key-at-least-32-characters
JWT_EXPIRES_IN=7d

# 上传
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760
```

---

## 📊 内存优化（2G 服务器）

| 服务         | 内存限制   | 说明        |
| ------------ | ---------- | ----------- |
| PostgreSQL   | 512MB      | 数据库      |
| API (NestJS) | 384MB      | 后端服务    |
| Web (Nuxt)   | 384MB      | 前端 SSR    |
| Nginx        | 64MB       | 反向代理    |
| 系统预留     | 704MB      | 系统 + 缓冲 |
| **总计**     | **2048MB** | 2G          |

### Swap 配置（推荐）

```bash
# 创建 2G Swap
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# 永久生效
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## 🔒 SSL 证书申请

```bash
# 申请 Let's Encrypt 证书
certbot --nginx -d your-domain.com -d www.your-domain.com -d admin.your-domain.com

# 自动续期（已自动配置）
certbot renew --dry-run
```

---

## 📋 部署检查清单

- [ ] 服务器初始化完成
- [ ] Docker 和 Docker Compose 安装
- [ ] 代码部署到 `/var/www/tatlerchain`
- [ ] `.env` 环境变量配置
- [ ] PostgreSQL 容器启动
- [ ] API 服务启动并可访问
- [ ] Web 服务启动并可访问
- [ ] Admin 静态文件部署
- [ ] Nginx 配置完成
- [ ] SSL 证书申请成功
- [ ] 防火墙配置（开放 80, 443）
- [ ] Swap 配置完成

---

## 🔄 常用运维命令

```bash
# 查看服务状态
docker-compose -f docker-compose.prod.yml ps

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f web

# 重启服务
docker-compose -f docker-compose.prod.yml restart api

# 进入容器
docker-compose -f docker-compose.prod.yml exec api sh

# 数据库备份
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U tatlerchain tatlerchain > backup.sql

# 数据库恢复
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U tatlerchain tatlerchain < backup.sql
```

---

## 💰 费用估算

| 项目         | 费用（月）           |
| ------------ | -------------------- |
| 阿里云 2核2G | ¥50-100              |
| 域名         | ¥5-10                |
| SSL 证书     | 免费 (Let's Encrypt) |
| **总计**     | **¥55-110/月**       |
