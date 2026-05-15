import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, Trash2, Plus, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAuth } from '../hooks/useAuth';

interface MonitorItem {
  id: string;
  registration_number: string;
  trademark: {
    name: string;
    category: string;
    exclusive_period_end: string;
  };
}

export default function MonitorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [monitors, setMonitors] = useState<MonitorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [regNumber, setRegNumber] = useState('');

  useEffect(() => {
    if (user) fetchMonitors();
  }, [user]);

  const fetchMonitors = async () => {
    const { data } = await supabase
      .from('monitor_my_trademarks')
      .select('id, registration_number, trademark:trademarks(name, category, exclusive_period_end)')
      .eq('user_id', user?.id);
    setMonitors(data || []);
    setLoading(false);
  };

  const addMonitor = async () => {
    if (!regNumber || !user) return;
    const { error } = await supabase.from('monitor_my_trademarks').insert({
      user_id: user.id,
      registration_number: regNumber
    });
    if (!error) {
      setRegNumber('');
      fetchMonitors();
    }
  };

  const removeMonitor = async (id: string) => {
    await supabase.from('monitor_my_trademarks').delete().eq('id', id);
    fetchMonitors();
  };

  const getDaysLeft = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getRiskLevel = (days: number) => {
    if (days < 180) return { level: 'high', text: '高风险', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (days < 365) return { level: 'medium', text: '中风险', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 'low', text: '低风险', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  if (loading) return <div className="p-8 text-center text-white">加载中...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1A1A3E] to-[#302B63] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">商标监控</h1>

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            placeholder="输入商标注册号"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
          />
          <button
            onClick={addMonitor}
            className="px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            添加监控
          </button>
        </div>

        <div className="grid gap-4">
          {monitors.map((item) => {
            const days = getDaysLeft(item.trademark.exclusive_period_end);
            const risk = getRiskLevel(days);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{item.trademark.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${risk.bg} ${risk.color}`}>
                        {risk.text}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mb-3">
                      注册号: {item.registration_number} | 分类: {item.trademark.category}
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-white/70">
                        <Clock className="w-4 h-4" />
                        <span>有效期至: {item.trademark.exclusive_period_end}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${days < 180 ? 'text-red-400' : 'text-white/70'}`}>
                        <AlertTriangle className="w-4 h-4" />
                        <span>剩余 {days} 天</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMonitor(item.id)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {monitors.length === 0 && (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg">暂无监控商标</p>
            <p className="text-white/40 text-sm mt-2">添加商标注册号，实时掌握商标状态</p>
          </div>
        )}
      </div>
    </div>
  );
}
