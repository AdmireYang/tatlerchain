# GitHub Actions 自动部署方案

## 📋 方案概述

使用 GitHub Actions 实现代码推送后自动部署到阿里云服务器。

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   开发者     │      │   GitHub    │      │  阿里云服务器 │
│  推送代码    │ ──→  │   Actions   │ ──→  │   自动部署   │
└─────────────┘      └─────────────┘      └─────────────┘
```

---

## 🏗️ 部署架构

### 方案 A：SSH 直连部署（推荐，简单）

```
GitHub Actions
     │
     │ SSH 连接
     ▼
┌─────────────────────────────┐
│        阿里云服务器          │
│  ┌───────────────────────┐  │
│  │  1. git pull 拉取代码  │  │
│  │  2. docker build      │  │
│  │  3. docker-compose up │  │
│  │  4. 健康检查           │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

**优点**：配置简单，直接在服务器上构建
**缺点**：构建时占用服务器资源

### 方案 B：Docker Hub 中转（适合多服务器）

```
GitHub Actions
     │
     │ 构建镜像
     ▼
┌─────────────┐
│ Docker Hub  │  ← 镜像仓库
└─────────────┘
     │
     │ 拉取镜像
     ▼
┌─────────────┐
│  阿里云服务器 │
└─────────────┘
```

**优点**：服务器不用构建，支持多服务器部署
**缺点**：需要 Docker Hub 账号，国内拉取可能慢

### 方案 C：阿里云容器镜像服务（企业级）

```
GitHub Actions
     │
     │ 构建并推送
     ▼
┌─────────────────┐
│ 阿里云容器镜像服务 │  ← 国内速度快
└─────────────────┘
     │
     │ 拉取镜像
     ▼
┌─────────────┐
│  阿里云服务器 │
└─────────────┘
```

**优点**：国内速度快，安全
**缺点**：需要额外配置阿里云 ACR

---

## 🎯 推荐方案：SSH 直连部署

适合单服务器、2核2G 配置的场景。

### 工作流程

```
1. 开发者推送代码到 main 分支
        ↓
2. GitHub Actions 触发
        ↓
3. SSH 连接到阿里云服务器
        ↓
4. 执行部署脚本
   - git pull 拉取最新代码
   - docker-compose build 构建镜像
   - docker-compose up -d 启动服务
   - 健康检查
        ↓
5. 部署完成，发送通知（可选）
```

---

## ⚙️ 配置步骤

### 第一步：服务器准备

1. **创建部署用户**（非 root，更安全）
   - 用户名：`deploy`
   - 添加到 docker 组
   - 配置 sudo 免密（仅限 nginx 重启）

2. **配置 SSH 密钥认证**
   - 生成 SSH 密钥对
   - 公钥添加到服务器 `~/.ssh/authorized_keys`
   - 私钥添加到 GitHub Secrets

3. **首次手动部署**
   - 克隆代码到 `/var/www/tatlerchain`
   - 配置 `.env` 环境变量
   - 确保 `deploy` 用户有读写权限

### 第二步：GitHub Secrets 配置

在 GitHub 仓库 → Settings → Secrets and variables → Actions 中添加：

| Secret 名称      | 说明      | 示例                    |
| ---------------- | --------- | ----------------------- |
| `SERVER_HOST`    | 服务器 IP | `8.153.15.139`          |
| `SERVER_USER`    | 部署用户  | `deploy`                |
| `SERVER_SSH_KEY` | SSH 私钥  | `-----BEGIN OPENSSH...` |
| `SERVER_PORT`    | SSH 端口  | `22`（或自定义端口）    |

### 第三步：创建 Workflow 文件

在 `.github/workflows/` 目录创建部署配置：

- `deploy.yml` - 主部署工作流

### 第四步：配置触发条件

| 触发方式            | 说明                     |
| ------------------- | ------------------------ |
| `push`              | 推送到 main 分支自动部署 |
| `workflow_dispatch` | 手动触发部署             |
| `release`           | 发布 Release 时部署      |

---

## 📁 工作流文件结构

```
.github/
└── workflows/
    ├── deploy.yml          # 生产环境部署
    ├── deploy-staging.yml  # 测试环境部署（可选）
    └── test.yml            # 代码测试（可选）
```

---

## 🔄 部署流程详解

### 自动部署（推送触发）

```
代码推送到 main 分支
        ↓
GitHub Actions 启动
        ↓
├── 代码检查（lint）      [可选]
├── 单元测试              [可选]
├── 构建测试              [可选]
        ↓
SSH 连接服务器
        ↓
执行部署命令
├── cd /var/www/tatlerchain
├── git pull origin main
├── docker-compose -f docker-compose.prod.yml build
├── docker-compose -f docker-compose.prod.yml up -d
├── 等待服务启动
├── 健康检查
        ↓
部署完成
```

### 手动部署（workflow_dispatch）

可在 GitHub Actions 页面手动触发，支持：

- 选择部署分支
- 选择是否强制重建
- 选择是否清理旧镜像

---

## 🔐 安全配置

### SSH 密钥管理

1. **使用 Ed25519 算法**（更安全）
2. **限制 IP 访问**（可选）
3. **定期轮换密钥**

### 服务器安全

1. **deploy 用户权限最小化**
   - 只能访问项目目录
   - 只能执行 docker 命令
   - sudo 仅限必要命令

2. **禁用密码登录**
   - 仅允许密钥认证

3. **防火墙配置**
   - 仅开放必要端口

---

## 📊 部署状态监控

### GitHub Actions 状态徽章

可在 README 中添加部署状态徽章：

```markdown
![Deploy](https://github.com/your-repo/tatlerchain/actions/workflows/deploy.yml/badge.svg)
```

### 部署通知（可选）

| 通知渠道 | 说明               |
| -------- | ------------------ |
| 企业微信 | 发送部署结果到群   |
| 钉钉     | 发送部署结果到群   |
| Slack    | 发送部署结果到频道 |
| 邮件     | 部署失败时邮件通知 |

---

## 🛠️ 回滚方案

### 方式 1：Git 回滚

```bash
# 回滚到上一个提交
git revert HEAD
git push
# 自动触发部署
```

### 方式 2：手动回滚

```bash
# SSH 登录服务器
ssh deploy@服务器IP

# 回滚到指定版本
cd /var/www/tatlerchain
git checkout <commit-hash>
docker-compose -f docker-compose.prod.yml up -d --build
```

### 方式 3：Docker 镜像回滚（方案 B/C）

如果使用镜像仓库，可以直接拉取之前的镜像版本。

---

## 📝 最佳实践

### 1. 分支策略

```
main (生产环境)
  ↑
develop (开发环境)
  ↑
feature/* (功能分支)
```

### 2. 部署时机

| 分支        | 触发条件  | 部署环境 |
| ----------- | --------- | -------- |
| `main`      | 推送/合并 | 生产环境 |
| `develop`   | 推送/合并 | 测试环境 |
| `feature/*` | 不部署    | -        |

### 3. 部署前检查

- [ ] 代码 lint 通过
- [ ] 单元测试通过
- [ ] 构建成功
- [ ] 健康检查通过

### 4. 部署后验证

- [ ] 服务健康检查
- [ ] 关键接口测试
- [ ] 日志检查

---

## ⏱️ 预计耗时

| 步骤                | 耗时        |
| ------------------- | ----------- |
| GitHub Actions 启动 | ~10s        |
| SSH 连接            | ~2s         |
| Git Pull            | ~5s         |
| Docker Build (首次) | ~3-5min     |
| Docker Build (缓存) | ~30s-1min   |
| 服务启动            | ~15s        |
| 健康检查            | ~10s        |
| **总计（有缓存）**  | **~1-2min** |

---

## 🔧 后续扩展

### 阶段 1：基础部署

- [x] SSH 直连部署
- [x] 自动触发
- [x] 手动触发

### 阶段 2：增强功能

- [ ] 部署通知（企业微信/钉钉）
- [ ] 多环境部署（staging/production）
- [ ] 部署审批（需要人工确认）

### 阶段 3：高级功能

- [ ] 蓝绿部署
- [ ] 金丝雀发布
- [ ] 自动回滚

---

## 📚 相关文档

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [阿里云 ECS 文档](https://help.aliyun.com/product/25365.html)
