# Supabase Edge Functions - 部署说明

## 📁 云函数列表

| 函数名 | 功能 | 状态 |
|--------|------|------|
| `ai-search` | AI 智能搜索商标 | 待部署 |
| `ai-valuation` | AI 智能估价 | 待部署 |
| `place-bid` | 出价竞拍（含分布式锁）| 待部署 |
| `update-order-status` | 更新订单状态 | 待部署 |
| `payment-notify` | 支付回调 | 待部署 |
| `verify-invitation` | 邀请码验证 | 待部署 |
| `nl2sql` | 自然语言转 SQL | 待部署 |
| `seo-generate` | SEO 内容生成 | 待部署 |
| `ai-recommend` | AI 推荐 | 待部署 |

## 🔧 部署前准备

### 1. 安装 Supabase CLI

```bash
# Windows (使用 npm)
npm install -g supabase

# 或使用 winget
winget install Supabase.CLI

# 或下载二进制文件
# https://github.com/supabase/cli/releases
```

### 2. 登录 Supabase

```bash
supabase login
```

### 3. 链接项目

```bash
# 进入项目目录
cd E:\workspace

# 链接到 Supabase 项目
supabase link --project-ref 您的项目ID
```

## 🚀 部署命令

### 方法一：逐个部署

```bash
# 部署 AI 搜索函数
supabase functions deploy ai-search

# 部署 AI 估价函数
supabase functions deploy ai-valuation

# 部署出价函数（用于拍卖）
supabase functions deploy place-bid

# 部署其他函数...
supabase functions deploy update-order-status
supabase functions deploy payment-notify
supabase functions deploy verify-invitation
supabase functions deploy nl2sql
supabase functions deploy seo-generate
supabase functions deploy ai-recommend
```

### 方法二：批量部署脚本

创建 `deploy-functions.bat` 文件：

```batch
@echo off
echo Deploying Supabase Edge Functions...

supabase functions deploy ai-search
supabase functions deploy ai-valuation
supabase functions deploy place-bid
supabase functions deploy update-order-status
supabase functions deploy payment-notify
supabase functions deploy verify-invitation
supabase functions deploy nl2sql
supabase functions deploy seo-generate
supabase functions deploy ai-recommend

echo All functions deployed!
pause
```

### 方法三：使用 secrets（推荐）

```bash
# 设置环境变量
supabase secrets set SUPABASE_URL=https://您的项目.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=您的service-role-key

# 然后部署
supabase functions deploy ai-search --no-verify-jwt
```

## 📋 部署检查清单

- [ ] Supabase CLI 已安装
- [ ] 已登录 Supabase 账号
- [ ] 已链接项目
- [ ] 已设置必要的 secrets
- [ ] 已部署 ai-search 函数
- [ ] 已部署 ai-valuation 函数
- [ ] 已部署 place-bid 函数
- [ ] 已部署 update-order-status 函数
- [ ] 已部署 payment-notify 函数
- [ ] 已部署 verify-invitation 函数
- [ ] 已部署 nl2sql 函数
- [ ] 已部署 seo-generate 函数
- [ ] 已部署 ai-recommend 函数
- [ ] 已测试函数可访问性

## 🌐 函数访问 URL

部署成功后，函数可以通过以下 URL 访问：

```
https://您的项目.supabase.co/functions/v1/ai-search
https://您的项目.supabase.co/functions/v1/ai-valuation
https://您的项目.supabase.co/functions/v1/place-bid
https://您的项目.supabase.co/functions/v1/update-order-status
https://您的项目.supabase.co/functions/v1/payment-notify
https://您的项目.supabase.co/functions/v1/verify-invitation
https://您的项目.supabase.co/functions/v1/nl2sql
https://您的项目.supabase.co/functions/v1/seo-generate
https://您的项目.supabase.co/functions/v1/ai-recommend
```

## 🔍 本地测试

```bash
# 本地启动 Supabase
supabase start

# 本地运行函数
supabase functions serve ai-search

# 测试函数
curl -X POST http://localhost:54321/functions/v1/ai-search \
  -H "Content-Type: application/json" \
  -d '{"query": "测试"}'
```

## ⚠️ 注意事项

1. **secrets 必须在 Supabase Dashboard 中配置**
   - 访问: https://supabase.com/dashboard
   - 项目 Settings → Edge Functions → Secrets

2. **函数超时**
   - 默认超时: 60 秒
   - 如需更长超时，联系 Supabase 支持

3. **免费计划限制**
   - 每日调用次数有限
   - 考虑升级到 Pro 计划

## 📚 相关文档

- [Supabase Edge Functions 文档](https://supabase.com/docs/guides/functions)
- [Supabase CLI 文档](https://supabase.com/docs/guides/cli)

---

_创建时间：2026-05-15_