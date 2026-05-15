// Supabase Authentication Client
// 从环境变量读取配置，不要硬编码密钥

require('dotenv').config();

class SupabaseAuthClient {
  constructor() {
    this.url = process.env.SUPABASE_URL;
    this.anonKey = process.env.SUPABASE_ANON_KEY;
    this.serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!this.url || !this.anonKey) {
      throw new Error('Missing Supabase configuration. Check .env file.');
    }
  }

  // 获取HTTP头
  getHeaders(isAdmin = false) {
    const key = isAdmin ? this.serviceKey : this.anonKey;
    return {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  // 注册新用户
  async signUp(email, password, metadata = {}) {
    const response = await fetch(`${this.url}/auth/v1/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        email: email,
        password: password,
        data: metadata
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || data.message || 'Signup failed');
    }

    return data;
  }

  // 用户登录
  async signIn(email, password) {
    const response = await fetch(`${this.url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || data.message || 'Login failed');
    }

    return data;
  }

  // 退出登录
  async signOut(accessToken) {
    const response = await fetch(`${this.url}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'apikey': this.anonKey,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return response.ok;
  }

  // 验证Token（使用Supabase）
  async verifyToken(accessToken) {
    const response = await fetch(`${this.url}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'apikey': this.anonKey,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  }

  // 获取用户信息
  async getUser(accessToken) {
    return this.verifyToken(accessToken);
  }

  // 发送密码重置邮件
  async resetPassword(email) {
    const response = await fetch(`${this.url}/auth/v1/recover`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email })
    });

    return response.ok;
  }

  // 更新用户信息
  async updateUser(accessToken, attributes) {
    const response = await fetch(`${this.url}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'apikey': this.anonKey,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(attributes)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || data.message || 'Update failed');
    }

    return data;
  }

  // 删除用户（需要service_role key）
  async deleteUser(userId) {
    if (!this.serviceKey) {
      throw new Error('Service role key required for this operation');
    }

    const response = await fetch(`${this.url}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.serviceKey}`,
        'apikey': this.serviceKey
      }
    });

    return response.ok;
  }

  // 列出所有用户（需要service_role key）
  async listUsers() {
    if (!this.serviceKey) {
      throw new Error('Service role key required for this operation');
    }

    const response = await fetch(`${this.url}/auth/v1/admin/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.serviceKey}`,
        'apikey': this.serviceKey
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || data.message || 'Failed to list users');
    }

    return data.users;
  }
}

// 创建单例实例
const authClient = new SupabaseAuthClient();

module.exports = { SupabaseAuthClient, authClient };
