import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Shield, AlertTriangle, Clock, TrendingUp,
  Gavel, ShoppingCart, Heart, Lock, RefreshCw, PieChart
} from 'lucide-react';
import { supabase } from '../supabase/client';

interface Trademark {
  registration_number: string;
  name: string;
  category: string;
  exclusive_period_end: string;
}

interface Listing {
  id: string;
  auction_type: 'fixed' | 'english' | 'sealed' | 'multi' | 'revenue';
  current_price: number;
  original_price: number;
  min_increment: number;
  end_time: string;
  revenue_share_percent?: number;
}

interface Bid {
  id: string;
  amount: number;
  bidder_id: string;
  created_at: string;
}

const auctionTypeMap = {
  fixed: { name: '一口价', icon: ShoppingCart },
  english: { name: '英式拍卖', icon: Gavel },
  sealed: { name: '密封投标', icon: Lock },
  multi: { name: '多轮竞价', icon: RefreshCw },
  revenue: { name: '收益分成', icon: PieChart }
};

export default function TrademarkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trademark, setTrademark] = useState<Trademark | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [sealedBids, setSealedBids] = useState<Bid[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
    const interval = setInterval(() => {
      if (listing?.end_time) {
        const left = new Date(listing.end_time).getTime() - Date.now();
        setTimeLeft(Math.max(0, left));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [id, listing?.end_time]);

  const fetchDetail = async () => {
    if (!id) return;
    const { data: tm } = await supabase.from('trademarks').select('*').eq('registration_number', id).single();
    if (tm) {
      setTrademark(tm);
      const { data: lst } = await supabase.from('listings').select('*').eq('trademark_id', id).eq('is_active', true).maybeSingle();
      setListing(lst);
      if (lst) {
        const { data: bidData } = await supabase.from('bids').select('*').eq('listing_id', lst.id).order('amount', { ascending: false }).limit(10);
        setBids(bidData || []);
      }
    }
    setLoading(false);
  };

  const getRisk = () => {
    if (!trademark?.exclusive_period_end) return { text: '未知', color: 'from-gray-500 to-gray-600' };
    const days = Math.ceil((new Date(trademark.exclusive_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days > 365) return { text: '低风险', color: 'from-emerald-500 to-emerald-600' };
    if (days > 180) return { text: '中风险', color: 'from-yellow-500 to-orange-500' };
    return { text: '高风险', color: 'from-red-500 to-red-600' };
  };

  const handleBid = async () => {
    if (!listing || !bidAmount) return;
    const amount = parseFloat(bidAmount);
    if (listing.auction_type === 'english' && amount <= listing.current_price) {
      alert('出价必须高于当前价格');
      return;
    }
    const { error } = await supabase.from('bids').insert({
      listing_id: listing.id,
      amount: amount
    });
    if (!error) {
      await supabase.from('listings').update({ current_price: amount }).eq('id', listing.id);
      alert('出价成功！');
      setBidAmount('');
      fetchDetail();
    }
  };

  const handleSealedBid = async () => {
    if (!listing || !bidAmount) return;
    const amount = parseFloat(bidAmount);
    setSealedBids([...sealedBids, { id: Date.now().toString(), amount, bidder_id: 'me', created_at: new Date().toISOString() }]);
    alert('密封投标已提交！');
    setBidAmount('');
  };

  const handleBuyNow = () => {
    if (!listing) return;
    navigate('/orders', { state: { listingId: listing.id } });
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="min-h-screen bg-[#0F0C29] flex items-center justify-center"><div className="animate-spin h-12 w-12 border-b-2 border-[#00D2FF]" /></div>;
  if (!trademark) return <div className="min-h-screen bg-[#0F0C29] flex items-center justify-center text-white">商标未找到</div>;

  const risk = getRisk();
  const AuctionIcon = listing ? auctionTypeMap[listing.auction_type].icon : Gavel;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243e]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.button onClick={() => navigate('/search')} className="flex items-center gap-2 text-white/70 hover:text-white mb-6">
          <ArrowLeft className="w-5 h-5" /> 返回搜索
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{trademark.name}</h1>
                  <p className="text-white/60">注册号: {trademark.registration_number}</p>
                </div>
                <div className="flex gap-3">
                  <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20"><Heart className="w-5 h-5 text-white" /></button>
                  <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20"><Shield className="w-5 h-5 text-[#00D2FF]" /></button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/50 text-sm mb-1">国际分类</p>
                  <p className="text-white font-semibold">{trademark.category || '第9类'}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/50 text-sm mb-1">有效期至</p>
                  <p className="text-white font-semibold">{trademark.exclusive_period_end || '2030-12-31'}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/50 text-sm mb-1">状态</p>
                  <p className="text-emerald-400 font-semibold">有效</p>
                </div>
              </div>

              <div className={`bg-gradient-to-r ${risk.color} rounded-xl p-6 text-white`}>
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">风险热力图</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">风险等级</p>
                    <p className="text-2xl font-bold">{risk.text}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm">剩余有效期</p>
                    <p className="text-xl font-semibold">{Math.ceil((new Date(trademark.exclusive_period_end || '2030-12-31').getTime() - Date.now()) / (1000 * 60 * 60 * 24))} 天</p>
                  </div>
                </div>
              </div>
            </div>

            {bids.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#6C5CE7]" /> 出价历史
                </h3>
                <div className="space-y-2">
                  {bids.slice(0, 5).map((bid, i) => (
                    <div key={bid.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70">出价 #{i + 1}</span>
                      <span className="text-[#00D2FF] font-semibold">¥{bid.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            {listing ? (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <AuctionIcon className="w-5 h-5 text-[#FF6B6B]" />
                  <h3 className="text-lg font-semibold text-white">{auctionTypeMap[listing.auction_type].name}</h3>
                </div>

                <div className="mb-6">
                  <p className="text-white/50 text-sm mb-1">{listing.auction_type === 'revenue' ? '分成比例' : '当前价格'}</p>
                  <p className="text-4xl font-bold text-white">
                    {listing.auction_type === 'revenue' ? `${listing.revenue_share_percent || 10}%` : `¥${listing.current_price.toLocaleString()}`}
                  </p>
                  {listing.original_price !== listing.current_price && listing.auction_type !== 'revenue' && (
                    <p className="text-white/40 text-sm">原价 ¥{listing.original_price.toLocaleString()}</p>
                  )}
                </div>

                {listing.auction_type === 'english' && (
                  <div className="mb-6">
                    <p className="text-white/50 text-sm mb-2">出价 (最低 ¥{listing.current_price + listing.min_increment})</p>
                    <div className="flex gap-2">
                      <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder={`最低加价 ¥${listing.min_increment}`} className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white" />
                      <button onClick={handleBid} className="px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-semibold">出价</button>
                    </div>
                  </div>
                )}

                {listing.auction_type === 'sealed' && (
                  <div className="mb-6">
                    <p className="text-white/50 text-sm mb-2">密封投标</p>
                    <div className="flex gap-2">
                      <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="输入您的出价" className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white" />
                      <button onClick={handleSealedBid} className="px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-semibold">投标</button>
                    </div>
                    {sealedBids.length > 0 && <p className="text-emerald-400 text-sm mt-2">已提交 {sealedBids.length} 个密封投标</p>}
                  </div>
                )}

                {listing.auction_type === 'multi' && (
                  <div className="mb-6">
                    <p className="text-white/50 text-sm mb-2">多轮竞价 - 第 {Math.min(bids.length + 1, 5)} 轮</p>
                    <div className="flex gap-2">
                      <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder={`最低 ¥${listing.current_price + listing.min_increment}`} className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white" />
                      <button onClick={handleBid} className="px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-semibold">出价</button>
                    </div>
                    <div className="mt-3 flex gap-1">
                      {[1, 2, 3, 4, 5].map(r => <div key={r} className={`flex-1 h-2 rounded-full ${r <= bids.length ? 'bg-[#6C5CE7]' : 'bg-white/20'}`} />)}
                    </div>
                  </div>
                )}

                {listing.auction_type === 'revenue' && (
                  <div className="mb-6 p-4 bg-white/5 rounded-xl">
                    <p className="text-white/70 text-sm">收益分成模式</p>
                    <p className="text-white text-sm mt-2">购买后按 {listing.revenue_share_percent || 10}% 比例分享商标未来收益</p>
                  </div>
                )}

                {(listing.auction_type === 'fixed' || listing.auction_type === 'revenue') && (
                  <button onClick={handleBuyNow} className="w-full py-4 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-semibold flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" /> 立即购买
                  </button>
                )}

                {listing.end_time && (
                  <div className="mt-4 flex items-center gap-2 text-white/50 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>剩余时间 {formatTime(timeLeft)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-white/60 mb-4">该商标暂未上架</p>
                <button className="px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-semibold">关注上架提醒</button>
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">交易保障</h3>
              <div className="space-y-3">
                {['支付宝担保交易', '专业中介服务', '全程法律支持'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/70">
                    <Shield className="w-4 h-4 text-[#00D2FF]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
