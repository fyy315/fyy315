# AI商标交易撮合平台 - 环境变量配置

## 📋 需要配置的环境变量

### 1. Supabase 配置

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 公开密钥（anon） | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务密钥（**保密**） | `eyJhbGci...` |
| `SUPABASE_JWT_SECRET` | JWT 签名密钥（**保密**） | 从Supabase设置中获取 |

### 2. Supabase Storage 配置

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NEXT_PUBLIC_SUPABASE_STORAGE_URL` | Storage URL | `https://xxx.supabase.co/storage/v1/object/public` |
| `NEXT_PUBLIC_STORAGE_BUCKET` | Bucket 名称 | `uploads` |

### 3. 网站配置

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NEXT_PUBLIC_SITE_URL` | 网站域名 | `https://www.anyeb.com` |
| `NEXT_PUBLIC_SITE_NAME` | 网站名称 | `AI商标交易平台` |

---

## 🔧 配置步骤

### 步骤 1: 获取 Supabase 凭据

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 复制以下信息：
   - Project URL
   - anon public 密钥
   - service_role 密钥（需要确认）
   - JWT Secret

### 步骤 2: 配置 Storage

1. 在 Supabase Dashboard 中选择 **Storage**
2. 创建或确认 Bucket：`uploads`
3. 复制 Storage URL

### 步骤 3: 在 Vercel 中配置环境变量

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下所有变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon密钥
SUPABASE_SERVICE_ROLE_KEY=你的service密钥
SUPABASE_JWT_SECRET=你的JWT密钥
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://你的项目.supabase.co/storage/v1/object/public
NEXT_PUBLIC_STORAGE_BUCKET=uploads
NEXT_PUBLIC_SITE_URL=https://www.anyeb.com
NEXT_PUBLIC_SITE_NAME=AI商标交易平台
```

---

## ⚠️ 重要提醒

1. **永远不要提交 `.env` 文件到 GitHub**
2. **服务密钥只在服务端使用，不要暴露在前端**
3. **定期轮换密钥**
4. **确保 RLS 策略已正确配置**

---

## 📝 示例配置文件

复制此文件为 `.env.local` 用于本地开发：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Storage
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1/object/public
NEXT_PUBLIC_STORAGE_BUCKET=uploads

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=AI Trademark Exchange
```

---

## ✅ 验证配置

配置完成后，在浏览器中打开网站，应该能够：
1. 正常加载页面
2. 连接 Supabase 数据库
3. 上传文件到 Storage
4. 用户注册和登录
