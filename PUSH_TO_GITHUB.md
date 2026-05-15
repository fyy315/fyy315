# 代码推送到 GitHub 并启用自动部署

## 📋 推送代码

### 1. 初始化Git仓库（如果还没有）

```bash
cd E:\workspace
git init
git add .
git commit -m "Initial commit with Supabase auth and Vercel deployment"
```

### 2. 添加远程仓库

```bash
git remote add origin https://github.com/fyy315/fyy315.git
```

### 3. 推送到GitHub

```bash
git branch -M main
git push -u origin main
```

---

## 🔧 配置 Vercel

### 方法1: 通过 Vercel Dashboard（推荐）

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New** → **Project**
3. 选择 **Import Git Repository**
4. 选择仓库 `fyy315/fyy315`
5. 在 **Environment Variables** 中添加：
   - `SUPABASE_URL` = `https://zizysoujrdzsqxcstilu.supabase.co`
   - `SUPABASE_ANON_KEY` = (从Supabase复制)
   - `SUPABASE_SERVICE_ROLE_KEY` = (从Supabase复制)
   - `SUPABASE_JWT_SECRET` = (从Supabase复制)
6. 点击 **Deploy**

### 方法2: 通过 Vercel CLI

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录Vercel
vercel login

# 在项目目录中
vercel

# 跟随提示完成配置
```

---

## 🔄 启用自动部署

### 配置 GitHub Actions Secrets

1. 访问 https://github.com/fyy315/fyy315/settings/secrets/actions
2. 点击 **New repository secret**
3. 添加以下Secrets：

| Secret名称 | 值 | 说明 |
|-----------|-----|------|
| `VERCEL_TOKEN` | `vcp_3nfjriSwaKsLwE6nE7Qo9r0AkJfTkonP0ZvrzPZAzMlnXRHLOL32Pqqb` | ⚠️ 已过期，请重新生成 |
| `VERCEL_ORG_ID` | 从Vercel获取 | 你的Vercel组织ID |
| `VERCEL_PROJECT_ID` | `prj_aeIz1HxegvZX4ofqBeah4OlV68nN` | 项目ID |
| `SUPABASE_URL` | `https://zizysoujrdzsqxcstilu.supabase.co` | Supabase URL |
| `SUPABASE_ANON_KEY` | (你的anon key) | 公开密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | (你的service key) | 服务密钥 |
| `SUPABASE_JWT_SECRET` | (你的JWT secret) | JWT密钥 |

### 获取 Vercel Org ID

```bash
vercel teams ls
```

或者在 Vercel Dashboard → Settings → General → Team ID

---

## ✅ 部署流程

### 每次推送代码

1. 推送代码到 GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. GitHub Actions 自动:
   - ✅ 运行测试
   - ✅ 构建项目
   - ✅ 部署到 Vercel

3. 在 GitHub Actions 页面查看状态:
   https://github.com/fyy315/fyy315/actions

### 查看部署结果

- **Preview URL**: 每次PR会生成预览URL
- **Production URL**: 合并到main后部署到生产

---

## 🚨 重要提醒

### ⚠️ Vercel Token 已暴露

你之前分享的 Vercel Token **已泄露**，必须立即：

1. **删除旧Token**: 
   访问 https://vercel.com/account/tokens 并删除

2. **生成新Token**:
   点击 **Create** 生成新Token

3. **更新GitHub Secret**:
   在 https://github.com/fyy315/fyy315/settings/secrets/actions 更新 `VERCEL_TOKEN`

### 🔐 保护敏感信息

**永远不要将以下内容推送到GitHub:**
- `.env` 文件
- 真实的API密钥
- Token和密码
- 私人证书

项目已配置 [.gitignore](file:///E:/workspace/.gitignore) 来保护 `.env` 文件。

---

## 📁 项目结构

```
fyy315/
├── .env                    # ⚠️ 不要提交！（已忽略）
├── .env.example           # ✅ 示例文件（安全）
├── .gitignore             # Git忽略配置
├── vercel.json            # Vercel配置
├── package.json           # Node.js依赖
├── server.js              # 服务器入口
├── auth-demo.html         # 认证测试页面
├── standalone-auth-test.html  # 独立测试页面
├── README.md              # 项目说明
├── DEPLOYMENT.md          # 部署指南
├── VERCEL_ENV_GUIDE.md    # 环境变量配置指南
├── PUSH_TO_GITHUB.md      # 本文件
├── lib/
│   ├── jwt-verifier.js    # JWT验证
│   └── supabase-auth.js   # Supabase认证
├── routes/
│   └── auth.js           # 认证API路由
├── .github/
│   └── workflows/
│       ├── vercel-deploy.yml  # Vercel自动部署
│       └── ci-cd.yml         # CI/CD流程
└── supabase-setup.sql    # 数据库设置脚本
```

---

## 🎯 部署后验证

部署成功后，访问你的Vercel URL测试：

```bash
# 测试健康检查
curl https://your-project.vercel.app/health

# 测试认证API
curl -X POST https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🆘 遇到问题？

### 部署失败

1. 检查 GitHub Actions 日志
2. 确认所有 Secrets 都已配置
3. 查看 [DEPLOYMENT.md](file:///E:/workspace/DEPLOYMENT.md) 故障排除部分

### 需要帮助

查看详细文档：
- [部署指南](file:///E:/workspace/DEPLOYMENT.md)
- [环境变量配置](file:///E:/workspace/VERCEL_ENV_GUIDE.md)
