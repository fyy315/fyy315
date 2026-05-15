import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, History, Plus, Minus } from 'lucide-react';
import { supabase } from '../supabase/client';

interface Transaction {
  id: string;
  type: 'recharge' | 'withdraw' | 'payment' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  description: string;
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (user.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('balance')
        .eq('id', user.user.id)
        .single();
      setBalance(profile?.balance || 0);

      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      setTransactions(txs || []);
    }
    setLoading(false);
  };

  const handleRecharge = async () => {
    if (!rechargeAmount) return;
    const amount = parseFloat(rechargeAmount);
    if (amount <= 0) return;

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    await supabase.from('transactions').insert({
      user_id: user.user.id,
      type: 'recharge',
      amount: amount,
      status: 'pending',
      description: '支付宝充值',
    });

    setShowRecharge(false);
    setRechargeAmount('');
    fetchWalletData();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recharge': return <Plus className="w-4 h-4 text-emerald-400" />;
      case 'withdraw': return <Minus className="w-4 h-4 text-red-400" />;
      case 'payment': return <ArrowUpRight className="w-4 h-4 text-orange-400" />;
      case 'refund': return <ArrowDownLeft className="w-4 h-4 text-blue-400" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      recharge: '充值',
      withdraw: '提现',
      payment: '支付',
      refund: '退款',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1A1A3E] to-[#302B63] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D2FF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1A1A3E] to-[#302B63] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">我的钱包</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#6C5CE7]/30 to-[#00D2FF]/30 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 mb-2">账户余额</p>
              <p className="text-5xl font-bold text-white">¥{balance.toLocaleString()}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowRecharge(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
                充值
              </button>
              <button
                className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
              >
                <Minus className="w-5 h-5" />
                提现
              </button>
            </div>
          </div>
        </motion.div>

        {showRecharge && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">支付宝充值</h3>
            <div className="flex gap-4 mb-4">
              {[100, 500, 1000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setRechargeAmount(amt.toString())}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    rechargeAmount === amt.toString()
                      ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  ¥{amt}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <input
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                placeholder="自定义金额"
                className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50"
              />
              <button
                onClick={handleRecharge}
                className="px-8 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
              >
                确认充值
              </button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-[#00D2FF]" />
            <h3 className="text-lg font-semibold text-white">交易记录</h3>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    {getTypeIcon(tx.type)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{getTypeLabel(tx.type)}</p>
                    <p className="text-white/50 text-sm">{tx.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    tx.type === 'recharge' || tx.type === 'refund' ? 'text-emerald-400' : 'text-white'
                  }`}>
                    {tx.type === 'recharge' || tx.type === 'refund' ? '+' : '-'}¥{tx.amount.toLocaleString()}
                  </p>
                  <p className="text-white/50 text-sm">{new Date(tx.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-12 text-white/50">
                <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>暂无交易记录</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
