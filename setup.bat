@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════════
echo   Supabase Authentication System - Quick Setup
echo ═══════════════════════════════════════════════════════════════
echo.

echo [1/5] 检查 Node.js 安装状态...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安装！
    echo    请访问 https://nodejs.org 下载并安装
    pause
    exit /b 1
)
echo ✅ Node.js 已安装
echo.

echo [2/5] 安装项目依赖...
npm install
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✅ 依赖安装完成
echo.

echo [3/5] 检查 .env 配置文件...
if not exist .env (
    echo ⚠️  .env 文件不存在，正在创建...
    echo SUPABASE_URL=https://your-project.supabase.co > .env
    echo SUPABASE_ANON_KEY=your-anon-key >> .env
    echo SUPABASE_SERVICE_ROLE_KEY=your-service-role-key >> .env
    echo SUPABASE_JWT_SECRET=your-jwt-secret >> .env
    echo.
    echo ❗ 请编辑 .env 文件并填入你的 Supabase 配置
    echo    然后运行: notepad .env
    pause
    exit /b 1
)
echo ✅ .env 配置文件存在
echo.

echo [4/5] 数据库设置说明...
echo.
echo 请在 Supabase Dashboard 中执行以下操作:
echo   1. 打开: https://supabase.com/dashboard
echo   2. 选择你的项目
echo   3. 进入 SQL Editor
echo   4. 复制 supabase-setup.sql 的内容
echo   5. 粘贴并执行
echo.
echo 是否继续启动服务器? (按任意键继续，Ctrl+C 取消)
pause > nul
echo.

echo [5/5] 启动服务器...
echo.
echo ═══════════════════════════════════════════════════════════════
echo   服务器即将启动
echo   访问地址: http://localhost:3000
echo   认证页面: http://localhost:3000/auth-demo.html
echo   API端点:  http://localhost:3000/api/auth
echo ═══════════════════════════════════════════════════════════════
echo.
node server.js
