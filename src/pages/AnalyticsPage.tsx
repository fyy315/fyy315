import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Activity } from 'lucide-react';
import { supabase } from '../supabase/client';

const COLORS = ['#6C5CE7', '#00D2FF', '#FF6B6B', '#10B981', '#F59E0B'];

interface Stats {
  totalOrders: number;
  totalAmount: number;
  activeUsers: number;
  conversionRate: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 128,
    totalAmount: 2568000,
    activeUsers: 456,
    conversionRate: 12.5
  });
  const [timeRange, setTimeRange] = useState('7d');

  const trendData = [
    { date: '01-09', orders: 12, amount: 180000 },
    { date: '01-10', orders: 18, amount: 320000 },
    { date: '01-11', orders: 15, amount: 280000 },
    { date: '01-12', orders: 22, amount: 450000 },
    { date: '01-13', orders: 28, amount: 520000 },
    { date: '01-14', orders: 20, amount: 380000 },
    { date: '01-15', orders: 25, amount: 420000 },
  ];

  const categoryData = [
    { name: '第9类', value: 35 },
    { name: '第25类', value: 28 },
    { name: '第35类', value: 22 },
    { name: '第42类', value: 15 },
  ];

  const hotTrademarks = [
    { name: 'TechStar', views: 1250, price: 88000 },
    { name: 'CloudMax', views: 980, price: 65000 },
    { name: 'DataFlow', views: 856, price: 52000 },
    { name: 'InnovatePro', views: 720, price: 48000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1A1A3E] to-[#302B63] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">数据分析看板</h1>
          <div className="flex gap-2">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-[#6C5CE7] text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {range === '24h' ? '24小时' : range === '7d' ? '7天' : '30天'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { icon: ShoppingBag, label: '总订单', value: stats.totalOrders, color: '#6C5CE7' },
            { icon: DollarSign, label: '交易额', value: `¥${(stats.totalAmount / 10000).toFixed(1)}万`, color: '#00D2FF' },
            { icon: Users, label: '活跃用户', value: stats.activeUsers, color: '#FF6B6B' },
            { icon: TrendingUp, label: '转化率', value: `${stats.conversionRate}%`, color: '#10B981' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${stat.color}20` }}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">交易趋势</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A3E', border: '1px solid #ffffff20', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#6C5CE7" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">分类分布</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A3E', border: '1px solid #ffffff20', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-white/60 text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">热门商标</h3>
          <div className="grid grid-cols-4 gap-4">
            {hotTrademarks.map((tm, index) => (
              <div key={tm.name} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{tm.name}</span>
                  <span className="text-[#00D2FF] text-sm">#{index + 1}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Activity className="w-4 h-4" />
                  <span>{tm.views} 浏览</span>
                </div>
                <p className="text-[#6C5CE7] font-semibold mt-2">¥{tm.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
