#!/bin/bash
# init-server.sh - 服务器初始化脚本
# 在新的阿里云服务器上运行此脚本进行初始化
# 使用方法: curl -sSL your-url/init-server.sh | bash

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "======================================"
echo "   TatlerChain 服务器初始化脚本       "
echo "======================================"
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    log_error "请使用 root 用户运行此脚本"
    exit 1
fi

# 1. 更新系统
log_info "更新系统..."
apt update && apt upgrade -y

# 2. 安装基础软件
log_info "安装基础软件..."
apt install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    unzip \
    build-essential \
    nginx \
    certbot \
    python3-certbot-nginx

# 3. 安装 Docker
log_info "安装 Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    log_info "Docker 安装完成 ✓"
else
    log_warn "Docker 已安装，跳过"
fi

# 4. 安装 Docker Compose
log_info "安装 Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log_info "Docker Compose 安装完成 ✓"
else
    log_warn "Docker Compose 已安装，跳过"
fi

# 5. 安装 Node.js 20
log_info "安装 Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    log_info "Node.js 安装完成 ✓"
else
    log_warn "Node.js 已安装，跳过"
fi

# 6. 安装 pnpm
log_info "安装 pnpm..."
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
    log_info "pnpm 安装完成 ✓"
else
    log_warn "pnpm 已安装，跳过"
fi

# 7. 创建应用目录
log_info "创建应用目录..."
mkdir -p /var/www/tatlerchain
mkdir -p /var/www/tatlerchain-admin
mkdir -p /var/log/tatlerchain

# 8. 配置 Swap（2G 服务器必须）
log_info "配置 Swap..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    
    # 永久生效
    if ! grep -q "/swapfile" /etc/fstab; then
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
    fi
    log_info "Swap 配置完成 ✓"
else
    log_warn "Swap 已配置，跳过"
fi

# 9. 配置防火墙
log_info "配置防火墙..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp     # SSH
    ufw allow 80/tcp     # HTTP (主站)
    ufw allow 443/tcp    # HTTPS (有域名时)
    ufw allow 8080/tcp   # Admin 后台 (无域名时)
    ufw --force enable
    log_info "防火墙配置完成 ✓"
fi

# 10. 优化系统参数
log_info "优化系统参数..."
cat >> /etc/sysctl.conf << EOF
# 网络优化
net.core.somaxconn = 1024
net.ipv4.tcp_max_syn_backlog = 1024
net.ipv4.ip_local_port_range = 1024 65535

# 文件描述符
fs.file-max = 65535
EOF
sysctl -p

# 打印安装结果
echo ""
echo "======================================"
log_info "🎉 服务器初始化完成！"
echo "======================================"
echo ""
echo "已安装软件版本:"
echo "  - Docker: $(docker --version)"
echo "  - Docker Compose: $(docker-compose --version)"
echo "  - Node.js: $(node --version)"
echo "  - pnpm: $(pnpm --version)"
echo "  - Nginx: $(nginx -v 2>&1)"
echo ""
echo "下一步操作:"
echo "  1. 克隆代码: cd /var/www/tatlerchain && git clone your-repo-url ."
echo "  2. 配置环境变量: cp scripts/env.production.template .env && vim .env"
echo "  3. 修改 API_BASE_URL 为: http://$(curl -s ifconfig.me 2>/dev/null || echo '服务器IP')"
echo "  4. 运行部署脚本: chmod +x scripts/deploy.sh && ./scripts/deploy.sh"
echo ""
echo "部署完成后访问:"
echo "  - 主站: http://$(curl -s ifconfig.me 2>/dev/null || echo '服务器IP')"
echo "  - 后台: http://$(curl -s ifconfig.me 2>/dev/null || echo '服务器IP'):8080"
echo ""

