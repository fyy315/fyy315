// Supabase Authentication Server
// 运行此服务器: node server.js

require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API路由
app.use('/api/auth', authRoutes);

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth-demo.html'));
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabase: {
      url: process.env.SUPABASE_URL ? 'configured' : 'missing',
      anonKey: process.env.SUPABASE_ANON_KEY ? 'configured' : 'missing'
    }
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API documentation: http://localhost:${PORT}/api/auth`);
});
