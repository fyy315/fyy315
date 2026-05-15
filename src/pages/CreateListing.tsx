import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, ChevronLeft, Tag, DollarSign, Clock, Shield, Eye } from 'lucide-react';
import { supabase } from '../supabase/client';

interface Trademark {
  registration_number: string;
  name: string;
  category: string;
  exclusive_period_end: string | null;
}

const auctionTypes = [
  { id: 'fixed', name: '一口价', desc: '固定价格直接购买', needDeposit: false },
  { id: 'english', name: '英式拍卖', desc: '公开竞价，价高者得', needDeposit: true },
  { id: 'sealed', name: '密封投标', desc: '私密出价，最高者中标', needDeposit: true },
  { id: 'multi', name: '多轮竞价', desc: '多轮出价，逐步淘汰', needDeposit: true },
  { id: 'revenue', name: '收益分成', desc: '按收益比例分成', needDeposit: false },
];

export default function CreateListing() {
  const [step, setStep] = useState(1);
  const [regNumber, setRegNumber] = useState('');
  const [trademark, setTrademark] = useState<Trademark | null>(null);
  const [loading, setLoading] = useState(false);
  const [auctionType, setAuctionType] = useState('fixed');
  const [formData, setFormData] = useState({
    startPrice: '',
    deposit: '',
    minIncrement: '100',
    endTime: '',
    revenueShare: '10',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const searchTrademark = async () => {
    if (!regNumber) return;
    setLoading(true);
    const { data } = await supabase
      .from('trademarks')
      .select('*')
      .eq('registration_number', regNumber)
      .single();
    if (data) setTrademark(data);
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const type = auctionTypes.find(t => t.id === auctionType);
    
    if (!formData.startPrice || parseFloat(formData.startPrice) <= 0) {
      newErrors.startPrice = '请输入有效的起拍价';
    }
    if (type?.needDeposit && (!formData.deposit || parseFloat(formData.deposit) <= 0)) {
      newErrors.deposit = '请输入有效的保证金';
    }
    if (auctionType !== 'fixed' && auctionType !== 'revenue' && (!formData.minIncrement || parseFloat(formData.minIncrement) <= 0)) {
      newErrors.minIncrement = '请输入有效的加价幅度';
    }
    if (auctionType !== 'fixed' && !formData.endTime) {
      newErrors.endTime = '请选择结束时间';
    }
    if (auctionType === 'revenue' && (!formData.revenueShare || parseFloat(formData.revenueShare) <= 0 || parseFloat(formData.revenueShare) > 100)) {
      newErrors.revenueShare = '分成比例需在1-100之间';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createListing = async () => {
    if (!trademark || !validateForm()) return;
    const { error } = await supabase.from('listings').insert({
      trademark_id: trademark.registration_number,
      auction_type: auctionType,
      current_price: parseFloat(formData.startPrice),
      original_price: parseFloat(formData.startPrice),
      deposit: auctionTypes.find(t => t.id === auctionType)?.needDeposit ? parseFloat(formData.deposit) : 0,
      min_increment: parseFloat(formData.minIncrement) || 100,
      end_time: formData.endTime || null,
      revenue_share: auctionType === 'revenue' ? parseFloat(formData.revenueShare) : null,
      seller_id: (await supabase.auth.getUser()).data.user?.id,
    });
    if (!error) {
      alert('上架成功！');
      setStep(1);
      setTrademark(null);
      setFormData({ startPrice: '', deposit: '', minIncrement: '100', endTime: '', revenueShare: '10' });
    }
  };

  const getAuctionConfig = () => {
    const type = auctionTypes.find(t => t.id === auctionType);
    return (
      <div className="space-y-4">
        <div>
          <label className="text-white/80 text-sm mb-2 block">
            {auctionType === 'fixed' ? '一口价' : auctionType === 'revenue' ? '基础价格' : '起拍价'} (元)
          </label>
          <input
            type="number"
            value={formData.startPrice}
            onChange={(e) => setFormData({ ...formData, startPrice: e.target.value })}
            placeholder="输入价格"
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50"
          />
          {errors.startPrice && <p className="text-red-400 text-sm mt-1">{errors.startPrice}</p>}
        </div>
        
        {type?.needDeposit && (
          <div>
            <label className="text-white/80 text-sm mb-2 block">保证金 (元)</label>
            <input
              type="number"
              value={formData.deposit}
              onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
              placeholder="参与竞价需缴纳的保证金"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50"
            />
            {errors.deposit && <p className="text-red-400 text-sm mt-1">{errors.deposit}</p>}
            <p className="text-white/40 text-xs mt-1">竞拍结束后未中标者全额退还</p>
          </div>
        )}
        
        {auctionType !== 'fixed' && auctionType !== 'revenue' && (
          <div>
            <label className="text-white/80 text-sm mb-2 block">最小加价幅度 (元)</label>
            <input
              type="number"
              value={formData.minIncrement}
              onChange={(e) => setFormData({ ...formData, minIncrement: e.target.value })}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
            />
            {errors.minIncrement && <p className="text-red-400 text-sm mt-1">{errors.minIncrement}</p>}
          </div>
        )}
        
        {auctionType === 'revenue' && (
          <div>
            <label className="text-white/80 text-sm mb-2 block">收益分成比例 (%)</label>
            <input
              type="number"
              value={formData.revenueShare}
              onChange={(e) => setFormData({ ...formData, revenueShare: e.target.value })}
              placeholder="1-100"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50"
            />
            {errors.revenueShare && <p className="text-red-400 text-sm mt-1">{errors.revenueShare}</p>}
            <p className="text-white/40 text-xs mt-1">买家使用商标产生的收益按此比例分成</p>
          </div>
        )}
        
        {auctionType !== 'fixed' && (
          <div>
            <label className="text-white/80 text-sm mb-2 block">结束时间</label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
            />
            {errors.endTime && <p className="text-red-400 text-sm mt-1">{errors.endTime}</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1a1a3e] to-[#302B63] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">商标上架</h1>
        
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s ? 'bg-[#6C5CE7]' : 'bg-white/10'
              } text-white font-bold`}>
                {s}
              </div>
              {s < 3 && <div className={`w-24 h-1 ${step > s ? 'bg-[#6C5CE7]' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#00D2FF]" />
              查询商标
            </h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="输入商标注册号"
                className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50"
              />
              <button
                onClick={searchTrademark}
                disabled={loading}
                className="bg-[#6C5CE7] hover:bg-[#5a4dd0] text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                {loading ? '查询中...' : '查询'}
              </button>
            </div>
            {trademark && (
              <div className="mt-6 bg-white/5 rounded-xl p-6 border border-[#00D2FF]/30">
                <div className="flex items-center gap-3 mb-3">
                  <Tag className="w-5 h-5 text-[#00D2FF]" />
                  <span className="text-white font-semibold text-lg">{trademark.name}</span>
                </div>
                <p className="text-white/60">注册号：{trademark.registration_number}</p>
                <p className="text-white/60">分类：{trademark.category}</p>
                {trademark.exclusive_period_end && (
                  <p className="text-white/60">有效期至：{trademark.exclusive_period_end}</p>
                )}
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => trademark && setStep(2)}
                disabled={!trademark}
                className="bg-[#6C5CE7] hover:bg-[#5a4dd0] disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                下一步 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#00D2FF]" />
              选择竞价类型
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {auctionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setAuctionType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    auctionType === type.id
                      ? 'border-[#6C5CE7] bg-[#6C5CE7]/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{type.name}</span>
                    {type.needDeposit && <Shield className="w-4 h-4 text-[#00D2FF]" />}
                  </div>
                  <div className="text-white/60 text-sm">{type.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-white/60 hover:text-white px-6 py-3 flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> 上一步
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-[#6C5CE7] hover:bg-[#5a4dd0] text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                下一步 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#00D2FF]" />
                配置参数
              </h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-[#00D2FF] hover:text-[#00D2FF]/80"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? '隐藏预览' : '预览'}
              </button>
            </div>
            
            {getAuctionConfig()}
            
            {showPreview && trademark && (
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-[#6C5CE7]/30">
                <h3 className="text-white font-semibold mb-3">上架预览</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-white/80"><span className="text-white/50">商标：</span>{trademark.name}</p>
                  <p className="text-white/80"><span className="text-white/50">类型：</span>{auctionTypes.find(t => t.id === auctionType)?.name}</p>
                  <p className="text-white/80"><span className="text-white/50">价格：</span>¥{formData.startPrice || '-'}</p>
                  {auctionTypes.find(t => t.id === auctionType)?.needDeposit && (
                    <p className="text-white/80"><span className="text-white/50">保证金：</span>¥{formData.deposit || '-'}</p>
                  )}
                  {auctionType === 'revenue' && (
                    <p className="text-white/80"><span className="text-white/50">分成：</span>{formData.revenueShare}%</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(2)}
                className="text-white/60 hover:text-white px-6 py-3 flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> 上一步
              </button>
              <button
                onClick={createListing}
                className="bg-[#6C5CE7] hover:bg-[#5a4dd0] text-white px-8 py-3 rounded-xl font-medium"
              >
                确认上架
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
