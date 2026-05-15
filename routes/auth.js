// Authentication Routes - API Endpoints
// 这些是Express.js路由，处理所有认证相关的API请求

const express = require('express');
const router = express.Router();
const { authClient } = require('./supabase-auth');
const { JWTVerifier, authMiddleware } = require('./jwt-verifier');

// 初始化JWT验证器
const jwtVerifier = new JWTVerifier(process.env.SUPABASE_JWT_SECRET);

// ========================================
// 公开路由
// ========================================

// POST /api/auth/signup - 用户注册
router.post('/signup', async (req, res) => {
  try {
    const { email, password, metadata } = req.body;

    // 验证输入
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // 密码强度检查
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }

    const result = await authClient.signUp(email, password, metadata);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: result.user,
      session: result.session
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ 
      error: error.message 
    });
  }
});

// POST /api/auth/login - 用户登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证输入
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const result = await authClient.signIn(email, password);
    
    res.json({
      success: true,
      message: 'Login successful',
      user: result.user,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires_in: result.expires_in
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ 
      error: 'Invalid credentials' 
    });
  }
});

// POST /api/auth/logout - 用户退出
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await authClient.signOut(token);
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Logout failed' 
    });
  }
});

// POST /api/auth/reset-password - 请求密码重置
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    await authClient.resetPassword(email);
    
    res.json({
      success: true,
      message: 'Password reset email sent'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      error: 'Failed to send reset email' 
    });
  }
});

// ========================================
// 受保护的路由（需要登录）
// ========================================

// GET /api/auth/me - 获取当前用户信息
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    const user = await authClient.verifyToken(token);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid or expired token' 
      });
    }

    res.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Failed to get user info' 
    });
  }
});

// PUT /api/auth/profile - 更新用户资料
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    const { data } = req.body;
    const result = await authClient.updateUser(token, data);
    
    res.json({
      success: true,
      user: result
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile' 
    });
  }
});

// ========================================
// 管理员路由（需要service_role）
// ========================================

// GET /api/auth/admin/users - 列出所有用户（仅管理员）
router.get('/admin/users', async (req, res) => {
  try {
    // 验证管理员权限
    const token = req.headers.authorization?.replace('Bearer ', '');
    const result = jwtVerifier.verify(token);
    
    if (!result.valid || result.user.role !== 'service_role') {
      return res.status(403).json({ 
        error: 'Admin access required' 
      });
    }

    const users = await authClient.listUsers();
    
    res.json({
      success: true,
      count: users.length,
      users: users
    });

  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ 
      error: 'Failed to list users' 
    });
  }
});

// DELETE /api/auth/admin/users/:id - 删除用户（仅管理员）
router.delete('/admin/users/:id', async (req, res) => {
  try {
    // 验证管理员权限
    const token = req.headers.authorization?.replace('Bearer ', '');
    const result = jwtVerifier.verify(token);
    
    if (!result.valid || result.user.role !== 'service_role') {
      return res.status(403).json({ 
        error: 'Admin access required' 
      });
    }

    await authClient.deleteUser(req.params.id);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      error: 'Failed to delete user' 
    });
  }
});

// ========================================
// Token验证
// ========================================

// POST /api/auth/verify - 验证Token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        error: 'Token is required' 
      });
    }

    const result = jwtVerifier.verify(token);
    
    res.json({
      valid: result.valid,
      user: result.user || null,
      error: result.error || null
    });

  } catch (error) {
    res.status(500).json({ 
      valid: false,
      error: error.message 
    });
  }
});

// POST /api/auth/refresh - 刷新Token
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ 
        error: 'Refresh token is required' 
      });
    }

    // 调用Supabase刷新token
    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        refresh_token: refresh_token
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || data.message || 'Token refresh failed');
    }

    res.json({
      success: true,
      access_token: data.access_token,
      expires_in: data.expires_in
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ 
      error: 'Token refresh failed' 
    });
  }
});

module.exports = router;
