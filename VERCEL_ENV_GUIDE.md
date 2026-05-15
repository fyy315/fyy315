# Vercel 环境变量配置指南

## ⚠️ 安全提醒

**请勿将这些密钥提交到GitHub！**
所有敏感信息必须通过Vercel Dashboard配置。

---

## 📋 需要配置的环境变量

### Supabase 配置

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `SUPABASE_URL` | Supabase项目URL | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase公开密钥（anon） | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase服务密钥（**保密**） | `eyJhbGci...` |
| `SUPABASE_JWT_SECRET` | JWT签名密钥（**保密**） | 从Supabase设置中获取 |

### 其他配置

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |

---

## 🔧 在 Vercel Dashboard 中配置

### 步骤 1: 访问项目设置

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目 `fangxi-s-projects/project-nvua8`
3. 点击 **Settings**（项目设置）

### 步骤 2: 配置环境变量

1. 在左侧菜单中选择 **Environment Variables**（环境变量）
2. 点击 **Add New**（新增）
3. 填写以下信息：

#### 添加 SUPABASE_URL
- **Name**: `SUPABASE_URL`
- **Value**: `https://zizysoujrdzsqxcstilu.supabase.co`
- **Environments**: 勾选 ✅ Production, ✅ Preview, ✅ Development

#### 添加 SUPABASE_ANON_KEY
- **Name**: `SUPABASE_ANON_KEY`
- **Value**: 你的Supabase公开密钥
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppenlzb3VqcmR6c3F4Y3N0aWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTExNjYsImV4cCI6MjA5NDMyNzE2Nn0.GvUgim-TY0lZsYSmvUrAO0Y1Mkn02aNsGGFdkt_0cJE
  ```
- **Environments**: 勾选 ✅ Production, ✅ Preview, ✅ Development

#### 添加 SUPABASE_SERVICE_ROLE_KEY ⚠️
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: 你的Supabase服务密钥（**保密**）
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppenlzb3VqcmR6c3F4Y3N0aWx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc1MTE2NiwiZXhwIjoyMDk0MzI3MTY2fQ.BaiYULbAO23iGZgq9AsL7vwjBrXLEpBKEHiznkEM_qw
  ```
- **Environments**: ✅ Production（**不要在Preview和Development中使用！**）

#### 添加 SUPABASE_JWT_SECRET ⚠️
- **Name**: `SUPABASE_JWT_SECRET`
- **Value**: 你的JWT密钥
  ```
  i6KNNzWOqx3TKuwu8t36tyT8OoczboboXRx5kkSc/yeRBvC3oFtQzKnR4TiNTXRPOiar/zEdNiY7dk9Xx7W6kw==
  ```
- **Environments**: ✅ Production（**保密**）

### 步骤 3: 保存

点击 **Save** 保存所有环境变量。

---

## 🚀 部署配置

### vercel.json 设置

项目根目录下的 `vercel.json` 已配置好：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

---

## 🔄 自动化部署配置

### GitHub 集成（推荐）

1. 在 Vercel 项目设置中，选择 **Git**
2. 点击 **Connect Git Repository**（连接Git仓库）
3. 选择你的仓库 `fyy315/fyy315`
4. 配置 **Build Command**（构建命令）:
   ```
   npm install && npm run build
   ```
5. 配置 **Output Directory**（输出目录）:
   ```
   .next 或 dist
   ```

### 部署触发器

#### 自动部署
- ✅ **Push to Branch**: 推送到分支时自动部署
- ✅ **Pull Request**: PR时创建预览部署
- ✅ **Merging Pull Request**: 合并PR时部署到生产环境

#### 手动部署
```bash
vercel --prod
```

---

## ✅ 验证配置

部署完成后，访问你的Vercel URL：
```
https://your-project.vercel.app
```

测试API：
```bash
curl https://your-project.vercel.app/health
```

---

## 🔒 安全最佳实践

### ✅ 应该做的
- 所有密钥存储在环境变量中
- 使用 `.env.example` 文件记录需要的变量名（不含值）
- 定期轮换密钥
- 在不同环境使用不同的密钥

### ❌ 不应该做的
- 将密钥硬编码在代码中
- 将 `.env` 文件提交到Git
- 在客户端暴露服务密钥
- 在日志中打印密钥

---

## 📞 获取Supabase密钥

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 复制以下信息：
   - **Project URL**
   - **anon public** 密钥
   - **service_role** 密钥（需要确认）
   - **JWT Secret**

---

## 🚨 密钥轮换

如果密钥泄露，立即：

1. 在Vercel中删除旧的环境变量
2. 在Supabase中Regenerate新密钥
3. 在Vercel中添加新的环境变量
4. 触发重新部署
