# Git 认证配置指南

## 🔐 问题说明

GitHub 已不再支持密码认证，需要使用以下方式之一：

1. **SSH 密钥**（推荐）
2. **Personal Access Token (PAT)**
3. **本地克隆后上传**

---

## 方案一：使用 SSH 密钥（推荐）

### 步骤 1：生成 SSH 密钥

在服务器上执行：

```bash
# 生成 SSH 密钥对
ssh-keygen -t ed25519 -C "your-email@example.com"

# 按提示操作：
# - 密钥保存位置：直接回车（默认 ~/.ssh/id_ed25519）
# - 密码：可以设置，也可以直接回车（不设置密码）
```

### 步骤 2：查看公钥

```bash
cat ~/.ssh/id_ed25519.pub
```

### 步骤 3：添加到 GitHub

1. 复制公钥内容（`cat ~/.ssh/id_ed25519.pub` 的输出）
2. 打开 GitHub → Settings → SSH and GPG keys
3. 点击 "New SSH key"
4. 粘贴公钥，保存

### 步骤 4：测试连接

```bash
ssh -T git@github.com
# 应该看到: Hi username! You've successfully authenticated...
```

### 步骤 5：使用 SSH 方式克隆

```bash
# 将 HTTPS URL 改为 SSH URL
git clone git@github.com:Wangxz516/project.git
```

---

## 方案二：使用 Personal Access Token

### 步骤 1：创建 Token

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token (classic)"
3. 设置：
   - Note: `Server Deployment`
   - Expiration: 选择过期时间（建议 90 天或更长）
   - Scopes: 勾选 `repo`（完整仓库权限）
4. 点击 "Generate token"
5. **复制 token**（只显示一次，务必保存）

### 步骤 2：使用 Token 克隆

```bash
# 方式 1：在 URL 中嵌入 token（不推荐，会暴露在历史记录中）
git clone https://<token>@github.com/Wangxz516/project.git

# 方式 2：使用 Git Credential Helper（推荐）
git clone https://github.com/Wangxz516/project.git
# 用户名：你的 GitHub 用户名
# 密码：粘贴刚才复制的 token
```

### 步骤 3：保存凭证（避免每次输入）

```bash
# 配置 Git Credential Helper
git config --global credential.helper store

# 下次输入一次后会自动保存
```

---

## 方案三：本地克隆后上传（最简单）

如果服务器配置 SSH/Token 不方便，可以：

### 步骤 1：在本地电脑克隆

```bash
# 在你的本地电脑上
git clone https://github.com/Wangxz516/project.git
cd project
```

### 步骤 2：打包上传到服务器

```bash
# 在本地电脑上打包（排除 node_modules 等）
tar -czf tatlerchain.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist' \
  --exclude='.output' \
  --exclude='.nuxt' \
  .

# 上传到服务器
scp tatlerchain.tar.gz root@8.153.15.139:/var/www/
```

### 步骤 3：在服务器上解压

```bash
# SSH 登录服务器
ssh root@8.153.15.139

# 解压
cd /var/www
tar -xzf tatlerchain.tar.gz
mv project tatlerchain
cd tatlerchain

# 初始化 Git（可选，用于后续更新）
git init
git remote add origin https://github.com/Wangxz516/project.git
```

---

## 🎯 推荐方案对比

| 方案          | 优点                         | 缺点                 | 适用场景           |
| ------------- | ---------------------------- | -------------------- | ------------------ |
| **SSH 密钥**  | 安全、永久有效、无需每次输入 | 需要配置一次         | **推荐，长期使用** |
| **PAT Token** | 配置简单                     | 会过期，需要定期更新 | 临时使用           |
| **本地上传**  | 最简单                       | 后续更新不方便       | 首次部署           |

---

## 🚀 快速开始（推荐 SSH）

```bash
# 1. 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your-email@example.com"
# 直接回车两次（不设置密码）

# 2. 复制公钥
cat ~/.ssh/id_ed25519.pub

# 3. 添加到 GitHub（网页操作）
# GitHub → Settings → SSH and GPG keys → New SSH key

# 4. 测试连接
ssh -T git@github.com

# 5. 克隆仓库
cd /var/www/tatlerchain
git clone git@github.com:Wangxz516/project.git .
```

---

## ⚠️ 注意事项

1. **SSH 密钥私钥不要泄露**（`~/.ssh/id_ed25519`）
2. **PAT Token 不要提交到代码仓库**
3. **如果使用 HTTPS + Token，建议配置 credential helper**

---

## 🔄 后续更新代码

### SSH 方式（推荐）

```bash
cd /var/www/tatlerchain
git pull origin main
```

### HTTPS + Token 方式

```bash
cd /var/www/tatlerchain
git pull
# 输入用户名和 token
```
