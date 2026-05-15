import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2, Users, Gift } from 'lucide-react';

interface ReferralStats {
  invitedCount: number;
  rewardedCount: number;
  totalReward: number;
}

export default function ReferralBanner() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'REF2024ABC';
  const referralLink = `https://tm-exchange.com/register?ref=${referralCode}`;
  
  const stats: ReferralStats = {
    invitedCount: 12,
    rewardedCount: 5,
    totalReward: 2500
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 bg-gradient-to-r from-[#6C5CE7]/20 to-[#00D2FF]/20 border border-white/10 backdrop-blur-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#00D2FF] flex items-center justify-center">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">邀请好友赚佣金</h3>
          <p className="text-sm text-white/60">好友完成首笔交易，您获得奖励</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={referralLink}
          readOnly
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="px-4 py-2 bg-[#6C5CE7] rounded-lg text-white text-sm font-medium flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          {copied ? '已复制' : '复制'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-[#00D2FF] rounded-lg text-white text-sm font-medium flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          分享
        </motion.button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <Users className="w-5 h-5 text-[#00D2FF] mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{stats.invitedCount}</p>
          <p className="text-xs text-white/50">已邀请</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <Gift className="w-5 h-5 text-[#6C5CE7] mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{stats.rewardedCount}</p>
          <p className="text-xs text-white/50">已奖励</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <p className="text-xl font-bold text-[#00D2FF]">¥{stats.totalReward}</p>
          <p className="text-xs text-white/50">累计奖励</p>
        </div>
      </div>
    </motion.div>
  );
}
