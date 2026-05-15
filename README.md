# Supabase + Vercel 认证系统

一个功能完整的用户认证系统，使用 Supabase 作为后端，Vercel 作为部署平台。

## ✨ 功能特性

- 🚀 完整的用户认证（注册、登录、登出）
- 🔐 JWT Token 验证
- 🛡️ Row Level Security (RLS) 保护数据
- 📱 响应式 Web 界面
- ⚡ Vercel 自动化部署
- 🔄 GitHub Actions CI/CD

## 📁 项目结构

```
fyy315/
├── .env                          # ⚠️ 环境变量（不要提交！）
├── .env.example                 # 环境变量示例（安全）
├── .gitignore                   # Git 忽略配置
├── vercel.json                  # Vercel 部署配置
├── package.json                 # Node.js 依赖
├── server.js                    # Express 服务器
├── standalone-auth-test.html   # 独立测试页面
├── supabase-setup.sql          # 数据库设置脚本
├── deploy.bat                  # Windows 一键部署
├── deploy.sh                   # Mac/Linux 一键部署
├── lib/
│   ├── jwt-verifier.js         # JWT 验证工具
│   └── supabase-auth.js        # Supabase 认证客户端
├── routes/
│   └── auth.js                 # 认证 API 路由
├── .github/
│   └── workflows/
│       ├── vercel-deploy.yml    # Vercel 自动部署
│       └── ci-cd.yml           # 完整 CI/CD
├── README.md                   # 本文件
├── FULL_DEPLOYMENT_GUIDE.md    # 📖 完整部署指南
├── DEPLOYMENT.md               # 部署文档
├── VERCEL_ENV_GUIDE.md        # 环境变量配置
├── PUSH_TO_GITHUB.md          # 代码推送指南
└── DEPLOYMENT_CHECKLIST.md    # ✅ 部署检查清单
```

## 🚀 快速开始

### 方式一：一键部署（推荐）

#### Windows 用户：
双击运行 `deploy.bat`

#### Mac/Linux 用户：
```bash
chmod +x deploy.sh
./deploy.sh
```

### 方式二：手动部署

详见文档：
- [FULL_DEPLOYMENT_GUIDE.md](file:///E:/workspace/FULL_DEPLOYMENT_GUIDE.md) - 完整部署指南
- [DEPLOYMENT_CHECKLIST.md](file:///E:/workspace/DEPLOYMENT_CHECKLIST.md) - 部署检查清单

### 1. 本地配置

```bash
# 复制环境变量示例
cp .env.example .env

# 编辑 .env 文件，填入你的 Supabase 凭据
```

### 2. 安装依赖

```bash
npm install
```

### 3. 设置数据库

在 Supabase Dashboard 中：

1. 进入 **SQL Editor**
2. 复制 `supabase-setup.sql` 的内容
3. 粘贴并执行

### 4. 本地测试

打开 `standalone-auth-test.html` 在浏览器中测试认证功能！

## 🔐 安全特性

### Row Level Security (RLS)
- ✅ 用户只能访问自己的数据
- ✅ 所有表都启用了RLS
- ✅ 使用 `auth.uid()` 验证用户身份

### JWT验证
- ✅ Token签名验证
- ✅ 过期时间检查
- ✅ 权限级别检查

### API安全
- ✅ 所有密钥存储在环境变量
- ✅ 支持公开和受保护的路由
- ✅ 管理员路由需要service_role

## 📡 API端点

### 公开端点
- `POST /api/auth/signup` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户退出
- `POST /api/auth/reset-password` - 重置密码
- `POST /api/auth/verify` - 验证Token
- `POST /api/auth/refresh` - 刷新Token

### 受保护端点（需要登录）
- `GET /api/auth/me` - 获取当前用户
- `PUT /api/auth/profile` - 更新用户资料

### 管理员端点（需要service_role）
- `GET /api/auth/admin/users` - 列出所有用户
- `DELETE /api/auth/admin/users/:id` - 删除用户

## 🧪 本地测试

### 使用Postman或curl

#### 注册
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### 登录
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### 获取用户信息
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🚀 部署到 Vercel

### 前置条件

1. ✅ 在 GitHub 上有仓库：https://github.com/fyy315/fyy315
2. ✅ 在 Vercel 上有项目：project-nvua8
3. ✅ 已配置所有环境变量

### 部署步骤

详见 [FULL_DEPLOYMENT_GUIDE.md](file:///E:/workspace/FULL_DEPLOYMENT_GUIDE.md)

### 快速命令

```bash
# 1. 推送到 GitHub
git add .
git commit -m "部署"
git push -u origin main

# 2. 部署到 Vercel
npm install -g vercel
vercel --prod
```

## 📚 文档索引

| 文档 | 说明 |
|------|------|
| [FULL_DEPLOYMENT_GUIDE.md](file:///E:/workspace/FULL_DEPLOYMENT_GUIDE.md) | 📖 完整部署指南（推荐先看这个） |
| [DEPLOYMENT_CHECKLIST.md](file:///E:/workspace/DEPLOYMENT_CHECKLIST.md) | ✅ 部署检查清单 |
| [VERCEL_ENV_GUIDE.md](file:///E:/workspace/VERCEL_ENV_GUIDE.md) | 🔐 环境变量配置详解 |
| [PUSH_TO_GITHUB.md](file:///E:/workspace/PUSH_TO_GITHUB.md) | 📤 代码推送和部署 |
| [DEPLOYMENT.md](file:///E:/workspace/DEPLOYMENT.md) | Vercel 部署说明 |

## ⚠️ 安全提醒

1. **🚨 立即删除泄露的 Vercel Token！**
   - 访问：https://vercel.com/account/tokens
   - 删除旧 Token，重新生成新 Token

2. **永远不要提交 `.env` 文件到 Git**
   - `.env` 已在 `.gitignore` 中

3. **定期轮换 API 密钥**
   - Supabase API 密钥
   - Vercel Token

4. **使用 HTTPS**
5. **配置适当的 RLS 策略**
6. **验证所有用户输入**

## 📞 问题排查

部署遇到问题？查看：
- [FULL_DEPLOYMENT_GUIDE.md](file:///E:/workspace/FULL_DEPLOYMENT_GUIDE.md) 故障排除部分
- 查看 Vercel 部署日志
- 检查 GitHub Actions 运行日志

## 📚 参考资料

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions)
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [JWT.io](https://jwt.io/)

---

**祝部署顺利！🎉**
