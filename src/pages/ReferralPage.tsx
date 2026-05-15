import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Users, DollarSign, Copy, Check, Gift } from 'lucide-react';
import { supabase } from '../supabase/client';

interface ReferralStats {
  code: string;
  invited: number;
  earned: number;
}

interface ReferralRecord {
  id: string;
  username: string;
  amount: number;
  created_at: string;
}

export default function ReferralPage() {
  const [stats, setStats] = useState<ReferralStats>({ code: '', invited: 0, earned: 0 });
  const [records, setRecords] = useState<ReferralRecord[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const code = 'REF-' + user.user.id.slice(0, 8).toUpperCase();
    setStats(prev => ({ ...prev, code }));

    const mockRecords: ReferralRecord[] = [
      { id: '1', username: 'user_123', amount: 50, created_at: '2024-01-15' },
      { id: '2', username: 'user_456', amount: 100, created_at: '2024-01-14' },
    ];
    setRecords(mockRecords);
    setStats(prev => ({ ...prev, invited: 2, earned: 150 }));
  };

  const copyCode = () => {
    navigator.clipboard.writeText(stats.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1A1A3E] to-[#302B63] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">邀请返利</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#6C5CE7]/30 to-[#00D2FF]/30 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Gift className="w-12 h-12 text-[#00D2FF]" />
            <div>
              <h2 className="text-xl font-semibold text-white">邀请好友，赚取返利</h2>
              <p className="text-white/60">好友完成首笔交易，您获得佣金</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
            <code className="text-[#00D2FF] font-mono text-lg">{stats.code}</code>
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-4 py-2 bg-[#6C5CE7] rounded-lg text-white hover:opacity-90"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? '已复制' : '复制'}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-[#6C5CE7]" />
              <span className="text-white/60">已邀请</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.invited}人</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-[#00D2FF]" />
              <span className="text-white/60">累计返利</span>
            </div>
            <p className="text-3xl font-bold text-white">¥{stats.earned}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#00D2FF]" />
            返利记录
          </h3>

          <div className="space-y-3">
            {records.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6C5CE7]/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#6C5CE7]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{r.username}</p>
                    <p className="text-white/50 text-sm">{r.created_at}</p>
                  </div>
                </div>
                <span className="text-emerald-400 font-semibold">+¥{r.amount}</span>
              </div>
            ))}
            {records.length === 0 && (
              <div className="text-center py-8 text-white/50">
                <p>暂无返利记录</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
