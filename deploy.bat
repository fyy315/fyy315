@echo off
chcp 65001 >nul
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                 Supabase + Vercel 项目部署助手                       ║
echo ║                                                                     ║
echo ║  项目名称：fyy315                                                    ║
echo ║  目标平台：Vercel                                                    ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

REM 检查Node.js
echo [1/10] 检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安装！
    echo    请访问 https://nodejs.org 下载并安装 Node.js 18+
    pause
    exit /b 1
)
echo ✅ Node.js 已安装
echo.

REM 检查Git
echo [2/10] 检查 Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git 未安装！
    echo    请访问 https://git-scm.com 下载并安装 Git
    pause
    exit /b 1
)
echo ✅ Git 已安装
echo.

REM 检查 .env 文件
echo [3/10] 检查环境配置...
if not exist .env (
    echo ⚠️  .env 文件不存在，正在从 .env.example 创建...
    copy .env.example .env >nul
    echo ✅ 已创建 .env 文件
    echo.
    echo ❗ 重要：请编辑 .env 文件并填入真实的 Supabase 配置！
    echo.
    echo 按下任意键继续编辑 .env...
    pause >nul
    notepad .env
    echo.
    echo 配置完成了吗？继续下一步前确认已保存。
    pause
) else (
    echo ✅ .env 文件已存在
)
echo.

REM 检查 Git 仓库
echo [4/10] 检查 Git 仓库...
if not exist .git (
    echo ⚠️  未初始化 Git 仓库，正在初始化...
    git init
    echo ✅ Git 仓库已初始化
) else (
    echo ✅ Git 仓库已初始化
)
echo.

REM 检查远程仓库
echo [5/10] 检查远程仓库...
git remote -v | findstr "origin" >nul
if errorlevel 1 (
    echo ⚠️  未配置远程仓库
    echo    正在添加 GitHub 远程仓库...
    git remote add origin https://github.com/fyy315/fyy315.git
    echo ✅ 已添加远程仓库
) else (
    echo ✅ 远程仓库已配置
)
echo.

REM 添加文件
echo [6/10] 添加文件到 Git...
git add .
echo ✅ 文件已添加
echo.

REM 提交
echo [7/10] 创建提交...
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set datetime=%datetime:~0,4%%datetime:~4,2%%datetime:~6,2%_%datetime:~8,2%%datetime:~10,2%%datetime:~12,2%
git commit -m "部署: %datetime%" 2>nul
if errorlevel 1 (
    echo ⚠️  没有新内容需要提交，或者已提交过
) else (
    echo ✅ 提交已创建
)
echo.

REM 推送到 GitHub
echo [8/10] 推送到 GitHub...
echo.
echo 现在将代码推送到 GitHub 仓库：
echo https://github.com/fyy315/fyy315
echo.
echo 请输入您的 GitHub 凭据（首次推送需要）
echo.
git push -u origin main
if errorlevel 1 (
    echo.
    echo ❌ 推送到 GitHub 失败！
    echo.
    echo 可能的原因：
    echo   - 远程仓库不存在或访问被拒绝
    echo   - 分支名不匹配（可能是 master 而不是 main）
    echo   - 网络连接问题
    echo.
    echo 请手动运行：git push -u origin main
    pause
    exit /b 1
)
echo ✅ 成功推送到 GitHub！
echo.

REM 部署到 Vercel
echo [9/10] 准备部署到 Vercel...
echo.
echo 检查 Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Vercel CLI 未安装，正在安装...
    npm install -g vercel
    if errorlevel 1 (
        echo ❌ 安装失败
        pause
        exit /b 1
    )
    echo ✅ Vercel CLI 已安装
)
echo.

echo [10/10] 部署到 Vercel...
echo.
echo 🚀 现在开始部署到 Vercel！
echo.
echo 首次部署需要登录 Vercel，按提示操作。
echo.
vercel login
if errorlevel 1 (
    echo ❌ Vercel 登录失败
    pause
    exit /b 1
)
echo.
vercel
if errorlevel 1 (
    echo.
    echo ⚠️  部署过程可能需要您手动确认
    echo    如果看到错误，请尝试手动运行：vercel
    echo.
)

echo.
echo ════════════════════════════════════════════════════════════════════
echo.
echo ✅ 部署流程完成！
echo.
echo 📋 后续步骤：
echo.
echo 1️⃣  配置 Vercel 环境变量
echo    访问：https://vercel.com/fangxi-s-projects/project-nvua8
echo    Settings → Environment Variables
echo    添加：SUPABASE_URL, SUPABASE_ANON_KEY, etc.
echo.
echo 2️⃣  查看部署状态
echo    访问：https://vercel.com/dashboard
echo.
echo 3️⃣  设置自动部署（推荐）
echo    在 Vercel 中连接 GitHub 仓库
echo.
echo 📚 更多帮助请查看：
echo    - DEPLOYMENT.md          完整部署文档
echo    - VERCEL_ENV_GUIDE.md   环境变量配置指南
echo    - PUSH_TO_GITHUB.md     代码推送指南
echo.
echo ════════════════════════════════════════════════════════════════════
echo.
echo 按任意键关闭...
pause >nul
