import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { supabase } from '../supabase/client';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const email = `${username}@meoo.local`;
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/role-select');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } }
        });
        if (error) throw error;
        navigate('/role-select');
      }
    } catch (err: any) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243e 100%)' }}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl" style={{ background: '#6C5CE7' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl" style={{ background: '#00D2FF' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl relative z-10"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI商标交易</h1>
          <p className="text-gray-400">智能撮合 · 安全交易</p>
        </div>

        <div className="flex mb-6 rounded-lg overflow-hidden">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-sm font-medium transition-all ${
              isLogin ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
            style={{ background: isLogin ? '#6C5CE7' : 'rgba(255,255,255,0.05)' }}>
            登录
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-sm font-medium transition-all ${
              !isLogin ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
            style={{ background: !isLogin ? '#6C5CE7' : 'rgba(255,255,255,0.05)' }}>
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', '--tw-ring-color': '#6C5CE7' }}
              placeholder="请输入用户名"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', '--tw-ring-color': '#6C5CE7' }}
              placeholder="请输入密码"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center py-2 rounded"
              style={{ background: 'rgba(255,107,107,0.1)' }}>
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-medium transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #00D2FF 100%)' }}>
            {loading ? '处理中...' : isLogin ? '登录' : '注册'}
          </motion.button>
        </form>

        <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(0,210,255,0.1)', border: '1px solid rgba(0,210,255,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: '#00D2FF' }} />
            <span className="text-sm font-medium" style={{ color: '#00D2FF' }}>AI免费估价</span>
          </div>
          <p className="text-xs text-gray-400">新用户注册即可免费获取一次AI商标估价服务</p>
        </div>
      </motion.div>
    </div>
  );
}
