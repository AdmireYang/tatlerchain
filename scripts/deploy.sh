#!/bin/bash
# deploy.sh - 生产环境部署脚本
# 使用方法: ./scripts/deploy.sh

set -e

APP_DIR="/var/www/tatlerchain"
ADMIN_DIR="/var/www/tatlerchain-admin"
CURRENT_DIR=$(pwd)

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查环境变量
check_env() {
    log_info "检查环境变量..."
    
    if [ ! -f ".env" ]; then
        log_error ".env 文件不存在，请先创建环境变量文件"
        exit 1
    fi
    
    source .env
    
    if [ -z "$DB_PASSWORD" ]; then
        log_error "DB_PASSWORD 未设置"
        exit 1
    fi
    
    if [ -z "$JWT_SECRET" ]; then
        log_error "JWT_SECRET 未设置"
        exit 1
    fi
    
    log_info "环境变量检查通过 ✓"
}

# 停止旧服务
stop_services() {
    log_info "停止旧服务..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
}

# 构建 Docker 镜像
build_images() {
    log_info "构建 Docker 镜像..."
    docker-compose -f docker-compose.prod.yml build --no-cache
}

# 启动服务
start_services() {
    log_info "启动服务..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 15
}

# 数据库迁移
run_migrations() {
    log_info "执行数据库迁移..."
    docker-compose -f docker-compose.prod.yml exec -T api sh -c "npx prisma migrate deploy" || {
        log_warn "迁移失败，尝试使用 db push..."
        docker-compose -f docker-compose.prod.yml exec -T api sh -c "npx prisma db push"
    }
}

# 构建 Admin 静态文件
build_admin() {
    log_info "构建 Admin 后台..."
    
    # 安装依赖
    pnpm install
    
    # 构建 Admin
    pnpm --filter @port/admin build
    
    # 复制到 Nginx 目录
    mkdir -p $ADMIN_DIR
    cp -r apps/admin/dist/* $ADMIN_DIR/
    
    log_info "Admin 构建完成 ✓"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # 检查 API
    if curl -sf http://localhost:3001/api/health > /dev/null; then
        log_info "API 服务正常 ✓"
    else
        log_error "API 服务异常"
        docker-compose -f docker-compose.prod.yml logs api
        exit 1
    fi
    
    # 检查 Web
    if curl -sf http://localhost:3003 > /dev/null; then
        log_info "Web 服务正常 ✓"
    else
        log_error "Web 服务异常"
        docker-compose -f docker-compose.prod.yml logs web
        exit 1
    fi
}

# 配置 Nginx（无域名版本）
setup_nginx() {
    log_info "配置 Nginx..."
    
    # 检查是否已配置
    if [ -f /etc/nginx/sites-enabled/tatlerchain ]; then
        log_warn "Nginx 已配置，跳过"
        return
    fi
    
    # 复制无域名配置
    cp scripts/nginx/tatlerchain-ip.conf /etc/nginx/sites-available/tatlerchain
    
    # 删除默认配置
    rm -f /etc/nginx/sites-enabled/default
    
    # 启用配置
    ln -sf /etc/nginx/sites-available/tatlerchain /etc/nginx/sites-enabled/
    
    log_info "Nginx 配置完成 ✓"
}

# 重启 Nginx
reload_nginx() {
    log_info "重新加载 Nginx 配置..."
    if nginx -t; then
        systemctl reload nginx
        log_info "Nginx 重启成功 ✓"
    else
        log_error "Nginx 配置测试失败"
    fi
}

# 清理
cleanup() {
    log_info "清理旧镜像..."
    docker image prune -f
}

# 主流程
main() {
    echo "======================================"
    echo "       TatlerChain 部署脚本          "
    echo "======================================"
    echo ""
    
    check_env
    stop_services
    build_images
    start_services
    run_migrations
    build_admin
    health_check
    setup_nginx
    reload_nginx
    cleanup
    
    # 获取服务器 IP
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "服务器IP")
    
    echo ""
    echo "======================================"
    log_info "🎉 部署完成！"
    echo "======================================"
    echo ""
    echo "访问地址:"
    echo "  - 主站: http://$SERVER_IP"
    echo "  - 后台: http://$SERVER_IP:8080"
    echo "  - API:  http://$SERVER_IP/api/health"
    echo ""
    echo "服务状态:"
    docker-compose -f docker-compose.prod.yml ps
}

# 执行主流程
main "$@"

