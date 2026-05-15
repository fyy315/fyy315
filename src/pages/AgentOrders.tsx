import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HashRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { 
  ClipboardList, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  FileCheck, 
  Package,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface Order {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  agentId: string;
  status: 'unpaid' | 'paid' | 'applied' | 'transferred' | 'completed' | 'cancelled';
  finalPrice: number;
  paymentMethod?: string;
  paymentTime?: string;
  createdAt: string;
  trademarkName: string;
  registrationNumber: string;
  buyerName: string;
  sellerName: string;
}

const mockOrders: Order[] = [
  {
    id: 'ord-001',
    listingId: 'lst-001',
    buyerId: 'usr-001',
    sellerId: 'usr-002',
    agentId: 'usr-003',
    status: 'paid',
    finalPrice: 50000,
    paymentMethod: 'alipay',
    paymentTime: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    trademarkName: '智慧云',
    registrationNumber: 'TM12345678',
    buyerName: '张三',
    sellerName: '李四'
  },
  {
    id: 'ord-002',
    listingId: 'lst-002',
    buyerId: 'usr-004',
    sellerId: 'usr-005',
    agentId: 'usr-003',
    status: 'applied',
    finalPrice: 80000,
    paymentMethod: 'alipay',
    paymentTime: '2024-01-14T14:20:00Z',
    createdAt: '2024-01-14T14:00:00Z',
    trademarkName: '创新科技',
    registrationNumber: 'TM87654321',
    buyerName: '王五',
    sellerName: '赵六'
  },
  {
    id: 'ord-003',
    listingId: 'lst-003',
    buyerId: 'usr-006',
    sellerId: 'usr-007',
    agentId: 'usr-003',
    status: 'transferred',
    finalPrice: 120000,
    paymentMethod: 'bank',
    paymentTime: '2024-01-13T09:15:00Z',
    createdAt: '2024-01-13T09:00:00Z',
    trademarkName: '未来视界',
    registrationNumber: 'TM11223344',
    buyerName: '孙七',
    sellerName: '周八'
  }
];

const statusConfig = {
  unpaid: { label: '待支付', color: 'text-yellow-400', bg: 'bg-yellow-400/20', icon: Clock },
  paid: { label: '已支付', color: 'text-blue-400', bg: 'bg-blue-400/20', icon: CreditCard },
  applied: { label: '已申请', color: 'text-purple-400', bg: 'bg-purple-400/20', icon: FileCheck },
  transferred: { label: '已过户', color: 'text-orange-400', bg: 'bg-orange-400/20', icon: Package },
  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-400/20', icon: CheckCircle },
  cancelled: { label: '已取消', color: 'text-gray-400', bg: 'bg-gray-400/20', icon: AlertCircle }
};

const statusFlow = ['unpaid', 'paid', 'applied', 'transferred', 'completed'];

function StatusBadge({ status }: { status: Order['status'] }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

function OrderCard({ order, onUpdateStatus }: { order: Order; onUpdateStatus: (id: string, newStatus: Order['status']) => void }) {
  const currentIndex = statusFlow.indexOf(order.status);
  const canAdvance = currentIndex < statusFlow.length - 1 && order.status !== 'cancelled';
  const nextStatus = canAdvance ? statusFlow[currentIndex + 1] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{order.trademarkName}</h3>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-white/50 text-sm">注册号: {order.registrationNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">¥{order.finalPrice.toLocaleString()}</p>
          <p className="text-white/50 text-sm">订单金额</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-white/50 mb-1">买家</p>
          <p className="text-white font-medium">{order.buyerName}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-white/50 mb-1">卖家</p>
          <p className="text-white font-medium">{order.sellerName}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Clock className="w-4 h-4" />
          <span>创建时间: {new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
        {canAdvance && (
          <button
            onClick={() => nextStatus && onUpdateStatus(order.id, nextStatus as Order['status'])}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" />
            推进至{statusConfig[nextStatus as Order['status']].label}
          </button>
        )}
        {order.status === 'completed' && (
          <span className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            订单已完成
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function AgentOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.trademarkName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const stats = {
    total: orders.length,
    processing: orders.filter(o => ['paid', 'applied', 'transferred'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1a1a3e] to-[#302B63] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">中介工作台</h1>
          <p className="text-white/60">处理商标交易订单，推进过户流程</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <ClipboardList className="w-5 h-5 text-[#6C5CE7]" />
              <span className="text-white/60">总订单数</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <RefreshCw className="w-5 h-5 text-[#00D2FF]" />
              <span className="text-white/60">处理中</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.processing}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white/60">已完成</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.completed}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="搜索商标名称、注册号、买家或卖家..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#6C5CE7]"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#6C5CE7] appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#1a1a3e]">全部状态</option>
              <option value="unpaid" className="bg-[#1a1a3e]">待支付</option>
              <option value="paid" className="bg-[#1a1a3e]">已支付</option>
              <option value="applied" className="bg-[#1a1a3e]">已申请</option>
              <option value="transferred" className="bg-[#1a1a3e]">已过户</option>
              <option value="completed" className="bg-[#1a1a3e]">已完成</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <ClipboardList className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-lg">暂无符合条件的订单</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
