import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Key, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAppStore } from '../store';

export default function InvitationCodePage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user, setCurrentRole } = useAppStore();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setLoading(true);
    setError('');

    try {
      const { data: invitation } = await supabase
        .from('invitation_codes')
        .select('*')
        .eq('code', code.trim())
        .eq('is_active', true)
        .single();

      if (!invitation) {
        setError('邀请码无效或已过期');
        setLoading(false);
        return;
      }

      if (invitation.used_count >= invitation.max_uses) {
        setError('邀请码使用次数已达上限');
        setLoading(false);
        return;
      }

      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user?.id,
          role: 'agent',
          is_active: true
        });

      if (roleError) throw roleError;

      await supabase
        .from('invitation_codes')
        .update({ used_count: invitation.used_count + 1 })
        .eq('id', invitation.id);

      setSuccess(true);
      setTimeout(() => {
        setCurrentRole('agent');
        navigate('/agent/orders');
      }, 1500);

    } catch (err: any) {
      setError(err.message || '验证失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243e 100%)' }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(108, 92, 231, 0.1) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(108, 92, 231, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl relative z-10"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #00D2FF 100%)' }}>
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">开通中介服务</h1>
          <p className="text-gray-400">输入邀请码成为平台中介</p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">开通成功</h3>
            <p className="text-gray-400">正在跳转至中介工作台...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">邀请码</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="请输入邀请码（如：AGENT2024）"
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                style={{ 
                  background: 'rgba(255,255,255,0.08)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-red-400 text-sm py-2 px-3 rounded-lg"
                style={{ background: 'rgba(255,107,107,0.1)' }}>
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full py-3 rounded-lg text-white font-medium transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #00D2FF 100%)' }}>
              {loading ? '验证中...' : '验证并开通'}
            </motion.button>

            <button
              type="button"
              onClick={() => navigate('/role-select')}
              className="w-full py-3 text-gray-400 hover:text-white transition-colors text-sm">
              返回角色选择
            </button>
          </form>
        )}

        <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(108,92,231,0.1)', border: '1px solid rgba(108,92,231,0.2)' }}>
          <p className="text-xs text-gray-400 text-center">
            中介服务需邀请码开通，请联系平台管理员获取
          </p>
        </div>
      </motion.div>
    </div>
  );
}
