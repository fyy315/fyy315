import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase/client';
import { useAuth } from '../hooks/useAuth';

interface Listing {
  id: string;
  trademark_id: string;
  auction_type: string;
  current_price: number;
  original_price: number;
  is_active: boolean;
  status: string;
  created_at: string;
  trademark: {
    name: string;
    category: string;
    registration_number: string;
  };
}

interface Bid {
  id: string;
  amount: number;
  created_at: string;
  bidder: {
    username: string;
  };
}

export default function MyListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [editPrice, setEditPrice] = useState('');
  const [showBids, setShowBids] = useState(false);

  useEffect(() => {
    if (user) fetchListings();
  }, [user]);

  const fetchListings = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*, trademark:trademarks(name, category, registration_number)')
      .eq('seller_id', user?.id)
      .order('created_at', { ascending: false });
    if (data) setListings(data);
  };

  const fetchBids = async (listingId: string) => {
    const { data } = await supabase
      .from('bids')
      .select('*, bidder:users(username)')
      .eq('listing_id', listingId)
      .order('amount', { ascending: false });
    if (data) setBids(data);
  };

  const toggleListing = async (id: string, current: boolean) => {
    await supabase.from('listings').update({ is_active: !current }).eq('id', id);
    fetchListings();
  };

  const updatePrice = async (id: string) => {
    if (!editPrice) return;
    await supabase.from('listings').update({ current_price: parseFloat(editPrice) }).eq('id', id);
    setEditPrice('');
    setSelectedListing(null);
    fetchListings();
  };

  const viewBids = (listing: Listing) => {
    setSelectedListing(listing);
    setShowBids(true);
    fetchBids(listing.id);
  };

  const getAuctionTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      fixed: '一口价',
      english: '英式拍卖',
      sealed: '密封投标',
      multi: '多轮竞价',
      revenue: '收益分成'
    };
    return map[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1A1A3E] to-[#302B63] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">我的上架管理</h1>

        <div className="grid gap-6">
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">{listing.trademark.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    注册号: {listing.trademark.registration_number} | 分类: {listing.trademark.category}
                  </p>
                  <div className="flex gap-4 mt-3">
                    <span className="px-3 py-1 bg-[#6C5CE7]/30 text-[#6C5CE7] rounded-full text-sm">
                      {getAuctionTypeLabel(listing.auction_type)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      listing.is_active ? 'bg-green-500/30 text-green-400' : 'bg-gray-500/30 text-gray-400'
                    }`}>
                      {listing.is_active ? '在售中' : '已下架'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#00D2FF]">¥{listing.current_price.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">原价 ¥{listing.original_price?.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => toggleListing(listing.id, listing.is_active)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    listing.is_active
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {listing.is_active ? '下架' : '上架'}
                </button>
                <button
                  onClick={() => setSelectedListing(listing)}
                  className="px-4 py-2 bg-[#6C5CE7]/20 text-[#6C5CE7] rounded-lg hover:bg-[#6C5CE7]/30 transition-all"
                >
                  修改价格
                </button>
                <button
                  onClick={() => viewBids(listing)}
                  className="px-4 py-2 bg-[#00D2FF]/20 text-[#00D2FF] rounded-lg hover:bg-[#00D2FF]/30 transition-all"
                >
                  查看出价
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">暂无上架商标</p>
            <p className="text-gray-500 text-sm mt-2">前往"创建上架"发布您的商标</p>
          </div>
        )}
      </div>

      {selectedListing && !showBids && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1A1A3E] rounded-2xl p-6 w-96 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-4">修改价格</h3>
            <p className="text-gray-400 mb-4">{selectedListing.trademark.name}</p>
            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              placeholder="输入新价格"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => updatePrice(selectedListing.id)}
                className="flex-1 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-lg text-white font-medium"
              >
                确认修改
              </button>
              <button
                onClick={() => { setSelectedListing(null); setEditPrice(''); }}
                className="flex-1 py-3 bg-white/10 rounded-lg text-gray-300"
              >
                取消
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showBids && selectedListing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1A1A3E] rounded-2xl p-6 w-[500px] max-h-[80vh] overflow-auto border border-white/20"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">出价记录</h3>
              <button onClick={() => { setShowBids(false); setSelectedListing(null); }} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <p className="text-gray-400 mb-4">{selectedListing.trademark.name}</p>
            <div className="space-y-3">
              {bids.map((bid, index) => (
                <div key={bid.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{bid.bidder.username}</p>
                    <p className="text-gray-500 text-sm">{new Date(bid.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#00D2FF] font-bold text-lg">¥{bid.amount.toLocaleString()}</p>
                    {index === 0 && <span className="text-xs text-yellow-400">当前最高</span>}
                  </div>
                </div>
              ))}
              {bids.length === 0 && (
                <p className="text-gray-500 text-center py-8">暂无出价记录</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
