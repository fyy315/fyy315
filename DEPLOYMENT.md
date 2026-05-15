# Vercel 部署指南

## 🚀 快速部署

### 前提条件

1. ✅ 已安装 Node.js (v18+)
2. ✅ 已安装 Vercel CLI: `npm install -g vercel`
3. ✅ 已在本地登录 Vercel: `vercel login`

### 部署步骤

#### 方法1: 通过命令行部署

```bash
# 1. 进入项目目录
cd E:\workspace

# 2. 部署到预览环境
vercel

# 3. 部署到生产环境
vercel --prod
```

#### 方法2: 通过GitHub自动部署（推荐）

1. 将代码推送到GitHub
2. 在Vercel Dashboard连接仓库
3. 每次推送到main分支会自动部署

---

## 🔐 配置环境变量

### 在 Vercel Dashboard 中配置

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目 `project-nvua8`
3. 进入 **Settings** → **Environment Variables**
4. 添加以下变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `SUPABASE_URL` | `https://zizysoujrdzsqxcstilu.supabase.co` | Production |
| `SUPABASE_ANON_KEY` | 从Supabase复制 | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | 从Supabase复制 | Production |
| `SUPABASE_JWT_SECRET` | 从Supabase复制 | Production |

**详细配置步骤请查看 [VERCEL_ENV_GUIDE.md](file:///E:/workspace/VERCEL_ENV_GUIDE.md)**

---

## 🔄 自动化部署配置

### GitHub Actions 工作流

项目已配置两个自动化工作流：

#### 1. CI/CD Pipeline ([.github/workflows/ci-cd.yml](file:///E:/workspace/.github/workflows/ci-cd.yml))

- ✅ 多版本Node.js测试
- ✅ 代码检查
- ✅ 自动构建
- ✅ 自动部署到Vercel

#### 2. Vercel直接部署 ([.github/workflows/vercel-deploy.yml](file:///E:/workspace/.github/workflows/vercel-deploy.yml))

- ✅ 推送到main分支自动部署
- ✅ PR创建预览部署

### 配置GitHub Secrets

在GitHub仓库中配置以下Secrets：

1. 进入 GitHub 仓库 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**

添加以下Secrets：

| Secret名称 | 值 |
|-----------|-----|
| `VERCEL_TOKEN` | 你的Vercel Token |
| `SUPABASE_URL` | 你的Supabase URL |
| `SUPABASE_ANON_KEY` | 你的Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | 你的Supabase service key |
| `SUPABASE_JWT_SECRET` | 你的JWT secret |

### 启用GitHub Actions

1. 将 [.github/workflows/](file:///E:/workspace/.github/workflows/) 目录推送到GitHub
2. GitHub Actions会自动检测并启用
3. 查看 **Actions** 标签页监控部署状态

---

## 🌐 自定义域名（可选）

### 添加自定义域名

1. 在 Vercel Dashboard 中进入项目
2. 选择 **Settings** → **Domains**
3. 输入你的域名
4. 按照提示添加DNS记录

### DNS配置

在域名提供商处添加：

```
类型    名称    值
A       @      76.76.21.21
CNAME   www    cname.vercel-dns.com
```

---

## 🔧 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 复制环境变量

创建 `.env.local` 文件：

```bash
cp .env .env.local
```

编辑 `.env.local`，填入实际的Supabase密钥。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

---

## 📊 监控和日志

### 查看部署日志

```bash
vercel logs my-project
```

### 查看实时日志

```bash
vercel logs my-project --follow
```

---

## 🔒 安全配置

### 环境变量权限

- `SUPABASE_SERVICE_ROLE_KEY` 和 `SUPABASE_JWT_SECRET` **只能在Production环境使用**
- 不要在客户端代码中暴露服务密钥
- 使用Row Level Security (RLS)保护数据库

### CORS配置

在 [vercel.json](file:///E:/workspace/vercel.json) 中已配置CORS：

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

---

## ❓ 常见问题

### 部署失败

1. 检查环境变量是否配置正确
2. 查看构建日志中的错误信息
3. 确保所有依赖都已在package.json中声明

### 环境变量未生效

1. 修改环境变量后需要重新部署
2. 在Vercel Dashboard中检查变量名是否正确
3. 确认变量已添加到正确的环境（Production/Preview/Development）

### 访问不到API

1. 检查服务器是否正确启动
2. 查看vercel.json中的路由配置
3. 检查Supabase项目状态是否正常

---

## 📞 获取帮助

- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- GitHub Issues: [新建Issue](https://github.com/fyy315/fyy315/issues)
