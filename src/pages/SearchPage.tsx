import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Wand2, History, TrendingUp, X } from 'lucide-react';
import { supabase } from '../supabase/client';

interface Trademark {
  registration_number: string;
  name: string;
  category: string;
  exclusive_period_end: string;
  current_price?: number;
  auction_type?: string;
  seo_description?: string;
}

interface SearchHistory {
  id: string;
  query: string;
  created_at: string;
}

const hotTags = [
  '第9类科技商标',
  '价格5万以下',
  '有效期3年以上',
  '无风险商标',
  '热门品牌',
  '英文商标',
];

const aiSuggestions = [
  '帮我找第25类服装商标，预算3-8万',
  '搜索科技类商标，要求有效期5年以上',
  '推荐热门商标，价格从低到高排序',
];

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Trademark[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiParsing, setAiParsing] = useState(false);
  const [parsedSql, setParsedSql] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    fetchTrademarks();
    fetchHistory();
  }, []);

  const fetchTrademarks = async () => {
    const { data } = await supabase
      .from('trademarks')
      .select('*, listings(current_price, auction_type)')
      .limit(12);
    setResults(data?.map((t: any) => ({
      ...t,
      current_price: t.listings?.[0]?.current_price,
      auction_type: t.listings?.[0]?.auction_type,
    })) || []);
  };

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('search_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    setHistory(data || []);
  };

  const parseNLToSQL = async (nlQuery: string) => {
    setAiParsing(true);
    await new Promise(r => setTimeout(r, 1500));
    
    let sql = 'SELECT * FROM trademarks WHERE 1=1';
    if (nlQuery.includes('第9类')) sql += " AND category = '第9类'";
    if (nlQuery.includes('第25类')) sql += " AND category = '第25类'";
    if (nlQuery.includes('5万以下')) sql += ' AND current_price < 50000';
    if (nlQuery.includes('有效期')) sql += " AND exclusive_period_end > '2027-01-01'";
    
    setParsedSql(sql);
    setAiParsing(false);
    return sql;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setShowSuggestions(false);
    
    await parseNLToSQL(query);
    
    let q = supabase.from('trademarks').select('*, listings(current_price, auction_type)');
    if (query.includes('第9类')) q = q.eq('category', '第9类');
    if (query.includes('第25类')) q = q.eq('category', '第25类');
    if (query.includes('科技')) q = q.ilike('name', '%科技%');
    
    const { data } = await q.limit(20);
    setResults(data?.map((t: any) => ({
      ...t,
      current_price: t.listings?.[0]?.current_price,
      auction_type: t.listings?.[0]?.auction_type,
    })) || []);
    
    await supabase.from('search_history').insert({ query });
    fetchHistory();
    setLoading(false);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    handleSearch({ preventDefault: () => {} } as React.FormEvent);
  };

  const getRiskLevel = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 180) return { level: 'high', color: 'from-red-500 to-red-600', text: '高风险' };
    if (days < 365) return { level: 'medium', color: 'from-yellow-500 to-orange-500', text: '中风险' };
    return { level: 'low', color: 'from-emerald-500 to-emerald-600', text: '低风险' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1A1A3E] to-[#302B63]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">AI智能商标搜索</h1>
          <p className="text-white/60">用自然语言描述需求，AI自动解析并搜索</p>
        </motion.div>

        <form onSubmit={handleSearch} className="relative mb-6">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="例如：帮我找第9类科技商标，价格5万以下，有效期3年以上"
              className="w-full px-6 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/30"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#6C5CE7]/20 via-[#00D2FF]/20 to-[#6C5CE7]/20 animate-pulse pointer-events-none" />
            <button
              type="submit"
              disabled={loading || aiParsing}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {aiParsing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  AI解析中
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  AI搜索
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A3E]/95 backdrop-blur-xl rounded-2xl border border-white/10 p-4 z-50"
              >
                <div className="mb-4">
                  <p className="text-white/60 text-sm mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    热门搜索
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hotTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white/80 text-sm transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI推荐
                  </p>
                  {aiSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleTagClick(s)}
                      className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg text-white/70 text-sm transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <AnimatePresence>
          {aiParsing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-gradient-to-r from-[#6C5CE7]/20 to-[#00D2FF]/20 backdrop-blur-xl rounded-xl border border-[#6C5CE7]/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-[#00D2FF] animate-spin" />
                <span className="text-white font-medium">AI正在解析您的需求...</span>
              </div>
              <div className="text-white/60 text-sm font-mono">
                {parsedSql || '分析关键词: 分类、价格区间、有效期...'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 transition-colors"
            >
              <History className="w-4 h-4" />
              搜索历史
            </button>
          </div>
          <span className="text-white/40 text-sm">共 {results.length} 个结果</span>
        </div>

        <AnimatePresence>
          {showHistory && history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">最近搜索</span>
                <button onClick={() => setShowHistory(false)} className="text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => handleTagClick(h.query)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white/70 text-sm transition-colors"
                  >
                    {h.query}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-3 border-[#6C5CE7] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/60 mt-4">AI正在搜索中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item, index) => {
              const risk = getRiskLevel(item.exclusive_period_end);
              return (
                <motion.div
                  key={item.registration_number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => navigate(`/trademark/${item.registration_number}`)}
                  className="p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-[#6C5CE7]/50 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#00D2FF] transition-colors">
                      {item.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r ${risk.color}`}>
                      {risk.text}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-white/60">
                    <p>注册号: {item.registration_number}</p>
                    <p>分类: {item.category || '未分类'}</p>
                    <p>有效期至: {item.exclusive_period_end}</p>
                    {item.seo_description && (
                      <p className="text-white/40 text-xs line-clamp-2">{item.seo_description}</p>
                    )}
                  </div>
                  {item.current_price && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[#00D2FF] font-bold text-xl">
                        ¥{item.current_price.toLocaleString()}
                      </span>
                      <span className="text-xs text-white/40 px-2 py-1 bg-white/10 rounded-full">
                        {item.auction_type === 'fixed' ? '一口价' : '竞价中'}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
