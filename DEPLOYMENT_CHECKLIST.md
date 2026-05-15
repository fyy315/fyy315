# AI 商标交易平台 - 部署检查清单

## 📋 快速开始

1. 首先阅读 [AI_TRADEMARK_ENV_GUIDE.md](file:///E:/workspace/AI_TRADEMARK_ENV_GUIDE.md)
2. 按照以下步骤逐一完成
3. 每完成一项在方框中打勾

---

## 🗄️ 第一阶段：Supabase 数据库配置

### 1.1 登录 Supabase Dashboard

- [ ] 访问 https://supabase.com/dashboard
- [ ] 选择您的项目或创建新项目

### 1.2 创建数据库表

在 SQL Editor 中执行以下脚本（按顺序）：

**第一步：执行初始建库脚本**
- [ ] 复制 `migrations/20260514_074851_init_trademark_platform.sql` 内容
- [ ] 粘贴到 Supabase SQL Editor
- [ ] 点击 "Run" 执行
- [ ] 确认以下表已创建：
  - [ ] users
  - [ ] user_roles
  - [ ] trademarks
  - [ ] monitor_my_trademarks
  - [ ] listings
  - [ ] bids
  - [ ] orders
  - [ ] user_evidences
  - [ ] user_applications
  - [ ] api_keys

**第二步：执行扩展脚本**
- [ ] 复制 `migrations/20260514_081401_add_distributed_locks_and_invitation.sql` 内容
- [ ] 粘贴到 Supabase SQL Editor
- [ ] 点击 "Run" 执行
- [ ] 确认以下表已创建：
  - [ ] distributed_locks（用于拍卖防超卖）
  - [ ] invitation_codes（中介邀请码）
  - [ ] payments（支付记录）
  - [ ] referral_tracking（裂变追踪）

### 1.3 创建 Storage Bucket

- [ ] 访问 Storage 页面
- [ ] 点击 "New bucket"
- [ ] 填写名称：`uploads`
- [ ] 设置为 Public bucket
- [ ] 确认创建成功

### 1.4 获取 API 凭据

在 Settings > API 中获取：

- [ ] Project URL: `https://xxxx.supabase.co`
- [ ] anon/public key: `eyJ...`（前端可用）
- [ ] service_role key: `eyJ...`（**保密，仅服务端**）
- [ ] JWT Secret: `xxxx...`（**保密**）

---

## 🔐 第二阶段：环境变量配置

### 2.1 本地环境文件

- [ ] 复制 `.env.example` 为 `.env.local`
- [ ] 填入实际的 Supabase 凭据

```env
# 必需的环境变量
NEXT_PUBLIC_SUPABASE_URL=https://您的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=您的anon-key
SUPABASE_SERVICE_ROLE_KEY=您的service-role-key（仅服务器）
SUPABASE_JWT_SECRET=您的jwt-secret

# Storage 配置
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://您的项目.supabase.co/storage/v1/object/public
NEXT_PUBLIC_STORAGE_BUCKET=uploads

# 应用配置
NEXT_PUBLIC_SITE_URL=https://www.anyeb.com
NEXT_PUBLIC_APP_NAME=AI商标交易平台
```

### 2.2 GitHub Secrets 配置

在 GitHub 仓库 Settings > Secrets 中添加：

- [ ] `SUPABASE_URL` = 您的项目 URL
- [ ] `SUPABASE_ANON_KEY` = 您的 anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = 您的 service role key
- [ ] `SUPABASE_JWT_SECRET` = 您的 JWT secret

### 2.3 Vercel 环境变量

在 Vercel Dashboard > Settings > Environment Variables 中配置：

**Production 和 Preview 环境：**
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_STORAGE_BUCKET` = `uploads`

**仅 Production 环境（机密）：**
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `SUPABASE_JWT_SECRET`

---

## 📤 第三阶段：代码推送

### 3.1 Git 操作

```bash
# 确保在项目目录
cd E:\workspace

# 添加所有文件
git add .

# 创建提交
git commit -m "feat: AI商标交易平台初始部署

- 使用环境变量配置 Supabase
- 包含完整数据库表结构
- 包含 9 个云函数
- 支持多语言 (zh/en/ja/ko/fr/de)
- 包含拍卖防超卖机制"

# 推送到 GitHub
git push -u origin main
```

- [ ] 确认 git add 已执行
- [ ] 确认 git commit 已成功
- [ ] 确认 git push 已完成

### 3.2 GitHub Actions 验证

- [ ] 访问 GitHub 仓库 Actions 页面
- [ ] 确认 CI/CD workflow 正在运行
- [ ] 确认部署到 Vercel 成功

---

## 🚀 第四阶段：Vercel 部署

### 4.1 Vercel 项目配置

- [ ] 登录 https://vercel.com
- [ ] 导入 GitHub 仓库
- [ ] 配置构建命令：`npm run build` 或使用默认
- [ ] 配置输出目录：根据框架配置（dist, build, .next 等）

### 4.2 域名配置

- [ ] 在 Vercel 中添加域名：`www.anyeb.com`
- [ ] 配置 DNS 记录指向 Vercel
- [ ] 等待 SSL 证书自动配置
- [ ] 确认域名可访问

---

## ✅ 第五阶段：验证测试

### 5.1 基础功能测试

在浏览器中访问 `https://www.anyeb.com`：

- [ ] 页面正常加载
- [ ] 语言切换正常（支持 zh/en/ja/ko/fr/de）
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] 商标搜索功能正常

### 5.2 数据库连接测试

- [ ] 执行数据库查询正常
- [ ] 用户数据正确存储
- [ ] RLS 策略正常工作

### 5.3 云函数测试

测试以下端点（假设部署在 /api 下）：

- [ ] AI 搜索功能：`/api/ai-search`
- [ ] AI 估价功能：`/api/ai-valuation`
- [ ] 出价功能：`/api/place-bid`
- [ ] 订单更新：`/api/update-order-status`

### 5.4 文件上传测试

- [ ] 上传图片到 Storage 正常
- [ ] 公开访问上传的文件正常

---

## 🔒 第六阶段：安全检查

### 6.1 密钥检查

- [ ] 没有硬编码的 API 密钥在源码中
- [ ] 所有密钥使用环境变量
- [ ] `.env` 文件在 `.gitignore` 中
- [ ] service_role key 未暴露在前端

### 6.2 数据库安全

- [ ] RLS 策略已启用
- [ ] 用户只能访问自己的数据
- [ ] 敏感操作需要认证

---

## 📞 第七阶段：云函数部署

### 7.1 Supabase Edge Functions

将以下函数部署到 Supabase：

- [ ] `functions/ai-search/index.ts` - AI 智能搜索
- [ ] `functions/ai-valuation/index.ts` - AI 智能估价
- [ ] `functions/place-bid/index.ts` - 出价竞拍（含分布式锁）
- [ ] `functions/update-order-status/index.ts` - 更新订单状态
- [ ] `functions/payment-notify/index.ts` - 支付回调
- [ ] `functions/verify-invitation/index.ts` - 邀请码验证
- [ ] `functions/nl2sql/index.ts` - 自然语言转 SQL
- [ ] `functions/seo-generate/index.ts` - SEO 内容生成
- [ ] `functions/ai-recommend/index.ts` - AI 推荐

部署命令：
```bash
supabase functions deploy ai-search
supabase functions deploy ai-valuation
supabase functions deploy place-bid
# ... 其他函数
```

---

## 📊 完成后记录

| 项目 | 状态 | 备注 |
|------|------|------|
| Supabase 数据库 | ⬜ | 完成后打勾 |
| Storage Bucket | ⬜ | 完成后打勾 |
| 环境变量配置 | ⬜ | 完成后打勾 |
| GitHub 推送 | ⬜ | 完成后打勾 |
| Vercel 部署 | ⬜ | 完成后打勾 |
| 域名解析 | ⬜ | 完成后打勾 |
| 功能测试 | ⬜ | 完成后打勾 |
| 安全检查 | ⬜ | 完成后打勾 |

---

## 🆘 遇到问题？

1. **数据库迁移失败**：检查 SQL 语法，确保在正确的数据库中执行
2. **部署失败**：查看 Vercel 日志，修复构建错误
3. **环境变量不生效**：清除缓存，重新构建
4. **CORS 错误**：检查云函数的 CORS 头配置

---

## 📚 相关文档

- [环境变量配置指南](file:///E:/workspace/AI_TRADEMARK_ENV_GUIDE.md)
- [完整部署指南](file:///E:/workspace/FULL_DEPLOYMENT_GUIDE.md)
- [数据库建库脚本](file:///E:/workspace/migrations/20260514_074851_init_trademark_platform.sql)
- [扩展脚本](file:///E:/workspace/migrations/20260514_081401_add_distributed_locks_and_invitation.sql)

---

_创建时间：2026-05-15_
_最后更新：2026-05-15_