#!/bin/bash
# ============================================
# TatlerChain 一键部署脚本
# ============================================
# 使用方法:
#   首次部署: ./deploy.sh init
#   更新部署: ./deploy.sh update
#   查看状态: ./deploy.sh status
#   查看日志: ./deploy.sh logs
#   重启服务: ./deploy.sh restart
#   停止服务: ./deploy.sh stop
#   帮助信息: ./deploy.sh help
# ============================================

set -e

# ============================================
# 配置区域（根据实际情况修改）
# ============================================
SERVER_IP="8.153.15.139"
GIT_REPO="git@github.com:AdmireYang/tatlerchain.git"
APP_DIR="/var/www/tatlerchain"
ADMIN_DIR="/var/www/tatlerchain-admin"

# ============================================
# 颜色输出
# ============================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

# ============================================
# 检查是否为 root 用户
# ============================================
check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "请使用 root 用户运行此脚本"
        log_info "使用: sudo ./deploy.sh $1"
        exit 1
    fi
}

# ============================================
# 安装基础软件
# ============================================
install_base() {
    log_step "安装基础软件..."
    apt update
    apt install -y curl wget git vim htop unzip build-essential
    log_info "基础软件安装完成 ✓"
}

# ============================================
# 安装 Docker
# ============================================
install_docker() {
    log_step "安装 Docker..."
    if command -v docker &> /dev/null; then
        log_warn "Docker 已安装，跳过"
        return
    fi
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    log_info "Docker 安装完成 ✓"
}

# ============================================
# 安装 Docker Compose
# ============================================
install_docker_compose() {
    log_step "安装 Docker Compose..."
    if command -v docker-compose &> /dev/null; then
        log_warn "Docker Compose 已安装，跳过"
        return
    fi
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log_info "Docker Compose 安装完成 ✓"
}

# ============================================
# 安装 Nginx
# ============================================
install_nginx() {
    log_step "安装 Nginx..."
    if command -v nginx &> /dev/null; then
        log_warn "Nginx 已安装，跳过"
        return
    fi
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    log_info "Nginx 安装完成 ✓"
}

# ============================================
# 安装 Node.js 和 pnpm
# ============================================
install_node() {
    log_step "安装 Node.js..."
    if command -v node &> /dev/null; then
        log_warn "Node.js 已安装，跳过"
    else
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt install -y nodejs
        log_info "Node.js 安装完成 ✓"
    fi

    log_step "安装 pnpm..."
    if command -v pnpm &> /dev/null; then
        log_warn "pnpm 已安装，跳过"
    else
        npm install -g pnpm
        log_info "pnpm 安装完成 ✓"
    fi
}

# ============================================
# 配置 Swap（2G 内存服务器必须）
# ============================================
setup_swap() {
    log_step "配置 Swap..."
    if [ -f /swapfile ]; then
        log_warn "Swap 已配置，跳过"
        return
    fi
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    if ! grep -q "/swapfile" /etc/fstab; then
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
    fi
    log_info "Swap 配置完成 ✓"
}

# ============================================
# 配置防火墙
# ============================================
setup_firewall() {
    log_step "配置防火墙..."
    if command -v ufw &> /dev/null; then
        ufw allow 22/tcp
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw allow 8080/tcp
        ufw --force enable
        log_info "防火墙配置完成 ✓"
    fi
}

# ============================================
# 配置 Docker 镜像加速（国内服务器）
# ============================================
setup_docker_mirror() {
    log_step "配置 Docker 镜像加速..."
    mkdir -p /etc/docker
    
    # 使用多个可用的镜像源
    cat > /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://dockerproxy.com",
    "https://docker.nju.edu.cn",
    "https://docker.m.daocloud.io"
  ],
  "max-concurrent-downloads": 10,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
    systemctl daemon-reload
    systemctl restart docker
    
    # 测试拉取
    log_info "测试镜像拉取..."
    if docker pull node:20-alpine; then
        log_info "Docker 镜像加速配置成功 ✓"
    else
        log_warn "镜像加速可能未生效，尝试直接拉取..."
    fi
}

# ============================================
# 配置 SSH 密钥（用于 Git）
# ============================================
setup_ssh_key() {
    log_step "配置 SSH 密钥..."
    if [ -f ~/.ssh/id_ed25519 ]; then
        log_warn "SSH 密钥已存在"
    else
        ssh-keygen -t ed25519 -C "deploy@server" -f ~/.ssh/id_ed25519 -N ""
        log_info "SSH 密钥生成完成 ✓"
    fi

    # 添加 GitHub 到已知主机
    mkdir -p ~/.ssh
    ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null || true

    echo ""
    log_warn "请将以下 SSH 公钥添加到 GitHub:"
    echo "=========================================="
    cat ~/.ssh/id_ed25519.pub
    echo "=========================================="
    echo ""
    log_info "添加方法: GitHub → Settings → SSH and GPG keys → New SSH key"
    echo ""
    read -p "按回车键继续（确认已添加到 GitHub）..."
}

# ============================================
# 加载 .env 环境变量
# ============================================
load_env() {
    if [ -f "$APP_DIR/.env" ]; then
        export $(cat "$APP_DIR/.env" | grep -v '^#' | xargs)
        log_info "环境变量加载完成 ✓"
    else
        log_warn ".env 文件不存在，使用默认值"
        export API_PORT=3001
        export WEB_PORT=3003
    fi
}

# ============================================
# 配置 Nginx（从模板生成，支持环境变量）
# ============================================
setup_nginx_config() {
    log_step "配置 Nginx..."
    
    # 加载环境变量
    load_env
    
    # 检查模板文件
    local NGINX_TEMPLATE="$APP_DIR/scripts/nginx/tatlerchain.conf"
    if [ ! -f "$NGINX_TEMPLATE" ]; then
        log_error "Nginx 模板文件不存在: $NGINX_TEMPLATE"
        exit 1
    fi
    
    # 使用 envsubst 从模板生成配置
    log_info "从模板生成 Nginx 配置..."
    log_info "  API_PORT: ${API_PORT:-3001}"
    log_info "  WEB_PORT: ${WEB_PORT:-3003}"
    log_info "  ADMIN_PORT: ${ADMIN_PORT:-8080}"
    
    # 设置默认值（envsubst 需要变量存在）
    export API_PORT=${API_PORT:-3001}
    export WEB_PORT=${WEB_PORT:-3003}
    export ADMIN_PORT=${ADMIN_PORT:-8080}
    
    envsubst '${API_PORT} ${WEB_PORT} ${ADMIN_PORT}' < "$NGINX_TEMPLATE" > /etc/nginx/sites-available/tatlerchain

    rm -f /etc/nginx/sites-enabled/default
    ln -sf /etc/nginx/sites-available/tatlerchain /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
    log_info "Nginx 配置完成 ✓"
}

# ============================================
# 克隆代码
# ============================================
clone_code() {
    log_step "克隆代码..."
    mkdir -p $APP_DIR
    mkdir -p $ADMIN_DIR
    
    if [ -d "$APP_DIR/.git" ]; then
        log_warn "代码已存在，执行 git pull..."
        cd $APP_DIR
        git pull origin main
    else
        cd $APP_DIR
        git clone $GIT_REPO .
    fi
    log_info "代码克隆完成 ✓"
}

# ============================================
# 配置环境变量
# ============================================
setup_env() {
    log_step "配置环境变量..."
    cd $APP_DIR
    
    if [ -f .env ]; then
        log_warn ".env 文件已存在"
        read -p "是否重新配置？(y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return
        fi
    fi

    # 生成随机密码和密钥
    DB_PASSWORD=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 16)
    JWT_SECRET=$(openssl rand -base64 32)

    cat > .env << EOF
# ====================================
# TatlerChain 生产环境配置
# ====================================

# 服务端口
API_PORT=3001
WEB_PORT=3003
ADMIN_PORT=5173

# API 地址
API_BASE_URL=http://$SERVER_IP

# 数据库配置
DB_USER=tatlerchain
DB_PASSWORD=$DB_PASSWORD
DB_NAME=tatlerchain
DATABASE_URL="postgresql://tatlerchain:$DB_PASSWORD@postgres:5432/tatlerchain?schema=public"

# JWT 配置
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

# 文件上传
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760
EOF

    log_info "环境变量配置完成 ✓"
    echo ""
    log_warn "请记录以下信息:"
    echo "  数据库密码: $DB_PASSWORD"
    echo "  JWT 密钥: $JWT_SECRET"
    echo ""
}

# ============================================
# 构建并启动服务
# ============================================
build_and_start() {
    log_step "构建并启动服务..."
    cd $APP_DIR

    # 停止旧服务
    docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true

    # 构建镜像
    log_info "构建 Docker 镜像（首次可能需要 5-10 分钟）..."
    docker-compose -f docker-compose.prod.yml build

    # 启动服务
    log_info "启动服务..."
    docker-compose -f docker-compose.prod.yml up -d

    # 等待服务启动
    log_info "等待服务启动..."
    sleep 15

    # 数据库迁移
    log_info "执行数据库迁移..."
    docker-compose -f docker-compose.prod.yml exec -T api sh -c "npx prisma db push" || true

    log_info "服务启动完成 ✓"
}

# ============================================
# 构建并部署 Admin 静态文件
# ============================================
build_admin() {
    log_step "构建 Admin 后台..."
    cd $APP_DIR
    
    # 安装依赖
    log_info "安装依赖..."
    pnpm install
    
    # 构建 Admin
    log_info "构建 Admin 项目..."
    pnpm --filter @port/admin build
    
    # 部署静态文件
    log_info "部署静态文件到 $ADMIN_DIR..."
    mkdir -p $ADMIN_DIR
    rm -rf $ADMIN_DIR/*
    cp -r apps/admin/dist/* $ADMIN_DIR/
    
    # 设置权限
    chown -R www-data:www-data $ADMIN_DIR 2>/dev/null || true
    
    log_info "Admin 构建完成 ✓"
    log_info "访问地址: http://$SERVER_IP:${ADMIN_PORT:-8080}"
}

# ============================================
# 单独部署 Admin
# ============================================
deploy_admin() {
    check_root "admin"
    cd $APP_DIR
    
    log_info "开始部署 Admin..."
    
    # 拉取最新代码
    log_step "拉取最新代码..."
    git pull origin main
    
    # 构建 Admin
    build_admin
    
    # 重载 Nginx
    nginx -t && systemctl reload nginx
    
    log_info "🎉 Admin 部署完成！"
    log_info "访问地址: http://$SERVER_IP:${ADMIN_PORT:-8080}"
}

# ============================================
# 健康检查
# ============================================
health_check() {
    log_step "健康检查..."
    
    # 加载环境变量
    load_env
    
    local api_port=${API_PORT:-3001}
    local web_port=${WEB_PORT:-3003}
    local admin_port=${ADMIN_PORT:-8080}
    
    # 检查 API
    log_info "检查 API 服务 (localhost:$api_port)..."
    if curl -sf http://localhost:$api_port/api/health > /dev/null 2>&1; then
        log_info "API 服务正常 ✓"
    else
        log_error "API 服务异常"
        docker-compose -f docker-compose.prod.yml logs --tail=50 api
        return 1
    fi
    
    # 检查 Web
    log_info "检查 Web 服务 (localhost:$web_port)..."
    if curl -sf http://localhost:$web_port > /dev/null 2>&1; then
        log_info "Web 服务正常 ✓"
    else
        log_error "Web 服务异常"
        docker-compose -f docker-compose.prod.yml logs --tail=50 web
        return 1
    fi
    
    # 检查 Admin（通过 Nginx $admin_port 端口）
    log_info "检查 Admin 服务 (localhost:$admin_port)..."
    if curl -sf http://localhost:$admin_port > /dev/null 2>&1; then
        log_info "Admin 服务正常 ✓"
    else
        log_warn "Admin 服务未部署或异常（可通过 ./deploy.sh admin 部署）"
    fi
    
    log_info "健康检查通过 ✓"
}

# ============================================
# 清理
# ============================================
cleanup() {
    log_step "清理旧资源..."
    docker image prune -f
    log_info "清理完成 ✓"
}

# ============================================
# 显示状态
# ============================================
show_status() {
    echo ""
    echo "=========================================="
    echo "  TatlerChain 服务状态"
    echo "=========================================="
    cd $APP_DIR 2>/dev/null || { log_error "应用目录不存在"; exit 1; }
    docker-compose -f docker-compose.prod.yml ps
    echo ""
}

# ============================================
# 显示日志
# ============================================
show_logs() {
    cd $APP_DIR 2>/dev/null || { log_error "应用目录不存在"; exit 1; }
    local service=${2:-api}
    docker-compose -f docker-compose.prod.yml logs -f --tail=100 $service
}

# ============================================
# 重启服务
# ============================================
restart_services() {
    cd $APP_DIR 2>/dev/null || { log_error "应用目录不存在"; exit 1; }
    local service=${2:-}
    if [ -n "$service" ]; then
        log_info "重启 $service 服务..."
        docker-compose -f docker-compose.prod.yml restart $service
    else
        log_info "重启所有服务..."
        docker-compose -f docker-compose.prod.yml restart
    fi
    log_info "重启完成 ✓"
}

# ============================================
# 停止服务
# ============================================
stop_services() {
    cd $APP_DIR 2>/dev/null || { log_error "应用目录不存在"; exit 1; }
    log_info "停止所有服务..."
    docker-compose -f docker-compose.prod.yml down
    log_info "服务已停止 ✓"
}

# ============================================
# 修复 .env 中的 API_BASE_URL（移除端口号）
# ============================================
fix_api_base_url() {
    if [ -f "$APP_DIR/.env" ]; then
        # 检查是否带端口号
        if grep -q "API_BASE_URL=http://[^:]*:[0-9]" "$APP_DIR/.env"; then
            log_warn "检测到 API_BASE_URL 带端口号，自动修复..."
            sed -i 's|API_BASE_URL=http://\([^:]*\):[0-9]*|API_BASE_URL=http://\1|g' "$APP_DIR/.env"
            log_info "API_BASE_URL 已修复为: $(grep API_BASE_URL $APP_DIR/.env)"
        fi
    fi
}

# ============================================
# 更新部署
# ============================================
update_deploy() {
    check_root "update"
    
    log_info "开始更新部署..."
    cd $APP_DIR

    # 检查并配置 Docker 镜像加速
    setup_docker_mirror

    # 拉取最新代码
    log_step "拉取最新代码..."
    git fetch origin
    git reset --hard origin/main

    # 自动修复 API_BASE_URL（移除端口号）
    fix_api_base_url

    # 重新生成 Nginx 配置（从 .env 读取端口）
    setup_nginx_config

    # 重新构建并启动
    build_and_start

    # 构建 Admin
    build_admin

    # 健康检查
    health_check

    # 清理
    cleanup

    echo ""
    echo "=========================================="
    log_info "🎉 更新完成！"
    echo "=========================================="
    show_result
}

# ============================================
# 首次初始化
# ============================================
init_deploy() {
    check_root "init"

    echo ""
    echo "=========================================="
    echo "  TatlerChain 首次部署"
    echo "=========================================="
    echo ""

    # 系统初始化
    install_base
    install_docker
    install_docker_compose
    install_nginx
    install_node
    setup_swap
    setup_firewall
    setup_docker_mirror

    # SSH 配置
    setup_ssh_key

    # 克隆代码
    clone_code

    # 配置环境变量
    setup_env

    # 配置 Nginx
    setup_nginx_config

    # 构建并启动
    build_and_start

    # 构建 Admin
    build_admin

    # 健康检查
    health_check

    # 清理
    cleanup

    echo ""
    echo "=========================================="
    log_info "🎉 部署完成！"
    echo "=========================================="
    show_result
}

# ============================================
# 显示结果
# ============================================
show_result() {
    echo ""
    echo "访问地址:"
    load_env
    echo "  - 主站: http://$SERVER_IP"
    echo "  - 后台: http://$SERVER_IP:${ADMIN_PORT:-8080}"
    echo "  - API:  http://$SERVER_IP/api/health"
    echo ""
    echo "常用命令:"
    echo "  ./deploy.sh status   - 查看状态"
    echo "  ./deploy.sh logs     - 查看日志"
    echo "  ./deploy.sh restart  - 重启服务"
    echo "  ./deploy.sh update   - 更新部署"
    echo ""
}

# ============================================
# 重新配置 Nginx（从 .env 读取端口）
# ============================================
reload_nginx() {
    check_root "nginx"
    cd $APP_DIR
    setup_nginx_config
    log_info "Nginx 配置已更新 ✓"
}

# ============================================
# 帮助信息
# ============================================
show_help() {
    echo ""
    echo "TatlerChain 部署脚本"
    echo ""
    echo "使用方法: ./deploy.sh <command>"
    echo ""
    echo "命令列表:"
    echo "  init      首次部署（完整安装）"
    echo "  update    更新部署（拉取代码并重新构建）"
    echo "  admin     单独部署 Admin 后台"
    echo "  status    查看服务状态"
    echo "  logs      查看日志（默认 api，可指定: logs web）"
    echo "  restart   重启服务（可指定: restart api）"
    echo "  stop      停止所有服务"
    echo "  nginx     重新生成 Nginx 配置（从 .env 读取端口）"
    echo "  help      显示帮助信息"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh init           # 首次部署"
    echo "  ./deploy.sh update         # 更新部署"
    echo "  ./deploy.sh logs api       # 查看 API 日志"
    echo "  ./deploy.sh logs web       # 查看 Web 日志"
    echo "  ./deploy.sh restart api    # 重启 API 服务"
    echo "  ./deploy.sh nginx          # 修改端口后重新配置 Nginx"
    echo ""
}

# ============================================
# 主入口
# ============================================
main() {
    case "${1:-help}" in
        init)
            init_deploy
            ;;
        update)
            update_deploy
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs "$@"
            ;;
        restart)
            restart_services "$@"
            ;;
        stop)
            stop_services
            ;;
        nginx)
            reload_nginx
            ;;
        admin)
            deploy_admin
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"

