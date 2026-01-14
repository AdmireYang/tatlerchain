# 🚀 快速部署指南

## 一、服务器准备

### 1. 登录服务器

```bash
ssh root@8.153.15.139
```

### 2. 运行初始化脚本

```bash
# 下载并运行初始化脚本
curl -sSL https://raw.githubusercontent.com/your-repo/main/scripts/init-server.sh | bash

# 或者手动复制 init-server.sh 到服务器执行
chmod +x init-server.sh
./init-server.sh
```

---

## 二、部署应用

### 1. 克隆代码

```bash
cd /var/www/tatlerchain
git clone https://github.com/your-repo/tatlerchain.git .
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp scripts/env.production.template .env

# 编辑环境变量（必须修改以下配置）
vim .env

# 必须修改的配置项：
# - DB_PASSWORD: 数据库密码
# - JWT_SECRET: JWT 密钥
# - API_BASE_URL: http://你的服务器IP（无域名）或 https://your-domain.com（有域名）
```

### 3. 运行部署脚本

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

---

## 三、配置 Nginx

### 方案 A：无域名（IP 直接访问）

```bash
# 复制无域名版 Nginx 配置
cp scripts/nginx/tatlerchain-ip.conf /etc/nginx/sites-available/tatlerchain

# 删除默认配置
rm -f /etc/nginx/sites-enabled/default

# 启用配置
ln -s /etc/nginx/sites-available/tatlerchain /etc/nginx/sites-enabled/

# 测试并重启
nginx -t && systemctl reload nginx
```

**访问地址：**

- 主站：`http://8.153.15.139`
- 后台：`http://8.153.15.139:8080`
- API：`http://8.153.15.139/api/health`

### 方案 B：有域名（推荐）

```bash
# 复制域名版 Nginx 配置
cp scripts/nginx/tatlerchain.conf /etc/nginx/sites-available/tatlerchain

# 修改域名
sed -i 's/your-domain.com/你的域名/g' /etc/nginx/sites-available/tatlerchain

# 启用配置
ln -s /etc/nginx/sites-available/tatlerchain /etc/nginx/sites-enabled/
nginx -t

# 申请 SSL 证书
certbot --nginx -d 你的域名 -d www.你的域名 -d admin.你的域名

# 测试自动续期
certbot renew --dry-run
```

**访问地址：**

- 主站：`https://你的域名`
- 后台：`https://admin.你的域名`

---

## 四、验证部署

### 检查服务状态

```bash
# 查看容器状态
docker-compose -f docker-compose.prod.yml ps

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f
```

### 访问测试

- 主站：https://你的域名
- 后台：https://admin.你的域名
- API：https://你的域名/api/health

---

## 五、常用命令

```bash
# 重启所有服务
docker-compose -f docker-compose.prod.yml restart

# 重启单个服务
docker-compose -f docker-compose.prod.yml restart api

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f api

# 进入容器
docker-compose -f docker-compose.prod.yml exec api sh

# 数据库备份
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U tatlerchain tatlerchain > backup_$(date +%Y%m%d).sql

# 重新部署
./scripts/deploy.sh
```

---

## 六、故障排查

### API 无法访问

```bash
# 检查容器是否运行
docker ps

# 查看 API 日志
docker-compose -f docker-compose.prod.yml logs api

# 检查端口
netstat -tlnp | grep 3001
```

### 数据库连接失败

```bash
# 检查数据库容器
docker-compose -f docker-compose.prod.yml logs postgres

# 测试数据库连接
docker-compose -f docker-compose.prod.yml exec postgres psql -U tatlerchain -d tatlerchain -c "SELECT 1"
```

### 内存不足

```bash
# 检查内存使用
free -h

# 检查 Swap
swapon --show

# 重启容器释放内存
docker-compose -f docker-compose.prod.yml restart
```

---

## 七、安全建议

1. **修改 SSH 端口**

```bash
# /etc/ssh/sshd_config
Port 22222  # 改为非默认端口
```

2. **禁用 root 密码登录**

```bash
# /etc/ssh/sshd_config
PermitRootLogin prohibit-password
PasswordAuthentication no
```

3. **定期备份**

```bash
# 添加定时备份任务
crontab -e
# 每天凌晨 3 点备份
0 3 * * * cd /var/www/tatlerchain && docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U tatlerchain tatlerchain > /backup/tatlerchain_$(date +\%Y\%m\%d).sql
```

4. **设置防火墙**

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```
