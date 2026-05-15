import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, Tag, FileText, Users } from 'lucide-react';

const categories = [
  { id: '9', name: '第9类', desc: '科学仪器、电子产品', count: 128 },
  { id: '25', name: '第25类', desc: '服装鞋帽', count: 96 },
  { id: '35', name: '第35类', desc: '广告销售', count: 84 },
  { id: '42', name: '第42类', desc: '科技服务', count: 72 },
];

const pages = [
  { path: '/', name: '首页' },
  { path: '/search', name: '智能搜索' },
  { path: '/ai-estimate', name: 'AI估价' },
  { path: '/cart', name: '购物车' },
  { path: '/orders', name: '我的订单' },
  { path: '/wallet', name: '我的钱包' },
  { path: '/settings', name: '个人设置' },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1A1A3E] to-[#302B63] p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Globe className="w-12 h-12 text-[#00D2FF] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">站点地图</h1>
          <p className="text-white/60">快速导航到所有页面</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-[#6C5CE7]" />
              <h2 className="text-lg font-semibold text-white">商标分类</h2>
            </div>
            <div className="space-y-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/search?category=${cat.name}`}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div>
                    <p className="text-white font-medium">{cat.name}</p>
                    <p className="text-white/50 text-sm">{cat.desc}</p>
                  </div>
                  <span className="text-[#00D2FF] text-sm">{cat.count}个</span>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#00D2FF]" />
              <h2 className="text-lg font-semibold text-white">页面导航</h2>
            </div>
            <div className="space-y-2">
              {pages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white"
                >
                  <span className="text-white/60">{page.path}</span>
                  <span className="flex-1">{page.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#FF6B6B]" />
            <h2 className="text-lg font-semibold text-white">用户角色</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { role: 'demander', name: '需求人', desc: '搜索购买商标' },
              { role: 'rights_holder', name: '权利人', desc: '上架出售商标' },
              { role: 'agent', name: '中介', desc: '撮合交易' },
            ].map((item) => (
              <div key={item.role} className="p-4 bg-white/5 rounded-xl text-center">
                <p className="text-white font-medium mb-1">{item.name}</p>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
