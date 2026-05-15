#!/bin/bash

# Supabase + Vercel 项目部署助手
# 使用方法：chmod +x deploy.sh && ./deploy.sh

clear

echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                 Supabase + Vercel 项目部署助手                       ║"
echo "║                                                                     ║"
echo "║  项目名称：fyy315                                                    ║"
echo "║  目标平台：Vercel                                                    ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查Node.js
echo -e "${GREEN}[1/10] 检查 Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装！${NC}"
    echo "   请访问 https://nodejs.org 下载并安装 Node.js 18+"
    exit 1
fi
node --version
echo -e "${GREEN}✅ Node.js 已安装${NC}"
echo ""

# 检查Git
echo -e "${GREEN}[2/10] 检查 Git...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git 未安装！${NC}"
    echo "   请访问 https://git-scm.com 下载并安装 Git"
    exit 1
fi
git --version
echo -e "${GREEN}✅ Git 已安装${NC}"
echo ""

# 检查 .env 文件
echo -e "${GREEN}[3/10] 检查环境配置...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env 文件不存在，正在从 .env.example 创建...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ 已创建 .env 文件${NC}"
    echo ""
    echo -e "${RED}❗ 重要：请编辑 .env 文件并填入真实的 Supabase 配置！${NC}"
    echo ""
    read -p "按任意键继续编辑 .env..." -n1 -s
    echo ""
    ${EDITOR:-nano} .env
    echo ""
    read -p "配置完成了吗？按任意键继续..." -n1 -s
else
    echo -e "${GREEN}✅ .env 文件已存在${NC}"
fi
echo ""

# 检查 Git 仓库
echo -e "${GREEN}[4/10] 检查 Git 仓库...${NC}"
if [ ! -d .git ]; then
    echo -e "${YELLOW}⚠️  未初始化 Git 仓库，正在初始化...${NC}"
    git init
    echo -e "${GREEN}✅ Git 仓库已初始化${NC}"
else
    echo -e "${GREEN}✅ Git 仓库已初始化${NC}"
fi
echo ""

# 检查远程仓库
echo -e "${GREEN}[5/10] 检查远程仓库...${NC}"
if ! git remote -v | grep -q "origin"; then
    echo -e "${YELLOW}⚠️  未配置远程仓库${NC}"
    echo "   正在添加 GitHub 远程仓库..."
    git remote add origin https://github.com/fyy315/fyy315.git
    echo -e "${GREEN}✅ 已添加远程仓库${NC}"
else
    echo -e "${GREEN}✅ 远程仓库已配置${NC}"
fi
echo ""

# 添加文件
echo -e "${GREEN}[6/10] 添加文件到 Git...${NC}"
git add .
echo -e "${GREEN}✅ 文件已添加${NC}"
echo ""

# 提交
echo -e "${GREEN}[7/10] 创建提交...${NC}"
datetime=$(date +"%Y%m%d_%H%M%S")
if ! git commit -m "部署: $datetime" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  没有新内容需要提交，或者已提交过${NC}"
else
    echo -e "${GREEN}✅ 提交已创建${NC}"
fi
echo ""

# 推送到 GitHub
echo -e "${GREEN}[8/10] 推送到 GitHub...${NC}"
echo ""
echo "现在将代码推送到 GitHub 仓库："
echo "https://github.com/fyy315/fyy315"
echo ""
echo "请输入您的 GitHub 凭据（首次推送需要）"
echo ""
if ! git push -u origin main; then
    echo ""
    echo -e "${RED}❌ 推送到 GitHub 失败！${NC}"
    echo ""
    echo "可能的原因："
    echo "  - 远程仓库不存在或访问被拒绝"
    echo "  - 分支名不匹配（可能是 master 而不是 main）"
    echo "  - 网络连接问题"
    echo ""
    echo "请手动运行：git push -u origin main"
    exit 1
fi
echo -e "${GREEN}✅ 成功推送到 GitHub！${NC}"
echo ""

# 检查 Vercel CLI
echo -e "${GREEN}[9/10] 检查 Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI 未安装，正在安装...${NC}"
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 安装失败${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Vercel CLI 已安装${NC}"
fi
echo ""

# 部署到 Vercel
echo -e "${GREEN}[10/10] 部署到 Vercel...${NC}"
echo ""
echo "🚀 现在开始部署到 Vercel！"
echo ""
echo "首次部署需要登录 Vercel，按提示操作。"
echo ""
if ! vercel whoami 2>/dev/null; then
    vercel login
fi
echo ""
if vercel; then
    echo -e "${GREEN}✅ 部署到 Vercel 成功！${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  部署过程可能需要您手动确认${NC}"
    echo "   如果看到错误，请尝试手动运行：vercel"
    echo ""
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ 部署流程完成！${NC}"
echo ""
echo "📋 后续步骤："
echo ""
echo "1️⃣  配置 Vercel 环境变量"
echo "   访问：https://vercel.com/fangxi-s-projects/project-nvua8"
echo "   Settings → Environment Variables"
echo "   添加：SUPABASE_URL, SUPABASE_ANON_KEY, etc."
echo ""
echo "2️⃣  查看部署状态"
echo "   访问：https://vercel.com/dashboard"
echo ""
echo "3️⃣  设置自动部署（推荐）"
echo "   在 Vercel 中连接 GitHub 仓库"
echo ""
echo "📚 更多帮助请查看："
echo "   - DEPLOYMENT.md          完整部署文档"
echo "   - VERCEL_ENV_GUIDE.md   环境变量配置指南"
echo "   - PUSH_TO_GITHUB.md     代码推送指南"
echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
