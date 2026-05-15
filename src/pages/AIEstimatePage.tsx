import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Share2, Lock, TrendingUp, Shield, Clock } from 'lucide-react';
import { supabase } from '../supabase/client';

interface EstimateResult {
  trademark_name: string;
  estimated_value: number;
  price_range: { min: number; max: number };
  factors: { name: string; score: number; weight: number }[];
}

export default function AIEstimatePage() {
  const navigate = useNavigate();
  const [trademarkName, setTrademarkName] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [hasUsed, setHasUsed] = useState(localStorage.getItem('ai_estimate_used') === 'true');

  const categories = ['第9类', '第25类', '第35类', '第42类'];

  const handleEstimate = async () => {
    if (!trademarkName || !category) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-valuation', {
        body: { trademark_name: trademarkName, category }
      });
      
      if (error) throw error;
      
      setResult(data.data);
      localStorage.setItem('ai_estimate_used', 'true');
      setHasUsed(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    alert('分享成功！请注册查看完整报告');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243e 100%)' }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(108, 92, 231, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(108, 92, 231, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg p-8 rounded-2xl backdrop-blur-xl relative z-10"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(0,210,255,0.1)', border: '1px solid rgba(0,210,255,0.3)' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#00D2FF' }} />
            <span className="text-sm font-medium" style={{ color: '#00D2FF' }}>AI智能估价</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">商标价值评估</h1>
          <p className="text-gray-400">基于大数据和AI算法智能估价</p>
          {hasUsed && (
            <p className="text-yellow-400 text-sm mt-2">您已使用免费估价次数，注册后可无限次使用</p>
          )}
        </div>

        {!result ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">商标名称</label>
              <input
                type="text"
                value={trademarkName}
                onChange={(e) => setTrademarkName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', '--tw-ring-color': '#6C5CE7' }}
                placeholder="请输入商标名称"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">国际分类</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', '--tw-ring-color': '#6C5CE7' }}
              >
                <option value="" className="bg-slate-800">请选择分类</option>
                {categories.map(c => (
                  <option key={c} value={c} className="bg-slate-800">{c}</option>
                ))}
              </select>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEstimate}
              disabled={loading || !trademarkName || !category || hasUsed}
              className="w-full py-4 rounded-lg text-white font-medium transition-all disabled:opacity-50 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #00D2FF 100%)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              {loading ? '评估中...' : hasUsed ? '免费次数已用完' : '立即估价'}
            </motion.button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="text-center p-6 rounded-xl" style={{ background: 'rgba(108,92,231,0.1)', border: '1px solid rgba(108,92,231,0.3)' }}>
              <p className="text-gray-400 text-sm mb-2">预估价值</p>
              <p className="text-4xl font-bold text-white mb-2">¥{result.estimated_value.toLocaleString()}</p>
              <p className="text-sm text-gray-400">价格区间 ¥{result.price_range.min.toLocaleString()} - ¥{result.price_range.max.toLocaleString()}</p>
            </div>

            <div className="space-y-3">
              {result.factors.map((factor, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2">
                    {factor.name === '市场热度' && <TrendingUp className="w-4 h-4 text-blue-400" />}
                    {factor.name === '名称辨识度' && <Sparkles className="w-4 h-4 text-purple-400" />}
                    {factor.name === '分类竞争度' && <Shield className="w-4 h-4 text-green-400" />}
                    {factor.name === '法律风险' && <Clock className="w-4 h-4 text-yellow-400" />}
                    <span className="text-white text-sm">{factor.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF]" style={{ width: `${factor.score}%` }} />
                    </div>
                    <span className="text-white text-sm">{factor.score}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm font-medium">完整报告需登录查看</span>
              </div>
              <p className="text-gray-400 text-xs">包含详细市场分析、相似商标对比、风险提示等</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #00D2FF 100%)' }}
            >
              <Share2 className="w-4 h-4" />
              分享获取完整报告
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
