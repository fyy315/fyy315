import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase/client';
import { Clock, CheckCircle, Truck, FileCheck, Package, CreditCard, ChevronRight } from 'lucide-react';
import type { Tables } from '../supabase/types';

type Order = Tables<'orders'>;

const statusConfig = {
  unpaid: { label: '待支付', color: '#F59E0B', icon: CreditCard, step: 1 },
  paid: { label: '已支付', color: '#3B82F6', icon: CheckCircle, step: 2 },
  applied: { label: '已申请过户', color: '#8B5CF6', icon: FileCheck, step: 3 },
  transferred: { label: '已过户', color: '#6366F1', icon: Truck, step: 4 },
  completed: { label: '已完成', color: '#10B981', icon: Package, step: 5 },
  cancelled: { label: '已取消', color: '#6B7280', icon: Clock, step: 0 }
};

const statusFlow = ['unpaid', 'paid', 'applied', 'transferred', 'completed'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('orders')
      .select('*, listing:listing_id(*)')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  async function handlePay(orderId: string) {
    await supabase.from('orders').update({ 
      status: 'paid', 
      paid_at: new Date().toISOString() 
    }).eq('id', orderId);
    fetchOrders();
  }

  async function handleApplyTransfer(orderId: string) {
    await supabase.from('orders').update({ 
      status: 'applied',
      applied_at: new Date().toISOString()
    }).eq('id', orderId);
    fetchOrders();
  }

  async function handleConfirmTransfer(orderId: string) {
    await supabase.from('orders').update({ 
      status: 'transferred',
      transferred_at: new Date().toISOString()
    }).eq('id', orderId);
    fetchOrders();
  }

  async function handleComplete(orderId: string) {
    await supabase.from('orders').update({ 
      status: 'completed',
      completed_at: new Date().toISOString()
    }).eq('id', orderId);
    fetchOrders();
  }

  const getTimeline = (order: Order) => {
    const timeline = [];
    if (order.created_at) timeline.push({ status: 'unpaid', time: order.created_at, label: '订单创建' });
    if (order.paid_at) timeline.push({ status: 'paid', time: order.paid_at, label: '支付成功' });
    if (order.applied_at) timeline.push({ status: 'applied', time: order.applied_at, label: '提交过户申请' });
    if (order.transferred_at) timeline.push({ status: 'transferred', time: order.transferred_at, label: '商标过户完成' });
    if (order.completed_at) timeline.push({ status: 'completed', time: order.completed_at, label: '订单完成' });
    return timeline;
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="p-8 text-center text-white">加载中...</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">我的订单</h1>
        
        <div className="flex gap-3 mb-6">
          {['all', 'unpaid', 'paid', 'applied', 'transferred', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === s 
                  ? 'bg-[#6C5CE7] text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {s === 'all' ? '全部' : statusConfig[s as keyof typeof statusConfig]?.label || s}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const currentStep = statusConfig[order.status as keyof typeof statusConfig]?.step || 1;
            const progress = ((currentStep - 1) / 4) * 100;
            const isExpanded = expandedOrder === order.id;
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-medium">订单号: {order.id.slice(0, 8)}</span>
                      <span 
                        className="px-3 py-1 rounded-full text-xs text-white"
                        style={{ backgroundColor: statusConfig[order.status as keyof typeof statusConfig]?.color }}
                      >
                        {statusConfig[order.status as keyof typeof statusConfig]?.label}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">{new Date(order.created_at || '').toLocaleString()}</p>
                  </div>
                  <p className="text-[#00D2FF] text-2xl font-bold">¥{order.final_price?.toLocaleString()}</p>
                </div>

                <div className="mb-4">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: statusConfig[order.status as keyof typeof statusConfig]?.color 
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-white/50">
                    <span>待支付</span>
                    <span>已支付</span>
                    <span>过户中</span>
                    <span>已过户</span>
                    <span>已完成</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {order.status === 'unpaid' && (
                      <button
                        onClick={() => handlePay(order.id)}
                        className="px-6 py-2 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] text-white rounded-xl font-medium hover:opacity-90"
                      >
                        立即支付
                      </button>
                    )}
                    {order.status === 'paid' && (
                      <button
                        onClick={() => handleApplyTransfer(order.id)}
                        className="px-6 py-2 bg-[#8B5CF6] text-white rounded-xl font-medium hover:opacity-90"
                      >
                        申请过户
                      </button>
                    )}
                    {order.status === 'transferred' && (
                      <button
                        onClick={() => handleComplete(order.id)}
                        className="px-6 py-2 bg-[#10B981] text-white rounded-xl font-medium hover:opacity-90"
                      >
                        确认收货
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="flex items-center gap-1 text-white/60 hover:text-white"
                  >
                    {isExpanded ? '收起' : '查看详情'}
                    <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <h4 className="text-white font-medium mb-3">订单时间线</h4>
                    <div className="space-y-3">
                      {getTimeline(order).map((item, index) => {
                        const Icon = statusConfig[item.status as keyof typeof statusConfig]?.icon || Clock;
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: statusConfig[item.status as keyof typeof statusConfig]?.color + '40' }}
                            >
                              <Icon className="w-4 h-4" style={{ color: statusConfig[item.status as keyof typeof statusConfig]?.color }} />
                            </div>
                            <div className="flex-1">
                              <p className="text-white text-sm">{item.label}</p>
                              <p className="text-white/50 text-xs">{new Date(item.time || '').toLocaleString()}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-white/50">
              <p>暂无订单</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
