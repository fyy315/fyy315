// JWT Verification Utility
// ！！！重要：请勿将此文件推送到GitHub！！！!
// 密钥应存储在环境变量中，不要硬编码

class JWTVerifier {
  constructor(jwtSecret) {
    this.secret = jwtSecret;
  }

  // Base64URL解码
  base64UrlDecode(str) {
    // 将 Base64URL 转换为标准 Base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // 添加填充
    const padding = base64.length % 4;
    if (padding) {
      base64 += '='.repeat(4 - padding);
    }
    
    // 解码
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    return decoded;
  }

  // 验证JWT签名
  verifySignature(header, payload, signature) {
    // 创建签名字符串
    const content = `${header}.${payload}`;
    
    // 使用HMAC SHA256验证
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', this.secret)
      .update(content)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    return signature === expectedSignature;
  }

  // 验证JWT Token
  verify(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const [headerB64, payloadB64, signatureB64] = parts;
      
      // 解码header和payload
      const header = JSON.parse(this.base64UrlDecode(headerB64));
      const payload = JSON.parse(this.base64UrlDecode(payloadB64));
      
      // 验证签名
      if (!this.verifySignature(headerB64, payloadB64, signatureB64)) {
        throw new Error('Invalid signature');
      }

      // 检查过期时间
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        throw new Error('Token expired');
      }

      // 检查生效时间
      if (payload.nbf && Date.now() < payload.nbf * 1000) {
        throw new Error('Token not yet valid');
      }

      return {
        valid: true,
        payload: payload,
        user: {
          id: payload.sub,
          email: payload.email,
          role: payload.role
        }
      };

    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // 从请求中提取Token
  extractToken(req) {
    // 从 Authorization header 提取
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // 从 cookie 提取
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }

    // 从 query string 提取
    if (req.query && req.query.token) {
      return req.query.token;
    }

    return null;
  }
}

// 认证中间件
function authMiddleware(jwtVerifier) {
  return (req, res, next) => {
    const token = jwtVerifier.extractToken(req);
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    const result = jwtVerifier.verify(token);
    
    if (!result.valid) {
      return res.status(401).json({ 
        error: result.error || 'Invalid token' 
      });
    }

    // 将用户信息附加到请求对象
    req.user = result.user;
    next();
  };
}

module.exports = { JWTVerifier, authMiddleware };
