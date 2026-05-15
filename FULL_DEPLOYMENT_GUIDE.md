# 完整部署指南

本文档包含从本地开发到部署到 Vercel 的完整流程。

## 📋 目录

1. [准备工作](#1-准备工作)
2. [Supabase 配置](#2-supabase-配置)
3. [本地项目设置](#3-本地项目设置)
4. [GitHub 仓库设置](#4-github-仓库设置)
5. [Vercel 部署](#5-vercel-部署)
6. [自动化部署配置](#6-自动化部署配置)
7. [部署后验证](#7-部署后验证)
8. [常见问题](#8-常见问题)

---

## 1️⃣ 准备工作

### 必需工具

| 工具 | 版本要求 | 下载地址 |
|------|---------|---------|
| Node.js | 18.x 或更高 | [nodejs.org](https://nodejs.org/) |
| Git | 最新版本 | [git-scm.com](https://git-scm.com/) |
| Vercel CLI | 最新 | `npm install -g vercel` |

### 检查工具安装

```bash
# 检查 Node.js
node --version

# 检查 npm
npm --version

# 检查 Git
git --version

# 检查 Vercel CLI（可选）
vercel --version
```

### 快速开始脚本

#### Windows 用户：
双击运行 `deploy.bat`

#### Mac/Linux 用户：
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 2️⃣ Supabase 配置

### 2.1 创建或登录 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 登录或创建账号
3. 访问 Dashboard：https://supabase.com/dashboard/project/zizysoujrdzsqxcstilu

### 2.2 设置数据库

1. 在 Supabase Dashboard 中点击 **SQL Editor**
2. 打开 `supabase-setup.sql` 文件
3. 复制所有内容并粘贴到 SQL Editor
4. 点击 **Run** 执行

### 2.3 获取 API 密钥

1. 进入 **Settings** → **API**
2. 复制以下信息：

| 项目 | 说明 |
|------|------|
| Project URL | `https://zizysoujrdzsqxcstilu.supabase.co` |
| anon public | 公钥（用于前端） |
| service_role | 服务密钥（用于后端） |
| JWT Secret | JWT签名密钥 |

---

## 3️⃣ 本地项目设置

### 3.1 配置环境变量

复制示例文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 Supabase 信息：

```env
SUPABASE_URL=https://zizysoujrdzsqxcstilu.supabase.co
SUPABASE_ANON_KEY=你的anon密钥
SUPABASE_SERVICE_ROLE_KEY=你的service密钥
SUPABASE_JWT_SECRET=你的JWT密钥
NODE_ENV=development
```

### 3.2 安装依赖

```bash
npm install
```

### 3.3 本地测试

#### 测试独立页面：
直接打开 `standalone-auth-test.html` 在浏览器中测试

#### 启动本地服务器（可选）：
```bash
npm start
```
访问 http://localhost:3000

---

## 4️⃣ GitHub 仓库设置

### 4.1 初始化 Git（如果还没）

```bash
cd E:\workspace
git init
```

### 4.2 添加远程仓库

```bash
git remote add origin https://github.com/fyy315/fyy315.git
```

### 4.3 提交代码

```bash
git add .
git commit -m "Initial commit: Supabase auth with Vercel deployment"
git branch -M main
git push -u origin main
```

### 4.4 配置 GitHub Secrets

1. 访问 https://github.com/fyy315/fyy315/settings/secrets/actions
2. 点击 **New repository secret**
3. 添加以下 Secrets：

| Secret 名称 | 值 |
|-------------|-----|
| `VERCEL_TOKEN` | 你的 Vercel Token (请重新生成新Token!) |
| `VERCEL_ORG_ID` | 你的 Vercel 组织 ID |
| `VERCEL_PROJECT_ID` | `prj_aeIz1HxegvZX4ofqBeah4OlV68nN` |
| `SUPABASE_URL` | `https://zizysoujrdzsqxcstilu.supabase.co` |
| `SUPABASE_ANON_KEY` | 你的 Supabase anon 密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | 你的 Supabase service 密钥 |
| `SUPABASE_JWT_SECRET` | 你的 JWT Secret |

#### 获取 Vercel Org ID

```bash
vercel login
vercel teams ls
```

---

## 5️⃣ Vercel 部署

### 5.1 方法一：通过 Vercel Dashboard 部署（推荐）

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New** → **Project**
3. 选择 **Import Git Repository**
4. 选择仓库 `fyy315/fyy315`
5. 在 **Environment Variables** 中添加所有 Supabase 密钥
6. 点击 **Deploy**

### 5.2 方法二：通过 Vercel CLI 部署

```bash
# 1. 登录 Vercel
vercel login

# 2. 部署到预览环境
vercel

# 3. 部署到生产环境
vercel --prod
```

### 5.3 配置 Vercel 环境变量

1. 在 Vercel 项目页面，点击 **Settings** → **Environment Variables**
2. 添加所有所需的环境变量（同 GitHub Secrets）
3. **注意**：`SUPABASE_SERVICE_ROLE_KEY` 和 `SUPABASE_JWT_SECRET` 只在 Production 环境启用！

---

## 6️⃣ 自动化部署配置

### 6.1 GitHub Actions 已配置

项目中已有两个工作流：

| 工作流文件 | 功能 |
|-----------|------|
| `.github/workflows/vercel-deploy.yml` | 推送到 main 时自动部署 |
| `.github/workflows/ci-cd.yml` | 完整 CI/CD 流程 |

### 6.2 部署触发

- **Push to main**: 自动部署到生产环境
- **Pull Request**: 自动创建预览部署
- **Merge PR**: 自动部署到生产

### 6.3 查看部署状态

1. 访问 https://github.com/fyy315/fyy315/actions
2. 查看工作流运行状态和日志

---

## 7️⃣ 部署后验证

### 7.1 检查部署是否成功

```bash
# 测试健康检查端点
curl https://your-project.vercel.app/health

# 预期响应：
# {"status":"ok","timestamp":"...","supabase":{"url":"configured","anonKey":"configured"}}
```

### 7.2 测试认证功能

访问你的部署 URL（例如 `https://project-nvua8.vercel.app`）

1. 测试用户注册
2. 测试用户登录
3. 测试获取用户信息
4. 测试创建任务
5. 测试获取任务列表

### 7.3 验证 Row Level Security

确保用户只能看到和修改自己的数据。

---

## 8️⃣ 常见问题

### Q1: 部署时提示环境变量缺失

**A**: 确保在 Vercel Dashboard 和 GitHub Secrets 中都配置了所有必要的环境变量。

### Q2: Vercel Token 过期或无效

**A**: 
1. 访问 https://vercel.com/account/tokens
2. 删除旧 Token 并生成新 Token
3. 更新 GitHub Secrets 中的 `VERCEL_TOKEN`

### Q3: Supabase API 返回 401 错误

**A**:
1. 检查 Supabase 项目是否暂停
2. 确认 API 密钥是否正确
3. 确认 API 密钥是否有正确权限

### Q4: 数据库查询失败

**A**:
1. 确认已在 Supabase 中运行 `supabase-setup.sql`
2. 检查 RLS 策略是否正确
3. 检查用户是否已登录

### Q5: 本地开发正常，部署后不工作

**A**:
1. 确保所有环境变量都在 Vercel 中配置
2. 检查 Supabase 项目的网络策略是否允许访问
3. 查看 Vercel 的部署日志

---

## 📞 获取帮助

- **Vercel 文档**: https://vercel.com/docs
- **Supabase 文档**: https://supabase.com/docs
- **项目 Issues**: https://github.com/fyy315/fyy315/issues
- **查看日志**: Vercel Dashboard → Project → Logs

---

## ✅ 部署检查清单

在部署前，请确认以下项目：

- [ ] 已安装 Node.js (18+)
- [ ] 已安装 Git
- [ ] 已在 Supabase 中运行数据库设置脚本
- [ ] 已配置 `.env` 文件
- [ ] 已提交并推送代码到 GitHub
- [ ] 已在 Vercel 中配置环境变量
- [ ] 已在 GitHub 中配置 Secrets
- [ ] 已删除并重新生成 Vercel Token（安全起见）
- [ ] 本地测试通过

---

## 🚀 快速命令参考

```bash
# 本地开发
npm start
npm run dev

# 部署
vercel           # 预览环境
vercel --prod    # 生产环境

# Git 操作
git add .
git commit -m "你的提交信息"
git push origin main

# 测试
curl https://your-project.vercel.app/health
```

祝部署顺利！🎉
