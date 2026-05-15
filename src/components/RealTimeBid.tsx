import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, User, Clock, Zap } from 'lucide-react';
import { supabase } from '../supabase/client';

interface Bid {
  id: string;
  amount: number;
  bidder_name: string;
  created_at: string;
}

interface RealTimeBidProps {
  listingId: string;
  currentPrice: number;
  minIncrement: number;
  onBidPlaced: () => void;
}

export default function RealTimeBid({ listingId, currentPrice, minIncrement, onBidPlaced }: RealTimeBidProps) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [newBidAmount, setNewBidAmount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [priceFlash, setPriceFlash] = useState(false);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    fetchBids();
    subscribeToBids();
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [listingId]);

  const fetchBids = async () => {
    const { data } = await supabase
      .from('bids')
      .select('*')
      .eq('listing_id', listingId)
      .order('amount', { ascending: false })
      .limit(10);
    setBids(data || []);
  };

  const subscribeToBids = () => {
    const channel = supabase
      .channel(`bids:${listingId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bids',
        filter: `listing_id=eq.${listingId}`
      }, (payload) => {
        const newBid = payload.new as Bid;
        setBids(prev => [newBid, ...prev].slice(0, 10));
        setPriceFlash(true);
        setTimeout(() => setPriceFlash(false), 500);
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });
    channelRef.current = channel;
  };

  const handleBid = async () => {
    const amount = parseFloat(newBidAmount);
    if (!amount || amount < currentPrice + minIncrement) {
      alert(`出价必须高于当前价格 + 最小加价 ¥${minIncrement}`);
      return;
    }

    const { error } = await supabase.from('bids').insert({
      listing_id: listingId,
      amount: amount
    });

    if (!error) {
      setNewBidAmount('');
      onBidPlaced();
    }
  };

  const getBidColor = (index: number) => {
    if (index === 0) return 'from-yellow-500 to-orange-500';
    if (index === 1) return 'from-gray-400 to-gray-500';
    if (index === 2) return 'from-orange-400 to-orange-600';
    return 'from-white/10 to-white/5';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-white/60 text-sm">{isConnected ? '实时连接中' : '连接断开'}</span>
        </div>
        <div className="flex items-center gap-1 text-white/40 text-xs">
          <Clock className="w-3 h-3" />
          <span>实时更新</span>
        </div>
      </div>

      <motion.div
        animate={priceFlash ? { scale: [1, 1.05, 1] } : {}}
        className="bg-gradient-to-r from-[#6C5CE7]/30 to-[#00D2FF]/30 rounded-xl p-4 border border-white/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">当前最高价</p>
            <p className="text-3xl font-bold text-white">¥{currentPrice.toLocaleString()}</p>
          </div>
          <Zap className="w-8 h-8 text-yellow-400" />
        </div>
      </motion.div>

      <div className="flex gap-2">
        <input
          type="number"
          value={newBidAmount}
          onChange={(e) => setNewBidAmount(e.target.value)}
          placeholder={`最低 ¥${(currentPrice + minIncrement).toLocaleString()}`}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00D2FF]"
        />
        <button
          onClick={handleBid}
          className="px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
        >
          出价
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {bids.map((bid, index) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center justify-between p-3 rounded-xl bg-gradient-to-r ${getBidColor(index)}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{bid.bidder_name || `出价者${index + 1}`}</p>
                  <p className="text-white/60 text-xs">{new Date(bid.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-white font-bold">¥{bid.amount.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {bids.length === 0 && (
          <div className="text-center py-8 text-white/40">
            <p>暂无出价，快来抢第一！</p>
          </div>
        )}
      </div>
    </div>
  );
}
